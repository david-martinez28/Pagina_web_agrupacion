<?php

namespace Database\Factories;

use App\Models\Administrador;
use Illuminate\Database\Eloquent\Factories\Factory;

class NoticiaFactory extends Factory
{
    public function definition(): array
    {
        return [
            'titulo'            => fake()->sentence(6),
            'descripcion'       => fake()->paragraphs(3, true),
            'imagen'            => 'noticias/default.jpg',
            'video'             => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            'enlace'            => fake()->url(),
            'pdf_descarga'      => 'pdfs/documento.pdf',
            'role'              => fake()->randomElement(['Formación', 'Actividades', 'Noticia']),
            'fecha_publicacion' => fake()->dateTimeBetween('-1 year', 'now'),
            'visibilidad'       => fake()->boolean(80),
            'id_administrador'  => Administrador::factory(),
        ];
    }
}