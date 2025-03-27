// app/page.js
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <div className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 lg:mt-16 lg:px-8 xl:mt-20">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-[#1B396A] sm:text-5xl md:text-6xl">
                  <span className="block">Gestion des présences</span>
                  <span className="block text-[#F26419]">simplifiée pour les enseignants</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  STUDAM est votre solution complète pour la gestion des présences des étudiants. Suivez facilement les présences par classe ou par matière, générez des rapports et gardez une trace précise des absences.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link href="/auth/register" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#F26419] hover:bg-opacity-90 md:py-4 md:text-lg md:px-10">
                      Commencer maintenant
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Link href="/auth/login" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-[#1B396A] bg-gray-100 hover:bg-gray-200 md:py-4 md:text-lg md:px-10">
                      Se connecter
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <Image 
            src="/images.jpeg" 
            alt="Éducation" 
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
            width={1000}
            height={800}
            priority
          />
        </div>
      </div>

      {/* Fonctionnalités */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-[#F26419] font-semibold tracking-wide uppercase">Fonctionnalités</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-[#1B396A] sm:text-4xl">
              Une meilleure façon de gérer les présences
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
              {/* Fonctionnalité 1 */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-[#F26419] text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                  </svg>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg font-medium text-[#1B396A]">Gestion par classe</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Suivez facilement les présences pour chaque classe et obtenez une vue d'ensemble claire.
                  </p>
                </div>
              </div>

              {/* Fonctionnalité 2 */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-[#F26419] text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                  </svg>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg font-medium text-[#1B396A]">Gestion par matière</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Organisez les présences par matière pour un suivi précis de chaque cours.
                  </p>
                </div>
              </div>

              {/* Fonctionnalité 3 */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-[#F26419] text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg font-medium text-[#1B396A]">Rapports détaillés</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Générez des rapports détaillés pour analyser les tendances de présence.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section À propos */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-[#F26419] font-semibold tracking-wide uppercase">À propos</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-[#1B396A] sm:text-4xl">
              Une plateforme conçue pour les établissements éducatifs
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              STUDAM est une solution innovante qui transforme la gestion quotidienne des présences dans les écoles, instituts et universités.
            </p>
          </div>

          <div className="mt-10">
            <div className="md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              <div className="mt-5">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-[#F26419] text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                </div>
                <div className="mt-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Efficacité</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Réduisez le temps consacré aux tâches administratives et concentrez-vous sur l'enseignement.
                  </p>
                </div>
              </div>

              <div className="mt-5">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-[#F26419] text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
                  </svg>
                </div>
                <div className="mt-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Précision</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Obtenez des données fiables sur la présence des étudiants pour prendre des décisions éclairées.
                  </p>
                </div>
              </div>

              <div className="mt-5">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-[#F26419] text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                  </svg>
                </div>
                <div className="mt-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Sécurité</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Protégez les données des étudiants avec des mesures de sécurité robustes.
                  </p>
                </div>
              </div>

              <div className="mt-5">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-[#F26419] text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"/>
                  </svg>
                </div>
                <div className="mt-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Flexibilité</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Adaptez la plateforme à vos besoins spécifiques, quelle que soit la taille de votre établissement.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Témoignages */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-[#F26419] font-semibold tracking-wide uppercase">Témoignages</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-[#1B396A] sm:text-4xl">
              Ce que disent nos utilisateurs
            </p>
          </div>
          <div className="mt-10">
            <div className="space-y-8 md:grid md:grid-cols-2 md:gap-8 md:space-y-0">
              <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-gray-600 italic">
                  "STUDAM a considérablement simplifié la gestion des présences dans notre école. Les rapports générés sont précis et nous fournissent des informations précieuses."
                </p>
                <div className="mt-4 flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-[#1B396A] flex items-center justify-center text-white font-bold">
                      AM
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Amadou M.</p>
                    <p className="text-sm text-gray-500">Directeur, École Polytechnique</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-gray-600 italic">
                  "En tant qu'enseignant, STUDAM m'a permis de gagner du temps sur les tâches administratives. Je peux maintenant me concentrer davantage sur la qualité de mon enseignement."
                </p>
                <div className="mt-4 flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-[#1B396A] flex items-center justify-center text-white font-bold">
                      FK
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Fatou K.</p>
                    <p className="text-sm text-gray-500">Enseignante, Département Informatique</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-[#1B396A]">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Prêt à simplifier la gestion des présences?</span>
            <span className="block text-[#F26419]">Commencez à utiliser STUDAM aujourd'hui.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link href="/auth/register" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#F26419] hover:bg-opacity-90">
                S'inscrire gratuitement
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}