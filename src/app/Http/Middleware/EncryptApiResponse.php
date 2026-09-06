<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Symfony\Component\HttpFoundation\Response;

class EncryptApiResponse
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Solo ciframos si la respuesta es JSON y fue exitosa (200)
        if ($response->headers->get('Content-Type') === 'application/json' && $response->getStatusCode() === 200) {
            $originalContent = $response->getContent();

            // Ciframos el contenido usando la clave de Laravel
            $encryptedData = Crypt::encryptString($originalContent);

            // Devolvemos un JSON que contiene el string cifrado
            $response->setContent(json_encode([
                'encrypted_response' => $encryptedData
            ]));
        }

        return $response;
    }
}