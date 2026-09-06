<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('calendario', function (Blueprint $table) {
            $table->id('id_calendario');
            $table->string('grado_educativo', 100);
            $table->string('imagen')->nullable();
            $table->string('enlace')->nullable();

            $table->foreignId('id_administrador')
                  ->nullable()
                  ->constrained('administrador', 'id_administrador')
                  ->nullOnDelete();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('calendario');
    }
};