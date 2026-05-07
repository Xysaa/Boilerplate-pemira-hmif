<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('participations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('election_session_id')->constrained('election_sessions')->cascadeOnDelete();
            $table->enum('status', ['registered', 'present', 'voted'])->default('registered');
            $table->timestamp('present_at')->nullable();
            $table->timestamp('voted_at')->nullable();
            $table->timestamps();

            // Satu voter hanya bisa ikut satu kali per sesi
            $table->unique(['user_id', 'election_session_id']);
            $table->index(['election_session_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('participations');
    }
};
