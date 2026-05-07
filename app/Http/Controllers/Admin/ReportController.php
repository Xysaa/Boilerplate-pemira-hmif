<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ElectionSession;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    public function index(): Response
    {
        $sessions = ElectionSession::where('status', 'ended')
            ->with(['candidates' => fn ($q) => $q->withCount('ballotBoxes')])
            ->withCount(['participations', 'ballotBoxes'])
            ->orderByDesc('end_at')->get();

        $activeSession = ElectionSession::active()
            ->withCount(['participations', 'ballotBoxes'])
            ->with(['candidates' => fn ($q) => $q->withCount('ballotBoxes')])
            ->first();

        return Inertia::render('Admin/Report', compact('sessions', 'activeSession'));
    }
}
