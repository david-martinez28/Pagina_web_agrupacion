<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdministradorResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id_administrador' => $this->id_administrador,
            'nombre'           => $this->nombre,
            'correo'           => $this->correo,
            'permisos'         => $this->permisos,
            'created_at'       => $this->created_at?->toDateTimeString(),
        ];
    }
}