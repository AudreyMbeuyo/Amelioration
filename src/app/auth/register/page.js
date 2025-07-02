"use client";

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'teacher' // Valeur par défaut
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

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

    // Validation en temps réel pour la confirmation du mot de passe
    if (name === 'password_confirmation' || name === 'password') {
      if (errors.password_confirmation) {
        setErrors(prevErrors => ({
          ...prevErrors,
          password_confirmation: ''
        }));
      }
    }
  };

  const validateForm = () => {
    console.log('🔍 Validation du formulaire...');
    const newErrors = {};

    // Validation du nom
    if (!formData.nom.trim()) {
      newErrors.nom = "Le nom complet est requis";
    } else if (formData.nom.trim().length < 2) {
      newErrors.nom = "Le nom doit contenir au moins 2 caractères";
    }

    // Validation de l'email
    if (!formData.email.trim()) {
      newErrors.email = "L'adresse email est requise";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "L'adresse email n'est pas valide";
    }

    // Validation du mot de passe
    if (!formData.password) {
      newErrors.password = "Le mot de passe est requis";
    } else if (formData.password.length < 6) {
      newErrors.password = "Le mot de passe doit contenir au moins 6 caractères";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre";
    }

    // Validation de la confirmation du mot de passe
    if (!formData.password_confirmation) {
      newErrors.password_confirmation = "La confirmation du mot de passe est requise";
    } else if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = "Les mots de passe ne correspondent pas";
    }

    // Validation du rôle
    if (!formData.role) {
      newErrors.role = "Le rôle est requis";
    }

    console.log('✅ Erreurs de validation:', newErrors);
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('🚀 Début de la soumission du formulaire');

    // Validation
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      console.log('❌ Validation échouée:', newErrors);
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Préparer les données pour l'API
      const registrationData = {
        nom: formData.nom.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        password_confirmation: formData.password_confirmation,
        role: formData.role
      };

      console.log('📤 Données à envoyer à l\'API:', {
        ...registrationData,
        password: '***masqué***',
        password_confirmation: '***masqué***'
      });

      const apiUrl = 'http://agence-voyage.ddns.net:9026/api/user/register';
      console.log('🌐 URL de l\'API:', apiUrl);

      // Appel API vers le vrai backend
      console.log('📡 Envoi de la requête...');
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
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

        if (response.status === 400) {
          console.log('🔍 Erreur 400 - Données invalides');
          // Erreurs de validation du serveur
          if (errorData.errors) {
            setErrors(errorData.errors);
          } else {
            setErrors({
              general: errorData.message || 'Données invalides'
            });
          }
        } else if (response.status === 409) {
          console.log('🔍 Erreur 409 - Conflit (email déjà utilisé)');
          setErrors({
            email: 'Cette adresse email est déjà utilisée'
          });
        } else if (response.status === 500) {
          console.log('🔍 Erreur 500 - Erreur serveur interne');
          setErrors({
            general: 'Erreur serveur. Veuillez réessayer plus tard.'
          });
        } else {
          console.log(`🔍 Erreur ${response.status} - Autre erreur`);
          setErrors({
            general: errorData.message || 'Une erreur est survenue lors de l\'inscription'
          });
        }
        return;
      }

      console.log('✅ Réponse OK, traitement des données...');
      const data = await response.json();
      console.log('📄 Données de réponse:', data);

      // Vérifier la réponse du serveur
      if (data.success || data.token || data.user) {
        console.log('🎉 Inscription réussie !');

        // Inscription réussie
        if (data.token) {
          console.log('🔐 Token reçu, auto-connexion...');
          // Auto-connexion si un token est fourni
          localStorage.setItem('authToken', data.token);
          localStorage.setItem('user', JSON.stringify(data.user || data));
          console.log('💾 Données utilisateur sauvegardées dans localStorage');
          console.log('➡️ Redirection vers /dashboard');
          router.push('/dashboard');
        } else {
          console.log('➡️ Redirection vers /auth/login avec message de succès');
          // Redirection vers la page de connexion avec message de succès
          router.push('/auth/login?message=inscription-reussie');
        }
      } else {
        console.log('❌ Réponse inattendue du serveur');
        setErrors({
          general: 'Inscription échouée. Veuillez réessayer.'
        });
      }

    } catch (error) {
      console.error('💥 Erreur lors de l\'inscription:', error);
      console.log('📊 Détails de l\'erreur:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });

      setErrors({
        general: 'Impossible de se connecter au serveur. Vérifiez votre connexion internet.'
      });
    } finally {
      console.log('🏁 Fin du processus d\'inscription');
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"/>
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-[#1B396A]">
                STUDAM
              </h1>
              <h2 className="mt-4 text-xl font-semibold text-gray-900">
                Inscription
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Créez votre compte pour accéder à STUDAM
              </p>
            </div>

            {/* Formulaire */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Message d'erreur général */}
              {errors.general && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <div className="text-sm text-red-700">
                      {errors.general}
                    </div>
                  </div>
              )}

              <div className="space-y-4">
                {/* Nom complet */}
                <div>
                  <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1">
                    Nom complet *
                  </label>
                  <input
                      id="nom"
                      name="nom"
                      type="text"
                      value={formData.nom}
                      onChange={handleChange}
                      className={`appearance-none relative block w-full px-3 py-3 border ${errors.nom ? 'border-red-300' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F26419] focus:border-[#F26419] focus:z-10 sm:text-sm transition-colors`}
                      placeholder="Entrez votre nom complet"
                  />
                  {errors.nom && (
                      <p className="mt-1 text-sm text-red-600">{errors.nom}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Adresse email *
                  </label>
                  <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`appearance-none relative block w-full px-3 py-3 border ${errors.email ? 'border-red-300' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F26419] focus:border-[#F26419] focus:z-10 sm:text-sm transition-colors`}
                      placeholder="Entrez votre adresse email"
                  />
                  {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                {/* Rôle */}
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                    Rôle *
                  </label>
                  <select
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className={`appearance-none relative block w-full px-3 py-3 border ${errors.role ? 'border-red-300' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F26419] focus:border-[#F26419] focus:z-10 sm:text-sm transition-colors`}
                  >
                    <option value="">Sélectionnez votre rôle</option>
                    <option value="teacher">Enseignant</option>
                    <option value="chef_departement">Chef de département</option>
                    <option value="admin">Administrateur</option>
                  </select>
                  {errors.role && (
                      <p className="mt-1 text-sm text-red-600">{errors.role}</p>
                  )}
                </div>

                {/* Mot de passe */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Mot de passe *
                  </label>
                  <div className="relative">
                    <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
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
                  <p className="mt-1 text-xs text-gray-500">
                    Minimum 6 caractères avec au moins une majuscule, une minuscule et un chiffre
                  </p>
                </div>

                {/* Confirmation du mot de passe */}
                <div>
                  <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirmer le mot de passe *
                  </label>
                  <div className="relative">
                    <input
                        id="password_confirmation"
                        name="password_confirmation"
                        type={showPasswordConfirm ? "text" : "password"}
                        value={formData.password_confirmation}
                        onChange={handleChange}
                        className={`appearance-none relative block w-full px-3 py-3 pr-10 border ${errors.password_confirmation ? 'border-red-300' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F26419] focus:border-[#F26419] focus:z-10 sm:text-sm transition-colors`}
                        placeholder="Confirmez votre mot de passe"
                    />
                    <EyeIcon
                        visible={showPasswordConfirm}
                        onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                    />
                  </div>
                  {errors.password_confirmation && (
                      <p className="mt-1 text-sm text-red-600">{errors.password_confirmation}</p>
                  )}
                </div>
              </div>

              {/* Conditions d'utilisation */}
              <div className="flex items-center">
                <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    className="h-4 w-4 text-[#F26419] focus:ring-[#F26419] border-gray-300 rounded"
                    required
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                  J&apos; accepte les{' '}
                  <Link href="/terms" className="text-[#F26419] hover:text-[#E55A1A] underline">
                    conditions d&apos; utilisation
                  </Link>
                  {' '}
                  et la{' '}
                  <Link href="/privacy" className="text-[#F26419] hover:text-[#E55A1A] underline">
                    politique de confidentialité
                  </Link>
                </label>
              </div>

              {/* Bouton d'inscription */}
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
                        Inscription en cours...
                      </div>
                  ) : (
                      'Créer mon compte'
                  )}
                </button>
              </div>

              {/* Lien de connexion */}
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Vous avez déjà un compte ?{' '}
                  <Link href="/auth/login" className="font-medium text-[#F26419] hover:text-[#E55A1A] underline">
                    Se connecter
                  </Link>
                </p>
              </div>
            </form>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-xs text-gray-500">
                © 2025 STUDAM - Système de gestion des présences
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Développé par{' '}
                Bioclass Innovators
              </p>
            </div>
          </div>
        </div>
      </div>
  );
}