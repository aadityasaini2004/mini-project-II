import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api'; // Tera jadu wala axios file

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/api/auth/login', { email, password });
            
            // 🔥 CHECK KARTE HAIN BACKEND NE KYA BHEJA:
            console.log("Backend Response:", response.data);

            // Agar backend object bhej raha hai ya sirf token (string) bhej raha hai
            const token = response.data.token || response.data; 
            
            // Agar role nahi aaya, toh app crash na ho isliye ek default value daal di
            const rawRole = response.data.role || "ROLE_UNKNOWN"; 

            localStorage.setItem('jwtToken', token);
            localStorage.setItem('userRole', rawRole);

            // Ab undefined pe replace nahi chalega, toh crash nahi hoga
            const role = rawRole.replace('ROLE_', '').toUpperCase();

            if (role === 'ADMIN') {
                navigate('/admin-dashboard');
            } else if (role === 'SUB_ADMIN') {
                navigate('/subadmin-dashboard');
            } else if (role === 'DEPT_ADMIN' || role === 'DEPT_HEAD') {
                navigate('/head-dashboard');
            } else if (role === 'STAFF') {
                navigate('/staff-dashboard');
            } else if (role === 'CR' || role === 'STUDENT') {
                navigate('/cr-dashboard');
            } else {
                navigate('/dashboard'); // Generic/Default dashboard
            }

        } catch (error) {
            console.error("Login Error:", error);
            alert("Login Failed! Please check your credentials.");
        }
    };

    return (
        <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'Arial' }}>
            <div style={{ maxWidth: '400px', margin: '0 auto', padding: '30px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', borderRadius: '10px', background: '#fff' }}>
                <h2>College Help Desk 🎓</h2>
                <p style={{ color: 'gray', marginBottom: '20px' }}>Sign in to continue</p>
                <form onSubmit={handleLogin}>
                    <input 
                        type="email" 
                        placeholder="Email Address" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                        style={{ display: 'block', width: '100%', padding: '10px', margin: '10px 0', boxSizing: 'border-box' }}
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                        style={{ display: 'block', width: '100%', padding: '10px', margin: '10px 0', boxSizing: 'border-box' }}
                    />
                    <button type="submit" style={{ width: '100%', padding: '10px', background: '#007BFF', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '10px' }}>
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;