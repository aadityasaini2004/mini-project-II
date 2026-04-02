import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import CRDashboard from './pages/CRDashboard'; 
import AdminDashboard from './pages/AdminDashboard';
import SubAdminDashboard from './pages/SubAdminDashboard';
import DeptAdminDasboard from './pages/DeptAdminDasboard';
import HeadDashboard from './pages/HeadDashboard';
import StaffDashboard from './pages/StaffDashboard';
import RegisterCR from './pages/RegisterCR';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

const GenericDashboard = () => (
    <div style={{padding: '20px'}}>
        <h2>Welcome! 🎓</h2>
        <p>This is a default dashboard. Role matching issue or dashboard under construction.</p>
    </div>
);

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/register" element={<RegisterCR />} />
        <Route path="/login" element={<Login />} />
        
        {/* Saare Respected Dashboards yahan register ho gaye */}
       <Route path="/cr-dashboard" element={<ProtectedRoute><CRDashboard /></ProtectedRoute>} />
        <Route path="/admin-dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/subadmin-dashboard" element={<ProtectedRoute><SubAdminDashboard /></ProtectedRoute>} />
        <Route path="/dept-admin-dashboard" element={<ProtectedRoute><DeptAdminDasboard /></ProtectedRoute>} />
        <Route path="/head-dashboard" element={<ProtectedRoute><HeadDashboard /></ProtectedRoute>} />
        <Route path="/staff-dashboard" element={<ProtectedRoute><StaffDashboard /></ProtectedRoute>} />
        
        <Route path="/dashboard" element={<GenericDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;