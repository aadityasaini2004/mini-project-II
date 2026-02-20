import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import CRDashboard from './pages/CRDashboard'; 

// Baaki roles ke liye abhi dummy (placeholder) dashboards bana diye hain
const AdminDashboard = () => <h2 style={{padding: '20px', color: 'purple'}}>Welcome Boss (Admin) Dashboard! 👑</h2>;
const SubAdminDashboard = () => <h2 style={{padding: '20px', color: 'blue'}}>Welcome Sub-Admin Dashboard! 🛡️</h2>;
const HeadDashboard = () => <h2 style={{padding: '20px', color: 'green'}}>Welcome Department Head Dashboard! 🏢</h2>;
const StaffDashboard = () => <h2 style={{padding: '20px', color: 'orange'}}>Welcome Staff Dashboard! 🛠️</h2>;

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
        <Route path="/head-dashboard" element={<HeadDashboard />} />
        <Route path="/staff-dashboard" element={<StaffDashboard />} />
        
        <Route path="/dashboard" element={<GenericDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;