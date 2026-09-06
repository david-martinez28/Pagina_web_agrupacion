<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Crypt;

class NoticiaResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id_publicacion'    => Crypt::encryptString($this->id_publicacion), // <-- ID Cifrado
            'titulo'            => $this->titulo,
            'descripcion'       => $this->descripcion,
            'role'              => $this->role,
            'imagen'            => $this->imagen,
            'imagen_url'        => $this->imagen_url, // 👈 ¡ESTO FALTABA!
            'video'             => $this->video,
            'enlace'            => $this->enlace,
            'pdf_descarga'      => $this->pdf_descarga,
            'fecha_publicacion' => $this->fecha_publicacion,
            'visibilidad'       => $this->visibilidad,
            'administrador'     => new AdministradorResource($this->whenLoaded('administrador')),
        ];
    }
}