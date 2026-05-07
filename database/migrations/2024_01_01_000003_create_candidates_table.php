<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('candidates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('election_session_id')
                  ->constrained('election_sessions')
                  ->cascadeOnDelete();
            $table->integer('number');
            $table->string('name');
            $table->string('vice_name')->nullable();
            $table->text('vision')->nullable();
            $table->text('mission')->nullable();
            $table->string('photo')->nullable();
            $table->string('vice_photo')->nullable();
            $table->timestamps();
            // TIDAK ADA softDeletes

            $table->unique(['election_session_id', 'number']);
            $table->index('election_session_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('candidates');
    }
};