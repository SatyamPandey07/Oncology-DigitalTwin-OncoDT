import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import LoginPage from './pages/LoginPage';
import DoctorLayout from './pages/doctor/DoctorLayout';
import PatientListPage from './pages/doctor/PatientListPage';
import PatientDetailPage from './pages/doctor/PatientDetailPage';
import SimulationPage from './pages/doctor/SimulationPage';
import ResultsPage from './pages/doctor/ResultsPage';

import PatientLayout from './pages/patient/PatientLayout';
import MyProfilePage from './pages/patient/MyProfilePage';
import VitalsPage from './pages/patient/VitalsPage';
import TreatmentTimelinePage from './pages/patient/TreatmentTimelinePage';
import MySimulationsPage from './pages/patient/MySimulationsPage';

// Route Guards
function RequireDoctor({ children }) {
  const { user, role } = useAuth();
  if (!user || role !== 'doctor') {
    return <Navigate to="/" replace />;
  }
  return children;
}

function RequirePatient({ children }) {
  const { user, role } = useAuth();
  if (!user || role !== 'patient') {
    return <Navigate to="/" replace />;
  }
  return children;
}

function LoginGuard({ children }) {
  const { user, role } = useAuth();
  if (user) {
    if (role === 'doctor') return <Navigate to="/doctor/patients" replace />;
    if (role === 'patient') return <Navigate to="/patient/profile" replace />;
  }
  return children;
}

export default function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <Routes>
          {/* Public Login Route */}
          <Route 
            path="/" 
            element={
              <LoginGuard>
                <LoginPage />
              </LoginGuard>
            } 
          />

          {/* Clinician Portal Routes */}
          <Route
            path="/doctor"
            element={
              <RequireDoctor>
                <DoctorLayout />
              </RequireDoctor>
            }
          >
            <Route path="patients" element={<PatientListPage />} />
            <Route path="patient/:id" element={<PatientDetailPage />} />
            <Route path="patient/:id/simulate" element={<SimulationPage />} />
            <Route path="patient/:id/results" element={<ResultsPage />} />
            {/* Contextual redirect */}
            <Route path="*" element={<Navigate to="patients" replace />} />
          </Route>

          {/* Patient Portal Routes */}
          <Route
            path="/patient"
            element={
              <RequirePatient>
                <PatientLayout />
              </RequirePatient>
            }
          >
            <Route path="profile" element={<MyProfilePage />} />
            <Route path="vitals" element={<VitalsPage />} />
            <Route path="treatments" element={<TreatmentTimelinePage />} />
            <Route path="simulations" element={<MySimulationsPage />} />
            <Route path="*" element={<Navigate to="profile" replace />} />
          </Route>

          {/* Catch-all redirect to login */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </HashRouter>
  );
}
