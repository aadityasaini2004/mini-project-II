import React, { useState, useEffect } from 'react';
import api from '../utils/api'; // Tumhara jadu wala axios file

const CRDashboard = () => {
    // Form ke liye states
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [departmentId, setDepartmentId] = useState(''); // Abhi ke liye manually ID dalenge
    
    // Tickets ki list dikhane ke liye state
    const [tickets, setTickets] = useState([]);

    // Backend se CR ki tickets mangwane ka function
    const fetchMyTickets = async () => {
        try {
            const response = await api.get('/api/cr/my-tickets');
            setTickets(response.data);
        } catch (error) {
            console.error("Tickets laane mein error:", error);
        }
    };

    // Jaise hi page load ho, tickets fetch kar lo
    useEffect(() => {
        fetchMyTickets();
    }, []);

    // Naya ticket raise karne ka function
    const handleRaiseTicket = async (e) => {
        e.preventDefault();
        try {
            await api.post('/api/cr/raise-ticket', {
                title: title,
                description: description,
                departmentId: departmentId
            });
            
            alert("Ticket raised successfully!");
            
            // Form clear kar do
            setTitle('');
            setDescription('');
            setDepartmentId('');
            
            // List ko update karne ke liye wapas fetch karo
            fetchMyTickets(); 
        } catch (error) {
            console.error("Ticket raise karne mein error:", error);
            alert("Failed to raise ticket!");
        }
    };

    return (
        <div style={{ padding: '30px', fontFamily: 'Arial' }}>
            <h2>Welcome CR! 🎓</h2>
            <hr />

            {/* Ticket Raise Karne ka Form */}
            <div style={{ background: '#f4f4f4', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
                <h3>Raise a New Complaint / Query</h3>
                <form onSubmit={handleRaiseTicket}>
                    <input 
                        type="text" 
                        placeholder="Problem Title (e.g., Projector Issue)" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        required 
                        style={{ display: 'block', margin: '10px 0', width: '100%', padding: '8px' }}
                    />
                    <textarea 
                        placeholder="Describe the issue in detail..." 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)} 
                        required 
                        rows="4"
                        style={{ display: 'block', margin: '10px 0', width: '100%', padding: '8px' }}
                    />
                    <input 
                        type="text" 
                        placeholder="Department ID (Paste IT Cell ID here)" 
                        value={departmentId} 
                        onChange={(e) => setDepartmentId(e.target.value)} 
                        required 
                        style={{ display: 'block', margin: '10px 0', width: '100%', padding: '8px' }}
                    />
                    <button type="submit" style={{ padding: '10px 20px', background: 'blue', color: 'white', border: 'none', cursor: 'pointer' }}>
                        Submit Ticket
                    </button>
                </form>
            </div>

            {/* Tickets ki List (Table) */}
            <div>
                <h3>My Raised Tickets</h3>
                {tickets.length === 0 ? (
                    <p>You haven't raised any tickets yet.</p>
                ) : (
                    <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ background: '#ddd' }}>
                            <tr>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Assigned To (Staff ID)</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tickets.map((ticket) => (
                                <tr key={ticket.id}>
                                    <td>{ticket.title}</td>
                                    <td>{ticket.description}</td>
                                    <td>{ticket.assignedStaffId || 'Not Assigned Yet'}</td>
                                    <td style={{ 
                                        color: ticket.status === 'RESOLVED' ? 'green' : 
                                               ticket.status === 'IN_PROGRESS' ? 'orange' : 'red',
                                        fontWeight: 'bold'
                                    }}>
                                        {ticket.status}
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

export default CRDashboard;