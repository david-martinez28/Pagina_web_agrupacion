<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CriterioEvaluacionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id_criterio'        => $this->id_criterio,
            'preferencias_texto' => $this->preferencias_texto,
            'baremacion_imagen'  => $this->baremacion_imagen ? asset('storage/' . $this->baremacion_imagen) : null,
            'desempate_texto'    => $this->desempate_texto,
            'administrador'      => new AdministradorResource($this->whenLoaded('administrador')),
            'updated_at'         => $this->updated_at?->toDateTimeString(),
        ];
    }
}