<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ElectionSession;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController extends Controller
{
    public function index(): Response
    {
        $activeSession = ElectionSession::active()->first();

        $stats = [
            'total_voters'   => User::where('role', 'voter')->count(),
            'total_petugas'  => User::where('role', 'petugas')->count(),
            'total_sessions' => ElectionSession::count(),
            'active_session' => $activeSession ? [
                'id'            => $activeSession->id,
                'name'          => $activeSession->name,
                'total_voters'  => $activeSession->total_voters,
                'total_votes'   => $activeSession->total_votes,
                'total_present' => $activeSession->total_present,
            ] : null,
        ];

        $sessions = ElectionSession::withCount(['participations', 'ballotBoxes', 'candidates'])
            ->orderByDesc('created_at')->limit(5)->get()
            ->map(fn ($s) => [
                'id'                   => $s->id,
                'name'                 => $s->name,
                'status'               => $s->status,
                'start_at'             => $s->start_at,
                'end_at'               => $s->end_at,
                'participations_count' => $s->participations_count,
                'ballot_boxes_count'   => $s->ballot_boxes_count,
                'candidates_count'     => $s->candidates_count,
            ]);

        return Inertia::render('Admin/Dashboard', compact('stats', 'sessions'));
    }
}
