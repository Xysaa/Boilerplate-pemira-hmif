<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'avatar',
        'google_id',
        'email_verified_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'google_id',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password'          => 'hashed',
        ];
    }

    // ── Role helpers ─────────────────────────────────────────────────────────

    public function isAdmin(): bool    { return $this->role === 'admin'; }
    public function isPetugas(): bool  { return $this->role === 'petugas'; }
    public function isVoter(): bool    { return $this->role === 'voter'; }

    // ── Relationships ────────────────────────────────────────────────────────

    public function participations(): HasMany
    {
        return $this->hasMany(Participation::class);
    }

    public function qrTokens(): HasMany
    {
        return $this->hasMany(QrToken::class);
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    public function participationFor(int $sessionId): ?Participation
    {
        return $this->participations()
            ->where('election_session_id', $sessionId)
            ->first();
    }

    /**
     * Cek apakah voter sudah vote di sesi yang masih aktif.
     * Digunakan untuk blokir login ulang.
     */
    public function hasVotedInActiveSession(): bool
    {
        return $this->participations()
            ->where('status', 'voted')
            ->whereHas('electionSession', fn ($q) => $q->where('status', 'active'))
            ->exists();
    }
}
