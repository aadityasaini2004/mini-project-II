import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const StaffDashboard = () => {
    const [tickets, setTickets] = useState([]);
    
    // Status update karne ke liye temporary state taaki dropdown change handle ho sake
    const [newStatuses, setNewStatuses] = useState({});

    // 1. Apni Assigned Tickets mangwana
    const fetchMyTickets = async () => {
        try {
            const response = await api.get('/api/staff/my-tickets');
            setTickets(response.data);
        } catch (error) {
            console.error("Error fetching staff tickets:", error);
        }
    };

    useEffect(() => {
        fetchMyTickets();
    }, []);

    // 2. Status Update karna
    const handleStatusUpdate = async (ticketId) => {
        const updatedStatus = newStatuses[ticketId];
        
        if (!updatedStatus) {
            alert("Please select a new status first!");
            return;
        }

        try {
            // Backend me query parameter (?status=...) bhejna hai
            const response = await api.put(`/api/staff/update-status/${ticketId}?status=${updatedStatus}`);
            alert(response.data);
            fetchMyTickets(); // Table refresh karo
        } catch (error) {
            console.error("Error updating status:", error);
            alert(error.response?.data || "Failed to update ticket status!");
        }
    };

    const handleDropdownChange = (ticketId, status) => {
        setNewStatuses({
            ...newStatuses,
            [ticketId]: status
        });
    };

    return (
        <div style={{ padding: '40px', fontFamily: 'Arial', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h2>🛠️ Staff / Technician Dashboard</h2>
                <span style={{ backgroundColor: '#28a745', color: 'white', padding: '8px 15px', borderRadius: '20px', fontWeight: 'bold' }}>
                    Resolution Team
                </span>
            </div>
            <hr />

            <div style={{ background: '#fff', padding: '30px', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', marginTop: '30px' }}>
                <h3 style={{ color: '#333', marginBottom: '20px' }}>📋 My Assigned Tasks</h3>
                <p style={{ color: 'gray', fontSize: '14px', marginBottom: '20px' }}>
                    Yahan aapko wahi tickets dikhengi jo aapke Department Head ne aapko assign ki hain. Problem solve karne ke baad unka status 'RESOLVED' mark karein.
                </p>

                {tickets.length === 0 ? (
                    <div style={{ padding: '20px', textAlign: 'center', background: '#e9ecef', borderRadius: '5px' }}>
                        🎉 Great! You have no pending tickets assigned to you right now.
                    </div>
                ) : (
                    <table border="1" cellPadding="12" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ background: '#e3f2fd' }}>
                            <tr>
                                <th>Ticket Title</th>
                                <th>Problem Description</th>
                                <th>Raised By</th>
                                <th>Current Status</th>
                                <th>Update Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tickets.map((ticket) => (
                                <tr key={ticket.id}>
                                    <td><strong>{ticket.title}</strong></td>
                                    <td>{ticket.description}</td>
                                    <td>{ticket.crId}</td>
                                    <td style={{ 
                                        color: ticket.status === 'RESOLVED' ? 'green' : 
                                               ticket.status === 'IN_PROGRESS' ? 'orange' : 'red',
                                        fontWeight: 'bold'
                                    }}>
                                        {ticket.status}
                                    </td>
                                    <td>
                                        {ticket.status === 'RESOLVED' ? (
                                            <span style={{ color: 'green', fontWeight: 'bold' }}>✅ Task Completed</span>
                                        ) : (
                                            <div style={{ display: 'flex', gap: '10px' }}>
                                                <select 
                                                    value={newStatuses[ticket.id] || ticket.status} 
                                                    onChange={(e) => handleDropdownChange(ticket.id, e.target.value)}
                                                    style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                                                >
                                                    <option value="IN_PROGRESS">IN PROGRESS (Working)</option>
                                                    <option value="RESOLVED">RESOLVED (Fixed)</option>
                                                </select>
                                                <button 
                                                    onClick={() => handleStatusUpdate(ticket.id)}
                                                    style={{ background: '#007bff', color: 'white', padding: '8px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                                >
                                                    Update
                                                </button>
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

export default StaffDashboard;