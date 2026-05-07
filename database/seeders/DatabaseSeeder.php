<?php

namespace Database\Seeders;

use App\Models\Candidate;
use App\Models\ElectionSession;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Administrator', 'email' => 'admin@itera.ac.id',
            'password' => Hash::make('password'), 'role' => 'admin',
            'email_verified_at' => now(),
        ]);
        User::create([
            'name' => 'Petugas 1', 'email' => 'petugas@itera.ac.id',
            'password' => Hash::make('password'), 'role' => 'petugas',
            'email_verified_at' => now(),
        ]);
        $session = ElectionSession::create([
            'name' => 'Pemilihan Ketua Himpunan Informatika 2024',
            'description' => 'Pemilihan ketua dan wakil ketua Himpunan Mahasiswa Informatika ITERA periode 2024-2025',
            'status' => 'draft', 'start_at' => now()->addDay(), 'end_at' => now()->addDays(3),
        ]);
        Candidate::create(['election_session_id' => $session->id, 'number' => 1,
            'name' => 'Budi Santoso', 'vice_name' => 'Siti Rahayu',
            'vision' => 'Mewujudkan Himpunan yang inovatif, inklusif, dan berprestasi di tingkat nasional',
            'mission' => "1. Meningkatkan kualitas akademik\n2. Mendorong kreativitas\n3. Memperkuat jaringan alumni",
        ]);
        Candidate::create(['election_session_id' => $session->id, 'number' => 2,
            'name' => 'Andi Pratama', 'vice_name' => 'Maya Sari',
            'vision' => 'Himpunan sebagai rumah belajar dan berkarya bagi seluruh mahasiswa Informatika',
            'mission' => "1. Program mentoring intensif\n2. Kolaborasi lintas prodi\n3. Platform digital",
        ]);
    }
}
