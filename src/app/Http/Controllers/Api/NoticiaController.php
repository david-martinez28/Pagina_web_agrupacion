<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Noticia;
use App\Http\Resources\NoticiaResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Support\Facades\Storage;

class NoticiaController extends Controller
{
    // ==========================================
    // OBTENER TODAS LAS PUBLICACIONES
    // ==========================================
    public function index()
    {
        $noticias = Noticia::with('administrador')->orderBy('fecha_publicacion', 'desc')->get();
        return NoticiaResource::collection($noticias);
    }

    // ==========================================
    // MOSTRAR UNA PUBLICACIÓN (Cifrado)
    // ==========================================
    public function show($idCifrado)
    {
        try {
            $idReal = Crypt::decryptString($idCifrado);
        } catch (DecryptException $e) {
            return response()->json(['error' => 'Identificador no válido'], 400);
        }

        $noticia = Noticia::where('id_publicacion', $idReal)->with('administrador')->firstOrFail();

        return new NoticiaResource($noticia);
    }

    // ==========================================
    // CREAR NUEVA PUBLICACIÓN (POST)
    // ==========================================
    public function store(Request $request)
    {
        // Limpiamos los campos vacíos de texto antes de validar para evitar errores de URL vacía
        $request->merge([
            'video' => $request->filled('video') ? $request->video : null,
            'enlace' => $request->filled('enlace') ? $request->enlace : null,
        ]);

        $validated = $request->validate([
            'titulo'            => 'required|string|max:200',
            'descripcion'       => 'required|string',
            'role'              => 'required|in:Formación,Actividades,Noticia',
            'fecha_publicacion' => 'required|date',
            'visibilidad'       => 'required|boolean',
            'id_administrador'  => 'nullable|exists:administrador,id_administrador',
            'video'             => 'nullable|url',
            'enlace'            => 'nullable|url',
            'imagen'            => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'pdf_descarga'      => 'nullable|mimes:pdf|max:5120',
        ]);

        if ($request->hasFile('imagen')) {
            $validated['imagen'] = $request->file('imagen')->store('noticias/imagenes', 'public');
        }

        if ($request->hasFile('pdf_descarga')) {
            $validated['pdf_descarga'] = $request->file('pdf_descarga')->store('noticias/pdfs', 'public');
        }

        $noticia = Noticia::create($validated);

        return response()->json([
            'message' => 'Publicación creada correctamente',
            'data'    => new NoticiaResource($noticia)
        ], 201);
    }

    // ==========================================
    // ACTUALIZAR UNA PUBLICACIÓN (PUT/POST con _method)
    // ==========================================
    public function update(Request $request, $idCifrado)
    {
        try {
            $idReal = Crypt::decryptString($idCifrado);
        } catch (DecryptException $e) {
            return response()->json(['error' => 'Identificador no válido'], 400);
        }

        $noticia = Noticia::where('id_publicacion', $idReal)->firstOrFail();

        // Convertimos cadenas vacías en null para que Laravel permita borrar el vídeo/enlace
        $request->merge([
            'video' => $request->filled('video') ? $request->video : null,
            'enlace' => $request->filled('enlace') ? $request->enlace : null,
        ]);

        $validated = $request->validate([
            'titulo'            => 'required|string|max:200',
            'descripcion'       => 'required|string',
            'role'              => 'required|in:Formación,Actividades,Noticia',
            'fecha_publicacion' => 'required|date',
            'visibilidad'       => 'required|boolean',
            'id_administrador'  => 'nullable|exists:administrador,id_administrador',
            'video'             => 'nullable|url',
            'enlace'            => 'nullable|url',
            'imagen'            => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'pdf_descarga'      => 'nullable|mimes:pdf|max:5120',
        ]);

        // Si el usuario subió una NUEVA imagen
        if ($request->hasFile('imagen')) {
            if ($noticia->imagen) {
                Storage::disk('public')->delete($noticia->imagen);
            }
            $validated['imagen'] = $request->file('imagen')->store('noticias/imagenes', 'public');
        }

        // Si el usuario subió un NUEVO PDF
        if ($request->hasFile('pdf_descarga')) {
            if ($noticia->pdf_descarga) {
                Storage::disk('public')->delete($noticia->pdf_descarga);
            }
            $validated['pdf_descarga'] = $request->file('pdf_descarga')->store('noticias/pdfs', 'public');
        }

        $noticia->update($validated);

        return response()->json([
            'message' => 'Publicación actualizada correctamente',
            'data'    => new NoticiaResource($noticia)
        ]);
    }

    // ==========================================
    // ELIMINAR UNA PUBLICACIÓN (DELETE)
    // ==========================================
    public function destroy($idCifrado)
    {
        try {
            $idReal = Crypt::decryptString($idCifrado);
        } catch (DecryptException $e) {
            return response()->json(['error' => 'Identificador no válido'], 400);
        }

        $noticia = Noticia::where('id_publicacion', $idReal)->firstOrFail();

        if ($noticia->imagen) {
            Storage::disk('public')->delete($noticia->imagen);
        }
        if ($noticia->pdf_descarga) {
            Storage::disk('public')->delete($noticia->pdf_descarga);
        }

        $noticia->delete();

        return response()->json(['message' => 'Publicación eliminada correctamente']);
    }
}