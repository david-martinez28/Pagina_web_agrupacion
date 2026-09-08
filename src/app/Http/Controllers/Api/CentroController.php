<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CentroResource;
use App\Models\Centro;
use App\Models\Ampa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class CentroController extends Controller
{
    public function index()
    {
        $centros = Centro::with(['administrador', 'ampa'])->orderBy('nombre', 'asc')->get();
        return CentroResource::collection($centros);
    }

    public function show($id)
    {
        $centro = Centro::where('id_centro', $id)->with(['administrador', 'ampa'])->firstOrFail();
        return new CentroResource($centro);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre'           => 'required|string|max:150',
            'descripcion'      => 'nullable|string',
            'modalidad'        => 'nullable|string|max:100',
            'direccion'        => 'nullable|string|max:255',
            'telefono'         => 'nullable|string|max:20',
            'email'            => 'nullable|email|max:150',
            'web'              => 'nullable|url|max:150',
            'facebook'         => 'nullable|string|max:100',
            'instagram'        => 'nullable|string|max:100',
            'video'            => 'nullable|string',
            'id_administrador' => 'nullable|exists:administrador,id_administrador',
            // 🛑 Validamos que exista y que NO esté ya asignada en la tabla centros
            'id_ampa'          => 'nullable|exists:ampa,id_ampa|unique:centros,id_ampa',
            'imagen'           => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ], [
            'id_ampa.unique' => 'La AMPA seleccionada ya se encuentra asociada a otro centro educativo.',
        ]);

        if ($request->hasFile('imagen')) {
            $validated['imagen'] = $request->file('imagen')->store('centros/imagenes', 'public');
        }

        $centro = Centro::create($validated);
        $centro->load(['administrador', 'ampa']);

        return response()->json([
            'message' => 'Centro creado correctamente',
            'data'    => new CentroResource($centro)
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $centro = Centro::where('id_centro', $id)->firstOrFail();

        $validated = $request->validate([
            'nombre'           => 'required|string|max:150',
            'descripcion'      => 'nullable|string',
            'modalidad'        => 'nullable|string|max:100',
            'direccion'        => 'nullable|string|max:255',
            'telefono'         => 'nullable|string|max:20',
            'email'            => 'nullable|email|max:150',
            'web'              => 'nullable|url|max:150',
            'facebook'         => 'nullable|string|max:100',
            'instagram'        => 'nullable|string|max:100',
            'video'            => 'nullable|string',
            'id_administrador' => 'nullable|exists:administrador,id_administrador',
            // 🛑 En el update ignoramos el id_ampa del propio centro actual para que se permita reasignar el mismo
            'id_ampa'          => [
                'nullable',
                'exists:ampa,id_ampa',
                Rule::unique('centros', 'id_ampa')->ignore($centro->id_centro, 'id_centro'),
            ],
            'imagen'           => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ], [
            'id_ampa.unique' => 'La AMPA seleccionada ya se encuentra asociada a otro centro educativo.',
        ]);

        if ($request->hasFile('imagen')) {
            if ($centro->imagen && Storage::disk('public')->exists($centro->imagen)) {
                Storage::disk('public')->delete($centro->imagen);
            }
            $validated['imagen'] = $request->file('imagen')->store('centros/imagenes', 'public');
        } else {
            unset($validated['imagen']);
        }

        $centro->update($validated);
        $centro->load(['administrador', 'ampa']);

        return response()->json([
            'message' => 'Centro actualizado correctamente',
            'data'    => new CentroResource($centro)
        ]);
    }

    public function destroy($id)
    {
        $centro = Centro::where('id_centro', $id)->firstOrFail();

        if ($centro->imagen && Storage::disk('public')->exists($centro->imagen)) {
            Storage::disk('public')->delete($centro->imagen);
        }

        if ($centro->ampa && $centro->ampa->imagen && Storage::disk('public')->exists($centro->ampa->imagen)) {
            Storage::disk('public')->delete($centro->ampa->imagen);
        }

        $centro->delete();

        return response()->json(['message' => 'Centro educativo eliminado correctamente']);
    }
}