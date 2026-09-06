<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ampa extends Model
{
    use HasFactory;

    protected $table = 'ampa';
    protected $primaryKey = 'id_ampa';

    protected $fillable = [
        'nombre',
        'correo',
        'telefono',
        'instagram',
        'facebook',
        'id_administrador',
    ];

    // Relaciones
    public function administrador()
    {
        return $this->belongsTo(Administrador::class, 'id_administrador', 'id_administrador');
    }

    public function centro()
    {
        return $this->hasOne(Centro::class, 'id_ampa', 'id_ampa');
    }
}