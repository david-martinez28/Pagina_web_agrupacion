<?php

use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Response;

// Esta ruta intercepta las peticiones a /storage y sirve la foto usando PHP
Route::get('/storage/noticias/imagenes/{filename}', function ($filename) {
    $path = storage_path('app/public/noticias/imagenes/' . $filename);
    
    if (!File::exists($path)) {
        abort(404);
    }
    
    return Response::file($path);
});