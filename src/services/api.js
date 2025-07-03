// src/services/api.js
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

/**
 * Classe utilitaire pour les appels API
 */
class ApiService {
  /**
   * Récupère le token d'authentification du stockage local
   * @returns {string|null} Le token d'authentification ou null
   */
  static getAuthToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken');
    }
    return null;
  }

  /**
   * Configure les headers pour les requêtes API
   * @param {boolean} includeAuth - Indique si le header d'authentification doit être inclus
   * @returns {Object} Les headers configurés
   */
  static getHeaders(includeAuth = true) {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (includeAuth) {
      const token = this.getAuthToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  /**
   * Effectue une requête vers l'API
   * @param {string} endpoint - Le endpoint de l'API
   * @param {string} method - La méthode HTTP (GET, POST, PUT, DELETE)
   * @param {Object} data - Les données à envoyer (pour POST, PUT)
   * @param {boolean} includeAuth - Indique si le header d'authentification doit être inclus
   * @returns {Promise<any>} La réponse de l'API
   */
  static async fetchApi(endpoint, method = 'GET', data = null, includeAuth = true) {
    const url = `${API_BASE_URL}${endpoint}`;
    const options = {
      method,
      headers: this.getHeaders(includeAuth),
    };

    if (data && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, options);
      
      // Vérifier si la réponse est au format JSON
      const contentType = response.headers.get('content-type');
      const isJson = contentType && contentType.includes('application/json');
      
      // Traiter la réponse selon son type
      const responseData = isJson ? await response.json() : await response.text();
      
      // Vérifier si la réponse est un succès
      if (!response.ok) {
        throw {
          status: response.status,
          data: responseData,
          message: isJson && responseData.message ? responseData.message : 'Une erreur est survenue'
        };
      }
      
      return responseData;
    } catch (error) {
      // Gérer les erreurs réseau
      if (!error.status) {
        console.error('Erreur réseau:', error);
        throw {
          status: 0,
          message: 'Impossible de se connecter au serveur'
        };
      }
      
      // Relancer l'erreur pour la traiter dans le composant
      throw error;
    }
  }
}

/**
 * Service d'authentification
 */
export const AuthService = {
  /**
   * Connecte un utilisateur
   * @param {string} email - L'email de l'utilisateur
   * @param {string} password - Le mot de passe de l'utilisateur
   * @returns {Promise<Object>} Les données de l'utilisateur connecté
   */
  login: async (email, password) => {
    const data = await ApiService.fetchApi('/auth/login', 'POST', { email, password }, false);
    
    // Stocker le token d'authentification
    if (data.token) {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    
    return data;
  },

  /**
   * Inscrit un nouvel utilisateur
   * @param {Object} userData - Les données de l'utilisateur
   * @returns {Promise<Object>} Les données de l'utilisateur inscrit
   */
  register: async (userData) => {
    const data = await ApiService.fetchApi('/auth/register', 'POST', userData, false);
    
    // Stocker le token d'authentification
    if (data.token) {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    
    return data;
  },

  /**
   * Déconnecte l'utilisateur actuel
   */
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.location.href = '/auth/login';
  },

  /**
   * Vérifie si l'utilisateur est authentifié
   * @returns {boolean} True si l'utilisateur est authentifié, sinon false
   */
  isAuthenticated: () => {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('authToken');
  },

  /**
   * Récupère les données de l'utilisateur connecté
   * @returns {Object|null} Les données de l'utilisateur ou null
   */
  getCurrentUser: () => {
    if (typeof window === 'undefined') return null;
    
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        return null;
      }
    }
    return null;
  }
};

/**
 * Service de gestion des enseignants
 */
export const TeacherService = {
  /**
   * Récupère la liste des enseignants
   * @param {Object} params - Paramètres de filtrage
   * @returns {Promise<Array>} Liste des enseignants
   */
  getTeachers: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const endpoint = `/teachers${queryParams ? `?${queryParams}` : ''}`;
    return ApiService.fetchApi(endpoint);
  },

  /**
   * Récupère un enseignant par son ID
   * @param {string} id - L'ID de l'enseignant
   * @returns {Promise<Object>} Les données de l'enseignant
   */
  getTeacherById: async (id) => {
    return ApiService.fetchApi(`/teachers/${id}`);
  },

  /**
   * Crée un nouvel enseignant
   * @param {Object} teacherData - Les données de l'enseignant
   * @returns {Promise<Object>} Les données de l'enseignant créé
   */
  createTeacher: async (teacherData) => {
    return ApiService.fetchApi('/teachers', 'POST', teacherData);
  },

  /**
   * Met à jour un enseignant existant
   * @param {string} id - L'ID de l'enseignant
   * @param {Object} teacherData - Les nouvelles données de l'enseignant
   * @returns {Promise<Object>} Les données de l'enseignant mis à jour
   */
  updateTeacher: async (id, teacherData) => {
    return ApiService.fetchApi(`/teachers/${id}`, 'PUT', teacherData);
  },

  /**
   * Supprime un enseignant
   * @param {string} id - L'ID de l'enseignant
   * @returns {Promise<Object>} Confirmation de suppression
   */
  deleteTeacher: async (id) => {
    return ApiService.fetchApi(`/teachers/${id}`, 'DELETE');
  }
};

/**
 * Service de gestion des étudiants
 */
export const StudentService = {
  /**
   * Récupère la liste des étudiants
   * @param {Object} params - Paramètres de filtrage
   * @returns {Promise<Array>} Liste des étudiants
   */
  getStudents: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const endpoint = `/students${queryParams ? `?${queryParams}` : ''}`;
    return ApiService.fetchApi(endpoint);
  },

  /**
   * Récupère un étudiant par son ID
   * @param {string} id - L'ID de l'étudiant
   * @returns {Promise<Object>} Les données de l'étudiant
   */
  getStudentById: async (id) => {
    return ApiService.fetchApi(`/students/${id}`);
  },

  /**
   * Crée un nouvel étudiant
   * @param {Object} studentData - Les données de l'étudiant
   * @returns {Promise<Object>} Les données de l'étudiant créé
   */
  createStudent: async (studentData) => {
    return ApiService.fetchApi('/students', 'POST', studentData);
  },

  /**
   * Met à jour un étudiant existant
   * @param {string} id - L'ID de l'étudiant
   * @param {Object} studentData - Les nouvelles données de l'étudiant
   * @returns {Promise<Object>} Les données de l'étudiant mis à jour
   */
  updateStudent: async (id, studentData) => {
    return ApiService.fetchApi(`/students/${id}`, 'PUT', studentData);
  },

  /**
   * Supprime un étudiant
   * @param {string} id - L'ID de l'étudiant
   * @returns {Promise<Object>} Confirmation de suppression
   */
  deleteStudent: async (id) => {
    return ApiService.fetchApi(`/students/${id}`, 'DELETE');
  },

  /**
   * Importe des étudiants à partir d'un fichier Excel
   * @param {File} file - Le fichier Excel contenant les données des étudiants
   * @param {string} classId - L'ID de la classe
   * @returns {Promise<Object>} Résultat de l'importation
   */
  importStudents: async (file, classId) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('classId', classId);
    
    const url = `${API_BASE_URL}/students/import`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ApiService.getAuthToken()}`
      },
      body: formData
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw {
        status: response.status,
        data: errorData,
        message: errorData.message || 'Erreur lors de l\'importation des étudiants'
      };
    }
    
    return response.json();
  }
};

/**
 * Service de gestion des courses
 */
export const ClassService = {
  /**
   * Récupère la liste des courses
   * @param {Object} params - Paramètres de filtrage
   * @returns {Promise<Array>} Liste des courses
   */
  getClasses: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const endpoint = `/classes${queryParams ? `?${queryParams}` : ''}`;
    return ApiService.fetchApi(endpoint);
  },

  /**
   * Récupère une classe par son ID
   * @param {string} id - L'ID de la classe
   * @returns {Promise<Object>} Les données de la classe
   */
  getClassById: async (id) => {
    return ApiService.fetchApi(`/classes/${id}`);
  },

  /**
   * Crée une nouvelle classe
   * @param {Object} classData - Les données de la classe
   * @returns {Promise<Object>} Les données de la classe créée
   */
  createClass: async (classData) => {
    return ApiService.fetchApi('/courses', 'POST', classData);
  },

  /**
   * Met à jour une classe existante
   * @param {string} id - L'ID de la classe
   * @param {Object} classData - Les nouvelles données de la classe
   * @returns {Promise<Object>} Les données de la classe mise à jour
   */
  updateClass: async (id, classData) => {
    return ApiService.fetchApi(`/classes/${id}`, 'PUT', classData);
  },

  /**
   * Supprime une classe
   * @param {string} id - L'ID de la classe
   * @returns {Promise<Object>} Confirmation de suppression
   */
  deleteClass: async (id) => {
    return ApiService.fetchApi(`/classes/${id}`, 'DELETE');
  },

  /**
   * Récupère les étudiants d'une classe
   * @param {string} id - L'ID de la classe
   * @returns {Promise<Array>} Liste des étudiants de la classe
   */
  getClassStudents: async (id) => {
    return ApiService.fetchApi(`/classes/${id}/students`);
  }
};

/**
 * Service de gestion des matières
 */
export const SubjectService = {
  /**
   * Récupère la liste des matières
   * @param {Object} params - Paramètres de filtrage
   * @returns {Promise<Array>} Liste des matières
   */
  getSubjects: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const endpoint = `/subjects${queryParams ? `?${queryParams}` : ''}`;
    return ApiService.fetchApi(endpoint);
  },

  /**
   * Récupère une matière par son ID
   * @param {string} id - L'ID de la matière
   * @returns {Promise<Object>} Les données de la matière
   */
  getSubjectById: async (id) => {
    return ApiService.fetchApi(`/subjects/${id}`);
  },

  /**
   * Crée une nouvelle matière
   * @param {Object} subjectData - Les données de la matière
   * @returns {Promise<Object>} Les données de la matière créée
   */
  createSubject: async (subjectData) => {
    return ApiService.fetchApi('/subjects', 'POST', subjectData);
  },

  /**
   * Met à jour une matière existante
   * @param {string} id - L'ID de la matière
   * @param {Object} subjectData - Les nouvelles données de la matière
   * @returns {Promise<Object>} Les données de la matière mise à jour
   */
  updateSubject: async (id, subjectData) => {
    return ApiService.fetchApi(`/subjects/${id}`, 'PUT', subjectData);
  },

  /**
   * Supprime une matière
   * @param {string} id - L'ID de la matière
   * @returns {Promise<Object>} Confirmation de suppression
   */
  deleteSubject: async (id) => {
    return ApiService.fetchApi(`/subjects/${id}`, 'DELETE');
  }
};

/**
 * Service de gestion des départements
 */
export const DepartmentService = {
  /**
   * Récupère la liste des départements
   * @returns {Promise<Array>} Liste des départements
   */
  getDepartments: async () => {
    return ApiService.fetchApi('/departments');
  },

  /**
   * Récupère un département par son ID
   * @param {string} id - L'ID du département
   * @returns {Promise<Object>} Les données du département
   */
  getDepartmentById: async (id) => {
    return ApiService.fetchApi(`/departments/${id}`);
  },

  /**
   * Crée un nouveau département
   * @param {Object} departmentData - Les données du département
   * @returns {Promise<Object>} Les données du département créé
   */
  createDepartment: async (departmentData) => {
    return ApiService.fetchApi('/departments', 'POST', departmentData);
  },

  /**
   * Met à jour un département existant
   * @param {string} id - L'ID du département
   * @param {Object} departmentData - Les nouvelles données du département
   * @returns {Promise<Object>} Les données du département mis à jour
   */
  updateDepartment: async (id, departmentData) => {
    return ApiService.fetchApi(`/departments/${id}`, 'PUT', departmentData);
  },

  /**
   * Supprime un département
   * @param {string} id - L'ID du département
   * @returns {Promise<Object>} Confirmation de suppression
   */
  deleteDepartment: async (id) => {
    return ApiService.fetchApi(`/departments/${id}`, 'DELETE');
  },

  /**
   * Récupère les courses d'un département
   * @param {string} id - L'ID du département
   * @returns {Promise<Array>} Liste des courses du département
   */
  getDepartmentClasses: async (id) => {
    return ApiService.fetchApi(`/departments/${id}/classes`);
  }
};

/**
 * Service de gestion des présences
 */
export const AttendanceService = {
  /**
   * Récupère les présences par classe et date
   * @param {string} classId - L'ID de la classe
   * @param {string} date - La date au format YYYY-MM-DD
   * @param {string} subjectId - L'ID de la matière (optionnel)
   * @returns {Promise<Array>} Liste des présences
   */
  getAttendanceByClassAndDate: async (classId, date, subjectId = null) => {
    let endpoint = `/attendance/class/${classId}/date/${date}`;
    if (subjectId) {
      endpoint += `/subject/${subjectId}`;
    }
    return ApiService.fetchApi(endpoint);
  },

  /**
   * Récupère les présences d'un étudiant
   * @param {string} studentId - L'ID de l'étudiant
   * @param {Object} params - Paramètres de filtrage (startDate, endDate, subjectId)
   * @returns {Promise<Array>} Liste des présences de l'étudiant
   */
  getStudentAttendance: async (studentId, params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const endpoint = `/attendance/student/${studentId}${queryParams ? `?${queryParams}` : ''}`;
    return ApiService.fetchApi(endpoint);
  },

  /**
   * Enregistre les présences pour une séance
   * @param {Object} attendanceData - Les données de présence
   * @returns {Promise<Object>} Confirmation d'enregistrement
   */
  saveAttendance: async (attendanceData) => {
    return ApiService.fetchApi('/attendance', 'POST', attendanceData);
  },

  /**
   * Récupère les statistiques de présence par classe
   * @param {string} classId - L'ID de la classe
   * @param {Object} params - Paramètres de filtrage (startDate, endDate, subjectId)
   * @returns {Promise<Object>} Statistiques de présence
   */
  getAttendanceStatsByClass: async (classId, params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const endpoint = `/attendance/stats/class/${classId}${queryParams ? `?${queryParams}` : ''}`;
    return ApiService.fetchApi(endpoint);
  },

  /**
   * Récupère les statistiques de présence par matière
   * @param {string} subjectId - L'ID de la matière
   * @param {Object} params - Paramètres de filtrage (startDate, endDate, classId)
   * @returns {Promise<Object>} Statistiques de présence
   */
  getAttendanceStatsBySubject: async (subjectId, params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const endpoint = `/attendance/stats/subject/${subjectId}${queryParams ? `?${queryParams}` : ''}`;
    return ApiService.fetchApi(endpoint);
  }
};

/**
 * Service de gestion des emplois du temps
 */
export const TimetableService = {
  /**
   * Récupère l'emploi du temps d'une classe
   * @param {string} classId - L'ID de la classe
   * @returns {Promise<Object>} Emploi du temps de la classe
   */
  getClassTimetable: async (classId) => {
    return ApiService.fetchApi(`/timetable/class/${classId}`);
  },

  /**
   * Récupère l'emploi du temps d'un enseignant
   * @param {string} teacherId - L'ID de l'enseignant
   * @returns {Promise<Object>} Emploi du temps de l'enseignant
   */
  getTeacherTimetable: async (teacherId) => {
    return ApiService.fetchApi(`/timetable/teacher/${teacherId}`);
  },

  /**
   * Ajoute un cours à l'emploi du temps
   * @param {Object} scheduleData - Les données du cours
   * @returns {Promise<Object>} Confirmation d'ajout
   */
  addSchedule: async (scheduleData) => {
    return ApiService.fetchApi('/timetables/schedule', 'POST', scheduleData);
  },

  /**
   * Met à jour un cours dans l'emploi du temps
   * @param {string} id - L'ID du cours
   * @param {Object} scheduleData - Les nouvelles données du cours
   * @returns {Promise<Object>} Confirmation de mise à jour
   */
  updateSchedule: async (id, scheduleData) => {
    return ApiService.fetchApi(`/timetable/schedule/${id}`, 'PUT', scheduleData);
  },

  /**
   * Supprime un cours de l'emploi du temps
   * @param {string} id - L'ID du cours
   * @returns {Promise<Object>} Confirmation de suppression
   */
  deleteSchedule: async (id) => {
    return ApiService.fetchApi(`/timetable/schedule/${id}`, 'DELETE');
  }
};

export default ApiService;