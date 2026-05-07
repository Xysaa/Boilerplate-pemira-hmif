<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Participation extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'election_session_id', 'status', 'present_at', 'voted_at'];

    protected function casts(): array
    {
        return [
            'present_at' => 'datetime',
            'voted_at'   => 'datetime',
        ];
    }

    // Relationships
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function electionSession(): BelongsTo
    {
        return $this->belongsTo(ElectionSession::class, 'election_session_id');
    }

    // Helpers
    public function isRegistered(): bool { return $this->status === 'registered'; }
    public function isPresent(): bool    { return $this->status === 'present'; }
    public function hasVoted(): bool     { return $this->status === 'voted'; }

    public function markPresent(): void
    {
        $this->update(['status' => 'present', 'present_at' => now()]);
    }

    public function markVoted(): void
    {
        $this->update(['status' => 'voted', 'voted_at' => now()]);
    }
}
