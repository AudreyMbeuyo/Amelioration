@extends('layouts.app')

@section('content')
<div class="relative bg-white overflow-hidden">
    <div class="max-w-7xl mx-auto">
        <div class="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main class="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 lg:mt-16 lg:px-8 xl:mt-20">
                <div class="sm:text-center lg:text-left">
                    <h1 class="text-4xl tracking-tight font-extrabold text-navy sm:text-5xl md:text-6xl">
                        <span class="block">Gestion des présences</span>
                        <span class="block text-orange">simplifiée pour les enseignants</span>
                    </h1>
                    <p class="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                        STUDAM est votre solution complète pour la gestion des présences des étudiants. Suivez facilement les présences par classe ou par matière, générez des rapports et gardez une trace précise des absences.
                    </p>
                    <div class="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                        <div class="rounded-md shadow">
                            <a href="{{ route('register') }}" class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-orange hover:bg-opacity-90 md:py-4 md:text-lg md:px-10">
                                Commencer maintenant
                            </a>
                        </div>
                        <div class="mt-3 sm:mt-0 sm:ml-3">
                            <a href="{{ route('login') }}" class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-navy bg-gray-100 hover:bg-gray-200 md:py-4 md:text-lg md:px-10">
                                Se connecter
                            </a>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>
    <div class="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <img class="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full" src="https://media.licdn.com/dms/image/v2/C4D1BAQF7aS9p_j6uRg/company-background_10000/company-background_10000/0/1583315972196/ensp_yaounde_cover?e=2147483647&v=beta&t=Sj-_HMt0Ml3RpCPdp5Rvra-VVrqBUcqI1EfWo_-RCgw" alt="Éducation">
    </div>
</div>

<!-- Fonctionnalités -->
<div class="py-12 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="lg:text-center">
            <h2 class="text-base text-orange font-semibold tracking-wide uppercase">Fonctionnalités</h2>
            <p class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-navy sm:text-4xl">
                Une meilleure façon de gérer les présences
            </p>
        </div>

        <div class="mt-10">
            <div class="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
                <!-- Fonctionnalité 1 -->
                <div class="relative">
                    <div class="absolute flex items-center justify-center h-12 w-12 rounded-md bg-orange text-white">
                        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                        </svg>
                    </div>
                    <div class="ml-16">
                        <h3 class="text-lg font-medium text-navy">Gestion par classe</h3>
                        <p class="mt-2 text-base text-gray-500">
                            Suivez facilement les présences pour chaque classe et obtenez une vue d'ensemble claire.
                        </p>
                    </div>
                </div>

                <!-- Fonctionnalité 2 -->
                <div class="relative">
                    <div class="absolute flex items-center justify-center h-12 w-12 rounded-md bg-orange text-white">
                        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                        </svg>
                    </div>
                    <div class="ml-16">
                        <h3 class="text-lg font-medium text-navy">Gestion par matière</h3>
                        <p class="mt-2 text-base text-gray-500">
                            Organisez les présences par matière pour un suivi précis de chaque cours.
                        </p>
                    </div>
                </div>

                <!-- Fonctionnalité 3 -->
                <div class="relative">
                    <div class="absolute flex items-center justify-center h-12 w-12 rounded-md bg-orange text-white">
                        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                        </svg>
                    </div>
                    <div class="ml-16">
                        <h3 class="text-lg font-medium text-navy">Rapports détaillés</h3>
                        <p class="mt-2 text-base text-gray-500">
                            Générez des rapports détaillés pour analyser les tendances de présence.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
