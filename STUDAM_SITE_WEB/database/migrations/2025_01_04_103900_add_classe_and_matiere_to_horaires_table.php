<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('horaires', function (Blueprint $table) {
            $table->foreignId('classe_id')->constrained('classes')->onDelete('cascade');
            $table->foreignId('matiere_id')->constrained('matieres')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('horaires', function (Blueprint $table) {
            $table->dropForeign(['classe_id']);
            $table->dropForeign(['matiere_id']);
            $table->dropColumn(['classe_id', 'matiere_id']);
        });
    }
};
