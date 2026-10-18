<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class CheckAdminLogin extends Command
{
    protected $signature = 'auth:check-admin {email : Existing administrator email address}';
    protected $description = 'Privately check an existing admin password without modifying accounts or tokens';

    public function handle(): int
    {
        $user = User::where('email', trim($this->argument('email')))->first();
        if (!$user || !$user->isAdmin()) {
            $this->error('No administrator account matches this email. No records were changed.');
            return self::FAILURE;
        }
        // Never accept a password as an argument, print it, or store it.
        $password = $this->secret('Enter your existing admin password', false);
        if (!is_string($password) || $password === '') {
            $this->error('Password check cancelled. No records were changed.');
            return self::FAILURE;
        }
        try {
            $matches = Hash::check($password, $user->password);
        } finally {
            unset($password);
        }
        if (!$matches) {
            $this->error('The password does not match this admin account in the configured database. No records were changed.');
            return self::FAILURE;
        }
        $this->info('Password matches. The account is an administrator. No records or tokens were changed.');
        return self::SUCCESS;
    }
}
