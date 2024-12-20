<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Departement;
use App\Models\Matiere;
use App\Models\Etudiant;

class Classe extends Model
{
    use HasFactory;

    protected $fillable = ['nom', 'departement_id'];

    public function departement()
    {
        return $this->belongsTo(Departement::class);
    }

    public function matieres()
    {
        return $this->belongsToMany(Matiere::class, 'matiere_classe');
    }

    public function etudiants()
    {
        return $this->belongsToMany(Etudiant::class, 'classe_etudiant');
    }
}
