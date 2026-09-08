<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CalendarioResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id_calendario' => $this->id_calendario,
            'grado_educativo' => $this->grado_educativo,
            // Aseguramos que si hay imagen, devuelva la URL completa con storage
            'imagen' => $this->imagen 
                ? (str_starts_with($this->imagen, 'http') ? $this->imagen : asset('storage/' . str_replace('/storage/', '', $this->imagen))) 
                : null,
            'enlace' => $this->enlace,
            'administrador' => new AdministradorResource($this->whenLoaded('administrador')),
        ];
    }
}