<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('secciones', function (Blueprint $table) {
    $table->id('id_seccion');
    $table->string('nombre', 100);
    $table->string('imagen')->nullable();

    $table->foreignId('id_administrador')
          ->nullable()
          ->constrained('administrador', 'id_administrador')
          ->nullOnDelete();

    $table->timestamps();
});
    }

    public function down(): void
    {
        Schema::dropIfExists('secciones');
    }
};