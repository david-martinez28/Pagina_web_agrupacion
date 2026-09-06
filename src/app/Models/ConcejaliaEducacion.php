<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ConcejaliaEducacion extends Model
{
    use HasFactory;

    protected $table = 'concejalia_educacion';
    protected $primaryKey = 'id_concejalia';

    protected $fillable = [
        'direccion',
        'telefono',
        'gmail',
        'imagen',
        'descripcion',
        'id_administrador',
    ];

    // Relaciones
    public function administrador()
    {
        return $this->belongsTo(Administrador::class, 'id_administrador', 'id_administrador');
    }
}