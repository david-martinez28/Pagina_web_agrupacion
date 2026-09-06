<?php

namespace Database\Seeders;

use App\Models\Administrador;
use App\Models\Ampa;
use App\Models\Calendario;
use App\Models\Centro;
use App\Models\ConcejaliaEducacion;
use App\Models\CriterioEvaluacion;
use App\Models\Empresa;
use App\Models\Noticia;
use App\Models\Seccion;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Crear un Administrador por defecto fijo para pruebas
        $adminPrincipal = Administrador::create([
            'nombre'     => 'Administrador Principal',
            'correo'     => 'admin@educacion.es',
            'contrasena' => Hash::make('secret123'),
            'pin'        => '1234',
            'permisos'   => 1,
        ]);

        // 2. Crear administradores secundarios
        Administrador::factory(3)->create();

        // 3. Crear Registro Único de Concejalía de Educación
        ConcejaliaEducacion::create([
            'direccion'        => 'Plaza del Ayuntamiento 1',
            'telefono'         => '965000111',
            'gmail'            => 'educacion@ayuntamiento.es',
            'imagen'           => 'concejalia/portada.jpg',
            'descripcion'      => 'Información general sobre la Concejalía de Educación y Servicios Educativos.',
            'id_administrador' => $adminPrincipal->id_administrador,
        ]);

        // 4. Crear Criterios de Evaluación
        CriterioEvaluacion::create([
            'preferencias_texto' => 'Criterios de valoración para la admisión escolar.',
            'baremacion_imagen'  => 'criterios/baremacion.jpg',
            'desempate_texto'    => 'Procedimiento oficial en caso de empate de puntos.',
            'id_administrador'   => $adminPrincipal->id_administrador,
        ]);

        // 5. Crear AMPAs y Centros Educativos asociados
        Ampa::factory(5)->create([
            'id_administrador' => $adminPrincipal->id_administrador,
        ])->each(function ($ampa) use ($adminPrincipal) {
            Centro::factory()->create([
                'id_ampa'          => $ampa->id_ampa,
                'id_administrador' => $adminPrincipal->id_administrador,
            ]);
        });

        // 6. Crear Noticias y Publicaciones
        Noticia::factory(15)->create([
            'id_administrador' => $adminPrincipal->id_administrador,
        ]);

        // 7. Crear Secciones y sus Empresas asociadas (Relación corregida: 1 Sección -> N Empresas)
        $nombresSecciones = [
            'Librerías y Papelerías',
            'Academias y Formación',
            'Deporte y Salud',
            'Ópticas y Audición'
        ];

        foreach ($nombresSecciones as $nombreSec) {
            $seccion = Seccion::create([
                'nombre'           => $nombreSec,
                'imagen'           => 'secciones/default.jpg',
                'id_administrador' => $adminPrincipal->id_administrador,
            ]);

            // Creamos entre 2 y 4 empresas vinculadas a esta sección exacta
            Empresa::factory(rand(2, 4))->create([
                'id_seccion'       => $seccion->id_seccion,
                'id_administrador' => $adminPrincipal->id_administrador,
            ]);
        }

        // 8. Crear Calendarios Escolares
        $grados = ['Educación Infantil', 'Educación Primaria', 'Educación Secundaria (ESO)', 'Bachillerato'];
        foreach ($grados as $grado) {
            Calendario::create([
                'grado_educativo'  => $grado,
                'imagen'           => 'calendario/' . strtolower(str_replace(' ', '_', $grado)) . '.jpg',
                'enlace'           => 'https://ejemplo.com/calendario.pdf',
                'id_administrador' => $adminPrincipal->id_administrador,
            ]);
        }
    }
}