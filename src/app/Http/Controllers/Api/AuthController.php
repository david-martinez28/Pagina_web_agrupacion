<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Administrador;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'correo'     => 'required|email',
            'contrasena' => 'required'
        ]);

        // Buscamos al administrador por su correo
        $admin = Administrador::where('correo', $request->correo)->first();

        // Verificamos si existe y si la contrasena coincide (¡debe estar hasheada en la BD!)
        if (!$admin || !Hash::check($request->contrasena, $admin->contrasena)) {
            throw ValidationException::withMessages([
                'correo' => ['Las credenciales proporcionadas son incorrectas.'],
            ]);
        }

        // Generamos el token de Sanctum
        $token = $admin->createToken('token_acceso_admin')->plainTextToken;

        return response()->json([
            'mensaje' => 'Login exitoso',
            'admin'   => $admin,
            'token'   => $token
        ]);
    }

    public function logout(Request $request)
    {
        // Borramos el token que se ha usado para esta petición
        $request->user()->currentAccessToken()->delete();

        return response()->json(['mensaje' => 'Sesión cerrada correctamente']);
    }
}