<?php

namespace App\Services;

use App\Models\QrToken;
use App\Models\User;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Log;

class QrService
{
    /**
     * Token valid for 10 seconds (rotates on every request from frontend).
     */
    const TTL_SECONDS = 100;

    /**
     * Generate a new QR token for voter presensi.
     * The QR payload is an encrypted JSON containing user_id + timestamp.
     */
    public function generateToken(User $voter): array
    {
        // Invalidate previous unused tokens for this user
        QrToken::where('user_id', $voter->id)
            ->where('used', false)
            ->delete();

        $expiresAt = now()->addSeconds(self::TTL_SECONDS);

        $payload = Crypt::encryptString(json_encode([
            'user_id'    => $voter->id,
            'timestamp'  => now()->timestamp,
            'expires_at' => $expiresAt->timestamp,
        ]));

        $qrToken = QrToken::create([
            'user_id'    => $voter->id,
            'token'      => $payload,
            'expires_at' => $expiresAt,
            'used'       => false,
        ]);

        return [
            'token'      => $payload,
            'expires_at' => $expiresAt->timestamp,
            'ttl'        => self::TTL_SECONDS,
        ];
    }

    /**
     * Validate a QR token scanned by Petugas.
     * Returns the voter User model or null if invalid.
     */
    public function validateToken(string $encryptedToken): ?User
    {
        try {
            $payload = json_decode(Crypt::decryptString($encryptedToken), true);

            if (!$payload || !isset($payload['user_id'], $payload['expires_at'])) {
                return null;
            }

            // Check token hasn't expired
            if (now()->timestamp > $payload['expires_at']) {
                return null;
            }

            // Find unused token in DB
            $qrToken = QrToken::where('user_id', $payload['user_id'])
                ->where('token', $encryptedToken)
                ->where('used', false)
                ->where('expires_at', '>', now())
                ->first();

            if (!$qrToken) {
                return null;
            }

            // Mark token as used
            $qrToken->update(['used' => true]);

            return User::find($payload['user_id']);
        } catch (\Throwable $e) {
            Log::warning('QR token validation failed: ' . $e->getMessage());
            return null;
        }
    }
}
