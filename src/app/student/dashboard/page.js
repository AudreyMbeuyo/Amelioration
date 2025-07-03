"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { AuthService } from '@/services/api';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import StatCard from '@/components/dashboard/StatCard';
import ClassList from '@/components/dashboard/ClassList';
import SubjectList from '@/components/dashboard/SubjectList';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        window.location.href = '/auth/login';
        return;
      }
      
      try {
        const currentUser = JSON.parse(userStr);
        setUser(currentUser);
      } catch (error) {
        console.error('Erreur lors de la récupération des données utilisateur:', error);
        window.location.href = '/auth/login';
        return;
      }
    }
    
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F26419]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <DashboardHeader user={user} />
        
        {/* Statistiques */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard 
            title="Matières" 
            count={user.matieres?.length || 0}
            icon={
              <svg className="h-6 w-6 text-[#F26419]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
              </svg>
            }
          />
          
          <StatCard 
            title="Classes" 
            count={user.classes?.length || 0}
            icon={
              <svg className="h-6 w-6 text-[#F26419]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
              </svg>
            }
          />
          
          <StatCard 
            title="Taux moyen de présence" 
            count="85%"
            icon={
              <svg className="h-6 w-6 text-[#F26419]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/>
              </svg>
            }
          />
        </div>

        {/* Section Chef de Département */}
        {user.role === 'chef_departement' && (
          <div className="mt-8">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                <h3 className="text-lg leading-6 font-medium text-[#1B396A]">
                  Gestion du Département {user.departement?.nom}
                </h3>
                <div className="flex space-x-4">
                  <Link 
                    href="/timetable" 
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#F26419] hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F26419]"
                  >
                    <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                    </svg>
                    Gérer les Emplois du Temps
                  </Link>
                  <Link 
                    href="/admin/teachers" 
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#1B396A] hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1B396A]"
                  >
                    <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                    </svg>
                    Gérer les Enseignants
                  </Link>
                  <Link 
                    href="/admin/students" 
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
                    </svg>
                    Gérer les Étudiants
                  </Link>
                </div>
              </div>
              <div className="px-4 py-3 bg-gray-50 text-sm text-gray-500">
                En tant que chef de département, vous pouvez gérer les emplois du temps de toutes les classes de votre département.
              </div>
            </div>
          </div>
        )}
        
        {/* Section Admin */}
        {(user.role === 'admin' || user.role === 'super_admin') && (
          <div className="mt-8">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                <h3 className="text-lg leading-6 font-medium text-[#1B396A]">
                  Administration du système
                </h3>
                <div className="flex space-x-4">
                  <Link 
                    href="/admin/teachers" 
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#F26419] hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F26419]"
                  >
                    <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                    </svg>
                    Gérer les Enseignants
                  </Link>
                  <Link 
                    href="/admin/students" 
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#1B396A] hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1B396A]"
                  >
                    <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
                    </svg>
                    Gérer les Étudiants
                  </Link>
                </div>
              </div>
              <div className="px-4 py-3 bg-gray-50 text-sm text-gray-500">
                En tant qu'administrateur, vous avez accès à toutes les fonctionnalités de gestion du système.
              </div>
            </div>
          </div>
        )}

        {/* Activités récentes */}
        <div className="mt-8">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <h3 className="text-lg leading-6 font-medium text-[#1B396A]">
                Activités récentes
              </h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      Cours de Programmation Web terminé
                    </p>
                    <p className="text-sm text-gray-500">
                      Aujourd'hui, 10:30 - 12:30 | 4GI
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      Prochain cours: Systèmes d'exploitation
                    </p>
                    <p className="text-sm text-gray-500">
                      Demain, 08:30 - 10:30 | 3GI
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      Alerte: Taux d'absentéisme élevé
                    </p>
                    <p className="text-sm text-gray-500">
                      5GI - Cours de Réseaux (30% d'absents)
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Liste des matières */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <h3 className="text-lg leading-6 font-medium text-[#1B396A]">
                Vos matières
              </h3>
              <Link 
                href="/subjects" 
                className="text-sm text-[#F26419] hover:text-opacity-90"
              >
                Voir tout
              </Link>
            </div>
            <div className="border-t border-gray-200">
              <SubjectList 
                subjects={[
                  { id: 1, libelle: 'Programmation Web', code: 'INFO301', departement: { nom: 'Informatique' } },
                  { id: 2, libelle: 'Systèmes d\'exploitation', code: 'INFO204', departement: { nom: 'Informatique' } },
                  { id: 3, libelle: 'Réseaux', code: 'INFO305', departement: { nom: 'Informatique' } },
                ]} 
              />
            </div>
          </div>

          {/* Liste des courses */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <h3 className="text-lg leading-6 font-medium text-[#1B396A]">
                Vos classes
              </h3>
              <Link 
                href="/classes" 
                className="text-sm text-[#F26419] hover:text-opacity-90"
              >
                Voir tout
              </Link>
            </div>
            <div className="border-t border-gray-200">
              <ClassList 
                classes={[
                  { id: 1, nom: '3GI', departement: { nom: 'Informatique' } },
                  { id: 2, nom: '4GI', departement: { nom: 'Informatique' } },
                  { id: 3, nom: '5GI', departement: { nom: 'Informatique' } },
                ]} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}