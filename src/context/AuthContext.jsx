import React, { createContext, useContext, useState, useEffect } from 'react';
import { authenticateDoctor } from '../data/mockDoctors';
import { getPatientById } from '../data/mockPatients';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('onco_user');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [role, setRole] = useState(() => {
    return localStorage.getItem('onco_role') || null;
  });

  const loginDoctor = (username, password) => {
    const doctor = authenticateDoctor(username, password);
    if (doctor) {
      const userData = {
        id: doctor.id,
        name: doctor.name,
        username: doctor.username,
        specialty: doctor.specialty,
        hospital: doctor.hospital,
        avatar: doctor.avatar,
        email: doctor.email
      };
      setUser(userData);
      setRole('doctor');
      localStorage.setItem('onco_user', JSON.stringify(userData));
      localStorage.setItem('onco_role', 'doctor');
      return { success: true };
    }
    return { success: false, error: 'Invalid username or password' };
  };

  const loginPatient = (patientId, dob) => {
    const patient = getPatientById(patientId);
    if (patient) {
      // Check DOB (simple string compare)
      if (patient.dob === dob) {
        const userData = {
          id: patient.id,
          name: patient.name,
          dob: patient.dob,
          cancerType: patient.cancerType,
          stage: patient.stage
        };
        setUser(userData);
        setRole('patient');
        localStorage.setItem('onco_user', JSON.stringify(userData));
        localStorage.setItem('onco_role', 'patient');
        return { success: true };
      } else {
        return { success: false, error: 'Date of birth does not match record' };
      }
    }
    return { success: false, error: 'Patient ID not found' };
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    localStorage.removeItem('onco_user');
    localStorage.removeItem('onco_role');
  };

  return (
    <AuthContext.Provider value={{ user, role, loginDoctor, loginPatient, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
