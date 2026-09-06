<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAdministradorRequest;
use App\Http\Requests\UpdateAdministradorRequest;
use App\Http\Resources\AdministradorResource;
use App\Models\Administrador;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Hash;

class AdministradorController extends Controller
{
    public function index()
    {
        return AdministradorResource::collection(Administrador::all());
    }

    public function store(StoreAdministradorRequest $request)
    {
        $validated =$request->validated();
        $validated['contrasena'] = Hash::make($validated['contrasena']);

        $admin = Administrador::create($validated);

        return new AdministradorResource($admin);
    }

    public function show(Administrador $administrador)
    {
        return new AdministradorResource($administrador);
    }

    public function update(UpdateAdministradorRequest $request, Administrador$administrador)
    {
        $validated =$request->validated();

        if (!empty($validated['contrasena'])) {
            $validated['contrasena'] = Hash::make($validated['contrasena']);
        } else {
            unset($validated['contrasena']);
        }

        $administrador->update($validated);

        return new AdministradorResource($administrador);
    }

    public function destroy(Administrador $administrador)
    {
        $administrador->delete();
        return response()->json(['message' => 'Administrador eliminado'], Response::HTTP_OK);
    }
}