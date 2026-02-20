import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const SubAdminDashboard = () => {
    // 1. Department Create State
    const [deptName, setDeptName] = useState('');

    // 2. Department Admin Create States
    const [daName, setDaName] = useState('');
    const [daEmail, setDaEmail] = useState('');
    const [daPassword, setDaPassword] = useState('');
    const [daDeptId, setDaDeptId] = useState('');

    // 3. Lists (Data fetched from backend)
    const [departments, setDepartments] = useState([]);
    const [pendingCRs, setPendingCRs] = useState([]);

    // --- DATA FETCHING FUNCTIONS ---
    const fetchDepartments = async () => {
        try {
            const response = await api.get('/api/department/all');
            setDepartments(response.data);
        } catch (error) {
            console.error("Departments fetch error:", error);
        }
    };

    const fetchPendingCRs = async () => {
        try {
            const response = await api.get('/api/subadmin/pending-crs');
            setPendingCRs(response.data);
        } catch (error) {
            console.error("Pending CRs fetch error:", error);
        }
    };

    // Jaise hi page load ho, data mangwa lo
    useEffect(() => {
        fetchDepartments();
        fetchPendingCRs();
    }, []);


    // --- ACTION HANDLERS ---
    const handleCreateDepartment = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/api/subadmin/create-department', { name: deptName });
            alert(response.data);
            setDeptName('');
            fetchDepartments(); // Naya department list me laane ke liye refresh karo
        } catch (error) {
            alert(error.response?.data || "Failed to create Department");
            console.error(error);
        }
    };

    const handleCreateDeptAdmin = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/api/subadmin/create-dept-admin', {
                name: daName,
                email: daEmail,
                password: daPassword,
                departmentId: daDeptId
            });
            alert(response.data);
            setDaName('');
            setDaEmail('');
            setDaPassword('');
            setDaDeptId('');
        } catch (error) {
            alert(error.response?.data || "Failed to create Department Admin");
            console.error(error);
        }
    };

    const handleApproveCR = async (crId) => {
        try {
            const response = await api.put(`/api/subadmin/approve-cr/${crId}`);
            alert(response.data);
            fetchPendingCRs(); // Approve hone ke baad list ko refresh karo
        } catch (error) {
            alert("Failed to approve CR");
            console.error(error);
        }
    };

    return (
        <div style={{ padding: '30px', fontFamily: 'Arial', background: '#f4f6f8', minHeight: '100vh' }}>
            <h2>🛡️ Sub-Admin Dashboard</h2>
            <hr style={{ marginBottom: '30px' }} />

            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                
                {/* --- CARD 1: Create Department --- */}
                <div style={{ flex: '1', minWidth: '300px', background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ color: '#0056b3' }}>🏢 Create Department</h3>
                    <form onSubmit={handleCreateDepartment}>
                        <input 
                            type="text" 
                            placeholder="Department Name (e.g., IT Cell)" 
                            value={deptName} 
                            onChange={(e) => setDeptName(e.target.value)} 
                            required 
                            style={{ width: '100%', padding: '10px', margin: '10px 0', boxSizing: 'border-box' }}
                        />
                        <button type="submit" style={{ width: '100%', padding: '10px', background: '#28a745', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>
                            Add Department
                        </button>
                    </form>
                </div>

                {/* --- CARD 2: Create Dept Admin --- */}
                <div style={{ flex: '1', minWidth: '300px', background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ color: '#0056b3' }}>👨‍💼 Create Dept Admin</h3>
                    <form onSubmit={handleCreateDeptAdmin}>
                        <input 
                            type="text" placeholder="Full Name" value={daName} onChange={(e) => setDaName(e.target.value)} required 
                            style={{ display: 'block', width: '100%', padding: '8px', margin: '8px 0', boxSizing: 'border-box' }}
                        />
                        <input 
                            type="email" placeholder="Email Address" value={daEmail} onChange={(e) => setDaEmail(e.target.value)} required 
                            style={{ display: 'block', width: '100%', padding: '8px', margin: '8px 0', boxSizing: 'border-box' }}
                        />
                        <input 
                            type="password" placeholder="Password" value={daPassword} onChange={(e) => setDaPassword(e.target.value)} required 
                            style={{ display: 'block', width: '100%', padding: '8px', margin: '8px 0', boxSizing: 'border-box' }}
                        />
                        
                        <select 
                            value={daDeptId} onChange={(e) => setDaDeptId(e.target.value)} required 
                            style={{ display: 'block', width: '100%', padding: '8px', margin: '8px 0', boxSizing: 'border-box' }}
                        >
                            <option value="" disabled>-- Select Department --</option>
                            {departments.map((dept) => (
                                <option key={dept.id} value={dept.id}>{dept.name}</option>
                            ))}
                        </select>

                        <button type="submit" style={{ width: '100%', padding: '10px', background: '#007BFF', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>
                            Register Dept Admin
                        </button>
                    </form>
                </div>
            </div>

            {/* --- CARD 3: Pending CR Approvals Table --- */}
            <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', marginTop: '30px' }}>
                <h3 style={{ color: '#dc3545' }}>⏳ Pending CR Approvals</h3>
                {pendingCRs.length === 0 ? (
                    <p>No CRs are waiting for approval.</p>
                ) : (
                    <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ background: '#f8d7da' }}>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>University ID</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pendingCRs.map((cr) => (
                                <tr key={cr.id}>
                                    <td>{cr.name}</td>
                                    <td>{cr.email}</td>
                                    <td>{cr.universityId}</td>
                                    <td>
                                        <button 
                                            onClick={() => handleApproveCR(cr.id)}
                                            style={{ background: '#28a745', color: 'white', padding: '6px 12px', border: 'none', cursor: 'pointer', borderRadius: '4px' }}
                                        >
                                            Approve CR
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

        </div>
    );
};

export default SubAdminDashboard;