<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class Empresa extends Model
{
    use HasFactory;
    protected $table = 'empresas';
    protected $primaryKey = 'id_empresa';

    protected $fillable = [
        'nombre', 'email', 'direccion', 'telefono', 
        'instagram', 'facebook', 'ofertas', 'condiciones', 
        'id_seccion', 'id_administrador','imagen', 'web'
    ];

    // Una empresa pertenece a una sección
    public function seccion()
    {
        return $this->belongsTo(Seccion::class, 'id_seccion', 'id_seccion');
    }
    public function administrador()
    {
        return $this->belongsTo(Administrador::class, 'id_administrador', 'id_administrador');
    }
}