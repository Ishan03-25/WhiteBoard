import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login';
import Profile from './pages/profile';
import CanvasView from './pages/CanvasView';
import RegistrationSuccess from './pages/registration';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/canvas/:id" element={<CanvasView />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/register-success" element={<RegistrationSuccess />} />
      </Routes>
    </Router>
  );
};

export default App;
