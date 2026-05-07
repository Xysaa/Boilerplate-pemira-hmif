<?php

namespace App\Http\Controllers\Voter;

use App\Http\Controllers\Controller;
use App\Models\BallotBox;
use App\Models\ElectionSession;
use App\Models\Participation;
use App\Services\QrService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class VoterController extends Controller
{
    public function __construct(private QrService $qrService) {}

    public function dashboard(): Response
    {
        $user    = Auth::user();
        $session = ElectionSession::active()->first();

        $participation = $session
            ? $user->participationFor($session->id)
            : null;

        // Auto-register voter in active session if not yet registered
        if ($session && !$participation) {
            $participation = Participation::create([
                'user_id'             => $user->id,
                'election_session_id' => $session->id,
                'status'              => 'registered',
            ]);
        }

        return Inertia::render('Voter/Dashboard', [
            'voter'         => $user->only('id', 'name', 'email', 'avatar'),
            'session'       => $session ? $session->only('id', 'name', 'status', 'start_at', 'end_at') : null,
            'participation' => $participation ? $participation->only('id', 'status', 'present_at', 'voted_at') : null,
        ]);
    }

    // ── QR Code Generation ───────────────────────────────────────────────────

    public function generateQr(): JsonResponse
    {
        $user = Auth::user();

        $session = ElectionSession::active()->first();
        if (!$session) {
            return response()->json(['error' => 'Tidak ada sesi pemilihan aktif.'], 422);
        }

        $participation = $user->participationFor($session->id);
        if ($participation?->isPresent()) {
            return response()->json(['error' => 'Anda sudah melakukan presensi.'], 422);
        }

        $token = $this->qrService->generateToken($user);

        return response()->json($token);
    }

    // ── Voting ───────────────────────────────────────────────────────────────

    public function showVoting(): Response
    {
        $user    = Auth::user();
        $session = ElectionSession::with('candidates')->active()->firstOrFail();

        $participation = $user->participationFor($session->id);

        if (!$participation || !$participation->isPresent()) {
            return Inertia::render('Voter/Dashboard', [
                'voter'         => $user->only('id', 'name', 'email', 'avatar'),
                'session'       => $session->only('id', 'name', 'status'),
                'participation' => $participation?->only('id', 'status'),
                'error'         => 'Lakukan presensi terlebih dahulu.',
            ]);
        }

        if ($participation->hasVoted()) {
            return Inertia::render('Voter/AlreadyVoted', [
                'voter' => $user->only('id', 'name', 'email', 'avatar'),
            ]);
        }

        return Inertia::render('Voter/Vote', [
            'voter'      => $user->only('id', 'name', 'email', 'avatar'),
            'session'    => $session->only('id', 'name'),
            'candidates' => $session->candidates->map(fn ($c) => $c->only('id', 'number', 'name', 'vice_name', 'vision', 'mission', 'photo', 'vice_photo')),
        ]);
    }

    public function submitVote(Request $request): RedirectResponse
    {
        $request->validate([
            'candidate_id' => ['required', 'integer', 'exists:candidates,id'],
        ]);

        $user    = Auth::user();
        $session = ElectionSession::active()->firstOrFail();

        $participation = $user->participationFor($session->id);

        // Guards
        abort_if(!$participation || !$participation->isPresent(), 403, 'Belum presensi.');
        abort_if($participation->hasVoted(), 403, 'Sudah melakukan pemungutan suara.');
        abort_if(
            !\App\Models\Candidate::where('id', $request->candidate_id)
                ->where('election_session_id', $session->id)
                ->exists(),
            422,
            'Kandidat tidak valid.'
        );

        // ── Store anonymous vote ─────────────────────────────────────────────
        BallotBox::create([
            'election_session_id' => $session->id,
            'candidate_id'        => $request->candidate_id,
            // NO user_id — anonymity preserved
        ]);

        // ── Update participation status ──────────────────────────────────────
        $participation->update([
            'status'   => 'voted',
            'voted_at' => now(),
        ]);

        return redirect()->route('voter.voted');
    }

    public function voted(): Response
    {
        $user = Auth::user();
        return Inertia::render('Voter/AlreadyVoted', [
            'voter' => $user->only('id', 'name', 'email', 'avatar'),
        ]);
    }
}
