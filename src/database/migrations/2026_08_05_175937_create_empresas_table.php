<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('empresas', function (Blueprint $table) {
    $table->id('id_empresa');
    $table->string('nombre', 150)->unique();
    $table->string('email', 150)->unique();
    $table->string('direccion', 255);
    $table->string('telefono', 20);
    $table->string('instagram', 100)->nullable();
    $table->string('facebook', 100)->nullable();
    $table->string('imagen')->nullable();
    $table->text('ofertas')->nullable();
    $table->text('condiciones')->nullable();

    // 👈 La empresa pertenece a una sección
    $table->foreignId('id_seccion')
          ->constrained('secciones', 'id_seccion')
          ->cascadeOnDelete();

    $table->foreignId('id_administrador')
          ->nullable()
          ->constrained('administrador', 'id_administrador')
          ->nullOnDelete();

    $table->timestamps();
});
    }

    public function down(): void
    {
        Schema::dropIfExists('empresas');
    }
};