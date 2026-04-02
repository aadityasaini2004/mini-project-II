import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('jwtToken');
    
    // Agar token nahi hai, toh seedha login pe bhejo (replace lagane se back button disable ho jata hai)
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    
    // Agar token hai, toh component dikhao
    return children;
};

export default ProtectedRoute;