<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;
use Inertia\Response;

class StaffLoginController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'turnstileSiteKey' => config('services.turnstile.site_key', ''),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $hasTurnstile = !empty(config('services.turnstile.secret_key'));

        $rules = [
            'email'    => ['required', 'email'],
            'password' => ['required', 'string'],
        ];

        // Hanya validasi turnstile jika secret key dikonfigurasi
        if ($hasTurnstile) {
            $rules['cf_turnstile_response'] = ['required', 'string'];
        }

        $request->validate($rules);

        // Verifikasi Cloudflare Turnstile (hanya jika dikonfigurasi)
        if ($hasTurnstile) {
            $turnstile = Http::asForm()->post(
                'https://challenges.cloudflare.com/turnstile/v0/siteverify',
                [
                    'secret'   => config('services.turnstile.secret_key'),
                    'response' => $request->cf_turnstile_response,
                    'remoteip' => $request->ip(),
                ]
            );

            if (!$turnstile->json('success')) {
                return back()->withErrors([
                    'cf_turnstile_response' => 'Verifikasi CAPTCHA gagal. Silakan coba lagi.',
                ]);
            }
        }

        // Attempt login
        if (!Auth::attempt($request->only('email', 'password'), $request->boolean('remember'))) {
            return back()->withErrors([
                'email' => 'Email atau password salah.',
            ]);
        }

        $user = Auth::user();

        // Pastikan hanya admin/petugas yang bisa login lewat form ini
        if (!in_array($user->role, ['admin', 'petugas'])) {
            Auth::logout();
            return back()->withErrors([
                'email' => 'Akun ini tidak memiliki akses staff.',
            ]);
        }

        $request->session()->regenerate();

        return match ($user->role) {
            'admin'   => redirect()->route('admin.dashboard'),
            'petugas' => redirect()->route('petugas.dashboard'),
            default   => redirect()->route('login'),
        };
    }

    public function destroy(Request $request): RedirectResponse
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login');
    }
}
