import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const CRDashboard = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [departmentId, setDepartmentId] = useState(''); 
    
    const [tickets, setTickets] = useState([]);
    const [departments, setDepartments] = useState([]); // 🔥 Naya state departments store karne ke liye

    const fetchMyTickets = async () => {
        try {
            const response = await api.get('/api/cr/my-tickets');
            setTickets(response.data);
        } catch (error) {
            console.error("Tickets laane mein error:", error);
        }
    };

    // 🔥 Naya function: Backend se departments lane ke liye
    const fetchDepartments = async () => {
        try {
            const response = await api.get('/api/department/all');
            setDepartments(response.data);
        } catch (error) {
            console.error("Departments laane mein error:", error);
        }
    };

    // Jaise hi page load ho, tickets aur departments dono mangwa lo
    useEffect(() => {
        fetchMyTickets();
        fetchDepartments();
    }, []);

    const handleRaiseTicket = async (e) => {
        e.preventDefault();
        try {
            await api.post('/api/cr/raise-ticket', {
                title: title,
                description: description,
                departmentId: departmentId // Dropdown se automatically id aayegi
            });
            
            alert("Ticket raised successfully!");
            setTitle('');
            setDescription('');
            setDepartmentId('');
            fetchMyTickets(); 
        } catch (error) {
            console.error("Ticket raise error:", error);
            alert("Failed to raise ticket!");
        }
    };

    return (
        <div style={{ padding: '30px', fontFamily: 'Arial' }}>
            <h2>Welcome CR! 🎓</h2>
            <hr />

            {/* Ticket Raise Form */}
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
                    
                    {/* 🔥 NAYA FIX: Input hatakar Dropdown (Select) laga diya */}
                    <select 
                        value={departmentId} 
                        onChange={(e) => setDepartmentId(e.target.value)} 
                        required 
                        style={{ display: 'block', margin: '10px 0', width: '100%', padding: '8px' }}
                    >
                        <option value="" disabled>-- Select Department --</option>
                        {departments.map((dept) => (
                            // 'dept.id' value me jayega, aur 'dept.name' screen par dikhega
                            // Agar tere model me 'name' ki jagah 'departmentName' hai, toh usko yaha change kar lena
                            <option key={dept.id} value={dept.id}>
                                {dept.name} 
                            </option>
                        ))}
                    </select>

                    <button type="submit" style={{ padding: '10px 20px', background: 'blue', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>
                        Submit Ticket
                    </button>
                </form>
            </div>

            {/* My Tickets Table */}
            <div>
                <h3>My Raised Tickets</h3>
                {tickets.length === 0 ? (
                    <p>You haven't raised any tickets yet.</p>
                ) : (
                    <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', background: '#fff' }}>
                        <thead style={{ background: '#ddd' }}>
                            <tr>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tickets.map((ticket) => (
                                <tr key={ticket.id}>
                                    <td>{ticket.title}</td>
                                    <td>{ticket.description}</td>
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