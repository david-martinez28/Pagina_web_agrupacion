<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

class AdministradorFactory extends Factory
{
    public function definition(): array
    {
        return [
            'nombre'     => fake()->name(),
            'correo'     => fake()->unique()->safeEmail(),
            'contrasena' => Hash::make('password123'),
            'pin'        => fake()->numerify('####'),
            'permisos'   => fake()->numberBetween(1, 3),
        ];
    }
}