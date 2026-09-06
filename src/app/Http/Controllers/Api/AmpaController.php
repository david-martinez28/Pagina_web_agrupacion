<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\AmpaResource;
use App\Models\Ampa;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class AmpaController extends Controller
{
    public function index()
    {
        $ampas = Ampa::with(['centro', 'administrador'])->get();
        return AmpaResource::collection($ampas);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre'           => 'required|string|max:150',
            'correo'           => 'required|email|max:150|unique:ampa,correo',
            'telefono'         => 'nullable|string|max:20',
            'instagram'        => 'nullable|string|max:100',
            'facebook'         => 'nullable|string|max:100',
            'id_administrador' => 'nullable|exists:administrador,id_administrador',
        ]);

        $ampa = Ampa::create($validated);

        return new AmpaResource($ampa->load(['centro', 'administrador']));
    }

    public function show(Ampa $ampa)
    {
        return new AmpaResource($ampa->load(['centro', 'administrador']));
    }

    public function update(Request $request, Ampa $ampa)
    {
        $validated = $request->validate([
            'nombre'           => 'sometimes|required|string|max:150',
            'correo'           => 'sometimes|required|email|max:150|unique:ampa,correo,' . $ampa->id_ampa . ',id_ampa',
            'telefono'         => 'nullable|string|max:20',
            'instagram'        => 'nullable|string|max:100',
            'facebook'         => 'nullable|string|max:100',
            'id_administrador' => 'nullable|exists:administrador,id_administrador',
        ]);

        $ampa->update($validated);

        return new AmpaResource($ampa->load(['centro', 'administrador']));
    }

    public function destroy(Ampa $ampa)
    {
        $ampa->delete();

        return response()->json(['message' => 'AMPA eliminada correctamente'], Response::HTTP_OK);
    }
}