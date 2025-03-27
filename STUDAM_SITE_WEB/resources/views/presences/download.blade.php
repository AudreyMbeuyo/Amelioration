@extends('layouts.app')

@section('content')
<div class="py-6">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-white shadow overflow-hidden sm:rounded-lg">
            <div class="px-4 py-5 sm:px-6">
                <h2 class="text-lg leading-6 font-medium text-navy">
                    Présences pour {{ $matiere->libelle }}
                </h2>
            </div>
            <div class="p-6">
                <p class="mb-4 text-gray-600">
                    Téléchargez un fichier Excel récapitulatif des présences pour cette matière.
                </p>
                <!-- Formulaire pour télécharger le fichier Excel -->
                <form action="{{ route('export.presences', ['horaireId' => $matiere->id]) }}" method="GET">
                    <button type="submit" class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange hover:bg-opacity-90">
                        <svg class="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                        </svg>
                        Télécharger le fichier Excel
                    </button>
                </form>
            </div>
        </div>
    </div>
</div>
@endsection