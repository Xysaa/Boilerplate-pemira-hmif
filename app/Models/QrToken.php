<?php

namespace App\Models;

use Illuminate\Database\Eloquent\MassPrunable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QrToken extends Model
{
    use MassPrunable;

    protected $fillable = ['user_id', 'token', 'expires_at', 'used'];

    protected function casts(): array
    {
        return ['expires_at' => 'datetime', 'used' => 'boolean'];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function isValid(): bool
    {
        return !$this->used && $this->expires_at->isFuture();
    }

    public function prunable()
    {
        return static::where('expires_at', '<', now()->subHour());
    }
}
