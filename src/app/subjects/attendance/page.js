"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function SubjectAttendancePage() {
    const router = useRouter();
    const params = useParams();
    const subjectId = params.id;

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [subject, setSubject] = useState(null);
    const [attendanceData, setAttendanceData] = useState([]);
    const [students, setStudents] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [error, setError] = useState('');

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
                loadSubject();
                loadAttendanceData();
            } catch (error) {
                console.error('Erreur lors de la récupération des données utilisateur:', error);
                router.push('/auth/login');
                return;
            }
        }
    }, [router, subjectId]);

    const loadSubject = async () => {
        try {
            // TODO: Remplacer par un vrai appel API
            // const response = await fetch(`http://agence-voyage.ddns.net:9026/api/subjects/${subjectId}`, {
            //   headers: {
            //     'Authorization': `Bearer ${localStorage.getItem('token')}`,
            //     'Content-Type': 'application/json'
            //   }
            // });

            // Simulation temporaire
            const mockSubject = {
                id: parseInt(subjectId),
                libelle: 'Programmation Web',
                code: 'INFO301',
                credits: 4,
                heuresParSemaine: 6,
                departement: { nom: 'Informatique' },
                enseignant: { nom: 'Dr. Amadou Diallo' }
            };

            setSubject(mockSubject);
        } catch (error) {
            console.error('Erreur lors du chargement de la matière:', error);
            setError('Impossible de charger les informations de la matière.');
        }
    };

    const loadAttendanceData = async () => {
        setLoading(true);
        setError('');

        try {
            // TODO: Remplacer par un vrai appel API
            // const response = await fetch(`http://agence-voyage.ddns.net:9026/api/subjects/${subjectId}/attendance?month=${selectedMonth}&year=${selectedYear}`, {
            //   headers: {
            //     'Authorization': `Bearer ${localStorage.getItem('token')}`,
            //     'Content-Type': 'application/json'
            //   }
            // });

            // Simulation temporaire
            setTimeout(() => {
                const mockStudents = [
                    { id: 1, matricule: "INF001", nom: "Diallo Mamadou", email: "diallo.m@studam.edu" },
                    { id: 2, matricule: "INF002", nom: "Fall Aissatou", email: "fall.a@studam.edu" },
                    { id: 3, matricule: "INF003", nom: "Sow Abdoulaye", email: "sow.a@studam.edu" },
                    { id: 4, matricule: "INF004", nom: "Diop Fatou", email: "diop.f@studam.edu" },
                    { id: 5, matricule: "INF005", nom: "Kane Ousmane", email: "kane.o@studam.edu" }
                ];

                const mockAttendance = [
                    {
                        date: '2025-01-15',
                        students: [
                            { studentId: 1, status: 'present' },
                            { studentId: 2, status: 'present' },
                            { studentId: 3, status: 'absent' },
                            { studentId: 4, status: 'present' },
                            { studentId: 5, status: 'retard' }
                        ]
                    },
                    {
                        date: '2025-01-17',
                        students: [
                            { studentId: 1, status: 'present' },
                            { studentId: 2, status: 'retard' },
                            { studentId: 3, status: 'present' },
                            { studentId: 4, status: 'absent' },
                            { studentId: 5, status: 'present' }
                        ]
                    },
                    {
                        date: '2025-01-22',
                        students: [
                            { studentId: 1, status: 'present' },
                            { studentId: 2, status: 'present' },
                            { studentId: 3, status: 'present' },
                            { studentId: 4, status: 'present' },
                            { studentId: 5, status: 'absent' }
                        ]
                    }
                ];

                setStudents(mockStudents);
                setAttendanceData(mockAttendance);
                setLoading(false);
            }, 500);

        } catch (error) {
            console.error('Erreur lors du chargement des présences:', error);
            setError('Impossible de charger les données de présence.');
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user && subjectId) {
            loadAttendanceData();
        }
    }, [selectedMonth, selectedYear]);

    const getAttendanceStats = () => {
        const totalSessions = attendanceData.length;
        const totalStudents = students.length;

        if (totalSessions === 0 || totalStudents === 0) {
            return { presentRate: 0, absentRate: 0, lateRate: 0 };
        }

        const totalRecords = totalSessions * totalStudents;
        let presentCount = 0;
        let absentCount = 0;
        let lateCount = 0;

        attendanceData.forEach(session => {
            session.students.forEach(record => {
                switch (record.status) {
                    case 'present':
                        presentCount++;
                        break;
                    case 'absent':
                        absentCount++;
                        break;
                    case 'retard':
                        lateCount++;
                        break;
                }
            });
        });

        return {
            presentRate: Math.round((presentCount / totalRecords) * 100),
            absentRate: Math.round((absentCount / totalRecords) * 100),
            lateRate: Math.round((lateCount / totalRecords) * 100)
        };
    };

    const getStudentAttendanceRate = (studentId) => {
        if (attendanceData.length === 0) return 0;

        let presentCount = 0;
        attendanceData.forEach(session => {
            const record = session.students.find(s => s.studentId === studentId);
            if (record && record.status === 'present') {
                presentCount++;
            }
        });

        return Math.round((presentCount / attendanceData.length) * 100);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'present':
                return 'bg-green-100 text-green-800';
            case 'absent':
                return 'bg-red-100 text-red-800';
            case 'retard':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'present':
                return 'Présent';
            case 'absent':
                return 'Absent';
            case 'retard':
                return 'Retard';
            default:
                return '-';
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const stats = getAttendanceStats();

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F26419]"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!subject) {
        return (
            <div className="min-h-screen bg-gray-100 py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-900">Matière non trouvée</h2>
                        <p className="mt-2 text-gray-600">La matière demandée n&apos; existe pas.</p>
                        <Link
                            href="/subjects"
                            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#F26419] hover:bg-opacity-90"
                        >
                            Retour aux matières
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center">
                                <Link
                                    href="/subjects"
                                    className="text-gray-400 hover:text-gray-600 mr-2"
                                >
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                                    </svg>
                                </Link>
                                <h1 className="text-3xl font-bold text-[#1B396A]">
                                    Présences - {subject.libelle}
                                </h1>
                            </div>
                            <p className="mt-2 text-gray-600">
                                {subject.code} • {subject.departement.nom} • {subject.enseignant.nom}
                            </p>
                        </div>
                        <Link
                            href={`/presence?subject=${subjectId}`}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#F26419] hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F26419]"
                        >
                            <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                            </svg>
                            Prendre les présences
                        </Link>
                    </div>
                </div>

                {/* Filtres */}
                <div className="mb-6 bg-white p-4 rounded-lg shadow">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <label htmlFor="month" className="block text-sm font-medium text-gray-700 mb-2">
                                Mois
                            </label>
                            <select
                                id="month"
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#F26419] focus:border-[#F26419]"
                            >
                                {[
                                    { value: 1, label: 'Janvier' },
                                    { value: 2, label: 'Février' },
                                    { value: 3, label: 'Mars' },
                                    { value: 4, label: 'Avril' },
                                    { value: 5, label: 'Mai' },
                                    { value: 6, label: 'Juin' },
                                    { value: 7, label: 'Juillet' },
                                    { value: 8, label: 'Août' },
                                    { value: 9, label: 'Septembre' },
                                    { value: 10, label: 'Octobre' },
                                    { value: 11, label: 'Novembre' },
                                    { value: 12, label: 'Décembre' }
                                ].map((month) => (
                                    <option key={month.value} value={month.value}>{month.label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex-1">
                            <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
                                Année
                            </label>
                            <select
                                id="year"
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#F26419] focus:border-[#F26419]"
                            >
                                <option value={2024}>2024</option>
                                <option value={2025}>2025</option>
                                <option value={2026}>2026</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Statistiques */}
                <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                    </svg>
                                </div>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Sessions</p>
                                <p className="text-2xl font-semibold text-gray-900">{attendanceData.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                    </svg>
                                </div>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Présents</p>
                                <p className="text-2xl font-semibold text-gray-900">{stats.presentRate}%</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                                    </svg>
                                </div>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Absents</p>
                                <p className="text-2xl font-semibold text-gray-900">{stats.absentRate}%</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-5 h-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                    </svg>
                                </div>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Retards</p>
                                <p className="text-2xl font-semibold text-gray-900">{stats.lateRate}%</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Message d'erreur */}
                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
                        <div className="flex">
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                            </svg>
                            <div className="ml-3">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tableau des présences */}
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-[#1B396A]">
                            Détail des présences
                        </h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                            Suivi des présences par étudiant et par session
                        </p>
                    </div>

                    {attendanceData.length === 0 ? (
                        <div className="px-4 py-6 sm:px-6">
                            <div className="text-center">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                </svg>
                                <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune donnée</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Aucune session de présence n&apos; a été enregistrée pour cette période.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Étudiant
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Taux de présence
                                    </th>
                                    {attendanceData.map((session) => (
                                        <th key={session.date} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            {new Date(session.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}
                                        </th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                {students.map((student) => (
                                    <tr key={student.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {student.nom}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {student.matricule}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                                                    <div
                                                        className="bg-[#F26419] h-2 rounded-full"
                                                        style={{ width: `${getStudentAttendanceRate(student.id)}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-sm font-medium text-gray-900">
                            {getStudentAttendanceRate(student.id)}%
                          </span>
                                            </div>
                                        </td>
                                        {attendanceData.map((session) => {
                                            const record = session.students.find(s => s.studentId === student.id);
                                            const status = record ? record.status : 'absent';
                                            return (
                                                <td key={session.date} className="px-6 py-4 whitespace-nowrap text-center">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(status)}`}>
                              {getStatusText(status)}
                            </span>
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}