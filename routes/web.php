<?php

use App\Http\Controllers\Auth\GoogleAuthController;
use App\Http\Controllers\Auth\StaffLoginController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\SessionController;
use App\Http\Controllers\Admin\CandidateController;
use App\Http\Controllers\Admin\PetugasController as AdminPetugasController;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\Petugas\PetugasController;
use App\Http\Controllers\Voter\VoterController;
use Illuminate\Support\Facades\Route;

// ── Root: redirect ke dashboard sesuai role jika sudah login ──────────────────
Route::get('/', function () {
    if (!auth()->check()) {
        return redirect()->route('login');
    }
    return match (auth()->user()->role) {
        'admin'   => redirect()->route('admin.dashboard'),
        'petugas' => redirect()->route('petugas.dashboard'),
        'voter'   => redirect()->route('voter.dashboard'),
        default   => redirect()->route('login'),
    };
});

// ── Auth: Staff Login ─────────────────────────────────────────────────────────
// PENTING: middleware 'guest' hanya untuk GET, bukan POST
Route::get('/login', [StaffLoginController::class, 'create'])
    ->middleware('guest')
    ->name('login');

Route::post('/login', [StaffLoginController::class, 'store'])
    ->name('login.store');

Route::post('/logout', [StaffLoginController::class, 'destroy'])
    ->middleware('auth')
    ->name('logout');

// ── Auth: Google OAuth (Voter) ────────────────────────────────────────────────
Route::get('/auth/google', [GoogleAuthController::class, 'redirect'])
    ->name('auth.google');

Route::get('/auth/google/callback', [GoogleAuthController::class, 'callback'])
    ->name('auth.google.callback');

// ── Voter Routes ──────────────────────────────────────────────────────────────
Route::middleware(['auth', 'role:voter'])
    ->prefix('voter')
    ->name('voter.')
    ->group(function () {
        Route::get('/dashboard', [VoterController::class, 'dashboard'])->name('dashboard');
        Route::get('/qr', [VoterController::class, 'generateQr'])->name('qr.generate');
        Route::get('/vote', [VoterController::class, 'showVoting'])->name('vote');
        Route::post('/vote', [VoterController::class, 'submitVote'])->name('vote.submit');
        Route::get('/voted', [VoterController::class, 'voted'])->name('voted');
    });

// ── Petugas Routes ────────────────────────────────────────────────────────────
Route::middleware(['auth', 'role:petugas'])
    ->prefix('petugas')
    ->name('petugas.')
    ->group(function () {
        Route::get('/dashboard', [PetugasController::class, 'dashboard'])->name('dashboard');
        Route::get('/scan', [PetugasController::class, 'scan'])->name('scan');
        Route::post('/scan/process', [PetugasController::class, 'processQr'])->name('scan.process');
    });

// ── Admin Routes ──────────────────────────────────────────────────────────────
Route::middleware(['auth', 'role:admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');

        Route::get('/sessions', [SessionController::class, 'index'])->name('sessions.index');
        Route::post('/sessions', [SessionController::class, 'store'])->name('sessions.store');
        Route::put('/sessions/{session}', [SessionController::class, 'update'])->name('sessions.update');
        Route::delete('/sessions/{session}', [SessionController::class, 'destroy'])->name('sessions.destroy');

        Route::get('/candidates', [CandidateController::class, 'index'])->name('candidates.index');
        Route::post('/candidates', [CandidateController::class, 'store'])->name('candidates.store');
        Route::put('/candidates/{candidate}', [CandidateController::class, 'update'])->name('candidates.update');
        Route::delete('/candidates/{candidate}', [CandidateController::class, 'destroy'])->name('candidates.destroy');

        Route::get('/petugas', [AdminPetugasController::class, 'index'])->name('petugas.index');
        Route::post('/petugas', [AdminPetugasController::class, 'store'])->name('petugas.store');
        Route::delete('/petugas/{user}', [AdminPetugasController::class, 'destroy'])->name('petugas.destroy');

        Route::get('/report', [ReportController::class, 'index'])->name('report');
    });