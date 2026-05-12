<?php

namespace App\Http\Controllers;

use App\Models\Candidate;
use App\Models\ElectionSession;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class LandingController extends Controller
{
    public function index(): Response
    {
        $activeSession = ElectionSession::where('status', 'active')
            ->withCount(['participations', 'ballotBoxes', 'candidates'])
            ->first();

        $upcoming = ElectionSession::where('status', 'draft')
            ->orderBy('start_at')
            ->limit(1)
            ->first();

        $latestEnded = ElectionSession::where('status', 'ended')
            ->withCount(['participations', 'ballotBoxes'])
            ->orderByDesc('end_at')
            ->first();

        $featuredSession = $activeSession ?: $upcoming;
        $candidates = [];
        if ($featuredSession) {
            $candidates = Candidate::where('election_session_id', $featuredSession->id)
                ->orderBy('number')
                ->get()
                ->map(fn ($c) => [
                    'id'        => $c->id,
                    'number'    => $c->number,
                    'name'      => $c->name,
                    'vice_name' => $c->vice_name,
                    'photo'     => $c->photo,
                    'vice_photo'=> $c->vice_photo,
                    'vision'    => $c->vision,
                ])
                ->toArray();
        }

        $stats = [
            'total_voters'     => User::where('role', 'voter')->count(),
            'total_sessions'   => ElectionSession::count(),
            'total_candidates' => Candidate::count(),
        ];

        return Inertia::render('Landing', [
            'activeSession'   => $activeSession ? [
                'id'                   => $activeSession->id,
                'name'                 => $activeSession->name,
                'description'          => $activeSession->description,
                'status'               => $activeSession->status,
                'start_at'             => $activeSession->start_at,
                'end_at'               => $activeSession->end_at,
                'participations_count' => $activeSession->participations_count,
                'ballot_boxes_count'   => $activeSession->ballot_boxes_count,
                'candidates_count'     => $activeSession->candidates_count,
            ] : null,
            'upcomingSession' => $upcoming ? [
                'id'          => $upcoming->id,
                'name'        => $upcoming->name,
                'description' => $upcoming->description,
                'start_at'    => $upcoming->start_at,
                'end_at'      => $upcoming->end_at,
            ] : null,
            'latestEnded'     => $latestEnded ? [
                'id'                   => $latestEnded->id,
                'name'                 => $latestEnded->name,
                'participations_count' => $latestEnded->participations_count,
                'ballot_boxes_count'   => $latestEnded->ballot_boxes_count,
                'end_at'               => $latestEnded->end_at,
            ] : null,
            'candidates'      => $candidates,
            'stats'           => $stats,
        ]);
    }
}
