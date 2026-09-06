<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Seccion extends Model
{
    use HasFactory;

    protected $table = 'secciones';
    protected $primaryKey = 'id_seccion';

    protected $fillable = [
        'nombre',
        'imagen',
        'id_administrador',
    ];

    // Una sección tiene muchas empresas
    public function empresas()
    {
        return $this->hasMany(Empresa::class, 'id_seccion', 'id_seccion');
    }

    // 👈 Añade esta relación que faltaba
    public function administrador()
    {
        return $this->belongsTo(Administrador::class, 'id_administrador', 'id_administrador');
    }
}