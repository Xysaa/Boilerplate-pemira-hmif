<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * JAMINAN ANONIMITAS:
 * Model ini TIDAK memiliki relasi ke User.
 * Hanya menyimpan voting_session_id dan candidate_id.
 * Pilihan voter tidak dapat ditelusuri kembali ke identitasnya.
 */
class BallotBox extends Model
{
    public $timestamps = false;

    protected $fillable = ['election_session_id', 'candidate_id'];

    protected function casts(): array
    {
        return ['created_at' => 'datetime'];
    }

    // Relationships (NO user relationship — by design)
    public function votingSession(): BelongsTo
    {
        return $this->belongsTo(VotingSession::class);
    }

    public function candidate(): BelongsTo
    {
        return $this->belongsTo(Candidate::class);
    }
}
