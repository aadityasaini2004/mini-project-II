import React, { useState, useEffect } from 'react';
import api from '../utils/api';

// 🔥 MUI Components Import
import { 
    Box, Typography, TableContainer, Table, TableHead, TableRow, 
    TableCell, TableBody, Paper, Chip, FormControl, Select, MenuItem, 
    Button, Container 
} from '@mui/material';

import BuildCircleIcon from '@mui/icons-material/BuildCircle';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import UpdateIcon from '@mui/icons-material/Update';

const StaffDashboard = () => {
    // 👇 LOGIC WAHI PURANA HAI
    const [tickets, setTickets] = useState([]);
    const [newStatuses, setNewStatuses] = useState({});

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

    const handleStatusUpdate = async (ticketId) => {
        const updatedStatus = newStatuses[ticketId];
        if (!updatedStatus) {
            alert("Please select a new status first!");
            return;
        }
        try {
            const response = await api.put(`/api/staff/update-status/${ticketId}?status=${updatedStatus}`);
            alert(response.data);
            fetchMyTickets(); 
        } catch (error) {
            alert(error.response?.data || "Failed to update ticket status!");
        }
    };

    const handleDropdownChange = (ticketId, status) => {
        setNewStatuses({ ...newStatuses, [ticketId]: status });
    };

    const getStatusColor = (status) => {
        if (status === 'RESOLVED') return 'success';
        if (status === 'IN_PROGRESS') return 'warning';
        return 'error'; 
    };

    // 👇 MUI UI SHURU
    return (
        <Box sx={{ backgroundColor: '#f4f7f6', minHeight: '100vh', pt: 4, pb: 6 }}>
            <Container maxWidth="lg">
                
                {/* Header Section */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" fontWeight="bold" color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <BuildCircleIcon fontSize="large" /> Technician Dashboard
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                        Resolution Team: Yahan aapko assign kiye gaye tasks dikhenge. Problem solve karne ke baad status update karein.
                    </Typography>
                </Box>

                {/* Tickets Table inside a Premium Paper Card */}
                <Paper elevation={4} sx={{ borderRadius: 3, overflow: 'hidden' }}>
                    <Box sx={{ p: 2, backgroundColor: '#e3f2fd', borderBottom: '1px solid #bbdefb' }}>
                        <Typography variant="h6" fontWeight="bold" color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            📋 My Assigned Tasks
                        </Typography>
                    </Box>

                    <TableContainer>
                        <Table sx={{ minWidth: 800 }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold', fontSize: '15px' }}>Ticket Title</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', fontSize: '15px', width: '35%' }}>Description</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', fontSize: '15px' }}>Raised By (CR)</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', fontSize: '15px' }}>Current Status</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '15px' }}>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {tickets.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center" sx={{ py: 5 }}>
                                            <Typography variant="h6" color="text.secondary">
                                                🎉 Great! You have no pending tickets assigned right now.
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    tickets.map((ticket) => (
                                        <TableRow key={ticket.id} hover>
                                            <TableCell sx={{ fontWeight: 'bold' }}>{ticket.title}</TableCell>
                                            <TableCell>{ticket.description}</TableCell>
                                            <TableCell><Chip label={ticket.crId} size="small" variant="outlined" /></TableCell>
                                            
                                            <TableCell>
                                                <Chip 
                                                    label={ticket.status} 
                                                    color={getStatusColor(ticket.status)} 
                                                    size="small" 
                                                    sx={{ fontWeight: 'bold', letterSpacing: 0.5 }} 
                                                />
                                            </TableCell>
                                            
                                            <TableCell align="center">
                                                {ticket.status === 'RESOLVED' ? (
                                                    <Typography variant="body2" color="success.main" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                                                        <TaskAltIcon fontSize="small" /> Task Completed
                                                    </Typography>
                                                ) : (
                                                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', alignItems: 'center' }}>
                                                        <FormControl size="small" sx={{ minWidth: 140 }}>
                                                            <Select
                                                                value={newStatuses[ticket.id] || ticket.status}
                                                                onChange={(e) => handleDropdownChange(ticket.id, e.target.value)}
                                                                sx={{ fontSize: '14px' }}
                                                            >
                                                                <MenuItem value="IN_PROGRESS">IN PROGRESS</MenuItem>
                                                                <MenuItem value="RESOLVED">RESOLVED</MenuItem>
                                                            </Select>
                                                        </FormControl>
                                                        
                                                        <Button 
                                                            variant="contained" 
                                                            color="primary" 
                                                            size="small" 
                                                            startIcon={<UpdateIcon />}
                                                            onClick={() => handleStatusUpdate(ticket.id)}
                                                            sx={{ fontWeight: 'bold', textTransform: 'none' }}
                                                        >
                                                            Update
                                                        </Button>
                                                    </Box>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>

            </Container>
        </Box>
    );
};

export default StaffDashboard;