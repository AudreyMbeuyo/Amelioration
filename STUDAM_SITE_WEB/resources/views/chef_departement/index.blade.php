@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-12">
            <div class="card">
                <div class="card-header">
                    <h2>Département : {{ $departement->nom }}</h2>
                </div>

                <div class="card-body">
                    <h3>Liste des Classes</h3>
                    
                    <div class="row mt-4">
                        @foreach($classes as $classe)
                            <div class="col-md-4 mb-4">
                                <div class="card">
                                    <div class="card-body">
                                        <h5 class="card-title">{{ $classe->nom }}</h5>
                                        <p class="card-text">
                                            Nombre d'étudiants : {{ $classe->etudiants->count() }}
                                        </p>
                                        <a href="{{ route('chef_departement.emploi_temps', $classe->id) }}" 
                                           class="btn btn-primary">
                                            Gérer l'emploi du temps
                                        </a>
                                    </div>
                                </div>
                            </div>
                        @endforeach
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
