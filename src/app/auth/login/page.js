"use client";

import Link from 'next/link';
import { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation simple
    const newErrors = {};
    if (!email) newErrors.email = "L'adresse email est requise";
    if (!password) newErrors.password = "Le mot de passe est requis";
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsLoading(true);
    
    // Simulation d'appel API (à remplacer par un vrai appel API)
    try {
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password }),
      // });
      
      // if (!response.ok) {
      //   const errorData = await response.json();
      //   throw new Error(errorData.message || 'Erreur de connexion');
      // }
      
      // const data = await response.json();
      
      console.log('Tentative de connexion avec:', { email, password });
      
              // Vérification des identifiants pour la démo
      if (email === 'admin' && password === 'admin') {
        // Créer un utilisateur fictif pour la démo
        const mockUser = {
          id: 1,
          nom: 'Administrateur',
          email: 'admin@studam.edu',
          role: 'super_admin',  // Modifier le rôle en super_admin
          departement: {
            id: 1,
            nom: 'Informatique'
          },
          matieres: [
            { id: 1, libelle: 'Programmation Web', code: 'INFO301', departement: { nom: 'Informatique' } },
            { id: 2, libelle: 'Systèmes d\'exploitation', code: 'INFO204', departement: { nom: 'Informatique' } },
            { id: 3, libelle: 'Réseaux', code: 'INFO305', departement: { nom: 'Informatique' } },
          ],
          classes: [
            { id: 1, nom: '3GI', departement: { nom: 'Informatique' } },
            { id: 2, nom: '4GI', departement: { nom: 'Informatique' } },
            { id: 3, nom: '5GI', departement: { nom: 'Informatique' } },
          ]
        };
        
        // Simuler la réponse d'API
        const mockResponse = {
          token: 'fake-jwt-token',
          user: mockUser
        };
        
        // Stocker les données de l'utilisateur dans localStorage
        localStorage.setItem('authToken', mockResponse.token);
        localStorage.setItem('user', JSON.stringify(mockResponse.user));
        
        // Simuler un délai pour montrer le loader
        setTimeout(() => {
          setIsLoading(false);
          window.location.href = '/dashboard';
        }, 1000);
      } else {
        // Simuler un délai pour montrer le loader
        setTimeout(() => {
          setIsLoading(false);
          setErrors({ form: 'Identifiants invalides. Essayez avec admin/admin pour la démo.' });
        }, 1000);
      }
    } catch (error) {
      setIsLoading(false);
      setErrors({ form: error.message });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-[#1B396A]">
            Connexion à votre compte
          </h2>
          <div className="mt-4 py-2 px-4 rounded-md bg-blue-50 border border-blue-200">
            <p className="text-sm text-blue-800">
              <span className="font-bold">Mode Démo:</span> Utilisez <span className="font-mono bg-blue-100 px-1 rounded">admin</span> comme identifiant et <span className="font-mono bg-blue-100 px-1 rounded">admin</span> comme mot de passe.
            </p>
          </div>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">Adresse email</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-[#F26419] focus:border-[#F26419] focus:z-10 sm:text-sm`}
                placeholder="Adresse email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Mot de passe</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-[#F26419] focus:border-[#F26419] focus:z-10 sm:text-sm`}
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>
          </div>

          {errors.form && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    {errors.form}
                  </h3>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-[#F26419] focus:ring-[#F26419] border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Se souvenir de moi
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-[#F26419] hover:text-opacity-90">
                Mot de passe oublié?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#F26419] hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F26419] disabled:opacity-50"
            >
              {isLoading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : null}
              Se connecter
            </button>
          </div>
        </form>
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Pas encore de compte? 
            <Link href="/auth/register" className="font-medium text-[#F26419] hover:text-opacity-90 ml-1">
              S'inscrire
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}