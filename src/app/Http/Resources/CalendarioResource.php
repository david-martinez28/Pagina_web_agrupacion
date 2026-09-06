<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CalendarioResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id_calendario'   => $this->id_calendario,
            'grado_educativo' => $this->grado_educativo,
            'imagen'          => $this->imagen ? asset('storage/' . $this->imagen) : null,
            'enlace'          => $this->enlace,
            'administrador'   => new AdministradorResource($this->whenLoaded('administrador')),
            'updated_at'      => $this->updated_at?->toDateTimeString(),
        ];
    }
}
