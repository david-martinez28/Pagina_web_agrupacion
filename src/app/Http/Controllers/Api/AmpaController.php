<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\AmpaResource;
use App\Models\Ampa;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;

class AmpaController extends Controller
{
    // ==========================================
    // OBTENER TODAS LAS AMPAS
    // ==========================================
    public function index()
    {
        $ampas = Ampa::with(['centro', 'administrador'])->orderBy('nombre', 'asc')->get();
        return AmpaResource::collection($ampas);
    }

    // ==========================================
    // MOSTRAR UN AMPA
    // ==========================================
    public function show(Ampa $ampa)
    {
        return new AmpaResource($ampa->load(['centro', 'administrador']));
    }

    // ==========================================
    // CREAR NUEVO AMPA (POST)
    // ==========================================
    public function store(Request $request)
    {
        $request->merge([
            'telefono'  => $request->filled('telefono') ? $request->telefono : null,
            'instagram' => $request->filled('instagram') ? $request->instagram : null,
            'facebook'  => $request->filled('facebook') ? $request->facebook : null,
        ]);

        $validated = $request->validate([
            'nombre'           => 'required|string|max:150',
            'correo'           => 'required|email|max:150|unique:ampa,correo',
            'telefono'         => 'nullable|string|max:20',
            'instagram'        => 'nullable|string|max:100',
            'facebook'         => 'nullable|string|max:100',
            'id_administrador' => 'nullable|exists:administrador,id_administrador',
            'imagen'           => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        if ($request->hasFile('imagen')) {
            // Se almacena limpio igual que en Empresas
            $validated['imagen'] = $request->file('imagen')->store('ampa', 'public');
        }

        $ampa = Ampa::create($validated);
        $ampa->load(['centro', 'administrador']);

        return response()->json([
            'message' => 'AMPA creada correctamente',
            'data'    => new AmpaResource($ampa)
        ], 201);
    }

    // ==========================================
    // ACTUALIZAR UN AMPA (PUT/POST con _method)
    // ==========================================
    public function update(Request $request, Ampa $ampa)
    {
        $request->merge([
            'telefono'  => $request->filled('telefono') ? $request->telefono : null,
            'instagram' => $request->filled('instagram') ? $request->instagram : null,
            'facebook'  => $request->filled('facebook') ? $request->facebook : null,
        ]);

        $validated = $request->validate([
            'nombre'           => 'sometimes|required|string|max:150',
            'correo'           => 'sometimes|required|email|max:150|unique:ampa,correo,' . $ampa->id_ampa . ',id_ampa',
            'telefono'         => 'nullable|string|max:20',
            'instagram'        => 'nullable|string|max:100',
            'facebook'         => 'nullable|string|max:100',
            'id_administrador' => 'nullable|exists:administrador,id_administrador',
            'imagen'           => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        if ($request->hasFile('imagen')) {
            if ($ampa->imagen && Storage::disk('public')->exists($ampa->imagen)) {
                Storage::disk('public')->delete($ampa->imagen);
            }
            $validated['imagen'] = $request->file('imagen')->store('ampa', 'public');
        } else {
            unset($validated['imagen']);
        }

        $ampa->update($validated);
        $ampa->load(['centro', 'administrador']);

        return response()->json([
            'message' => 'AMPA actualizada correctamente',
            'data'    => new AmpaResource($ampa)
        ]);
    }

    // ==========================================
    // ELIMINAR UN AMPA (DELETE)
    // ==========================================
    public function destroy(Ampa $ampa)
    {
        if ($ampa->imagen && Storage::disk('public')->exists($ampa->imagen)) {
            Storage::disk('public')->delete($ampa->imagen);
        }

        $ampa->delete();

        return response()->json(['message' => 'AMPA eliminada correctamente']);
    }
}