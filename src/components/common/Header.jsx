"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Header() {
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
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-2xl font-bold text-[#1B396A]">
                STUDAM
              </Link>
            </div>
          </div>
          
          {/* Menu desktop */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <div className="flex space-x-4">
              {!isLoggedIn && (
                <>
                  <Link href="/about" className="text-gray-700 hover:text-[#F26419] px-3 py-2 rounded-md text-sm font-medium">
                    À propos
                  </Link>
                  <Link href="/features" className="text-gray-700 hover:text-[#F26419] px-3 py-2 rounded-md text-sm font-medium">
                    Fonctionnalités
                  </Link>
                  <Link href="/contact" className="text-gray-700 hover:text-[#F26419] px-3 py-2 rounded-md text-sm font-medium">
                    Contact
                  </Link>
                </>
              )}
              
              {isLoggedIn && (
                <>
                  <Link href="/dashboard" className="text-gray-700 hover:text-[#F26419] px-3 py-2 rounded-md text-sm font-medium">
                    Tableau de bord
                  </Link>
                  <Link href="/presence" className="text-gray-700 hover:text-[#F26419] px-3 py-2 rounded-md text-sm font-medium">
                    Présences
                  </Link>
                  <Link href="/timetable" className="text-gray-700 hover:text-[#F26419] px-3 py-2 rounded-md text-sm font-medium">
                    Emploi du temps
                  </Link>
                  {user?.role === 'admin' || user?.role === 'super_admin' || user?.role === 'chef_departement' ? (
                    <>
                      <Link href="/admin/teachers" className="text-gray-700 hover:text-[#F26419] px-3 py-2 rounded-md text-sm font-medium">
                        Enseignants
                      </Link>
                      <Link href="/admin/students" className="text-gray-700 hover:text-[#F26419] px-3 py-2 rounded-md text-sm font-medium">
                        Étudiants
                      </Link>
                    </>
                  ) : null}
                </>
              )}
            </div>
            <div className="ml-6 flex items-center">
              {!isLoggedIn ? (
                <>
                  <Link href="/auth/login" className="text-[#1B396A] hover:text-[#F26419] px-3 py-2 rounded-md text-sm font-medium">
                    Connexion
                  </Link>
                  <Link href="/auth/register" className="bg-[#F26419] text-white hover:bg-opacity-90 px-3 py-2 rounded-md text-sm font-medium ml-4">
                    Inscription
                  </Link>
                </>
              ) : (
                <div className="flex items-center">
                  <Link href="/profile" className="text-gray-700 hover:text-[#F26419] px-3 py-2 rounded-md text-sm font-medium">
                    {user?.nom || 'Profil'}
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="bg-[#1B396A] text-white hover:bg-opacity-90 px-3 py-2 rounded-md text-sm font-medium ml-4"
                  >
                    Déconnexion
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-[#F26419] hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#F26419]"
              aria-expanded="false"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Ouvrir le menu principal</span>
              {/* Icon when menu is closed */}
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/* Icon when menu is open */}
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} sm:hidden`}>
        <div className="pt-2 pb-3 space-y-1">
          {!isLoggedIn ? (
            <>
              <Link
                href="/about"
                className="text-gray-700 hover:bg-gray-100 hover:text-[#F26419] block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                À propos
              </Link>
              <Link
                href="/features"
                className="text-gray-700 hover:bg-gray-100 hover:text-[#F26419] block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Fonctionnalités
              </Link>
              <Link
                href="/contact"
                className="text-gray-700 hover:bg-gray-100 hover:text-[#F26419] block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
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
              {user?.role === 'admin' || user?.role === 'super_admin' || user?.role === 'chef_departement' ? (
                <Link
                  href="/admin/teachers"
                  className="text-gray-700 hover:bg-gray-100 hover:text-[#F26419] block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Enseignants
                </Link>
              ) : null}
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
        <div className="pt-4 pb-3 border-t border-gray-200">
          {!isLoggedIn ? (
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <Link
                  href="/auth/login"
                  className="block w-full text-center px-4 py-2 text-sm font-medium text-[#1B396A] bg-gray-100 rounded-md hover:bg-gray-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Connexion
                </Link>
              </div>
              <div className="ml-3">
                <Link
                  href="/auth/register"
                  className="block w-full text-center px-4 py-2 text-sm font-medium text-white bg-[#F26419] rounded-md hover:bg-opacity-90"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Inscription
                </Link>
              </div>
            </div>
          ) : (
            <div className="px-4">
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  handleLogout();
                }}
                className="block w-full text-center px-4 py-2 text-sm font-medium text-white bg-[#1B396A] rounded-md hover:bg-opacity-90"
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