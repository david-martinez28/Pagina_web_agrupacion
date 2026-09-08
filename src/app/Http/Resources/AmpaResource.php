<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AmpaResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id_ampa'       => $this->id_ampa,
            'nombre'        => $this->nombre,
            'correo'        => $this->correo,
            'telefono'      => $this->telefono,
            'instagram'     => $this->instagram,
            'imagen'        => $this->imagen 
                ? (str_starts_with($this->imagen, 'http') ? $this->imagen : asset('storage/' . str_replace('/storage/', '', $this->imagen))) 
                : null,    
            'facebook'      => $this->facebook,
            'centro'        => new CentroResource($this->whenLoaded('centro')),
            'administrador' => new AdministradorResource($this->whenLoaded('administrador')),
        ];
    }
}