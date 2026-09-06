<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('criterios_evaluacion', function (Blueprint $table) {
            $table->id('id_criterio');
            $table->text('preferencias_texto')->nullable();
            $table->string('baremacion_imagen')->nullable();
            $table->text('desempate_texto')->nullable();

            $table->foreignId('id_administrador')
                  ->nullable()
                  ->constrained('administrador', 'id_administrador')
                  ->nullOnDelete();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('criterios_evaluacion');
    }
};