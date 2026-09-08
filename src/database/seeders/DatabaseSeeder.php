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
use PhpOffice\PhpSpreadsheet\IOFactory;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Crear o recuperar el Administrador por defecto fijo para pruebas
        $adminPrincipal = Administrador::firstOrCreate(
            ['correo' => 'admin@educacion.es'],
            [
                'nombre'     => 'Administrador Principal',
                'contrasena' => Hash::make('secret123'),
                'pin'        => '1234',
                'permisos'   => 1,
            ]
        );

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

        // 7. IMPORTAR SECCIONES Y EMPRESAS DESDE EL EXCEL (Sustituye a los datos de prueba estáticos)
        $this->importarComerciosDesdeExcel($adminPrincipal->id_administrador);

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

    /**
     * Método auxiliar para leer el Excel y poblar Secciones y Empresas
     */
    private function importarComerciosDesdeExcel($adminId): void
    {
        $filePath = storage_path('app/comercios 2024-25.xlsx');

        if (!file_exists($filePath)) {
            $this->command->warn("⚠️ El archivo Excel no se encontró en 'storage/app/comercios 2024-25.xlsx'. Se omite la importación de comercios.");
            return;
        }

        $this->command->info("📂 Leyendo y procesando el archivo Excel de comercios...");

        $spreadsheet = IOFactory::load($filePath);
        $sheetNames = $spreadsheet->getSheetNames();

        foreach ($sheetNames as $sheetName) {
            $sheet = $spreadsheet->getSheetByName($sheetName);
            $rows = $sheet->toArray(null, true, true, true);

            // Buscar la fila de cabecera dinámica ('Comercio')
            $headerRowIndex = null;
            $headers = [];

            foreach ($rows as $rowIndex => $row) {
                foreach ($row as $cell) {
                    if (trim(strtolower($cell)) === 'comercio') {
                        $headerRowIndex = $rowIndex;
                        $headers = array_map('trim', $row);
                        break 2;
                    }
                }
            }

            if (!$headerRowIndex) {
                continue;
            }

            // Crear o recuperar la sección basada en el nombre de la pestaña del Excel
            $seccion = Seccion::firstOrCreate(
                ['nombre' => trim($sheetName)],
                [
                    'imagen'           => 'secciones/default.jpg',
                    'id_administrador' => $adminId,
                    'created_at'       => Carbon::now(),
                    'updated_at'       => Carbon::now()
                ]
            );

            // Procesar las filas de comercios de la pestaña
            for ($i = $headerRowIndex + 1; $i <= count(array_keys($rows)); $i++) {
                $row = $rows[$i] ?? null;
                if (!$row) continue;

                $rowData = [];
                foreach ($headers as $colKey => $headerName) {
                    $headerLower = mb_strtolower($headerName);
                    $val = trim($row[$colKey] ?? '');

                    if (str_contains($headerLower, 'comercio')) {
                        $rowData['nombre'] = $val;
                    } elseif (str_contains($headerLower, 'descuento')) {
                        $rowData['ofertas'] = $val;
                    } elseif (str_contains($headerLower, 'condicion')) {
                        $rowData['condiciones'] = $val;
                    } elseif (str_contains($headerLower, 'teléfono') || str_contains($headerLower, 'telefono')) {
                        $rowData['telefono'] = $val;
                    } elseif (str_contains($headerLower, 'dirección') || str_contains($headerLower, 'direccion')) {
                        $rowData['direccion'] = $val;
                    } elseif (str_contains($headerLower, 'web')) {
                        $rowData['web'] = $val;
                    } elseif (str_contains($headerLower, 'correo') || str_contains($headerLower, 'email')) {
                        $rowData['email'] = ($val !== '' && strtolower($val) !== 'nan') ? $val : null;
                    } elseif (str_contains($headerLower, 'instagram')) {
                        $rowData['instagram'] = $val;
                    } elseif (str_contains($headerLower, 'facebook')) {
                        $rowData['facebook'] = $val;
                    }
                }

                if (!empty($rowData['nombre'])) {
                    // Controlar duplicados de email para evitar errores de clave única
                    $email = $rowData['email'] ?? null;
                    if ($email && Empresa::where('email', $email)->exists()) {
                        $email = null;
                    }

                    Empresa::updateOrCreate(
                        ['nombre' => $rowData['nombre']],
                        [
                            'email'            => $email,
                            'web'              => $rowData['web'] ?? null,
                            'direccion'        => $rowData['direccion'] ?? null,
                            'telefono'         => $rowData['telefono'] ?? null,
                            'instagram'        => $rowData['instagram'] ?? null,
                            'facebook'         => $rowData['facebook'] ?? null,
                            'ofertas'          => $rowData['ofertas'] ?? null,
                            'condiciones'      => $rowData['condiciones'] ?? null,
                            'id_seccion'       => $seccion->id_seccion,
                            'id_administrador' => $adminId,
                            'created_at'       => Carbon::now(),
                            'updated_at'       => Carbon::now(),
                        ]
                    );
                }
            }
        }

        $this->command->info("✨ ¡Secciones y comercios del Excel importados correctamente en la base de datos!");
    }
}