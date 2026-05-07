<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Candidate;
use App\Models\ElectionSession;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CandidateController extends Controller
{
    public function index(): Response
    {
        $sessions   = ElectionSession::all();
        $candidates = Candidate::with('electionSession')->withCount('ballotBoxes')
            ->orderBy('election_session_id')->orderBy('number')->get();
        return Inertia::render('Admin/Candidates/Index', compact('sessions', 'candidates'));
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'election_session_id' => ['required', 'exists:election_sessions,id'],
            'number'              => ['required', 'integer', 'min:1'],
            'name'                => ['required', 'string', 'max:255'],
            'vice_name'           => ['nullable', 'string', 'max:255'],
            'vision'              => ['nullable', 'string'],
            'mission'             => ['nullable', 'string'],
            'photo'               => ['nullable', 'image', 'max:2048'],
            'vice_photo'          => ['nullable', 'image', 'max:2048'],
        ]);
        if ($request->hasFile('photo')) $data['photo'] = $request->file('photo')->store('candidates', 'public');
        if ($request->hasFile('vice_photo')) $data['vice_photo'] = $request->file('vice_photo')->store('candidates', 'public');
        Candidate::create($data);
        return back()->with('success', 'Kandidat berhasil ditambahkan.');
    }

    public function update(Request $request, Candidate $candidate): RedirectResponse
    {
        $data = $request->validate([
            'number'    => ['required', 'integer', 'min:1'],
            'name'      => ['required', 'string', 'max:255'],
            'vice_name' => ['nullable', 'string', 'max:255'],
            'vision'    => ['nullable', 'string'],
            'mission'   => ['nullable', 'string'],
        ]);
        $candidate->update($data);
        return back()->with('success', 'Kandidat berhasil diperbarui.');
    }

    public function destroy(Candidate $candidate): RedirectResponse
    {
        $candidate->delete();
        return back()->with('success', 'Kandidat berhasil dihapus.');
    }
}
