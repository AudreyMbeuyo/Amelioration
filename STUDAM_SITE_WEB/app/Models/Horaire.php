<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Matiere;
use App\Models\Estpresent;
use App\Models\Classe;

class Horaire extends Model
{
    use HasFactory;

    protected $fillable = [
        'jour',
        'heure_debut',
        'heure_fin',
        'classe_id',
        'matiere_id'
    ];

    public function matieres()
    {
        return $this->hasMany(Matiere::class);
    }

    public function estpresents()
    {
        return $this->hasMany(Estpresent::class);
    }

    public function classe()
    {
        return $this->belongsTo(Classe::class);
    }

    public function matiere()
    {
        return $this->belongsTo(Matiere::class);
    }
}
