<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\NoticiaController;
use App\Http\Controllers\Api\CentroController;
use App\Http\Controllers\Api\ConcejaliaEducacionController;
use App\Http\Controllers\Api\EmpresaController;
use App\Http\Controllers\Api\CriterioEvaluacionController;
use App\Http\Controllers\Api\SeccionController;
use App\Http\Controllers\Api\AdministradorController;
use App\Http\Controllers\Api\UsuarioController;
use App\Http\Controllers\Api\ContactoController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AmpaController;
use App\Http\Controllers\Api\CalendarioController;

// ==========================================
// RUTAS PÚBLICAS (Cifradas con el middleware)
// ==========================================
Route::middleware(['encrypt.api'])->group(function () {

    // --- Autenticación ---
    Route::post('/login', [AuthController::class, 'login']);

    // Noticias
    Route::get('/noticias', [NoticiaController::class, 'index']);
    Route::get('/noticias/{id}', [NoticiaController::class, 'show']);

    // Empresas
    Route::get('/empresas', [EmpresaController::class, 'index']);
    Route::get('/empresas/{empresa}', [EmpresaController::class, 'show']);

    // Secciones
    Route::get('/secciones', [SeccionController::class, 'index']);
    Route::get('/secciones/{seccion}', [SeccionController::class, 'show']);

    // Criterios de Evaluación
    Route::get('/criterio-evaluacion', [CriterioEvaluacionController::class, 'index']);

    // Centros Educativos
    Route::get('/centros', [CentroController::class, 'index']);
    Route::get('/centros/{centro}', [CentroController::class, 'show']);

    // Ampas
    Route::get('/ampas', [AmpaController::class, 'index']);

    // Concejalía de Educación
    Route::get('/concejalia-educacion', [ConcejaliaEducacionController::class, 'index']);

    //Calendario Matriculacion
    route::get('/calendarios', [CalendarioController::class, 'index']);


});


// ==========================================
// RUTAS PRIVADAS (Protegidas por Sanctum y cifradas)
// ==========================================
Route::middleware(['auth:sanctum', 'encrypt.api'])->group(function () {
    
    // --- Autenticación ---
    Route::post('/logout', [AuthController::class, 'logout']);

    // Noticias (Admin)
    Route::post('/noticias', [NoticiaController::class, 'store']);
    Route::put('/noticias/{id}', [NoticiaController::class, 'update']);
    Route::delete('/noticias/{id}', [NoticiaController::class, 'destroy']);

    // Centros (Admin)
    Route::post('/centros', [CentroController::class, 'store']);
    Route::put('/centros/{centro}', [CentroController::class, 'update']);
    Route::delete('/centros/{centro}', [CentroController::class, 'destroy']);

    // Empresas (Admin)
    Route::post('/empresas', [EmpresaController::class, 'store']);
    Route::put('/empresas/{empresa}', [EmpresaController::class, 'update']);
    Route::delete('/empresas/{empresa}', [EmpresaController::class, 'destroy']);

    // Secciones (Admin)
    Route::post('/secciones', [SeccionController::class, 'store']);
    Route::put('/secciones/{seccion}', [SeccionController::class, 'update']);
    Route::delete('/secciones/{seccion}', [SeccionController::class, 'destroy']);

    // Concejalía de Educación (Admin - Soporta POST/PUT según prefieras actualizar)
    Route::post('/concejalia-educacion', [ConcejaliaEducacionController::class, 'store']);
    Route::put('/concejalia-educacion', [ConcejaliaEducacionController::class, 'update']);

    // Criterios (Admin)
    Route::put('/criterio-evaluacion', [CriterioEvaluacionController::class, 'updateOrCreate']);

    // Calendario Matriculacion (Admin)
    Route::post('/calendarios', [CalendarioController::class, 'store']);
    Route::put('/calendarios/{id_calendario}', [CalendarioController::class, 'update']);
    Route::delete('/calendarios/{id_calendario}', [CalendarioController::class, 'destroy']);
});