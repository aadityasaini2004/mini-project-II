import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const HeadDashboard = () => {
    // --- STATES ---
    // 1. Add Staff Form States
    const [staffName, setStaffName] = useState('');
    const [staffEmail, setStaffEmail] = useState('');
    const [staffPassword, setStaffPassword] = useState('');

    // 2. Data Lists
    const [staffList, setStaffList] = useState([]);
    const [tickets, setTickets] = useState([]);

    // 3. Ticket Assignment Dropdown State (Har ticket ke liye alag staff select karne ke liye)
    const [assignSelections, setAssignSelections] = useState({});

    // --- DATA FETCHING FUNCTIONS ---
    const fetchMyStaff = async () => {
        try {
            const response = await api.get('/api/head/my-staff');
            setStaffList(response.data);
        } catch (error) {
            console.error("Error fetching staff:", error);
        }
    };

    const fetchDepartmentTickets = async () => {
        try {
            const response = await api.get('/api/head/department-tickets');
            setTickets(response.data);
        } catch (error) {
            console.error("Error fetching tickets:", error);
        }
    };

    useEffect(() => {
        fetchMyStaff();
        fetchDepartmentTickets();
    }, []);

    // --- ACTION HANDLERS ---
    const handleAddStaff = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/api/head/add-staff', {
                name: staffName,
                email: staffEmail,
                password: staffPassword
            });
            alert(response.data);
            
            // Clear form and refresh list
            setStaffName('');
            setStaffEmail('');
            setStaffPassword('');
            fetchMyStaff(); 
        } catch (error) {
            alert("Failed to add staff!");
            console.error(error);
        }
    };

    const handleDeleteStaff = async (staffId) => {
        if (!window.confirm("Are you sure you want to delete this staff member?")) return;
        
        try {
            const response = await api.delete(`/api/head/delete-staff/${staffId}`);
            alert(response.data);
            fetchMyStaff(); // Refresh list after deletion
        } catch (error) {
            alert("Failed to delete staff!");
            console.error(error);
        }
    };

    const handleAssignTicket = async (ticketId) => {
        const selectedStaffId = assignSelections[ticketId];
        
        if (!selectedStaffId) {
            alert("Please select a staff member first!");
            return;
        }

        try {
            const response = await api.put(`/api/head/assign-ticket/${ticketId}/${selectedStaffId}`);
            alert(response.data);
            fetchDepartmentTickets(); // Refresh tickets to see updated status
        } catch (error) {
            alert(error.response?.data || "Failed to assign ticket!");
            console.error(error);
        }
    };

    // Dropdown value change handle karne ke liye
    const handleDropdownChange = (ticketId, staffId) => {
        setAssignSelections({
            ...assignSelections,
            [ticketId]: staffId
        });
    };

    return (
        <div style={{ padding: '30px', fontFamily: 'Arial', background: '#f8f9fa', minHeight: '100vh' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>👨‍💼 Department Head Dashboard</h2>
                <span style={{ backgroundColor: '#ffc107', color: '#000', padding: '8px 15px', borderRadius: '20px', fontWeight: 'bold' }}>
                    Dept. Manager
                </span>
            </div>
            <hr style={{ marginBottom: '30px' }} />

            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                
                {/* --- CARD 1: ADD NEW STAFF --- */}
                <div style={{ flex: '1', minWidth: '300px', background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ color: '#0056b3', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>🛠️ Add New Staff</h3>
                    <form onSubmit={handleAddStaff}>
                        <input type="text" placeholder="Staff Name" value={staffName} onChange={(e) => setStaffName(e.target.value)} required style={{ display: 'block', width: '100%', padding: '10px', margin: '10px 0', boxSizing: 'border-box' }} />
                        <input type="email" placeholder="Staff Email" value={staffEmail} onChange={(e) => setStaffEmail(e.target.value)} required style={{ display: 'block', width: '100%', padding: '10px', margin: '10px 0', boxSizing: 'border-box' }} />
                        <input type="password" placeholder="Password" value={staffPassword} onChange={(e) => setStaffPassword(e.target.value)} required style={{ display: 'block', width: '100%', padding: '10px', margin: '10px 0', boxSizing: 'border-box' }} />
                        <button type="submit" style={{ width: '100%', padding: '10px', background: '#28a745', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold' }}>
                            Register Staff
                        </button>
                    </form>
                </div>

                {/* --- CARD 2: MY STAFF LIST --- */}
                <div style={{ flex: '2', minWidth: '400px', background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ color: '#0056b3', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>👥 My Department Staff</h3>
                    {staffList.length === 0 ? (
                        <p style={{ color: 'gray' }}>No staff added yet. Add staff from the left panel.</p>
                    ) : (
                        <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead style={{ background: '#e9ecef' }}>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {staffList.map((staff) => (
                                    <tr key={staff.id}>
                                        <td>{staff.name}</td>
                                        <td>{staff.email}</td>
                                        <td>
                                            <button 
                                                onClick={() => handleDeleteStaff(staff.id)}
                                                style={{ background: '#dc3545', color: 'white', padding: '5px 10px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                            >
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* --- SECTION 3: DEPARTMENT TICKETS --- */}
            <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', marginTop: '30px' }}>
                <h3 style={{ color: '#dc3545', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>📋 Department Tickets</h3>
                {tickets.length === 0 ? (
                    <p>No tickets raised for your department yet.</p>
                ) : (
                    <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ background: '#ffebee' }}>
                            <tr>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Raised By (CR)</th>
                                <th>Status</th>
                                <th>Assign To Staff</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tickets.map((ticket) => (
                                <tr key={ticket.id}>
                                    <td><strong>{ticket.title}</strong></td>
                                    <td>{ticket.description}</td>
                                    <td>{ticket.crId}</td>
                                    
                                    {/* Status Column */}
                                    <td style={{ 
                                        color: ticket.status === 'RESOLVED' ? 'green' : 
                                               ticket.status === 'IN_PROGRESS' ? 'orange' : 'red',
                                        fontWeight: 'bold'
                                    }}>
                                        {ticket.status}
                                    </td>
                                    
                                    {/* Assignment Column */}
                                    <td>
                                        {ticket.status === 'RESOLVED' ? (
                                            <span style={{ color: 'green' }}>✓ Solved by {staffList.find(s => s.id === ticket.assignedStaffId)?.name || 'Staff'}</span>
                                        ) : (
                                            <div style={{ display: 'flex', gap: '10px' }}>
                                                <select 
                                                    value={assignSelections[ticket.id] || ticket.assignedStaffId || ''} 
                                                    onChange={(e) => handleDropdownChange(ticket.id, e.target.value)}
                                                    style={{ padding: '5px', flex: '1' }}
                                                    disabled={ticket.status === 'IN_PROGRESS' && ticket.assignedStaffId}
                                                >
                                                    <option value="" disabled>-- Select Staff --</option>
                                                    {staffList.map(staff => (
                                                        <option key={staff.id} value={staff.id}>{staff.name}</option>
                                                    ))}
                                                </select>
                                                
                                                {/* Button tabhi active hoga jab ticket IN_PROGRESS na ho */}
                                                {(!ticket.assignedStaffId) && (
                                                    <button 
                                                        onClick={() => handleAssignTicket(ticket.id)}
                                                        style={{ background: '#007bff', color: 'white', padding: '5px 10px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                                    >
                                                        Assign
                                                    </button>
                                                )}
                                                {(ticket.assignedStaffId && ticket.status === 'IN_PROGRESS') && (
                                                    <span style={{ padding: '5px', fontSize: '12px', color: 'gray' }}>Assigned</span>
                                                )}
                                            </div>
                                        )}
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

export default HeadDashboard;