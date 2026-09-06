<?php

namespace Database\Factories;

use App\Models\Administrador;
use App\Models\Ampa;
use Illuminate\Database\Eloquent\Factories\Factory;

class CentroFactory extends Factory
{
    public function definition(): array
    {
        return [
            'nombre'           => 'CEIP ' . fake()->streetName(),
            'descripcion'      => fake()->paragraph(),
            'imagen'           => 'centros/default.jpg',
            'modalidad'        => fake()->randomElement(['Pública', 'Concertada', 'Privada']),
            
            // Datos de contacto y ubicación
            'direccion'        => fake()->address(),
            'telefono'         => fake()->phoneNumber(),
            'email'            => fake()->safeEmail(),
            'web'              => fake()->url(),
            
            // Redes sociales y multimedia
            'facebook'         => 'https://facebook.com/' . fake()->userName(),
            'instagram'        => '@' . fake()->userName(),
            'video'            => 'https://youtube.com/watch?v=' . fake()->regexify('[A-Za-z0-9]{11}'),
            
            // Relaciones
            'id_ampa'          => Ampa::factory(),
            'id_administrador' => Administrador::factory(),
        ];
    }
}