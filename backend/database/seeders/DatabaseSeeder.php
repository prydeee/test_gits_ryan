<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'ryansyah@admin.com'],
            [
                'name' => 'ryansyah',
                'password' => Hash::make('password')
            ]
        );
    }
}