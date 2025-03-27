<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Horaire;
use App\Models\Enseignant;
use App\Models\Classe;
use App\Models\Etudiant;

class Matiere extends Model
{
    use HasFactory;

    protected $fillable = ['libelle', 'code', 'horaire_id', 'enseignant_id'];

    public function horaire()
    {
        return $this->belongsTo(Horaire::class);
    }

    public function enseignant()
    {
        return $this->belongsTo(Enseignant::class);
    }

    public function classes()
    {
        return $this->belongsToMany(Classe::class, 'matiere_classe');
    }

    public function etudiants()
    {
        return $this->belongsToMany(Etudiant::class);
    }
}
