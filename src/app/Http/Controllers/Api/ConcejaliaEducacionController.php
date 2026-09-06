<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ConcejaliaEducacionResource;
use App\Models\ConcejaliaEducacion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ConcejaliaEducacionController extends Controller
{
    public function index()
    {
        $concejalia = ConcejaliaEducacion::with('administrador')->first();
        
        if (!$concejalia) {
            return response()->json(['data' => null], 200);
        }

        return new ConcejaliaEducacionResource($concejalia);
    }

    public function update(Request $request)
    {
        $request->merge([
            'direccion'   => $request->filled('direccion') ? $request->direccion : null,
            'telefono'    => $request->filled('telefono') ? $request->telefono : null,
            'gmail'       => $request->filled('gmail') ? $request->gmail : null,
            'descripcion' => $request->filled('descripcion') ? $request->descripcion : null,
        ]);

        $validated = $request->validate([
            'direccion'        => 'nullable|string|max:255',
            'telefono'         => 'nullable|string|max:20',
            'gmail'            => 'nullable|email|max:150',
            'descripcion'      => 'nullable|string',
            'id_administrador' => 'nullable|exists:administrador,id_administrador',
            'imagen'           => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        $concejalia = ConcejaliaEducacion::first();

        if ($request->hasFile('imagen')) {
            if ($concejalia && $concejalia->imagen) {
                Storage::disk('public')->delete($concejalia->imagen);
            }
            $validated['imagen'] = $request->file('imagen')->store('concejalia/imagenes', 'public');
        } else {
            // Conserva la imagen actual si no se sube una nueva en el formulario
            unset($validated['imagen']);
        }

        if ($concejalia) {
            $concejalia->update($validated);
        } else {
            $concejalia = ConcejaliaEducacion::create($validated);
        }

        $concejalia->load('administrador');

        return response()->json([
            'message' => 'Concejalía de Educación actualizada correctamente',
            'data'    => new ConcejaliaEducacionResource($concejalia)
        ]);
    }
}