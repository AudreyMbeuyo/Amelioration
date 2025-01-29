<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HoraireClasseMatiere extends Model
{
    protected $table = 'horaires_classes_matieres';
    protected $fillable = [
        'horaire_id',
        'classe_id',
        'matiere_id',
    ];
    public function classe()
    {
        return $this->belongsTo(Classe::class);
    }
    public function matiere()
    {
        return $this->belongsTo(Matiere::class);
    }
    public function horaire()
    {
        return $this->belongsTo(Horaire::class);
    }
}