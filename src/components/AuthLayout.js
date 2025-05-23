import React from 'react';
// Removed AuthApiCheck import

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Panel de Administración
        </h2>
        {/* Removed AuthApiCheck component */}
      </div>
      {children}
    </div>
  );
};

export default AuthLayout;

// DONE