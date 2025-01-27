<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Classe;
use App\Models\Etudiant;
use App\Models\Departement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class SuperAdminController extends Controller
{
    public function index()
    {
        $departements = Departement::with('chefDepartement')->get();
        return view('superadmin.index', compact('departements'));
    }

    public function createDepartement(Request $request)
    {
        $request->validate([
            'nom' => 'required|string|max:255|unique:departements,nom',
        ]);

        try {
            Departement::create([
                'nom' => $request->nom,
            ]);

            return redirect()->route('superadmin.index')
                           ->with('success', 'Département créé avec succès.');
        } catch (\Exception $e) {
            return redirect()->back()
                           ->with('error', 'Une erreur est survenue lors de la création du département.')
                           ->withInput();
        }
    }

    public function createChefDepartement(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'departement_id' => 'required|exists:departements,id',
        ]);

        // Vérifier si le département a déjà un chef
        $existingChef = User::where('departement_id', $request->departement_id)
                           ->where('role', 'chef_departement')
                           ->first();

        if ($existingChef) {
            return redirect()->back()
                           ->with('error', 'Ce département a déjà un chef assigné.')
                           ->withInput();
        }

        DB::beginTransaction();
        try {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => 'chef_departement',
                'departement_id' => $request->departement_id,
            ]);

            DB::commit();
            return redirect()->route('superadmin.index')
                           ->with('success', 'Chef de département créé avec succès.');
        } catch (\Exception $e) {
            DB::rollback();
            return redirect()->back()
                           ->with('error', 'Une erreur est survenue lors de la création du chef de département.')
                           ->withInput();
        }
    }

    public function deleteChefDepartement($id)
    {
        $chef = User::where('id', $id)
                    ->where('role', 'chef_departement')
                    ->firstOrFail();

        try {
            $chef->delete();
            return redirect()->route('superadmin.index')
                           ->with('success', 'Chef de département supprimé avec succès.');
        } catch (\Exception $e) {
            return redirect()->back()
                           ->with('error', 'Une erreur est survenue lors de la suppression.');
        }
    }

    public function importEtudiants(Request $request)
    {
        $request->validate([
            'fichier' => 'required|file|mimes:csv,txt',
            'classe_id' => 'required|exists:classes,id'
        ]);

        try {
            $classe = Classe::findOrFail($request->classe_id);
            $file = $request->file('fichier');
            
            if (($handle = fopen($file->getPathname(), "r")) !== FALSE) {
                // Ignorer l'en-tête
                fgetcsv($handle);
                
                DB::beginTransaction();

                while (($row = fgetcsv($handle)) !== FALSE) {
                    if (!empty($row[0]) && !empty($row[1])) {
                        // Séparer le nom complet en nom et prénom
                        $nomComplet = explode(' ', $row[1], 2);
                        $prenom = $nomComplet[0];
                        $nom = isset($nomComplet[1]) ? $nomComplet[1] : '';

                        $etudiant = new Etudiant([
                            'matricule' => $row[0],
                            'prenom' => $prenom,
                            'nom' => $nom,
                            'classe_id' => $classe->id
                        ]);
                        $etudiant->save();
                    }
                }
                fclose($handle);
                DB::commit();

                return redirect()->back()->with('success', 'Les étudiants ont été importés avec succès.');
            }
        } catch (\Exception $e) {
            DB::rollback();
            return redirect()->back()
                           ->with('error', 'Une erreur est survenue lors de l\'importation des étudiants : ' . $e->getMessage())
                           ->withInput();
        }
    }

    public function getClassesByDepartement($departement_id)
    {
        $classes = Classe::where('departement_id', $departement_id)->get();
        return response()->json($classes);
    }

    public function downloadSampleCSV()
    {
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="exemple_etudiants.csv"',
        ];

        $handle = fopen('php://temp', 'w+');
        fputcsv($handle, ['Matricule', 'Nom Complet']);
        fputcsv($handle, ['20A123', 'Jean Dupont']);
        fputcsv($handle, ['20A124', 'Marie Martin']);
        fputcsv($handle, ['20A125', 'Pierre Dubois']);
        
        rewind($handle);
        $content = stream_get_contents($handle);
        fclose($handle);

        return response($content, 200, $headers);
    }
}
