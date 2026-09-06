<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CentroResource;
use App\Models\Centro;
use App\Models\Ampa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

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
        $request->merge([
            'descripcion' => $request->filled('descripcion') ? $request->descripcion : null,
            'modalidad'   => $request->filled('modalidad') ? $request->modalidad : null,
            'direccion'   => $request->filled('direccion') ? $request->direccion : null,
            'telefono'    => $request->filled('telefono') ? $request->telefono : null,
            'email'       => $request->filled('email') ? $request->email : null,
            'web'         => $request->filled('web') ? $request->web : null,
            'facebook'    => $request->filled('facebook') ? $request->facebook : null,
            'instagram'   => $request->filled('instagram') ? $request->instagram : null,
            'video'       => $request->filled('video') ? $request->video : null,
        ]);

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
            'imagen'           => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'ampa_nombre'      => 'nullable|string|max:150',
            'ampa_correo'      => 'nullable|email|max:150',
            'ampa_telefono'    => 'nullable|string|max:20',
            'ampa_instagram'   => 'nullable|string|max:100',
            'ampa_facebook'    => 'nullable|string|max:100',
        ]);

        if ($request->hasFile('imagen')) {
            $validated['imagen'] = $request->file('imagen')->store('centros/imagenes', 'public');
        }

        $ampaId = null;
        if ($request->filled('ampa_nombre')) {
            $ampa = Ampa::create([
                'nombre'           => $request->ampa_nombre,
                'correo'           => $request->input('ampa_correo'),
                'telefono'         => $request->input('ampa_telefono'),
                'instagram'        => $request->input('ampa_instagram'),
                'facebook'         => $request->input('ampa_facebook'),
                'id_administrador' => $request->input('id_administrador'),
            ]);
            $ampaId = $ampa->id_ampa;
        }

        $validated['id_ampa'] = $ampaId;

        $centro = Centro::create($validated);
        $centro->load(['administrador', 'ampa']);

        return response()->json([
            'message' => 'Centro y AMPA creados correctamente',
            'data'    => new CentroResource($centro)
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $centro = Centro::where('id_centro', $id)->firstOrFail();

        $request->merge([
            'descripcion' => $request->filled('descripcion') ? $request->descripcion : null,
            'modalidad'   => $request->filled('modalidad') ? $request->modalidad : null,
            'direccion'   => $request->filled('direccion') ? $request->direccion : null,
            'telefono'    => $request->filled('telefono') ? $request->telefono : null,
            'email'       => $request->filled('email') ? $request->email : null,
            'web'         => $request->filled('web') ? $request->web : null,
            'facebook'    => $request->filled('facebook') ? $request->facebook : null,
            'instagram'   => $request->filled('instagram') ? $request->instagram : null,
            'video'       => $request->filled('video') ? $request->video : null,
        ]);

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
            'imagen'           => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'ampa_nombre'      => 'nullable|string|max:150',
            'ampa_correo'      => 'nullable|email|max:150',
            'ampa_telefono'    => 'nullable|string|max:20',
            'ampa_instagram'   => 'nullable|string|max:100',
            'ampa_facebook'    => 'nullable|string|max:100',
        ]);

        if ($request->hasFile('imagen')) {
            if ($centro->imagen && Storage::disk('public')->exists($centro->imagen)) {
                Storage::disk('public')->delete($centro->imagen);
            }
            $validated['imagen'] = $request->file('imagen')->store('centros/imagenes', 'public');
        } else {
            unset($validated['imagen']);
        }

        if ($request->filled('ampa_nombre')) {
            if ($centro->ampa) {
                $centro->ampa->update([
                    'nombre'    => $request->ampa_nombre,
                    'correo'    => $request->input('ampa_correo'),
                    'telefono'  => $request->input('ampa_telefono'),
                    'instagram' => $request->input('ampa_instagram'),
                    'facebook'  => $request->input('ampa_facebook'),
                ]);
            } else {
                $ampa = Ampa::create([
                    'nombre'           => $request->ampa_nombre,
                    'correo'           => $request->input('ampa_correo'),
                    'telefono'         => $request->input('ampa_telefono'),
                    'instagram'        => $request->input('ampa_instagram'),
                    'facebook'         => $request->input('ampa_facebook'),
                    'id_administrador' => $request->input('id_administrador'),
                ]);
                $validated['id_ampa'] = $ampa->id_ampa;
            }
        } else {
            $validated['id_ampa'] = null;
        }

        $centro->update($validated);
        $centro->load(['administrador', 'ampa']);

        return response()->json([
            'message' => 'Centro y AMPA actualizados correctamente',
            'data'    => new CentroResource($centro)
        ]);
    }

    public function destroy($id)
    {
        $centro = Centro::where('id_centro', $id)->firstOrFail();

        if ($centro->imagen && Storage::disk('public')->exists($centro->imagen)) {
            Storage::disk('public')->delete($centro->imagen);
        }

        $centro->delete();

        return response()->json(['message' => 'Centro educativo eliminado correctamente']);
    }
}