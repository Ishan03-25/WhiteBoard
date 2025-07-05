import React from 'react';
import { useNavigate } from 'react-router-dom';

const RegistrationSuccess = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/');
  };
//comment test
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="max-w-md w-full space-y-6 p-8 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold text-green-600">Registration Successful!</h1>
        <p className="text-gray-700">Your account has been created. You can now sign in.</p>
        <button
          onClick={handleGoBack}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Go back and sign in
        </button>
      </div>
    </div>
  );
};

export default RegistrationSuccess;
