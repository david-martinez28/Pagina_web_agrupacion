<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAdministradorRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'nombre'     => 'required|string|max:100',
            'correo'     => 'required|email|max:150|unique:administrador,correo',
            'contrasena' => 'required|string|min:6',
            'pin'        => 'required|string|max:10',
            'permisos'   => 'integer',
        ];
    }

    public function messages(): array
    {
        return [
            'nombre.required'     => 'El nombre del administrador es obligatorio.',
            'nombre.max'          => 'El nombre no puede superar los 100 caracteres.',
            'correo.required'     => 'El correo electrónico es obligatorio.',
            'correo.email'        => 'El formato del correo electrónico no es válido.',
            'correo.max'          => 'El correo no puede superar los 150 caracteres.',
            'correo.unique'       => 'Este correo electrónico ya está registrado en el sistema.',
            'contrasena.required' => 'La contraseña es obligatoria.',
            'contrasena.min'      => 'La contraseña debe tener al menos 6 caracteres.',
            'pin.required'        => 'El PIN de seguridad es obligatorio.',
            'pin.max'             => 'El PIN no puede superar los 10 caracteres.',
            'permisos.integer'    => 'El formato de los permisos debe ser un número entero.',
        ];
    }
}