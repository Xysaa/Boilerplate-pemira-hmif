<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Candidate extends Model
{
    use HasFactory;
    // TIDAK pakai SoftDeletes

    protected $fillable = [
        'election_session_id',
        'number',
        'name',
        'vice_name',
        'vision',
        'mission',
        'photo',
        'vice_photo',
    ];

    public function electionSession(): BelongsTo
    {
        return $this->belongsTo(ElectionSession::class);
    }

    public function ballotBoxes(): HasMany
    {
        return $this->hasMany(BallotBox::class);
    }

    public function getVoteCountAttribute(): int
    {
        return $this->ballotBoxes()->count();
    }
}