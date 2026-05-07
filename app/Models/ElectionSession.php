<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ElectionSession extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'description', 'status', 'start_at', 'end_at'];

    protected function casts(): array
    {
        return ['start_at' => 'datetime', 'end_at' => 'datetime'];
    }

    public function candidates(): HasMany { return $this->hasMany(Candidate::class); }
    public function participations(): HasMany { return $this->hasMany(Participation::class); }
    public function ballotBoxes(): HasMany { return $this->hasMany(BallotBox::class); }

    public function scopeActive($query) { return $query->where('status', 'active'); }

    public function getTotalVotersAttribute(): int { return $this->participations()->count(); }
    public function getTotalVotesAttribute(): int { return $this->ballotBoxes()->count(); }
    public function getTotalPresentAttribute(): int { return $this->participations()->whereIn('status', ['present', 'voted'])->count(); }
}
