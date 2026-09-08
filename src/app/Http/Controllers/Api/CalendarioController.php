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
            $path = $request->file('imagen')->store('calendario', 'public');
            // Guardamos la ruta relativa limpia o la URL según prefieras, 
            // asegurando que coincida con el Resource
            $validated['imagen'] = '/storage/' . $path;
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

        if ($request->hasFile('imagen')) {
            $path = $request->file('imagen')->store('calendario', 'public');

            // Eliminar imagen anterior si existe físicamente
            if ($calendario->imagen) {
                // Extraer la ruta relativa eliminando el dominio o /storage/ inicial
                $relativePath = str_replace('/storage/', '', parse_url($calendario->imagen, PHP_URL_PATH));
                if (Storage::disk('public')->exists($relativePath)) {
                    Storage::disk('public')->delete($relativePath);
                }
            }

            $validated['imagen'] = '/storage/' . $path;
        } else {
            unset($validated['imagen']);
        }

        // Si se envió _method en el FormData, Laravel lo maneja, pero con POST directo evitamos fallos
        $calendario->update($validated);

        return new CalendarioResource(
            $calendario->fresh()->load('administrador')
        );
    }

    public function destroy(Calendario $calendario)
    {
        if ($calendario->imagen) {
            $relativePath = str_replace('/storage/', '', parse_url($calendario->imagen, PHP_URL_PATH));
            if (Storage::disk('public')->exists($relativePath)) {
                Storage::disk('public')->delete($relativePath);
            }
        }

        $calendario->delete();

        return response()->json([
            'message' => 'Registro de calendario eliminado correctamente'
        ], Response::HTTP_OK);
    }
}