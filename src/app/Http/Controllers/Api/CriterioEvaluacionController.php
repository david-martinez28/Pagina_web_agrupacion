<?php

namespace App\Http\Controllers\Api;


use App\Http\Controllers\Controller;
use App\Models\CriterioEvaluacion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CriterioEvaluacionController extends Controller
{
    public function index()
    {
        $criterio = CriterioEvaluacion::first();
        return response()->json($criterio);
    }

   public function updateOrCreate(Request $request)
{
    $validated = $request->validate([
        'preferencias_texto' => 'nullable|string',
        'desempate_texto'    => 'nullable|string',
        'id_administrador'   => 'nullable|exists:administrador,id_administrador',
        'baremacion_imagen'  => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
    ]);

    $criterio = CriterioEvaluacion::first();

    if ($request->hasFile('baremacion_imagen')) {
        if ($criterio && $criterio->baremacion_imagen) {
            Storage::disk('public')->delete($criterio->baremacion_imagen);
        }
        $validated['baremacion_imagen'] = $request->file('baremacion_imagen')->store('criterios/imagenes', 'public');
    }

    if ($criterio) {
        $criterio->update($validated);
    } else {
        $criterio = CriterioEvaluacion::create($validated);
    }

    return response()->json([
        'message' => 'Criterios de evaluación actualizados correctamente',
        'data'    => $criterio
    ]);
}
}