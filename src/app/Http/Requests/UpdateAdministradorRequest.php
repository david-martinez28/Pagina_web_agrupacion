<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAdministradorRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        $id = $this->route('administrador')->id_administrador ?? $this->route('administrador');

        return [
            'nombre'     => 'sometimes|required|string|max:100',
            'correo'     => 'sometimes|required|email|max:150|unique:administrador,correo,' . $id . ',id_administrador',
            'contrasena' => 'nullable|string|min:6',
            'pin'        => 'sometimes|required|string|max:10',
            'permisos'   => 'integer',
        ];
    }

    public function messages(): array
    {
        return [
            'nombre.required'  => 'El nombre no puede quedar vacío.',
            'nombre.max'       => 'El nombre no puede superar los 100 caracteres.',
            'correo.required'  => 'El correo electrónico no puede quedar vacío.',
            'correo.email'     => 'El formato del correo electrónico no es válido.',
            'correo.unique'    => 'Este correo electrónico ya pertenece a otro administrador.',
            'contrasena.min'   => 'Si actualizas la contraseña, debe tener al menos 6 caracteres.',
            'pin.required'     => 'El PIN de seguridad no puede quedar vacío.',
            'pin.max'          => 'El PIN no puede superar los 10 caracteres.',
            'permisos.integer' => 'El formato de los permisos es inválido.',
        ];
    }
}