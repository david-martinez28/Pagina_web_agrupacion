<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CalendarioResource;
use App\Models\Calendario;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;

class CalendarioController extends Controller
{
    public function index()
    {
        $calendarios = Calendario::with('administrador')->get();

        return CalendarioResource::collection($calendarios);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'grado_educativo'  => 'required|string|max:100',
            'imagen'           => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'enlace'           => 'nullable|url',
            'id_administrador' => 'nullable|exists:administrador,id_administrador',
        ]);

        if ($request->hasFile('imagen')) {
            $validated['imagen'] = $request->file('imagen')
                ->store('calendario', 'public');
        }

        $calendario = Calendario::create($validated);

        return new CalendarioResource(
            $calendario->load('administrador')
        );
    }

    public function show(Calendario $calendario)
    {
        return new CalendarioResource(
            $calendario->load('administrador')
        );
    }

    public function update(Request $request, Calendario $calendario)
    {
        $validated = $request->validate([
            'grado_educativo'  => 'sometimes|required|string|max:100',
            'imagen'           => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'enlace'           => 'nullable|url',
            'id_administrador' => 'nullable|exists:administrador,id_administrador',
        ]);

        /*
         * Si llega una imagen nueva:
         *
         * 1. Guardamos primero la nueva imagen.
         * 2. Eliminamos la imagen antigua.
         * 3. Guardamos la nueva ruta en la BD.
         */
        if ($request->hasFile('imagen')) {

            // Guardar la imagen nueva
            $nuevaImagen = $request->file('imagen')
                ->store('calendario', 'public');

            // Guardar temporalmente la imagen anterior
            $imagenAnterior = $calendario->imagen;

            // Actualizar la BD con la nueva imagen
            $validated['imagen'] = $nuevaImagen;

            $calendario->update($validated);

            // Eliminar la imagen anterior después de actualizar
            if (
                $imagenAnterior &&
                Storage::disk('public')->exists($imagenAnterior)
            ) {
                Storage::disk('public')->delete($imagenAnterior);
            }

        } else {
            // Si no se ha enviado una imagen nueva,
            // mantenemos la imagen existente.
            $calendario->update($validated);
        }

        return new CalendarioResource(
            $calendario->fresh()->load('administrador')
        );
    }

    public function destroy(Calendario $calendario)
    {
        if (
            $calendario->imagen &&
            Storage::disk('public')->exists($calendario->imagen)
        ) {
            Storage::disk('public')->delete($calendario->imagen);
        }

        $calendario->delete();

        return response()->json([
            'message' => 'Registro de calendario eliminado correctamente'
        ], Response::HTTP_OK);
    }
}

