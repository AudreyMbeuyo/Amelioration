@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-12">
            <div class="card">
                <div class="card-header">
                    <h2>Emploi du temps - {{ $classe->nom }}</h2>
                </div>

                <div class="card-body">
                    <form action="{{ route('chef_departement.update_emploi_temps', $classe->id) }}" method="POST">
                        @csrf
                        @method('PUT')
                        
                        <div class="table-responsive">
                            <table class="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>Heures</th>
                                        <th>Lundi</th>
                                        <th>Mardi</th>
                                        <th>Mercredi</th>
                                        <th>Jeudi</th>
                                        <th>Vendredi</th>
                                        <th>Samedi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    @php
                                        $heures = ['08:00-10:00', '10:00-12:00', '14:00-16:00', '16:00-18:00'];
                                        $jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
                                    @endphp

                                    @foreach($heures as $heure)
                                        <tr>
                                            <td>{{ $heure }}</td>
                                            @foreach($jours as $jour)
                                                <td>
                                                    <select name="horaires[{{ $jour }}][{{ $heure }}]" class="form-control">
                                                        <option value="">Sélectionner une matière</option>
                                                        @foreach($classe->matieres as $matiere)
                                                            <option value="{{ $matiere->id }}"
                                                                {{ $horaires->where('jour', $jour)
                                                                          ->where('heure_debut', $heure)
                                                                          ->where('matiere_id', $matiere->id)
                                                                          ->count() > 0 ? 'selected' : '' }}>
                                                                {{ $matiere->nom }}
                                                            </option>
                                                        @endforeach
                                                    </select>
                                                </td>
                                            @endforeach
                                        </tr>
                                    @endforeach
                                </tbody>
                            </table>
                        </div>

                        <div class="text-center mt-4">
                            <button type="submit" class="btn btn-primary">Enregistrer l'emploi du temps</button>
                            <a href="{{ route('chef_departement.index') }}" class="btn btn-secondary ml-2">Retour</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
