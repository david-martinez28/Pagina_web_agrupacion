<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class SeccionFactory extends Factory
{
    public function definition(): array
    {
        return [
            'nombre' => $this->faker->unique()->randomElement([
                'Librerías y Papelerías',
                'Academias y Formación',
                'Deporte y Salud',
                'Ópticas y Audición',
                'Informática y Tecnología',
                'Moda y Calzado Infantil'
            ]),
            'imagen' => 'secciones/imagenes/default.jpg',
        ];
    }
}