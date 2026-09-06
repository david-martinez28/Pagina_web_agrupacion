<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ConcejaliaEducacionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id_concejalia' => $this->id_concejalia,
            'direccion'     => $this->direccion,
            'telefono'      => $this->telefono,
            'gmail'         => $this->gmail,
            'imagen'        => $this->imagen ? asset('storage/' . $this->imagen) : null,
            'descripcion'   => $this->descripcion,
            'administrador' => new AdministradorResource($this->whenLoaded('administrador')),
            'updated_at'    => $this->updated_at?->toDateTimeString(),
        ];
    }
}