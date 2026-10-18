<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class ResetAdminPassword extends Command
{
    protected $signature = 'auth:reset-admin-password {email : Existing administrator email address}';
    protected $description = 'Reset an existing administrator password using hidden terminal input';

    public function handle(): int
    {
        $user = User::where('email', trim($this->argument('email')))->first();
        if (!$user || !$user->isAdmin()) {
            $this->error('No administrator account matches this email. No records were changed.');
            return self::FAILURE;
        }

        // Disable visible-input fallback; passwords never enter command history.
        $password = $this->secret('Enter a new admin password (at least 12 characters)', false);
        $confirmation = $this->secret('Confirm the new admin password', false);
        try {
            $validator = Validator::make([
                'password' => $password,
                'password_confirmation' => $confirmation,
            ], ['password' => ['required', 'string', 'min:12', 'max:72', 'confirmed']]);
            if ($validator->fails()) {
                foreach ($validator->errors()->all() as $message) $this->error($message);
                $this->error('Password was not changed.');
                return self::FAILURE;
            }
            // bcrypt uses only the first 72 bytes, even for multibyte passwords.
            if (strlen($password) > 72) {
                $this->error('Use a password of at most 72 bytes. Password was not changed.');
                return self::FAILURE;
            }
            DB::transaction(function () use ($user, $password) {
                $admin = User::whereKey($user->id)->lockForUpdate()->firstOrFail();
                if (!$admin->isAdmin()) throw new \RuntimeException('This account is no longer an administrator.');
                $admin->password = Hash::make($password);
                $admin->save();
                $admin->tokens()->delete();
            });
        } finally {
            unset($password, $confirmation, $validator);
        }
        $this->info('Admin password updated. Sign in with your existing email and new password.');
        return self::SUCCESS;
    }
}
