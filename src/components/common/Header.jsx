"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function FixedHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté au chargement du composant
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      const userStr = localStorage.getItem('user');

      setIsLoggedIn(!!token);

      if (userStr) {
        try {
          setUser(JSON.parse(userStr));
        } catch (error) {
          console.error('Erreur lors de la récupération des données utilisateur:', error);
        }
      }
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/auth/login';
    }
  };

  return (
      <nav className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/" className="flex items-center space-x-2">
                  <div className="h-8 w-8 bg-gradient-to-br from-[#F26419] to-[#FF7A47] rounded-lg flex items-center justify-center">
                    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.168 18.477 18.582 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                    </svg>
                  </div>
                  <span className="text-2xl font-bold text-[#1B396A]">STUDAM</span>
                </Link>
              </div>
            </div>

            {/* Menu desktop */}
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <div className="flex space-x-8">
                {!isLoggedIn ? (
                    <>
                      <a href="#about" className="text-gray-700 hover:text-[#F26419] px-3 py-2 rounded-md text-sm font-medium transition-colors">
                        À propos
                      </a>
                      <a href="#features" className="text-gray-700 hover:text-[#F26419] px-3 py-2 rounded-md text-sm font-medium transition-colors">
                        Fonctionnalités
                      </a>
                      <a href="#contact" className="text-gray-700 hover:text-[#F26419] px-3 py-2 rounded-md text-sm font-medium transition-colors">
                        Contact
                      </a>
                    </>
                ) : (
                    <>
                      <Link href="/dashboard" className="text-gray-700 hover:text-[#F26419] px-3 py-2 rounded-md text-sm font-medium transition-colors">
                        Tableau de bord
                      </Link>
                      {/* CORRECTION CRITIQUE: /presence → /attendance */}
                      <Link href="/attendance" className="text-gray-700 hover:text-[#F26419] px-3 py-2 rounded-md text-sm font-medium transition-colors">
                        Présences
                      </Link>
                      <Link href="/timetable" className="text-gray-700 hover:text-[#F26419] px-3 py-2 rounded-md text-sm font-medium transition-colors">
                        Emploi du temps
                      </Link>
                      {/* Liens d'administration - Vérifier les rôles */}
                      {(user?.role === 'admin' || user?.role === 'super_admin' || user?.role === 'chef_departement') && (
                          <div className="relative group">
                            <button className="text-gray-700 hover:text-[#F26419] px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center">
                              Administration
                              <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                              </svg>
                            </button>
                            <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                              <div className="py-1">
                                <Link href="/admin/students" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#F26419]">
                                  Gestion des étudiants
                                </Link>
                                <Link href="/admin/teachers" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#F26419]">
                                  Gestion des enseignants
                                </Link>
                                {/* Temporairement désactivé jusqu'à création */}
                                <span className="block px-4 py-2 text-sm text-gray-400 cursor-not-allowed">
                            Gestion des départements
                            <span className="text-xs ml-1">(bientôt)</span>
                          </span>
                              </div>
                            </div>
                          </div>
                      )}
                      <Link href="/profile" className="text-gray-700 hover:text-[#F26419] px-3 py-2 rounded-md text-sm font-medium transition-colors">
                        Profil
                      </Link>
                    </>
                )}
              </div>

              {/* Boutons de connexion/inscription ou menu utilisateur */}
              <div className="ml-6 flex items-center space-x-4">
                {!isLoggedIn ? (
                    <>
                      <Link
                          href="/auth/login"
                          className="text-gray-700 hover:text-[#F26419] font-medium transition-colors"
                      >
                        Connexion
                      </Link>
                      <Link
                          href="/auth/register"
                          className="bg-[#F26419] text-white px-4 py-2 rounded-md font-medium hover:bg-[#E55A1A] transition-colors"
                      >
                        Inscription
                      </Link>
                    </>
                ) : (
                    <div className="relative group">
                      <button className="flex items-center space-x-2 text-gray-700 hover:text-[#F26419] transition-colors">
                        <div className="w-8 h-8 bg-gradient-to-br from-[#F26419] to-[#FF7A47] rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {user?.nom ? user.nom.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <span className="hidden md:block text-sm font-medium">
                      {user?.nom || 'Utilisateur'}
                    </span>
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                        </svg>
                      </button>
                      <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                        <div className="py-1">
                          <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#F26419]">
                            Mon profil
                          </Link>
                          <Link href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#F26419]">
                            Paramètres
                          </Link>
                          <hr className="my-1" />
                          <button
                              onClick={handleLogout}
                              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            Déconnexion
                          </button>
                        </div>
                      </div>
                    </div>
                )}
              </div>
            </div>

            {/* Bouton menu mobile */}
            <div className="sm:hidden flex items-center">
              <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="text-gray-700 hover:text-[#F26419] focus:outline-none focus:text-[#F26419] transition-colors"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMenuOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                  ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Menu mobile */}
        <div className={`${isMenuOpen ? 'block' : 'hidden'} sm:hidden bg-white border-t border-gray-200`}>
          <div className="pt-2 pb-3 space-y-1">
            {!isLoggedIn ? (
                <>
                  <a
                      href="#about"
                      className="text-gray-700 hover:bg-gray-100 hover:text-[#F26419] block px-3 py-2 rounded-md text-base font-medium"
                      onClick={() => setIsMenuOpen(false)}
                  >
                    À propos
                  </a>
                  <a
                      href="#features"
                      className="text-gray-700 hover:bg-gray-100 hover:text-[#F26419] block px-3 py-2 rounded-md text-base font-medium"
                      onClick={() => setIsMenuOpen(false)}
                  >
                    Fonctionnalités
                  </a>
                  <a
                      href="#contact"
                      className="text-gray-700 hover:bg-gray-100 hover:text-[#F26419] block px-3 py-2 rounded-md text-base font-medium"
                      onClick={() => setIsMenuOpen(false)}
                  >
                    Contact
                  </a>
                </>
            ) : (
                <>
                  <Link
                      href="/dashboard"
                      className="text-gray-700 hover:bg-gray-100 hover:text-[#F26419] block px-3 py-2 rounded-md text-base font-medium"
                      onClick={() => setIsMenuOpen(false)}
                  >
                    Tableau de bord
                  </Link>
                  {/* CORRECTION CRITIQUE: /presence → /attendance */}
                  <Link
                      href="/attendance"
                      className="text-gray-700 hover:bg-gray-100 hover:text-[#F26419] block px-3 py-2 rounded-md text-base font-medium"
                      onClick={() => setIsMenuOpen(false)}
                  >
                    Présences
                  </Link>
                  <Link
                      href="/timetable"
                      className="text-gray-700 hover:bg-gray-100 hover:text-[#F26419] block px-3 py-2 rounded-md text-base font-medium"
                      onClick={() => setIsMenuOpen(false)}
                  >
                    Emploi du temps
                  </Link>
                  {(user?.role === 'admin' || user?.role === 'super_admin' || user?.role === 'chef_departement') && (
                      <>
                        <Link
                            href="/admin/students"
                            className="text-gray-700 hover:bg-gray-100 hover:text-[#F26419] block px-3 py-2 rounded-md text-base font-medium"
                            onClick={() => setIsMenuOpen(false)}
                        >
                          Gestion des étudiants
                        </Link>
                        <Link
                            href="/admin/teachers"
                            className="text-gray-700 hover:bg-gray-100 hover:text-[#F26419] block px-3 py-2 rounded-md text-base font-medium"
                            onClick={() => setIsMenuOpen(false)}
                        >
                          Gestion des enseignants
                        </Link>
                      </>
                  )}
                  <Link
                      href="/profile"
                      className="text-gray-700 hover:bg-gray-100 hover:text-[#F26419] block px-3 py-2 rounded-md text-base font-medium"
                      onClick={() => setIsMenuOpen(false)}
                  >
                    Profil
                  </Link>
                </>
            )}
          </div>

          {/* Section utilisateur mobile */}
          <div className="pt-4 pb-3 border-t border-gray-200">
            {!isLoggedIn ? (
                <div className="flex items-center justify-around px-3">
                  <Link
                      href="/auth/login"
                      className="text-[#1B396A] font-medium"
                      onClick={() => setIsMenuOpen(false)}
                  >
                    Connexion
                  </Link>
                  <Link
                      href="/auth/register"
                      className="bg-[#F26419] text-white px-4 py-2 rounded-md font-medium"
                      onClick={() => setIsMenuOpen(false)}
                  >
                    Inscription
                  </Link>
                </div>
            ) : (
                <div className="px-3">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#F26419] to-[#FF7A47] rounded-full flex items-center justify-center text-white font-medium">
                      {user?.nom ? user.nom.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div>
                      <div className="text-base font-medium text-gray-800">
                        {user?.nom || 'Utilisateur'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {user?.email || ''}
                      </div>
                    </div>
                  </div>
                  <button
                      onClick={handleLogout}
                      className="w-full text-left text-red-600 hover:bg-red-50 px-3 py-2 rounded-md text-base font-medium"
                  >
                    Déconnexion
                  </button>
                </div>
            )}
          </div>
        </div>
      </nav>
  );
}