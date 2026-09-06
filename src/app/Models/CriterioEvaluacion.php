<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CriterioEvaluacion extends Model
{
    use HasFactory;

    protected $table = 'criterios_evaluacion';
    protected $primaryKey = 'id_criterio';

    protected $fillable = [
        'preferencias_texto',
        'baremacion_imagen',
        'desempate_texto',
        'id_administrador',
    ];

    // Relaciones
    public function administrador()
    {
        return $this->belongsTo(Administrador::class, 'id_administrador', 'id_administrador');
    }
}