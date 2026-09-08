<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Seccion;
use App\Models\Empresa;
use PhpOffice\PhpSpreadsheet\IOFactory;
use Carbon\Carbon;

class EmpresaExcelSeeder extends Seeder
{
    public function run(): void
    {
        // Ruta donde colocaras tu archivo Excel (ej: storage/app/comercios 2024-25.xlsx)
        $filePath = storage_path('app/comercios 2024-25.xlsx');

        if (!file_exists($filePath)) {
            $this->command->error("El archivo Excel no se encuentra en: {$filePath}");
            return;
        }

        $this->command->info("Leyendo el archivo Excel...");

        $spreadsheet = IOFactory::load($filePath);
        $sheetNames = $spreadsheet->getSheetNames();

        foreach ($sheetNames as $sheetName) {
            $sheet = $spreadsheet->getSheetByName($sheetName);
            $rows = $sheet->toArray(null, true, true, true);

            // 1. Buscar dinámicamente la fila de cabecera que contenga 'Comercio'
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
                continue; // Si la pestaña no tiene formato de comercios, se salta
            }

            // 2. Crear o recuperar la sección basada en el nombre de la pestaña
            $seccion = Seccion::firstOrCreate(
                ['nombre' => trim($sheetName)],
                ['created_at' => Carbon::now(), 'updated_at' => Carbon::now()]
            );

            // 3. Procesar las filas de datos posteriores a la cabecera
            for ($i = $headerRowIndex + 1; $i <= count(array_keys($rows)); $i++) {
                $row = $rows[$i] ?? null;
                if (!$row) continue;

                // Mapear columnas dinámicamente según el texto de la cabecera
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

                // Validar que tenga nombre y no esté vacío
                if (!empty($rowData['nombre'])) {
                    // Evitar duplicados por email nulo o único
                    if (!empty($rowData['email'])) {
                        $exists = Empresa::where('email', $rowData['email'])->exists();
                        if ($exists) $rowData['email'] = null; // Evitar error de clave única duplicada
                    }

                    Empresa::updateOrCreate(
                        ['nombre' => $rowData['nombre']],
                        [
                            'email' => $rowData['email'] ?? null,
                            'web' => $rowData['web'] ?? null,
                            'direccion' => $rowData['direccion'] ?? null,
                            'telefono' => $rowData['telefono'] ?? null,
                            'instagram' => $rowData['instagram'] ?? null,
                            'facebook' => $rowData['facebook'] ?? null,
                            'ofertas' => $rowData['ofertas'] ?? null,
                            'condiciones' => $rowData['condiciones'] ?? null,
                            'id_seccion' => $seccion->id_seccion, // Relación con la sección
                            'updated_at' => Carbon::now(),
                            'created_at' => Carbon::now(),
                        ]
                    );
                }
            }
        }

        $this->command->info("¡Comercios e importación desde Excel finalizados con éxito!");
    }
}