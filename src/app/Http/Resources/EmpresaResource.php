<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Crypt;

class EmpresaResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id_empresa'    => Crypt::encryptString($this->id_empresa), // ID cifrado para la URL segura
            'nombre'        => $this->nombre,
            'email'         => $this->email,
            'imagen'        => $this->imagen ? asset('storage/' . $this->imagen) : null,
            'direccion'     => $this->direccion,
            'telefono'      => $this->telefono,
            'instagram'     => $this->instagram,
            'facebook'      => $this->facebook,
            'ofertas'       => $this->ofertas,
            'condiciones'   => $this->condiciones,
            
            // 👈 IMPORTANTE: Enviamos el ID de la sección plano para que coincida con el <select> y la validación
            'id_seccion'    => $this->id_seccion, 
            
            // Relación en singular (coincide con el controller)
            'seccion'       => new SeccionResource($this->whenLoaded('seccion')),
            
            'administrador' => new AdministradorResource($this->whenLoaded('administrador')),
        ];
    }
}