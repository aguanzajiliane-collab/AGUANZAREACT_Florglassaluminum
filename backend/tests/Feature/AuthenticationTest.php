<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Tests\TestCase;

// Transaction rollback only: never migrates, resets, or seeds the database.
class AuthenticationTest extends TestCase
{
    use DatabaseTransactions;

    private function account(string $role): array
    {
        $password = Str::password(24);
        $user = User::create([
            'name' => 'Authentication test',
            'email' => Str::uuid().'@example.test',
            'password' => Hash::make($password),
            'role' => $role,
        ]);
        return [$user, $password];
    }

    public function test_admin_can_log_in_with_existing_password_and_access_admin_routes(): void
    {
        [$user, $password] = $this->account('admin');
        $hash = $user->getRawOriginal('password');
        $response = $this->postJson('/api/login', ['email' => $user->email, 'password' => $password]);
        $response->assertOk()->assertJsonPath('user.role', 'admin')->assertJsonStructure(['token']);
        $this->assertSame($hash, $user->fresh()->getRawOriginal('password'));
        $this->withToken($response->json('token'))->getJson('/api/user')->assertOk()->assertJsonPath('data.role', 'admin');
        $this->getJson('/api/customers')->assertOk();
    }

    public function test_customer_can_log_in_but_cannot_access_admin_routes(): void
    {
        [$user, $password] = $this->account('customer');
        $response = $this->postJson('/api/login', ['email' => $user->email, 'password' => $password]);
        $response->assertOk()->assertJsonPath('user.role', 'customer');
        $this->withToken($response->json('token'))->getJson('/api/dashboard')->assertForbidden();
        $this->getJson('/api/customers')->assertForbidden();
        $this->postJson('/api/products', [])->assertForbidden();
    }

    public function test_wrong_password_is_rejected_without_changing_the_account(): void
    {
        [$user] = $this->account('admin');
        $before = $user->getRawOriginal('password');
        $this->postJson('/api/login', ['email' => $user->email, 'password' => Str::password(25)])
            ->assertStatus(422)->assertJsonPath('message', 'The provided credentials are incorrect.');
        $this->assertSame($before, $user->fresh()->getRawOriginal('password'));
        $this->assertSame(0, $user->tokens()->count());
    }

    public function test_registration_remains_customer_only(): void
    {
        $password = Str::password(24);
        $email = Str::uuid().'@example.test';
        $this->postJson('/api/register', [
            'name' => 'Registration test', 'email' => $email,
            'password' => $password, 'password_confirmation' => $password, 'role' => 'admin',
        ])->assertCreated()->assertJsonPath('user.role', 'customer');
        $this->assertTrue(Hash::check($password, User::where('email', $email)->firstOrFail()->password));
        $this->postJson('/api/login', ['email' => $email, 'password' => $password])->assertOk();
    }

    public function test_unauthenticated_visitors_cannot_access_admin_routes(): void
    {
        $this->getJson('/api/dashboard')->assertUnauthorized();
        $this->getJson('/api/customers')->assertUnauthorized();
    }

    public function test_private_admin_password_check_is_read_only(): void
    {
        [$user, $password] = $this->account('admin');
        $before = $user->getRawOriginal('password');
        $this->artisan('auth:check-admin', ['email' => $user->email])
            ->expectsQuestion('Enter your existing admin password', $password)
            ->expectsOutput('Password matches. The account is an administrator. No records or tokens were changed.')
            ->assertSuccessful();
        $this->assertSame($before, $user->fresh()->getRawOriginal('password'));
        $this->assertSame(0, $user->tokens()->count());
    }

    public function test_private_admin_password_check_rejects_wrong_password(): void
    {
        [$user] = $this->account('admin');
        $this->artisan('auth:check-admin', ['email' => $user->email])
            ->expectsQuestion('Enter your existing admin password', Str::password(25))
            ->expectsOutput('The password does not match this admin account in the configured database. No records were changed.')
            ->assertFailed();
    }

    public function test_admin_reset_allows_login_and_preserves_other_accounts(): void
    {
        [$admin, $oldPassword] = $this->account('admin');
        [$customer] = $this->account('customer');
        $customerBefore = $customer->fresh()->getAttributes();
        $admin->createToken('old-session');
        $newPassword = Str::password(24);
        $this->artisan('auth:reset-admin-password', ['email' => $admin->email])
            ->expectsQuestion('Enter a new admin password (at least 12 characters)', $newPassword)
            ->expectsQuestion('Confirm the new admin password', $newPassword)
            ->expectsOutput('Admin password updated. Sign in with your existing email and new password.')
            ->assertSuccessful();
        $this->assertTrue(Hash::check($newPassword, $admin->fresh()->password));
        $this->assertFalse(Hash::check($oldPassword, $admin->fresh()->password));
        $this->assertSame('admin', $admin->fresh()->role);
        $this->assertSame(0, $admin->tokens()->count());
        $this->assertSame($customerBefore, $customer->fresh()->getAttributes());
        $this->postJson('/api/login', ['email' => $admin->email, 'password' => $newPassword])
            ->assertOk()->assertJsonPath('user.role', 'admin');
    }

    public function test_admin_reset_rejects_mismatch_without_changing_password(): void
    {
        [$admin] = $this->account('admin');
        $before = $admin->getRawOriginal('password');
        $this->artisan('auth:reset-admin-password', ['email' => $admin->email])
            ->expectsQuestion('Enter a new admin password (at least 12 characters)', Str::password(24))
            ->expectsQuestion('Confirm the new admin password', Str::password(25))
            ->expectsOutput('The password field confirmation does not match.')
            ->expectsOutput('Password was not changed.')
            ->assertFailed();
        $this->assertSame($before, $admin->fresh()->getRawOriginal('password'));
    }

    public function test_admin_reset_does_not_allow_customer_accounts(): void
    {
        [$customer] = $this->account('customer');
        $before = $customer->fresh()->getAttributes();
        $this->artisan('auth:reset-admin-password', ['email' => $customer->email])
            ->expectsOutput('No administrator account matches this email. No records were changed.')
            ->assertFailed();
        $this->assertSame($before, $customer->fresh()->getAttributes());
    }
}
