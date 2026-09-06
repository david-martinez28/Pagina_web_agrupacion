<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('noticias', function (Blueprint $table) {
            $table->id('id_publicacion');
            $table->string('titulo', 200);
            $table->text('descripcion');
            $table->string('imagen')->nullable();
            $table->string('video')->nullable();
            $table->string('enlace')->nullable();
            $table->string('pdf_descarga')->nullable();
            $table->enum('role', ['Formación', 'Actividades', 'Noticia'])->default('Noticia');
            $table->timestamp('fecha_publicacion')->useCurrent();
            $table->integer('visibilidad')->default(1);

            $table->foreignId('id_administrador')
                  ->nullable()
                  ->constrained('administrador', 'id_administrador')
                  ->nullOnDelete();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('noticias');
    }
};