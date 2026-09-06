<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Seccion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SeccionController extends Controller
{
    public function index()
    {
        try {
            // Cargamos la relación con 'empresas' según la nueva estructura
            $secciones = Seccion::with(['empresas', 'administrador'])->orderBy('nombre', 'asc')->get();
            return response()->json($secciones);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error interno en el servidor',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $seccion = Seccion::where('id_seccion', $id)->with(['empresas', 'administrador'])->firstOrFail();
            return response()->json($seccion);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Sección no encontrada',
                'message' => $e->getMessage()
            ], 404);
        }
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre'           => 'required|string|max:100|unique:secciones,nombre',
            'id_administrador' => 'nullable|exists:administrador,id_administrador',
            'imagen'           => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        if ($request->hasFile('imagen')) {
            $validated['imagen'] = $request->file('imagen')->store('secciones/imagenes', 'public');
        }

        $seccion = Seccion::create($validated);
        $seccion->load(['empresas', 'administrador']);

        return response()->json([
            'message' => 'Sección creada correctamente',
            'data'    => $seccion
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $seccion = Seccion::where('id_seccion', $id)->firstOrFail();

        $validated = $request->validate([
            'nombre'           => 'required|string|max:100|unique:secciones,nombre,' . $id . ',id_seccion',
            'id_administrador' => 'nullable|exists:administrador,id_administrador',
            'imagen'           => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        if ($request->hasFile('imagen')) {
            if ($seccion->imagen) {
                Storage::disk('public')->delete($seccion->imagen);
            }
            $validated['imagen'] = $request->file('imagen')->store('secciones/imagenes', 'public');
        }

        $seccion->update($validated);
        $seccion->load(['empresas', 'administrador']);

        return response()->json([
            'message' => 'Sección actualizada correctamente',
            'data'    => $seccion
        ]);
    }

    public function destroy($id)
    {
        $seccion = Seccion::where('id_seccion', $id)->firstOrFail();
        
        if ($seccion->imagen) {
            Storage::disk('public')->delete($seccion->imagen);
        }

        $seccion->delete();

        return response()->json(['message' => 'Sección eliminada correctamente']);
    }
}