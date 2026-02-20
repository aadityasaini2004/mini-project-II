import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api'; // Tera axios instance

const RegisterCR = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [universityId, setUniversityId] = useState(''); // Roll No. ke liye
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            // Backend ke register API ko hit karna (No token required here)
            const response = await api.post('/api/auth/register-cr', {
                name: name,
                email: email,
                password: password,
                universityId: universityId
            });

            // Success message dikhana (e.g., "Wait for approval")
            alert(response.data);
            
            // Register hone ke baad wapas Login page par bhej do
            navigate('/login');
        } catch (error) {
            console.error("Registration Error:", error);
            alert("Registration Failed! Email might already exist.");
        }
    };

    return (
        <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'Arial', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
            <div style={{ maxWidth: '400px', margin: '0 auto', padding: '30px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', borderRadius: '10px', background: '#fff' }}>
                <h2>📝 CR Registration</h2>
                <p style={{ color: 'gray', marginBottom: '20px', fontSize: '14px' }}>
                    Register as a Class Representative. Your account will need admin approval before you can log in.
                </p>
                <form onSubmit={handleRegister}>
                    <input 
                        type="text" 
                        placeholder="Full Name" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        required 
                        style={{ display: 'block', width: '100%', padding: '10px', margin: '10px 0', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                    <input 
                        type="text" 
                        placeholder="University ID / Roll No (e.g., CR-101)" 
                        value={universityId} 
                        onChange={(e) => setUniversityId(e.target.value)} 
                        required 
                        style={{ display: 'block', width: '100%', padding: '10px', margin: '10px 0', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                    <input 
                        type="email" 
                        placeholder="College Email Address" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                        style={{ display: 'block', width: '100%', padding: '10px', margin: '10px 0', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                    <input 
                        type="password" 
                        placeholder="Create a Password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                        style={{ display: 'block', width: '100%', padding: '10px', margin: '10px 0', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                    <button type="submit" style={{ width: '100%', padding: '10px', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '10px', fontWeight: 'bold' }}>
                        Register Request
                    </button>
                </form>
                
                <div style={{ marginTop: '20px', fontSize: '14px' }}>
                    Already registered? <Link to="/login" style={{ color: '#007bff', textDecoration: 'none' }}>Log in here</Link>
                </div>
            </div>
        </div>
    );
};

export default RegisterCR;