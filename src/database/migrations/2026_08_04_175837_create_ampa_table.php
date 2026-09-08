<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ampa', function (Blueprint $table) {
            $table->id('id_ampa');
            $table->string('nombre', 150);
            $table->string('correo', 150)->unique();
            $table->string('telefono', 20)->nullable();
            $table->string('instagram', 100)->nullable();
            $table->string('facebook', 100)->nullable();
            $table->string("imagen")->nullable();
            
            $table->foreignId('id_administrador')
                  ->nullable()
                  ->constrained('administrador', 'id_administrador')
                  ->nullOnDelete();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ampa');
    }
};