"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import TimetableSelector from '@/components/timetable/TimetableSelector';
import TimetableGrid from '@/components/timetable/TimetableGrid';
import ScheduleModal from '@/components/timetable/ScheduleModal';

export default function TimetablePage() {
  const router = useRouter();
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [timetableData, setTimetableData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  // Jours de la semaine
  const daysOfWeek = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  
  // Créneaux horaires
  const timeSlots = ['08:00-10:00', '10:00-12:00', '12:00-14:00', '14:00-16:00', '16:00-18:00'];

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
        
        // Charger les classes de l'utilisateur connecté
        if (currentUser) {
          setClasses(currentUser.classes || []);
          // Si l'utilisateur a au moins une classe, la sélectionner par défaut
          if (currentUser.classes && currentUser.classes.length > 0) {
            setSelectedClassId(currentUser.classes[0].id);
          }
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données utilisateur:', error);
        router.push('/auth/login');
        return;
      }
    }
    
    setLoading(false);
  }, [router]);

  useEffect(() => {
    // Charger les données d'emploi du temps quand une classe est sélectionnée
    if (selectedClassId) {
      loadTimetableData();
    }
  }, [selectedClassId]);

  const loadTimetableData = () => {
    // Simuler le chargement des données d'emploi du temps
    setLoading(true);
    
    // Données fictives pour la démo
    setTimeout(() => {
      // Générer quelques cours aléatoires
      const subjects = [
        { id: 1, libelle: 'Programmation Web', code: 'INFO301', enseignant: { id: 1, nom: 'Dr. Diallo' } },
        { id: 2, libelle: 'Systèmes d\'exploitation', code: 'INFO204', enseignant: { id: 2, nom: 'Prof. Fall' } },
        { id: 3, libelle: 'Réseaux', code: 'INFO305', enseignant: { id: 3, nom: 'Dr. Sow' } },
        { id: 4, libelle: 'Bases de données', code: 'INFO202', enseignant: { id: 4, nom: 'Prof. Kane' } },
        { id: 5, libelle: 'Intelligence Artificielle', code: 'INFO401', enseignant: { id: 5, nom: 'Dr. Ndiaye' } }
      ];
      
      const mockTimetable = [];
      
      // Ajouter quelques cours pour chaque jour
      daysOfWeek.forEach(day => {
        // Ajouter 1-3 cours par jour
        const numCourses = Math.floor(Math.random() * 3) + 1;
        
        for (let i = 0; i < numCourses; i++) {
          // Sélectionner un créneau horaire aléatoire
          const timeSlot = timeSlots[Math.floor(Math.random() * timeSlots.length)];
          
          // Sélectionner une matière aléatoire
          const subject = subjects[Math.floor(Math.random() * subjects.length)];
          
          // Vérifier si ce créneau est déjà occupé
          const existingSchedule = mockTimetable.find(
            s => s.jour === day && s.horaire === timeSlot
          );
          
          if (!existingSchedule) {
            mockTimetable.push({
              id: mockTimetable.length + 1,
              jour: day,
              horaire: timeSlot,
              matiere: subject,
              classe: { id: selectedClassId, nom: classes.find(c => c.id === parseInt(selectedClassId))?.nom }
            });
          }
        }
      });
      
      setTimetableData(mockTimetable);
      setLoading(false);
    }, 1000);
  };

  const handleClassChange = (classId) => {
    setSelectedClassId(classId);
  };

  const handleCellClick = (day, time, schedule) => {
    setSelectedDay(day);
    setSelectedTime(time);
    setSelectedSchedule(schedule);
    setShowModal(true);
  };

  const handleSaveSchedule = (scheduleData) => {
    if (scheduleData.id) {
      // Mise à jour d'un cours existant
      setTimetableData(prev => 
        prev.map(item => 
          item.id === scheduleData.id ? scheduleData : item
        )
      );
    } else {
      // Ajout d'un nouveau cours
      const newSchedule = {
        ...scheduleData,
        id: timetableData.length + 1,
        jour: selectedDay,
        horaire: selectedTime,
        classe: { id: selectedClassId, nom: classes.find(c => c.id === parseInt(selectedClassId))?.nom }
      };
      
      setTimetableData(prev => [...prev, newSchedule]);
    }
    
    setShowModal(false);
    setSelectedSchedule(null);
  };

  const handleDeleteSchedule = (scheduleId) => {
    setTimetableData(prev => prev.filter(item => item.id !== scheduleId));
    setShowModal(false);
    setSelectedSchedule(null);
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
          <h1 className="text-3xl font-bold text-[#1B396A]">Emploi du Temps</h1>
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
                  <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">Emploi du temps</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        {/* Sélecteur de classe */}
        <div className="mb-6">
          <TimetableSelector 
            classes={classes} 
            selectedClassId={selectedClassId}
            onClassChange={handleClassChange}
          />
        </div>

        {/* Grille d'emploi du temps */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-[#1B396A]">
              Emploi du Temps Hebdomadaire
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              {selectedClassId && classes.find(c => c.id === parseInt(selectedClassId)) && 
                `Classe: ${classes.find(c => c.id === parseInt(selectedClassId)).nom}`}
              {!selectedClassId && "Sélectionnez une classe pour afficher son emploi du temps"}
            </p>
          </div>
          
          {selectedClassId ? (
            <TimetableGrid 
              daysOfWeek={daysOfWeek}
              timeSlots={timeSlots}
              schedules={timetableData}
              onCellClick={handleCellClick}
            />
          ) : (
            <div className="px-4 py-5 sm:px-6">
              <div className="text-center py-10">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune classe sélectionnée</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Veuillez sélectionner une classe pour afficher son emploi du temps.
                </p>
              </div>
            </div>
          )}
          
          <div className="px-4 py-4 sm:px-6 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-[#F26419] rounded-full mr-1"></div>
                  <span className="text-xs text-gray-500">Cours programmé</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-gray-200 rounded-full mr-1"></div>
                  <span className="text-xs text-gray-500">Créneau disponible</span>
                </div>
              </div>
              <p className="text-xs text-gray-500">Cliquez sur un créneau pour ajouter/modifier un cours</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal pour ajouter/modifier un cours */}
      {showModal && (
        <ScheduleModal 
          show={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedSchedule(null);
          }}
          day={selectedDay}
          time={selectedTime}
          schedule={selectedSchedule}
          classId={selectedClassId}
          className={classes.find(c => c.id === parseInt(selectedClassId))?.nom}
          onSave={handleSaveSchedule}
          onDelete={handleDeleteSchedule}
          subjects={user.matieres || []}
        />
      )}
    </div>
  );
}