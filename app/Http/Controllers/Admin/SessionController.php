<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ElectionSession;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SessionController extends Controller
{
    public function index(): Response
    {
        $sessions = ElectionSession::withCount(['participations', 'ballotBoxes', 'candidates'])
            ->orderByDesc('created_at')->get();
        return Inertia::render('Admin/Sessions/Index', compact('sessions'));
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name'        => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'start_at'    => ['nullable', 'date'],
            'end_at'      => ['nullable', 'date', 'after:start_at'],
        ]);
        ElectionSession::create($data);
        return back()->with('success', 'Sesi berhasil dibuat.');
    }

    public function update(Request $request, ElectionSession $session): RedirectResponse
    {
        $data = $request->validate([
            'name'        => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'status'      => ['required', 'in:draft,active,ended'],
            'start_at'    => ['nullable', 'date'],
            'end_at'      => ['nullable', 'date'],
        ]);
        if ($data['status'] === 'active') {
            ElectionSession::where('status', 'active')->where('id', '!=', $session->id)->update(['status' => 'ended']);
        }
        $session->update($data);
        return back()->with('success', 'Sesi berhasil diperbarui.');
    }

    public function destroy(ElectionSession $session): RedirectResponse
    {
        abort_if($session->status === 'active', 403, 'Tidak dapat menghapus sesi aktif.');
        $session->delete();
        return back()->with('success', 'Sesi berhasil dihapus.');
    }
}
