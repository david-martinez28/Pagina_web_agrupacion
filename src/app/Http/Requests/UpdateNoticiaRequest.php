<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Enums\RoleNoticia;

class UpdateNoticiaRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'titulo'           => 'sometimes|required|string|max:200',
            'descripcion'      => 'sometimes|required|string',
            'imagen'           => 'nullable|string',
            'video'            => 'nullable|string',
            'enlace'           => 'nullable|url',
            'pdf_descarga'     => 'nullable|string',
            'role'             => ['sometimes', 'required', Rule::enum(RoleNoticia::class)],
            'visibilidad'      => 'boolean',
            'id_administrador' => 'nullable|exists:administrador,id_administrador',
        ];
    }

    public function messages(): array
    {
        return [
            'titulo.required'         => 'El título no puede quedar vacío al actualizar.',
            'titulo.max'              => 'El título no puede exceder los 200 caracteres.',
            'descripcion.required'    => 'La descripción no puede quedar vacía.',
            'enlace.url'              => 'El enlace proporcionado no es una URL válida.',
            'role.required'           => 'La categoría de la publicación no puede quedar vacía.',
            'role.enum'               => 'La categoría seleccionada no es válida.',
            'visibilidad.boolean'     => 'El valor de visibilidad debe ser de tipo booleano.',
            'id_administrador.exists' => 'El administrador asignado no existe.',
        ];
    }
}