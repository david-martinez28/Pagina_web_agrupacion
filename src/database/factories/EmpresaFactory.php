<?php

namespace Database\Factories;

use App\Models\Seccion;
use Illuminate\Database\Eloquent\Factories\Factory;

class EmpresaFactory extends Factory
{
    public function definition(): array
    {
        return [
            'nombre' => $this->faker->unique()->company(),
            'email' => $this->faker->unique()->companyEmail(),
            'direccion' => $this->faker->streetAddress() . ', Elda',
            'telefono' => $this->faker->numerify('966######'),
            'instagram' => '@' . $this->faker->lexify('????????'),
            'facebook' => $this->faker->company() . ' Oficial',
            'imagen' => 'empresas/default.jpg',
            'ofertas' => '10% de descuento en todos los servicios presentando el carnet de socio.',
            'condiciones' => 'No acumulable a otras ofertas vigentes. Válido durante todo el año escolar.',
            // Asigna la empresa de forma aleatoria a una sección existente
            'id_seccion' => Seccion::factory(), 
        ];
    }
}