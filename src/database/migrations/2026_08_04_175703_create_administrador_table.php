<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('administrador', function (Blueprint $table) {
            $table->id('id_administrador');
            $table->string('nombre', 100);
            $table->string('correo', 150)->unique();
            $table->string('contrasena');
            $table->string('pin', 10);
            $table->integer('permisos')->default(1);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('administrador');
    }
};