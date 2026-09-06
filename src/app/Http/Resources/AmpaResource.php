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
            'facebook'      => $this->facebook,
            'centro'        => new CentroResource($this->whenLoaded('centro')),
            'administrador' => new AdministradorResource($this->whenLoaded('administrador')),
        ];
    }
}
