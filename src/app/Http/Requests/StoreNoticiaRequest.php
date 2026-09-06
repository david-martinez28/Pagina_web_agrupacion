<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Enums\RoleNoticia;

class StoreNoticiaRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'titulo'           => 'required|string|max:200',
            'descripcion'      => 'required|string',
            'imagen'           => 'nullable|string',
            'video'            => 'nullable|string',
            'enlace'           => 'nullable|url',
            'pdf_descarga'     => 'nullable|string',
            'role'             => ['required', Rule::enum(RoleNoticia::class)],
            'visibilidad'      => 'boolean',
            'id_administrador' => 'nullable|exists:administrador,id_administrador',
        ];
    }

    public function messages(): array
    {
        return [
            'titulo.required'         => 'El título de la publicación es obligatorio.',
            'titulo.max'              => 'El título no puede exceder los 200 caracteres.',
            'descripcion.required'    => 'La descripción o contenido de la publicación es obligatoria.',
            'enlace.url'              => 'El enlace proporcionado no es una URL válida.',
            'role.required'           => 'Debes asignar un rol (categoría) a la publicación.',
            'role.enum'               => 'La categoría seleccionada no es válida. Debe ser Formación, Actividades o Noticia.',
            'visibilidad.boolean'     => 'El valor de visibilidad debe ser verdadero o falso.',
            'id_administrador.exists' => 'El administrador que intenta publicar no existe en la base de datos.',
        ];
    }
}