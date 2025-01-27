<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Enseignant;
use App\Models\Classe;
use App\Models\User;

class Departement extends Model
{
    use HasFactory;

    protected $fillable = ['nom'];

    public function enseignant()
    {
        return $this->hasOne(Enseignant::class);
    }

    public function classes()
    {
        return $this->hasMany(Classe::class);
    }

    public function chefDepartement()
    {
        return $this->hasOne(User::class)->where('role', 'chef_departement');
    }
}
