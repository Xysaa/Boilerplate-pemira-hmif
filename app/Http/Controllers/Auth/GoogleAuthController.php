<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;

class GoogleAuthController extends Controller
{
    /**
     * Format NIM ITERA:
     *   1 | YY | PP | XXXX
     *   │    │    │    └── 4 digit nomor urut (0001-9999)
     *   │    │    └─────── 2 digit kode prodi (14 = Informatika)
     *   │    └──────────── 2 digit angkatan (19-99)
     *   └─────────────────  prefix tetap = 1
     *
     * Contoh:
     *   stevanus.123140038@student.itera.ac.id
     *   → NIM: 1 | 23 | 14 | 0038 ✓
     *
     *   budi.119140150@student.itera.ac.id
     *   → NIM: 1 | 19 | 14 | 0150 ✓
     *
     * Regex:
     *   ^[a-zA-Z]+          → nama hanya huruf (sebelum titik)
     *   \.                  → titik pemisah nama dan NIM
     *   1                   → prefix NIM
     *   (1[9]|[2-9][0-9])  → angkatan 19-99 (2 digit)
     *   14                  → kode prodi Informatika (2 digit)
     *   [0-9]{4}            → nomor urut 4 digit (0001-9999)
     *   @student\.itera\.ac\.id$
     */
    const VOTER_EMAIL_REGEX = '/^[a-zA-Z]+\.1(1[9]|[2-9][0-9])14[0-9]{4}@student\.itera\.ac\.id$/';

    public function redirect(): RedirectResponse
    {
        return Socialite::driver('google')->redirect();
    }

    public function callback(): RedirectResponse
    {
        try {
            $googleUser = Socialite::driver('google')->user();
        } catch (\Throwable $e) {
            return redirect()->route('login')
                ->withErrors(['oauth' => 'Login Google gagal. Silakan coba lagi.']);
        }

        $email = $googleUser->getEmail();

        // Validasi format email ITERA Informatika
        if (!preg_match(self::VOTER_EMAIL_REGEX, $email)) {
            return redirect()->route('login')->withErrors([
                'oauth' => 'Email tidak valid. Hanya email mahasiswa Informatika ITERA (angkatan 19+) yang diizinkan.',
            ]);
        }

        // Find or create voter
        $user = User::updateOrCreate(
            ['email' => $email],
            [
                'name'              => $googleUser->getName(),
                'google_id'         => $googleUser->getId(),
                'avatar'            => $googleUser->getAvatar(),
                'role'              => 'voter',
                'email_verified_at' => now(),
                'password'          => null,
            ]
        );

        // Blokir jika sudah vote di sesi aktif
        if ($user->hasVotedInActiveSession()) {
            return redirect()->route('login')->withErrors([
                'oauth' => 'Anda telah menggunakan hak suara. Akses ditutup hingga sesi berikutnya dibuka.',
            ]);
        }

        Auth::login($user, remember: true);

        return redirect()->route('voter.dashboard');
    }
}