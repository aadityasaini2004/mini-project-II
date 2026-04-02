import React, { useState } from 'react';
import api from '../utils/api';

const AdminDashboard = () => {
    // Sub-Admin create karne ke liye states
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleCreateSubAdmin = async (e) => {
        e.preventDefault();
        try {
            // Tere backend API ko hit karega aur Token automatically jayega
            const response = await api.post('/api/admin/create-sub-admin', {
                name: name,
                email: email,
                password: password
            });
            
            // Backend se aane wala success message dikhayenge
            alert(response.data); 
            
            // Form clear kar do
            setName('');
            setEmail('');
            setPassword('');
        } catch (error) {
            console.error("Error creating Sub-Admin:", error);
            // Agar backend se error aaye (jaise 403 Forbidden ya 500)
            if (error.response && error.response.status === 403) {
                alert("Access Denied! Sirf asli Admin ye kar sakta hai.");
            } else {
                alert("Failed to create Sub-Admin! Email already exists ya koi aur issue hai.");
            }
        }
    };

    return (
        <div style={{ padding: '40px', fontFamily: 'Arial', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h2>👑 Super Admin Dashboard</h2>
                <span style={{ backgroundColor: '#28a745', color: 'white', padding: '8px 15px', borderRadius: '20px', fontWeight: 'bold' }}>
                    System Controller
                </span>
            </div>
            <hr />

            <div style={{ 
                maxWidth: '500px', 
                background: '#fff', 
                padding: '30px', 
                borderRadius: '10px', 
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)', 
                marginTop: '30px' 
            }}>
                <h3 style={{ color: '#333', marginBottom: '20px' }}>Create New Sub-Admin</h3>
                <form onSubmit={handleCreateSubAdmin}>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Full Name</label>
                        <input 
                            type="text" 
                            placeholder="e.g., Ramesh Sharma" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            required 
                            style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '5px', border: '1px solid #ccc' }}
                        />
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Email Address</label>
                        <input 
                            type="email" 
                            placeholder="subadmin@college.edu.in" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                            style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '5px', border: '1px solid #ccc' }}
                        />
                    </div>

                    <div style={{ marginBottom: '25px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Password</label>
                        <input 
                            type="password" 
                            placeholder="Create a strong password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                            style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '5px', border: '1px solid #ccc' }}
                        />
                    </div>

                    <button 
                        type="submit" 
                        style={{ 
                            width: '100%', 
                            padding: '12px', 
                            background: '#007BFF', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '5px', 
                            cursor: 'pointer', 
                            fontWeight: 'bold',
                            fontSize: '16px'
                        }}
                    >
                        Register Sub-Admin
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminDashboard;