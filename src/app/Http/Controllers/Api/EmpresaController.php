<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\EmpresaResource;
use App\Models\Empresa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Support\Facades\Storage;

class EmpresaController extends Controller
{
    // ==========================================
    // OBTENER TODAS LAS EMPRESAS
    // ==========================================
    public function index()
    {
        $empresas = Empresa::with(['seccion', 'administrador'])->orderBy('nombre', 'asc')->get();
        return EmpresaResource::collection($empresas);
    }

    // ==========================================
    // MOSTRAR UNA EMPRESA (Cifrado)
    // ==========================================
    public function show($idCifrado)
    {
        try {
            $idReal = Crypt::decryptString($idCifrado);
        } catch (DecryptException $e) {
            return response()->json(['error' => 'Identificador no válido'], 400);
        }

        $empresa = Empresa::where('id_empresa', $idReal)->with(['seccion', 'administrador'])->firstOrFail();

        return new EmpresaResource($empresa);
    }

    // ==========================================
    // CREAR NUEVA EMPRESA (POST)
    // ==========================================
    public function store(Request $request)
    {
        $request->merge([
            'instagram'   => $request->filled('instagram') ? $request->instagram : null,
            'facebook'    => $request->filled('facebook') ? $request->facebook : null,
            'ofertas'     => $request->filled('ofertas') ? $request->ofertas : null,
            'condiciones' => $request->filled('condiciones') ? $request->condiciones : null,
        ]);

        $validated = $request->validate([
            'nombre'           => 'required|string|max:150|unique:empresas,nombre',
            'email'            => 'required|email|max:150|unique:empresas,email',
            'direccion'        => 'required|string|max:255',
            'telefono'         => 'required|string|max:20',
            'instagram'        => 'nullable|string|max:100',
            'facebook'         => 'nullable|string|max:100',
            'imagen'           => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'ofertas'          => 'nullable|string',
            'web'              => 'nullable|url|max:255',
            'condiciones'      => 'nullable|string',
            'id_seccion'       => 'required|exists:secciones,id_seccion',
            'id_administrador' => 'nullable|exists:administrador,id_administrador',
        ]);

        if ($request->hasFile('imagen')) {
            $validated['imagen'] = $request->file('imagen')->store('empresas/imagenes', 'public');
        }

        $empresa = Empresa::create($validated);
        $empresa->load(['seccion', 'administrador']);

        return response()->json([
            'message' => 'Empresa creada correctamente',
            'data'    => new EmpresaResource($empresa)
        ], 201);
    }

    // ==========================================
    // ACTUALIZAR UNA EMPRESA (PUT/POST con _method)
    // ==========================================
    public function update(Request $request, $idCifrado)
    {
        try {
            $idReal = Crypt::decryptString($idCifrado);
        } catch (DecryptException $e) {
            return response()->json(['error' => 'Identificador no válido'], 400);
        }

        $empresa = Empresa::where('id_empresa', $idReal)->firstOrFail();

        $request->merge([
            'instagram'   => $request->filled('instagram') ? $request->instagram : null,
            'facebook'    => $request->filled('facebook') ? $request->facebook : null,
            'ofertas'     => $request->filled('ofertas') ? $request->ofertas : null,
            'condiciones' => $request->filled('condiciones') ? $request->condiciones : null,
        ]);

        $validated = $request->validate([
            'nombre'           => 'required|string|max:150|unique:empresas,nombre,' . $idReal . ',id_empresa',
            'email'            => 'required|email|max:150|unique:empresas,email,' . $idReal . ',id_empresa',
            'direccion'        => 'required|string|max:255',
            'telefono'         => 'required|string|max:20',
            'instagram'        => 'nullable|string|max:100',
            'facebook'         => 'nullable|string|max:100',
            'imagen'           => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'ofertas'          => 'nullable|string',
            'web'              => 'nullable|url|max:255',
            'condiciones'      => 'nullable|string',
            'id_seccion'       => 'required|exists:secciones,id_seccion',
            'id_administrador' => 'nullable|exists:administrador,id_administrador',
        ]);

        // Si el usuario subió una NUEVA imagen
        if ($request->hasFile('imagen')) {
            if ($empresa->imagen && Storage::disk('public')->exists($empresa->imagen)) {
                Storage::disk('public')->delete($empresa->imagen);
            }
            $validated['imagen'] = $request->file('imagen')->store('empresas/imagenes', 'public');
        } else {
            unset($validated['imagen']);
        }

        $empresa->update($validated);
        $empresa->load(['seccion', 'administrador']);

        return response()->json([
            'message' => 'Empresa actualizada correctamente',
            'data'    => new EmpresaResource($empresa)
        ]);
    }

    // ==========================================
    // ELIMINAR UNA EMPRESA (DELETE)
    // ==========================================
    public function destroy($idCifrado)
    {
        try {
            $idReal = Crypt::decryptString($idCifrado);
        } catch (DecryptException $e) {
            return response()->json(['error' => 'Identificador no válido'], 400);
        }

        $empresa = Empresa::where('id_empresa', $idReal)->firstOrFail();

        if ($empresa->imagen && Storage::disk('public')->exists($empresa->imagen)) {
            Storage::disk('public')->delete($empresa->imagen);
        }

        $empresa->delete();

        return response()->json(['message' => 'Empresa eliminada correctamente']);
    }
}