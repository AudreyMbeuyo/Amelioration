"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('info');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({});

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        router.push('/auth/login');
        return;
      }

      try {
        const currentUser = JSON.parse(userStr);
        setUser(currentUser);
        setFormData({
          nom: currentUser.nom || '',
          email: currentUser.email || '',
          phone: currentUser.phone || '',
          bio: currentUser.bio || ''
        });
      } catch (error) {
        console.error('Erreur lors de la récupération des données utilisateur:', error);
        router.push('/auth/login');
        return;
      }
    }

    setLoading(false);
  }, [router]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simuler une mise à jour de profil réussie
      setTimeout(() => {
        // Mettre à jour l'utilisateur dans le localStorage
        const updatedUser = { ...user, ...formData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);

        setSuccessMessage('Votre profil a été mis à jour avec succès');
        setLoading(false);

        // Effacer le message après 3 secondes
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      }, 1000);
    } catch (error) {
      setErrorMessage('Une erreur est survenue lors de la mise à jour du profil');
      setLoading(false);

      // Effacer le message après 3 secondes
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simuler un changement de mot de passe réussi
      setTimeout(() => {
        setSuccessMessage('Votre mot de passe a été changé avec succès');
        setLoading(false);

        // Effacer le message après 3 secondes
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      }, 1000);
    } catch (error) {
      setErrorMessage('Une erreur est survenue lors du changement de mot de passe');
      setLoading(false);

      // Effacer le message après 3 secondes
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Composant ProfileInfo intégré
  const ProfileInfo = () => (
      <form onSubmit={handleUpdateProfile} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="nom" className="block text-sm font-medium text-gray-700">
              Nom complet
            </label>
            <div className="mt-1">
              <input
                  type="text"
                  name="nom"
                  id="nom"
                  value={formData.nom}
                  onChange={handleInputChange}
                  className="shadow-sm focus:ring-[#F26419] focus:border-[#F26419] block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Adresse email
            </label>
            <div className="mt-1">
              <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="shadow-sm focus:ring-[#F26419] focus:border-[#F26419] block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Numéro de téléphone
            </label>
            <div className="mt-1">
              <input
                  type="tel"
                  name="phone"
                  id="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="shadow-sm focus:ring-[#F26419] focus:border-[#F26419] block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
              Bio
            </label>
            <div className="mt-1">
            <textarea
                id="bio"
                name="bio"
                rows={4}
                value={formData.bio}
                onChange={handleInputChange}
                className="shadow-sm focus:ring-[#F26419] focus:border-[#F26419] block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="Quelques mots à propos de vous..."
            />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
              type="submit"
              disabled={loading}
              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#F26419] hover:bg-[#E55A1A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F26419] disabled:opacity-50"
          >
            {loading ? 'Mise à jour...' : 'Mettre à jour le profil'}
          </button>
        </div>
      </form>
  );

  // Composant PasswordChange intégré
  const PasswordChange = () => {
    const [passwordData, setPasswordData] = useState({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });

    const handlePasswordInputChange = (e) => {
      const { name, value } = e.target;
      setPasswordData(prev => ({
        ...prev,
        [name]: value
      }));
    };

    return (
        <form onSubmit={handleChangePassword} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                Mot de passe actuel
              </label>
              <div className="mt-1">
                <input
                    type="password"
                    name="currentPassword"
                    id="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordInputChange}
                    className="shadow-sm focus:ring-[#F26419] focus:border-[#F26419] block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                Nouveau mot de passe
              </label>
              <div className="mt-1">
                <input
                    type="password"
                    name="newPassword"
                    id="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordInputChange}
                    className="shadow-sm focus:ring-[#F26419] focus:border-[#F26419] block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirmer le nouveau mot de passe
              </label>
              <div className="mt-1">
                <input
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordInputChange}
                    className="shadow-sm focus:ring-[#F26419] focus:border-[#F26419] block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
                type="submit"
                disabled={loading}
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#F26419] hover:bg-[#E55A1A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F26419] disabled:opacity-50"
            >
              {loading ? 'Changement...' : 'Changer le mot de passe'}
            </button>
          </div>
        </form>
    );
  };

  // Composant ActivityLog intégré
  const ActivityLog = () => {
    const mockActivities = [
      {
        id: 1,
        action: 'Connexion',
        description: 'Connexion à la plateforme',
        timestamp: '2024-01-15 14:30:00',
        ip: '192.168.1.100'
      },
      {
        id: 2,
        action: 'Mise à jour profil',
        description: 'Modification des informations personnelles',
        timestamp: '2024-01-14 09:15:00',
        ip: '192.168.1.100'
      },
      {
        id: 3,
        action: 'Prise de présence',
        description: 'Enregistrement des présences - Cours de Programmation Web',
        timestamp: '2024-01-13 10:00:00',
        ip: '192.168.1.100'
      }
    ];

    return (
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Activité récente</h3>
            <div className="space-y-3">
              {mockActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 bg-white rounded-md border">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-[#F26419] rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.action}
                      </p>
                      <p className="text-sm text-gray-500">
                        {activity.description}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {activity.timestamp} • IP: {activity.ip}
                      </p>
                    </div>
                  </div>
              ))}
            </div>
          </div>
        </div>
    );
  };

  if (loading && !user) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F26419]"></div>
        </div>
    );
  }

  if (!user) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <div className="text-center">
            <p className="text-gray-600">Aucun utilisateur connecté</p>
            <Link href="/auth/login" className="text-[#F26419] hover:underline">
              Se connecter
            </Link>
          </div>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-[#1B396A]">Mon Profil</h1>
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-3">
                <li className="inline-flex items-center">
                  <Link href="/dashboard" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-[#F26419]">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                    </svg>
                    Tableau de bord
                  </Link>
                </li>
                <li aria-current="page">
                  <div className="flex items-center">
                    <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                    </svg>
                    <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">Profil</span>
                  </div>
                </li>
              </ol>
            </nav>
          </div>

          {/* Messages de succès ou d'erreur */}
          {successMessage && (
              <div className="mb-4 rounded-md bg-green-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">
                      {successMessage}
                    </p>
                  </div>
                </div>
              </div>
          )}

          {errorMessage && (
              <div className="mb-4 rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">
                      {errorMessage}
                    </p>
                  </div>
                </div>
              </div>
          )}

          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            {/* En-tête de profil */}
            <div className="bg-gradient-to-r from-[#1B396A] to-[#437DE0] px-4 py-8 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row items-center">
                <div className="flex-shrink-0 h-24 w-24 bg-white rounded-full flex items-center justify-center text-[#1B396A] text-3xl font-bold mb-4 sm:mb-0">
                  {user.nom ? user.nom.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
                </div>
                <div className="sm:ml-6 text-center sm:text-left">
                  <h2 className="text-2xl font-bold text-white">{user.nom || 'Utilisateur'}</h2>
                  <p className="text-blue-100 mt-1">{user.email || 'Email non renseigné'}</p>
                  <div className="mt-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {user.role === 'super_admin' ? 'Super Administrateur' :
                        user.role === 'admin' ? 'Administrateur' :
                            user.role === 'chef_departement' ? 'Chef de département' :
                                'Enseignant'}
                  </span>
                    {user.departement && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 ml-2">
                      {user.departement.nom}
                    </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Onglets */}
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                <button
                    className={`px-6 py-4 font-medium text-sm border-b-2 ${
                        activeTab === 'info'
                            ? 'border-[#F26419] text-[#F26419]'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                    onClick={() => setActiveTab('info')}
                >
                  Informations personnelles
                </button>
                <button
                    className={`px-6 py-4 font-medium text-sm border-b-2 ${
                        activeTab === 'password'
                            ? 'border-[#F26419] text-[#F26419]'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                    onClick={() => setActiveTab('password')}
                >
                  Changer de mot de passe
                </button>
                <button
                    className={`px-6 py-4 font-medium text-sm border-b-2 ${
                        activeTab === 'activity'
                            ? 'border-[#F26419] text-[#F26419]'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                    onClick={() => setActiveTab('activity')}
                >
                  Activité récente
                </button>
              </nav>
            </div>

            {/* Contenu des onglets */}
            <div className="px-4 py-6 sm:px-6 lg:px-8">
              {activeTab === 'info' && <ProfileInfo />}
              {activeTab === 'password' && <PasswordChange />}
              {activeTab === 'activity' && <ActivityLog />}
            </div>
          </div>
        </div>
      </div>
  );
}