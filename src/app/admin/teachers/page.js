"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import TeachersList from '@/components/teachers/TeachersList';
import TeacherModal from '@/components/teachers/TeacherModal';
import TeachersFilter from '@/components/teachers/TeachersFilter';

export default function TeachersPage() {
  const router = useRouter();
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [teachers, setTeachers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    department: '',
    subject: ''
  });
  const [showModal, setShowModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté et a les droits d'admin
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        router.push('/auth/login');
        return;
      }
      
      try {
        const currentUser = JSON.parse(userStr);
        setUser(currentUser);
        
        // Vérifier si l'utilisateur a les droits d'admin
        if (currentUser.role !== 'admin' && currentUser.role !== 'super_admin' && currentUser.role !== 'chef_departement') {
          // Rediriger vers le dashboard pour les utilisateurs non autorisés
          router.push('/dashboard');
          return;
        }
        
        // Charger les données
        loadTeachers();
        loadDepartments();
        loadSubjects();
      } catch (error) {
        console.error('Erreur lors de la récupération des données utilisateur:', error);
        router.push('/auth/login');
        return;
      }
    }
  }, [router]);

  const loadTeachers = () => {
    setLoading(true);
    
    // Données fictives pour la démo
    setTimeout(() => {
      const mockTeachers = [
        { 
          id: 1, 
          nom: 'Dr. Amadou Diallo', 
          email: 'a.diallo@studam.edu', 
          phone: '(+221) 77 123 45 67', 
          departement: { id: 1, nom: 'Informatique' },
          matieres: [
            { id: 1, libelle: 'Programmation Web', code: 'INFO301' },
            { id: 3, libelle: 'Réseaux', code: 'INFO305' }
          ],
          isChefDepartement: true,
          status: 'active'
        },
        { 
          id: 2, 
          nom: 'Prof. Fatou Fall', 
          email: 'f.fall@studam.edu', 
          phone: '(+221) 77 234 56 78', 
          departement: { id: 1, nom: 'Informatique' },
          matieres: [
            { id: 2, libelle: 'Systèmes d\'exploitation', code: 'INFO204' }
          ],
          isChefDepartement: false,
          status: 'active'
        },
        { 
          id: 3, 
          nom: 'Dr. Modou Sow', 
          email: 'm.sow@studam.edu', 
          phone: '(+221) 77 345 67 89', 
          departement: { id: 2, nom: 'Mathématiques' },
          matieres: [
            { id: 6, libelle: 'Algèbre linéaire', code: 'MATH201' },
            { id: 7, libelle: 'Analyse numérique', code: 'MATH302' }
          ],
          isChefDepartement: true,
          status: 'active'
        },
        { 
          id: 4, 
          nom: 'Prof. Aissatou Ndiaye', 
          email: 'a.ndiaye@studam.edu', 
          phone: '(+221) 77 456 78 90', 
          departement: { id: 3, nom: 'Génie Civil' },
          matieres: [
            { id: 10, libelle: 'Structures en béton', code: 'GC301' }
          ],
          isChefDepartement: false,
          status: 'active'
        },
        { 
          id: 5, 
          nom: 'Dr. Oumar Faye', 
          email: 'o.faye@studam.edu', 
          phone: '(+221) 77 567 89 01', 
          departement: { id: 2, nom: 'Mathématiques' },
          matieres: [
            { id: 8, libelle: 'Statistiques', code: 'MATH401' }
          ],
          isChefDepartement: false,
          status: 'inactive'
        }
      ];
      
      setTeachers(mockTeachers);
      setLoading(false);
    }, 1000);
  };

  const loadDepartments = () => {
    // Données fictives pour la démo
    const mockDepartments = [
      { id: 1, nom: 'Informatique' },
      { id: 2, nom: 'Mathématiques' },
      { id: 3, nom: 'Génie Civil' },
      { id: 4, nom: 'Génie Électrique' },
      { id: 5, nom: 'Gestion' }
    ];
    
    setDepartments(mockDepartments);
  };

  const loadSubjects = () => {
    // Données fictives pour la démo
    const mockSubjects = [
      { id: 1, libelle: 'Programmation Web', code: 'INFO301', departement: { id: 1, nom: 'Informatique' } },
      { id: 2, libelle: 'Systèmes d\'exploitation', code: 'INFO204', departement: { id: 1, nom: 'Informatique' } },
      { id: 3, libelle: 'Réseaux', code: 'INFO305', departement: { id: 1, nom: 'Informatique' } },
      { id: 4, libelle: 'Bases de données', code: 'INFO202', departement: { id: 1, nom: 'Informatique' } },
      { id: 5, libelle: 'Intelligence Artificielle', code: 'INFO401', departement: { id: 1, nom: 'Informatique' } },
      { id: 6, libelle: 'Algèbre linéaire', code: 'MATH201', departement: { id: 2, nom: 'Mathématiques' } },
      { id: 7, libelle: 'Analyse numérique', code: 'MATH302', departement: { id: 2, nom: 'Mathématiques' } },
      { id: 8, libelle: 'Statistiques', code: 'MATH401', departement: { id: 2, nom: 'Mathématiques' } },
      { id: 9, libelle: 'Mécanique des sols', code: 'GC201', departement: { id: 3, nom: 'Génie Civil' } },
      { id: 10, libelle: 'Structures en béton', code: 'GC301', departement: { id: 3, nom: 'Génie Civil' } }
    ];
    
    setSubjects(mockSubjects);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const filteredTeachers = teachers.filter(teacher => {
    // Filtrer par recherche de texte
    if (filters.search && !teacher.nom.toLowerCase().includes(filters.search.toLowerCase()) && 
        !teacher.email.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    
    // Filtrer par département
    if (filters.department && teacher.departement.id !== parseInt(filters.department)) {
      return false;
    }
    
    // Filtrer par matière
    if (filters.subject && !teacher.matieres.some(m => m.id === parseInt(filters.subject))) {
      return false;
    }
    
    return true;
  });

  const handleAddTeacher = () => {
    setSelectedTeacher(null);
    setShowModal(true);
  };

  const handleEditTeacher = (teacher) => {
    setSelectedTeacher(teacher);
    setShowModal(true);
  };

  const handleSaveTeacher = (teacherData) => {
    if (teacherData.id) {
      // Mise à jour d'un enseignant existant
      setTeachers(prev => 
        prev.map(item => 
          item.id === teacherData.id ? { ...item, ...teacherData } : item
        )
      );
    } else {
      // Ajout d'un nouvel enseignant
      const newTeacher = {
        ...teacherData,
        id: teachers.length + 1,
        status: 'active'
      };
      
      setTeachers(prev => [...prev, newTeacher]);
    }
    
    setShowModal(false);
    setSelectedTeacher(null);
  };

  const handleToggleStatus = (teacherId) => {
    setTeachers(prev => 
      prev.map(teacher => 
        teacher.id === teacherId 
          ? { ...teacher, status: teacher.status === 'active' ? 'inactive' : 'active' } 
          : teacher
      )
    );
  };

  const handleToggleChefDepartement = (teacherId) => {
    // Si on active un chef de département, il faut désactiver tous les autres dans le même département
    const teacher = teachers.find(t => t.id === teacherId);
    if (!teacher) return;
    
    const departmentId = teacher.departement.id;
    
    setTeachers(prev => 
      prev.map(t => {
        if (t.id === teacherId) {
          return { ...t, isChefDepartement: !t.isChefDepartement };
        } else if (t.departement.id === departmentId && !teacher.isChefDepartement) {
          return { ...t, isChefDepartement: false };
        }
        return t;
      })
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F26419]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[#1B396A]">Gestion des Enseignants</h1>
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
                  <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">Enseignants</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        {/* Filtres et bouton d'ajout */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between gap-4">
          <TeachersFilter 
            departments={departments}
            subjects={subjects}
            filters={filters}
            onFilterChange={handleFilterChange}
          />
          
          <div className="sm:ml-4">
            <button
              type="button"
              onClick={handleAddTeacher}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#F26419] hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F26419]"
            >
              <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
              Ajouter un enseignant
            </button>
          </div>
        </div>

        {/* Liste des enseignants */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-[#1B396A]">
              Liste des Enseignants
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              {filteredTeachers.length} enseignant(s) trouvé(s)
            </p>
          </div>
          
          <TeachersList 
            teachers={filteredTeachers}
            onEdit={handleEditTeacher}
            onToggleStatus={handleToggleStatus}
            onToggleChefDepartement={handleToggleChefDepartement}
          />
        </div>
      </div>

      {/* Modal pour ajouter/modifier un enseignant */}
      {showModal && (
        <TeacherModal 
          show={showModal}
          teacher={selectedTeacher}
          departments={departments}
          subjects={subjects}
          onClose={() => {
            setShowModal(false);
            setSelectedTeacher(null);
          }}
          onSave={handleSaveTeacher}
        />
      )}
    </div>
  );
}