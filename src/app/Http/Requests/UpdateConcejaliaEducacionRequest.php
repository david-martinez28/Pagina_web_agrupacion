<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateConcejaliaEducacionRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'direccion'        => 'nullable|string|max:255',
            'telefono'         => 'nullable|string|max:20',
            'gmail'            => 'nullable|email|max:150',
            'imagen'           => 'nullable|string',
            'descripcion'      => 'nullable|string',
            'id_administrador' => 'nullable|exists:administrador,id_administrador',
        ];
    }

    public function messages(): array
    {
        return [
            'direccion.max'           => 'La dirección es demasiado larga (máximo 255 caracteres).',
            'telefono.max'            => 'El teléfono no puede tener más de 20 caracteres.',
            'gmail.email'             => 'El correo de contacto debe tener un formato válido (ej. usuario@gmail.com).',
            'gmail.max'               => 'El correo electrónico no puede superar los 150 caracteres.',
            'id_administrador.exists' => 'El administrador asociado a esta actualización no es válido o no existe.',
        ];
    }
}