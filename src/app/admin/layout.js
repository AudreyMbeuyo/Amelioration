"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import authService from '../../services/AuthService';

export default function AdminLayout({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const userStr = localStorage.getItem('user');
            if (!userStr) {
                router.push('/auth/login');
                return;
            }

            try {
                const currentUser = JSON.parse(userStr);

                // Vérifier que l'utilisateur a les droits admin
                if (!['admin', 'super_admin', 'ADMIN'].includes(currentUser.role)) {
                    router.push('/dashboard');
                    return;
                }

                setUser(currentUser);
            } catch (error) {
                console.error('Erreur parsing utilisateur:', error);
                router.push('/auth/login');
                return;
            } finally {
                setLoading(false);
            }
        }
    }, [router]);

    const handleLogout = async () => {
        try {
            await authService.logout();
            router.push('/');
        } catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
        }
    };

    const sidebarItems = [
        {
            name: 'Dashboard',
            href: '/admin/dashboard',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v0a2 2 0 01-2 2H10a2 2 0 01-2-2v0z"/>
                </svg>
            )
        },
        {
            name: 'Départements',
            href: '/admin/departments',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                </svg>
            )
        },
        {
            name: 'Utilisateurs',
            href: '/admin/users',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m0 0v1M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
                </svg>
            ),
            subItems: [
                { name: 'Tous les utilisateurs', href: '/admin/users' },
                { name: 'Chefs de département', href: '/admin/users/chiefs' },
                { name: 'Enseignants', href: '/admin/users/teachers' },
                { name: 'Créer utilisateur', href: '/admin/users/create' }
            ]
        },
        {
            name: 'Système',
            href: '/admin/system',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
            ),
            subItems: [
                { name: 'Paramètres', href: '/admin/system' },
                { name: 'Sécurité', href: '/admin/system/security' },
                { name: 'Sauvegardes', href: '/admin/system/backup' },
                { name: 'Logs', href: '/admin/system/logs' }
            ]
        },
        {
            name: 'Rapports',
            href: '/admin/reports',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
            ),
            subItems: [
                { name: 'Vue d\'ensemble', href: '/admin/reports' },
                { name: 'Présences', href: '/admin/reports/attendance' },
                { name: 'Départements', href: '/admin/reports/departments' },
                { name: 'Utilisateurs', href: '/admin/reports/users' }
            ]
        }
    ];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F26419] mx-auto"></div>
                    <p className="mt-4 text-gray-600">Chargement de l&apos; interface admin...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Admin */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo et toggle sidebar */}
                        <div className="flex items-center">
                            <button
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#F26419] lg:hidden"
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
                                </svg>
                            </button>
                            <div className="flex items-center ml-2 lg:ml-0">
                                <h1 className="text-xl font-bold text-[#1B396A]">STUDAM Admin</h1>
                                <span className="ml-2 px-2 py-1 text-xs font-medium bg-[#F26419] text-white rounded-full">
                  Super Admin
                </span>
                            </div>
                        </div>

                        {/* User menu */}
                        <div className="flex items-center space-x-4">
                            <div className="text-sm text-gray-700">
                                <span className="font-medium">{user.name || user.nom}</span>
                                <span className="text-gray-500 ml-2">({user.role})</span>
                            </div>
                            <div className="relative">
                                <button className="flex items-center space-x-2 text-gray-700 hover:text-[#F26419] transition-colors">
                                    <div className="w-8 h-8 bg-gradient-to-br from-[#F26419] to-[#FF7A47] rounded-full flex items-center justify-center text-white text-sm font-medium">
                                        {(user.name || user.nom)?.charAt(0)?.toUpperCase() || 'A'}
                                    </div>
                                </button>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                                Déconnexion
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex">
                {/* Sidebar */}
                <div className={`${isSidebarOpen ? 'w-64' : 'w-16'} bg-white shadow-sm h-screen transition-all duration-300 ease-in-out flex-shrink-0`}>
                    <nav className="mt-5 px-2">
                        <div className="space-y-1">
                            {sidebarItems.map((item) => {
                                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                                const hasSubItems = item.subItems && item.subItems.length > 0;
                                const isExpanded = isActive && hasSubItems;

                                return (
                                    <div key={item.name}>
                                        <Link
                                            href={item.href}
                                            className={`${
                                                isActive
                                                    ? 'bg-[#F26419] text-white'
                                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                            } group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors`}
                                        >
                                            <div className="mr-3 flex-shrink-0">
                                                {item.icon}
                                            </div>
                                            {isSidebarOpen && (
                                                <>
                                                    {item.name}
                                                    {hasSubItems && (
                                                        <svg className={`ml-auto h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                                                        </svg>
                                                    )}
                                                </>
                                            )}
                                        </Link>

                                        {/* Sous-items */}
                                        {hasSubItems && isSidebarOpen && isExpanded && (
                                            <div className="mt-1 ml-8 space-y-1">
                                                {item.subItems.map((subItem) => {
                                                    const isSubActive = pathname === subItem.href;
                                                    return (
                                                        <Link
                                                            key={subItem.name}
                                                            href={subItem.href}
                                                            className={`${
                                                                isSubActive
                                                                    ? 'bg-orange-100 text-[#F26419] font-medium'
                                                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                                            } group flex items-center px-2 py-2 text-sm rounded-md transition-colors`}
                                                        >
                                                            {subItem.name}
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </nav>
                </div>

                {/* Main content */}
                <div className="flex-1 overflow-auto">
                    <main className="flex-1">
                        <div className="py-6">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                {children}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}