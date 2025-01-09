<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Matiere;
use App\Models\Classe;

class MatiereClasseSeeder extends Seeder
{
    public function run()
    {
        // Récupérer toutes les matières et la classe 4GI
        $matieres = Matiere::all();
        $classe = Classe::where('nom', '4GI')->first();

        if ($classe && $matieres->isNotEmpty()) {
            // Attacher toutes les matières à la classe 4GI en une seule commande
            $classe->matieres()->syncWithoutDetaching($matieres->pluck('id')->toArray());
            $this->command->info('Toutes les matières ont été attachées à la classe 4GI.');
        } else {
            if (!$classe) {
                $this->command->warn('La classe 4GI est introuvable.');
            }
            if ($matieres->isEmpty()) {
                $this->command->warn('Aucune matière trouvée.');
            }
        }
    }
}
