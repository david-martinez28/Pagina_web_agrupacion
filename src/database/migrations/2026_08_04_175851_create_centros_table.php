<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('centros', function (Blueprint $table) {
            $table->id('id_centro');
            $table->string('nombre', 150);
            $table->text('descripcion')->nullable();
            $table->string('imagen')->nullable();
            $table->string('modalidad', 100)->nullable();
            $table->string('email', 150)->nullable();
            $table->string('web', 150)->nullable();
            $table->string('facebook', 100)->nullable();
            $table->string('instagram', 100)->nullable();
            $table->string('video')->nullable();

            
            // --- NUEVOS CAMPOS ---
            $table->string('direccion', 255)->nullable(); // 255 es el tamaño estándar
            $table->string('telefono', 20)->nullable();   // 20 caracteres por si lleva prefijos (+34)


            // ---------------------
            
            $table->foreignId('id_ampa')
                  ->nullable()
                  ->constrained('ampa', 'id_ampa')
                  ->nullOnDelete();

            $table->foreignId('id_administrador')
                  ->nullable()
                  ->constrained('administrador', 'id_administrador')
                  ->nullOnDelete();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('centros');
    }



    };