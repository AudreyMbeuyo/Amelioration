@extends('layouts.app')

@section('content')
<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 transform hover:scale-[1.01] transition-transform duration-300">
        <div class="bg-white shadow-2xl rounded-2xl p-8 animate-fadeIn">
            <div class="text-center">
                <!-- Logo ou icône d'application -->
                <div class="mx-auto w-16 h-16 bg-orange/10 rounded-full flex items-center justify-center mb-4 animate-bounce-gentle">
                    <svg class="w-8 h-8 text-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                    </svg>
                </div>
                <h2 class="text-3xl font-extrabold text-navy mb-2 animate-slideDown">
                    Bienvenue
                </h2>
                <p class="text-gray-500 text-sm animate-slideDown">Connectez-vous à votre compte</p>
            </div>

            <form class="mt-8 space-y-6" action="{{ route('login') }}" method="POST">
                @csrf
                <div class="space-y-4">
                    <div class="group">
                        <label for="email" class="block text-sm font-medium text-gray-700 mb-1 transition-opacity group-focus-within:text-orange">
                            Adresse email
                        </label>
                        <div class="relative rounded-md shadow-sm">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg class="h-5 w-5 text-gray-400 group-focus-within:text-orange transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                </svg>
                            </div>
                            <input id="email" name="email" type="email" required 
                                class="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange focus:border-transparent transition-all sm:text-sm"
                                placeholder="nom@exemple.com">
                        </div>
                    </div>

                    <div class="group">
                        <label for="password" class="block text-sm font-medium text-gray-700 mb-1 transition-opacity group-focus-within:text-orange">
                            Mot de passe
                        </label>
                        <div class="relative rounded-md shadow-sm">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg class="h-5 w-5 text-gray-400 group-focus-within:text-orange transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <input id="password" name="password" type="password" required 
                                class="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange focus:border-transparent transition-all sm:text-sm"
                                placeholder="••••••••">
                        </div>
                    </div>
                </div>

                @if ($errors->any())
                    <div class="animate-shake bg-red-50 text-red-500 text-sm p-3 rounded-lg border border-red-200">
                        @foreach ($errors->all() as $error)
                            <p class="flex items-center">
                                <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                                </svg>
                                {{ $error }}
                            </p>
                        @endforeach
                    </div>
                @endif

                <div>
                    <button type="submit" class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-orange hover:bg-orange-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange transition-all duration-150 ease-in-out transform hover:scale-[1.02] active:scale-[0.98]">
                        <span class="absolute left-0 inset-y-0 flex items-center pl-3 pointer-events-none">
                            <svg class="h-5 w-5 text-orange-light group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                            </svg>
                        </span>
                        Se connecter
                    </button>
                </div>
            </form>

            <div class="mt-6 text-center">
                <p class="text-sm text-gray-600">
                    Pas encore de compte? 
                    <a href="{{ route('register') }}" class="font-medium text-orange hover:text-orange-dark transition-colors hover:underline">
                        S'inscrire
                    </a>
                </p>
            </div>
        </div>
    </div>
</div>

<style>
@keyframes fadeIn {
    0% { opacity: 0; }
    100% { opacity: 1; }
}

@keyframes slideDown {
    0% { 
        transform: translateY(-10px);
        opacity: 0;
    }
    100% { 
        transform: translateY(0);
        opacity: 1;
    }
}

@keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
}

@keyframes bounceGentle {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
}

.animate-fadeIn {
    animation: fadeIn 0.5s ease-out;
}

.animate-slideDown {
    animation: slideDown 0.5s ease-out;
}

.animate-shake {
    animation: shake 0.5s ease-in-out;
}

.animate-bounce-gentle {
    animation: bounceGentle 2s infinite;
}
</style>
@endsection
Last edited just now