import React, { useState, useEffect } from 'react'; // 🔥 useEffect import kiya hai
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api'; // Tera jadu wala axios file

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    // 🔥 NAYA ADD KIYA: Agar pehle se logged in hai, toh wapas login page pe mat aane do
    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        const rawRole = localStorage.getItem('userRole');

        if (token && rawRole) {
            const role = rawRole.replace('ROLE_', '').toUpperCase();
            if (role === 'ADMIN') navigate('/admin-dashboard', { replace: true });
            else if (role === 'SUB_ADMIN') navigate('/subadmin-dashboard', { replace: true });
            else if (role === 'DEPARTMENT_ADMIN' || role === 'DEPT_ADMIN') navigate('/dept-admin-dashboard', { replace: true });
            else if (role === 'STAFF') navigate('/staff-dashboard', { replace: true });
            else if (role === 'CR' || role === 'STUDENT') navigate('/cr-dashboard', { replace: true });
            else if (role === 'DEPARTMENT_HEAD' || role === 'DEPT_HEAD') navigate('/head-dashboard', { replace: true });
            else navigate('/dashboard', { replace: true });
        }
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/api/auth/login', { email, password });
            
            console.log("Backend Response:", response.data);

            const token = response.data.token || response.data; 
            const rawRole = response.data.role || "ROLE_UNKNOWN"; 

            localStorage.setItem('jwtToken', token);
            localStorage.setItem('userRole', rawRole);

            const role = rawRole.replace('ROLE_', '').toUpperCase();

            // 🔥 YAHAN BHI UPDATE KIYA: { replace: true } lagaya taaki history replace ho jaye
            if (role === 'ADMIN') {
                navigate('/admin-dashboard', { replace: true });
            } else if (role === 'SUB_ADMIN') {
                navigate('/subadmin-dashboard', { replace: true });
            } else if (role === 'DEPARTMENT_ADMIN' || role === 'DEPT_ADMIN') {
                navigate('/dept-admin-dashboard', { replace: true });
            } else if (role === 'STAFF') {
                navigate('/staff-dashboard', { replace: true });
            } else if (role === 'CR' || role === 'STUDENT') {
                navigate('/cr-dashboard', { replace: true });
            } else if (role === 'DEPARTMENT_HEAD' || role === 'DEPT_HEAD') {
                navigate('/head-dashboard', { replace: true });
            } else {
                navigate('/dashboard', { replace: true }); 
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

                <div style={{ marginTop: '20px', fontSize: '14px' }}>
                    New CR? <Link to="/register" style={{ color: '#007bff', textDecoration: 'none' }}>Register Here</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;