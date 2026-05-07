<?php

namespace App\Http\Controllers\Petugas;

use App\Http\Controllers\Controller;
use App\Models\ElectionSession;
use App\Models\Participation;
use App\Services\QrService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PetugasController extends Controller
{
    public function __construct(private QrService $qrService) {}

    public function dashboard(): Response
    {
        $session = ElectionSession::active()
            ->withCount(['participations', 'ballotBoxes'])
            ->first();

        $recentScans = [];
        if ($session) {
            $recentScans = Participation::with('user:id,name,email,avatar')
                ->where('election_session_id', $session->id)
                ->whereIn('status', ['present', 'voted'])
                ->orderByDesc('present_at')
                ->limit(10)
                ->get()
                ->map(fn ($p) => [
                    'id'         => $p->id,
                    'user'       => $p->user->only('id', 'name', 'email', 'avatar'),
                    'status'     => $p->status,
                    'present_at' => $p->present_at,
                ]);
        }

        return Inertia::render('Petugas/Dashboard', [
            'session'     => $session ? [
                'id'                  => $session->id,
                'name'                => $session->name,
                'participations_count'=> $session->participations_count,
                'ballot_boxes_count'  => $session->ballot_boxes_count,
            ] : null,
            'recentScans' => $recentScans,
        ]);
    }

    public function scan(): Response
    {
        $session = ElectionSession::active()->first();
        return Inertia::render('Petugas/Scan', [
            'session' => $session ? $session->only('id', 'name') : null,
        ]);
    }

    public function processQr(Request $request): JsonResponse
    {
        $request->validate([
            'token' => ['required', 'string'],
        ]);

        $session = ElectionSession::active()->first();
        if (!$session) {
            return response()->json(['success' => false, 'message' => 'Tidak ada sesi aktif.'], 422);
        }

        $voter = $this->qrService->validateToken($request->token);
        if (!$voter) {
            return response()->json(['success' => false, 'message' => 'QR Code tidak valid atau sudah kadaluarsa.'], 422);
        }

        // Get or create participation
        $participation = Participation::firstOrCreate(
            ['user_id' => $voter->id, 'election_session_id' => $session->id],
            ['status' => 'registered']
        );

        if ($participation->isPresent()) {
            return response()->json([
                'success' => false,
                'message' => "Pemilih {$voter->name} sudah melakukan presensi.",
            ], 422);
        }

        $participation->update([
            'status'     => 'present',
            'present_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'voter'   => [
                'id'     => $voter->id,
                'name'   => $voter->name,
                'email'  => $voter->email,
                'avatar' => $voter->avatar,
            ],
            'message' => "Presensi {$voter->name} berhasil dicatat.",
        ]);
    }
}
