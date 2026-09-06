<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Crypt;

class SeccionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id_seccion'    => Crypt::encryptString($this->id_seccion), // ID cifrado
            'nombre'        => $this->nombre,
            'imagen'        => $this->imagen ? asset('storage/' . $this->imagen) : null,
            'id_empresa'    => $this->id_empresa ? Crypt::encryptString($this->id_empresa) : null, // ID foráneo cifrado si existe
            'empresa'       => new EmpresaResource($this->whenLoaded('empresa')),
            'administrador' => new AdministradorResource($this->whenLoaded('administrador')),
        ];
    }
}