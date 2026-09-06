<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CentroResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id_centro'     => $this->id_centro,
            'nombre'        => $this->nombre,
            'descripcion'   => $this->descripcion,
            'imagen'        => $this->imagen ? asset('storage/' . $this->imagen) : null,
            'modalidad'     => $this->modalidad,
            'direccion'     => $this->direccion,
            'telefono'      => $this->telefono,
            'email'         => $this->email,
            'web'           => $this->web,
            'facebook'      => $this->facebook,
            'instagram'     => $this->instagram,
            'video'         => $this->video,
            'ampa'          => new AmpaResource($this->whenLoaded('ampa')),
            'administrador' => new AdministradorResource($this->whenLoaded('administrador')),
            'updated_at'    => $this->updated_at?->toDateTimeString(),
        ];
    }
}