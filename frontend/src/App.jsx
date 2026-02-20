import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import CRDashboard from './pages/CRDashboard'; 
import AdminDashboard from './pages/AdminDashboard';
import SubAdminDashboard from './pages/SubAdminDashboard';
import DeptAdminDasboard from './pages/DeptAdminDasboard';
import HeadDashboard from './pages/HeadDashboard';
import StaffDashboard from './pages/StaffDashboard';

const GenericDashboard = () => (
    <div style={{padding: '20px'}}>
        <h2>Welcome! 🎓</h2>
        <p>This is a default dashboard. Role matching issue or dashboard under construction.</p>
    </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        
        {/* Saare Respected Dashboards yahan register ho gaye */}
        <Route path="/cr-dashboard" element={<CRDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/subadmin-dashboard" element={<SubAdminDashboard />} />
        <Route path="/dept-admin-dashboard" element={<DeptAdminDasboard />} />
        <Route path="/head-dashboard" element={<HeadDashboard />} />
        <Route path="/staff-dashboard" element={<StaffDashboard />} />
        
        <Route path="/dashboard" element={<GenericDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;