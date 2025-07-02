"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Vérifier s'il y a un message de succès depuis l'inscription
    const message = searchParams.get('message');
    if (message === 'inscription-reussie') {
      setSuccessMessage('Inscription réussie ! Veuillez vous connecter.');
      // Nettoyer l'URL
      window.history.replaceState({}, '', '/auth/login');
    }
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`🔄 Changement de champ: ${name} = ${value}`);

    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));

    // Effacer l'erreur si l'utilisateur commence à taper
    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    console.log('🔍 Validation du formulaire de connexion...');
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "L'adresse email est requise";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "L'adresse email n'est pas valide";
    }

    if (!formData.password) {
      newErrors.password = "Le mot de passe est requis";
    }

    console.log('✅ Erreurs de validation:', newErrors);
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('🚀 Début de la connexion');

    // Validation
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      console.log('❌ Validation échouée:', newErrors);
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});
    setSuccessMessage('');

    try {
      // Préparer les données pour l'API
      const loginData = {
        email: formData.email.trim().toLowerCase(),
        password: formData.password
      };

      console.log('📤 Données à envoyer à l\'API:', {
        email: loginData.email,
        password: '***masqué***'
      });

      const apiUrl = 'http://agence-voyage.ddns.net:9026/api/user/signin';
      console.log('🌐 URL de l\'API:', apiUrl);

      // Appel API vers le vrai backend
      console.log('📡 Envoi de la requête de connexion...');
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      console.log('📥 Réponse reçue:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries())
      });

      if (!response.ok) {
        console.log('❌ Réponse non OK, status:', response.status);

        let errorData = {};
        try {
          errorData = await response.json();
          console.log('📄 Données d\'erreur du serveur:', errorData);
        } catch (parseError) {
          console.log('⚠️ Impossible de parser la réponse d\'erreur:', parseError);
          errorData = {};
        }

        if (response.status === 401) {
          console.log('🔍 Erreur 401 - Identifiants incorrects');
          setErrors({
            general: 'Email ou mot de passe incorrect'
          });
        } else if (response.status === 400) {
          console.log('🔍 Erreur 400 - Données invalides');
          if (errorData.errors) {
            setErrors(errorData.errors);
          } else {
            setErrors({
              general: errorData.message || 'Données invalides'
            });
          }
        } else if (response.status === 500) {
          console.log('🔍 Erreur 500 - Erreur serveur interne');
          setErrors({
            general: 'Erreur serveur. Veuillez réessayer plus tard.'
          });
        } else {
          console.log(`🔍 Erreur ${response.status} - Autre erreur`);
          setErrors({
            general: errorData.message || 'Une erreur est survenue lors de la connexion'
          });
        }
        return;
      }

      console.log('✅ Réponse OK, traitement des données...');
      const data = await response.json();
      console.log('📄 Données de réponse:', data);

      // Vérifier la réponse du serveur
      if (data.success || data.token || data.user || data.access_token) {
        console.log('🎉 Connexion réussie !');

        // Déterminer le token à utiliser
        const token = data.token || data.access_token;
        const user = data.user || data;

        if (token) {
          console.log('🔐 Token reçu, sauvegarde...');
          localStorage.setItem('authToken', token);
          localStorage.setItem('user', JSON.stringify(user));
          console.log('💾 Données utilisateur sauvegardées dans localStorage');
          console.log('➡️ Redirection vers /dashboard');
          router.push('/dashboard');
        } else {
          console.log('❌ Aucun token reçu');
          setErrors({
            general: 'Erreur lors de la connexion. Aucun token reçu.'
          });
        }
      } else {
        console.log('❌ Réponse inattendue du serveur');
        setErrors({
          general: 'Connexion échouée. Veuillez réessayer.'
        });
      }

    } catch (error) {
      console.error('💥 Erreur lors de la connexion:', error);
      console.log('📊 Détails de l\'erreur:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });

      setErrors({
        general: 'Impossible de se connecter au serveur. Vérifiez votre connexion internet.'
      });
    } finally {
      console.log('🏁 Fin du processus de connexion');
      setIsLoading(false);
    }
  };

  // Icône SVG pour l'œil
  const EyeIcon = ({ visible, onClick }) => (
      <button
          type="button"
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
          onClick={onClick}
      >
        {visible ? (
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
            </svg>
        ) : (
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"/>
            </svg>
        )}
      </button>
  );

  return (
      <div className="min-h-screen bg-gradient-to-br from-[#1B396A] to-[#2A5490] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="bg-white rounded-xl shadow-2xl p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="mx-auto h-16 w-16 bg-gradient-to-r from-[#F26419] to-[#FF7A47] rounded-full flex items-center justify-center mb-4">
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-[#1B396A]">
                STUDAM
              </h1>
              <h2 className="mt-4 text-xl font-semibold text-gray-900">
                Connexion
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Connectez-vous à votre compte STUDAM
              </p>
            </div>

            {/* Message de succès */}
            {successMessage && (
                <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-green-700">{successMessage}</p>
                    </div>
                  </div>
                </div>
            )}

            {/* Formulaire */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Message d'erreur général */}
              {errors.general && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-700">{errors.general}</p>
                      </div>
                    </div>
                  </div>
              )}

              <div className="space-y-4">
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Adresse email
                  </label>
                  <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`appearance-none relative block w-full px-3 py-3 border ${errors.email ? 'border-red-300' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F26419] focus:border-[#F26419] focus:z-10 sm:text-sm transition-colors`}
                      placeholder="Entrez votre adresse email"
                  />
                  {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                {/* Mot de passe */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`appearance-none relative block w-full px-3 py-3 pr-10 border ${errors.password ? 'border-red-300' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F26419] focus:border-[#F26419] focus:z-10 sm:text-sm transition-colors`}
                        placeholder="Entrez votre mot de passe"
                    />
                    <EyeIcon
                        visible={showPassword}
                        onClick={() => setShowPassword(!showPassword)}
                    />
                  </div>
                  {errors.password && (
                      <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                  )}
                </div>
              </div>

              {/* Options supplémentaires */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                      id="remember"
                      name="remember"
                      type="checkbox"
                      className="h-4 w-4 text-[#F26419] focus:ring-[#F26419] border-gray-300 rounded"
                  />
                  <label htmlFor="remember" className="ml-2 block text-sm text-gray-900">
                    Se souvenir de moi
                  </label>
                </div>

                <div className="text-sm">
                  <Link href="/auth/forgot-password" className="font-medium text-[#F26419] hover:text-[#E55A1A] underline">
                    Mot de passe oublié ?
                  </Link>
                </div>
              </div>

              {/* Bouton de connexion */}
              <div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-[#F26419] to-[#FF7A47] hover:from-[#E55A1A] hover:to-[#F26419] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F26419] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
                >
                  {isLoading ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Connexion en cours...
                      </div>
                  ) : (
                      'Se connecter'
                  )}
                </button>
              </div>

              {/* Lien d'inscription */}
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Vous n'avez pas encore de compte ?{' '}
                  <Link href="/auth/register" className="font-medium text-[#F26419] hover:text-[#E55A1A] underline">
                    S'inscrire
                  </Link>
                </p>
              </div>
            </form>

            {/* Divider */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Ou</span>
                </div>
              </div>
            </div>

            {/* Accès rapide demo */}
            <div className="mt-6">
              <button
                  type="button"
                  onClick={() => {
                    setFormData({ email: 'admin@studam.edu', password: 'password123' });
                    console.log('🎯 Utilisation des identifiants de démonstration');
                  }}
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F26419] transition-colors"
              >
                <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
                Utiliser le compte de démonstration
              </button>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-xs text-gray-500">
                © 2025 STUDAM - Système de gestion des présences
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Développé par Bioclass Innovators
              </p>
            </div>
          </div>
        </div>
      </div>
  );
}