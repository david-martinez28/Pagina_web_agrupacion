<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use App\Enums\RoleNoticia;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Noticia extends Model
{
    use HasFactory;
    protected $fillable=['titulo', 'descripcion', 'imagen', 'video', 'enlace', 'pdf_descarga', 'role', 'fecha_publicacion', 'visibilidad', 'id_administrador'];
    protected $table = 'noticias';
    protected $primaryKey = 'id_publicacion';
    protected $appends = ['imagen_url']; // Añade esto para que la propiedad se incluya automáticamente

    protected function imagenUrl(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->imagen 
                ? asset('storage/' . $this->imagen) 
                : null
        );
    }
    protected function casts(): array
    {
        return [
            'fecha_publicacion' => 'datetime',
            'visibilidad' => 'boolean',
            'role' => RoleNoticia::class,
        ];
    }

    public function administrador() 
    { 
        return $this->belongsTo(Administrador::class, 'id_administrador', 'id_administrador'); 
    }
}