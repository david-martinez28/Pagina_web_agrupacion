<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Laravel\Sanctum\HasApiTokens; // <-- IMPORTANTE: Importar Sanctum

#[Fillable(['nombre', 'correo', 'contrasena', 'pin', 'permisos'])]
#[Hidden(['contrasena', 'pin'])]
class Administrador extends Authenticatable
{
    use HasApiTokens, HasFactory; // <-- IMPORTANTE: Usar el trait

    protected $table = 'administrador';
    protected $primaryKey = 'id_administrador';

    /**
     * IMPORTANTE: Le dice a Laravel que el campo de la contraseña 
     * en esta tabla se llama 'contrasena' y no 'password'.
     */
    public function getAuthPassword()
    {
        return $this->contrasena;
    }

    // --- RELACIONES ---
    public function ampas() { return $this->hasMany(Ampa::class, 'id_administrador', 'id_administrador'); }
    public function centros() { return $this->hasMany(Centro::class, 'id_administrador', 'id_administrador'); }
    public function concejalias() { return $this->hasMany(ConcejaliaEducacion::class, 'id_administrador', 'id_administrador'); }
    public function noticias() { return $this->hasMany(Noticia::class, 'id_administrador', 'id_administrador'); }
    public function empresas() { return $this->hasMany(Empresa::class, 'id_administrador', 'id_administrador'); }
    public function secciones() { return $this->hasMany(Seccion::class, 'id_administrador', 'id_administrador'); }
    public function calendarios() { return $this->hasMany(Calendario::class, 'id_administrador', 'id_administrador'); }
    public function criteriosEvaluacion() { return $this->hasMany(CriterioEvaluacion::class, 'id_administrador', 'id_administrador'); }
}