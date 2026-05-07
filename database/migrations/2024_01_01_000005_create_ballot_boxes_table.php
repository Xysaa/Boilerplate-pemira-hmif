<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ballot_boxes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('election_session_id')
                  ->constrained('election_sessions')
                  ->cascadeOnDelete();
            $table->foreignId('candidate_id')
                  ->constrained('candidates')
                  ->cascadeOnDelete();
            // TIDAK ADA user_id — jaminan anonimitas
            $table->timestamp('created_at')->useCurrent();

            $table->index('election_session_id');
            $table->index('candidate_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ballot_boxes');
    }
};