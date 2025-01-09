@extends('layouts.app')

@section('content')
<div class="py-6">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center">
            <h1 class="text-3xl font-bold text-navy">Gestion du Département</h1>
            <nav class="flex" aria-label="Breadcrumb">
                <ol class="inline-flex items-center space-x-1 md:space-x-3">
                    <li class="inline-flex items-center">
                        <a href="{{ route('dashboard') }}" class="inline-flex items-center text-sm font-medium text-gray-500 hover:text-orange">
                            <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                            </svg>
                            Dashboard
                        </a>
                    </li>
                    <li aria-current="page">
                        <div class="flex items-center">
                            <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
                            </svg>
                            <span class="ml-1 text-sm font-medium text-gray-500 md:ml-2">Gestion du département</span>
                        </div>
                    </li>
                </ol>
            </nav>
        </div>

        <div class="mt-4">
            <div class="bg-white shadow overflow-hidden sm:rounded-lg">
                <div class="px-4 py-5 sm:px-6">
                    <h2 class="text-lg leading-6 font-medium text-navy">
                        Classes du Département {{ $departement->nom }}
                    </h2>
                    <p class="mt-1 max-w-2xl text-sm text-gray-500">
                        Sélectionnez une classe pour gérer son emploi du temps
                    </p>
                </div>
                <div class="border-t border-gray-200">
                    <ul class="divide-y divide-gray-200">
                        @forelse ($classes as $classe)
                            <li class="hover:bg-gray-50">
                                <div class="px-4 py-4 sm:px-6">
                                    <div class="flex items-center justify-between">
                                        <div class="flex items-center">
                                            <div class="flex-shrink-0">
                                                <svg class="h-8 w-8 text-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                                                </svg>
                                            </div>
                                            <div class="ml-4">
                                                <h3 class="text-lg font-medium text-navy">
                                                    {{ $classe->nom }}
                                                </h3>
                                                <div class="mt-1 flex items-center">
                                                    <span class="text-sm text-gray-500">
                                                        {{ $classe->etudiants_count ?? 0 }} étudiants
                                                    </span>
                                                    <span class="mx-2 text-gray-500">&middot;</span>
                                                    <span class="text-sm text-gray-500">
                                                        {{ $classe->matieres_count ?? 0 }} matières
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <a href="{{ route('chef_departement.emploi_temps', $classe->id) }}" 
                                               class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange hover:bg-orange-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange">
                                                <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                                                </svg>
                                                Gérer l'emploi du temps
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        @empty
                            <li class="px-4 py-5 sm:px-6">
                                <div class="text-center text-gray-500">
                                    Aucune classe trouvée dans ce département
                                </div>
                            </li>
                        @endforelse
                    </ul>
                </div>
            </div>
        </div>
        
        <div class="mt-4">
            <div class="bg-white shadow overflow-hidden sm:rounded-lg">
                <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
                    <h2 class="text-lg leading-6 font-medium text-navy">
                        Matières du Département {{ $departement->nom }}
                    </h2>
                    <button type="button" onclick="openMatiereModal()" class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange hover:bg-orange-dark">
                        <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                        </svg>
                        Ajouter
                    </button>
                </div>
                <div class="border-t border-gray-200">
                    <ul class="divide-y divide-gray-200">
                        @forelse ($matieres as $matiere)
                            <li class="hover:bg-gray-50">
                                <div class="px-4 py-4 sm:px-6">
                                    <div class="flex items-center justify-between">
                                        <div class="flex items-center">
                                            <div class="flex-shrink-0">
                                                <svg class="h-8 w-8 text-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                                                </svg>
                                            </div>
                                            <div class="ml-4">
                                                <h3 class="text-lg font-medium text-navy">
                                                    {{ $matiere->libelle }}
                                                </h3>
                                                <div class="mt-1 flex items-center">
                                                    <span class="text-sm text-gray-500">
                                                        <b>Code: </b>{{ $matiere->code }}
                                                    </span>
                                                </div>
                                                <div class="mt-1 flex items-center">
                                                    <span class="text-sm text-gray-500">
                                                        <b>Responsable: </b>{{ $matiere->enseignant->nom ?? "Aucun enseignant responsable" }}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        @empty
                            <li class="px-4 py-5 sm:px-6">
                                <div class="text-center text-gray-500">
                                    Aucune matière trouvée dans ce département
                                </div>
                            </li>
                        @endforelse
                    </ul>
                </div>
            </div>
        </div>
    </div>
</div>



<!-- Modal Ajout Matière -->
<div id="matiereModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 hidden overflow-y-auto h-full w-full" style="z-index: 999;">
    <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
            <h3 class="text-lg font-medium text-navy">Ajouter une matière</h3>
            <form action="{{ route('matieres.store') }}" method="POST" class="mt-4">
                @csrf
                <input type="hidden" name="departement_id" value="{{ $departement->id }}">
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="libelle">
                        Nom de la matière
                    </label>
                    <input type="text" name="libelle" id="libelle" required
                           class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-orange">
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="code">
                        Code
                    </label>
                    <input type="text" name="code" id="code" required
                           class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-orange">
                </div>
                 <div class="form-group">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="code">
                        Enseignant
                    </label>                    
                    <select class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-orange" 
                            id="enseignant_id" name="enseignant_id">
                        <option value="">Pas d'enseignant assigné</option>
                        @foreach($enseignants as $enseignant)
                            <option value="{{ $enseignant->id }}">{{ $enseignant->nom }}</option>
                        @endforeach
                    </select>
                </div>    
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="classe_id">
                        Classe
                    </label>
                    <select name="classe_id" id="classe_id" required
                            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-orange">
                        <option value="">Sélectionner une classe</option>
                        @foreach($classes as $classe)
                            <option value="{{ $classe->id }}">{{ $classe->nom }}</option>
                        @endforeach
                    </select>
                </div>
                <div class="flex justify-end space-x-3">
                    <button type="button" onclick="document.getElementById('matiereModal').classList.add('hidden')"
                            class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
                        Annuler
                    </button>
                    <button type="submit"
                            class="px-4 py-2 bg-orange text-white rounded-md hover:bg-opacity-90">
                        Ajouter
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>

<script>
    function openMatiereModal() {
        document.getElementById('matiereModal').classList.remove('hidden');
    }
</script>
@endsection
