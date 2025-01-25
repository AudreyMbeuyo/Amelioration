<?php
namespace App\Http\Controllers;

use App\Models\Enseignant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class EnseignantController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:enseignants',
            'password' => 'required|string|min:8|confirmed',
        ]);

        Enseignant::create([
            'nom' => $request->nom,
            'prenom' => $request->prenom,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'departement_id' => $request->departement_id,
        ]);

        return redirect()->back()->with('success', 'Enseignant ajouté avec succès');
    }
}