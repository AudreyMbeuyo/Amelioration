<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ChefDepartementMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        // Vérifier si l'utilisateur est connecté et est un chef de département
        if (!auth()->check() || auth()->user()->departement_id === null) {
            return redirect()->route('dashboard')->with('error', 'Accès non autorisé. Seuls les chefs de département peuvent accéder à cette page.');
        }

        return $next($request);
    }
}
