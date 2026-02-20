import React, { useState } from 'react'
import api from '../utils/api';

const DeptAdminDasboard = () => {
// Department Head create karne ke states
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleCreateDeptHead = async (e) => {
        e.preventDefault();
        try {
            // Backend ko request bhej rahe hain
            // DepartmentId aur Role backend khud set karega security ke liye
            const response = await api.post('/api/deptadmin/create-dept-head', {
                name: name,
                email: email,
                password: password
            });
            
            alert(response.data); // Success message from backend
            
            // Form clear karo
            setName('');
            setEmail('');
            setPassword('');
        } catch (error) {
            console.error("Error creating Dept Head:", error);
            if (error.response && error.response.status === 403) {
                alert("Access Denied! Only a Department Admin can do this.");
            } else {
                alert(error.response?.data || "Failed to create Department Head! Check details.");
            }
        }
    };

    return (
        <div style={{ padding: '40px', fontFamily: 'Arial', backgroundColor: '#eef2f3', minHeight: '100vh' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h2>🏢 Department Admin Dashboard</h2>
                <span style={{ backgroundColor: '#17a2b8', color: 'white', padding: '8px 15px', borderRadius: '20px', fontWeight: 'bold' }}>
                    Dept. Controller
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
                <h3 style={{ color: '#333', marginBottom: '20px' }}>👨‍💼 Add Department Head / Staff</h3>
                <p style={{ color: 'gray', fontSize: '14px', marginBottom: '20px' }}>
                    Yeh user automatically aapke department se link ho jayega.
                </p>

                <form onSubmit={handleCreateDeptHead}>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Full Name</label>
                        <input 
                            type="text" 
                            placeholder="e.g., Amit Verma" 
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
                            placeholder="amit.head@college.edu.in" 
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
                            background: '#17a2b8', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '5px', 
                            cursor: 'pointer', 
                            fontWeight: 'bold',
                            fontSize: '16px'
                        }}
                    >
                        Register Dept Head
                    </button>
                </form>
            </div>
        </div>
    );
};

export default DeptAdminDasboard