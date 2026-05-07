<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class PetugasController extends Controller
{
    public function index(): Response
    {
        $petugas = User::where('role', 'petugas')->orderBy('name')->get(['id', 'name', 'email', 'created_at']);
        return Inertia::render('Admin/Petugas/Index', compact('petugas'));
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name'     => ['required', 'string', 'max:255'],
            'email'    => ['required', 'email', 'unique:users'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);
        User::create(['name' => $data['name'], 'email' => $data['email'],
            'password' => Hash::make($data['password']), 'role' => 'petugas']);
        return back()->with('success', 'Akun petugas berhasil dibuat.');
    }

    public function destroy(User $user): RedirectResponse
    {
        abort_if($user->role !== 'petugas', 403);
        $user->delete();
        return back()->with('success', 'Akun petugas berhasil dihapus.');
    }
}
