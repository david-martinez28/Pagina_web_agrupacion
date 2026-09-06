<?php

namespace Database\Factories;

use App\Models\Administrador;
use Illuminate\Database\Eloquent\Factories\Factory;

class AmpaFactory extends Factory
{
    public function definition(): array
    {
        return [
            'nombre'           => 'AMPA ' . fake()->company(),
            'correo'           => fake()->unique()->safeEmail(),
            'telefono'         => fake()->phoneNumber(),
            'instagram'        => '@ampa_' . fake()->userName(),
            'facebook'         => 'ampa.' . fake()->userName(),
            'id_administrador' => Administrador::factory(),
        ];
    }
}