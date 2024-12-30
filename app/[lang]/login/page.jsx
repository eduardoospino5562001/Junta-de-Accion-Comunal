"use client";

import LogInForm from "./login-form";
import { UserCircle } from 'lucide-react';

const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <UserCircle className="w-24 h-24 text-blue-600 mb-6" />
          <h2 className="text-3xl font-bold text-center text-gray-800">Bienvenido</h2>
          <p className="text-center text-gray-600 mt-2">Inicia sesión para acceder a tu cuenta</p>
        </div>
        <LogInForm />
      </div>
    </div>
  );
};

export default LoginPage;

