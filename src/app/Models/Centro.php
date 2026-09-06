<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Centro extends Model
{
    use HasFactory;

    protected $table = 'centros';
    protected $primaryKey = 'id_centro';

    protected $fillable = [
        'nombre',
        'descripcion',
        'imagen',
        'modalidad',
        'direccion',
        'telefono',
        'email',
        'web',
        'facebook',
        'instagram',
        'video',
        'id_ampa',
        'id_administrador',
    ];

    // Relaciones
    public function ampa()
    {
        return $this->belongsTo(Ampa::class, 'id_ampa', 'id_ampa');
    }

    public function administrador()
    {
        return $this->belongsTo(Administrador::class, 'id_administrador', 'id_administrador');
    }
}