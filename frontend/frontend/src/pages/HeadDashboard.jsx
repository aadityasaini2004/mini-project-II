import React, { useState, useEffect } from 'react';
import api from '../utils/api';

// 🔥 MUI Components Import
import { 
    Box, Typography, Grid, Card, CardContent, TextField, Button, 
    FormControl, InputLabel, Select, MenuItem, TableContainer, 
    Table, TableHead, TableRow, TableCell, TableBody, Paper, Chip, IconButton, Tooltip 
} from '@mui/material';

import EngineeringIcon from '@mui/icons-material/Engineering';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import GroupIcon from '@mui/icons-material/Group';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const HeadDashboard = () => {
    // --- STATES ---
    const [staffName, setStaffName] = useState('');
    const [staffEmail, setStaffEmail] = useState('');
    const [staffPassword, setStaffPassword] = useState('');

    const [staffList, setStaffList] = useState([]);
    const [tickets, setTickets] = useState([]);
    const [assignSelections, setAssignSelections] = useState({});

    // --- DATA FETCHING ---
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

    // --- HANDLERS ---
    const handleAddStaff = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/api/head/add-staff', {
                name: staffName, email: staffEmail, password: staffPassword
            });
            alert(response.data);
            setStaffName(''); setStaffEmail(''); setStaffPassword('');
            fetchMyStaff(); 
        } catch (error) {
            alert("Failed to add staff!");
        }
    };

    const handleDeleteStaff = async (staffId) => {
        if (!window.confirm("Are you sure you want to delete this staff member?")) return;
        try {
            const response = await api.delete(`/api/head/delete-staff/${staffId}`);
            alert(response.data);
            fetchMyStaff(); 
        } catch (error) {
            alert("Failed to delete staff!");
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
            fetchDepartmentTickets(); 
        } catch (error) {
            alert(error.response?.data || "Failed to assign ticket!");
        }
    };

    const handleDropdownChange = (ticketId, staffId) => {
        setAssignSelections({ ...assignSelections, [ticketId]: staffId });
    };

    // Helper function for dynamic status colors
    const getStatusColor = (status) => {
        if (status === 'RESOLVED') return 'success';
        if (status === 'IN_PROGRESS') return 'warning';
        return 'error'; 
    };

    // --- MUI UI SHURU ---
    return (
        <Box sx={{ padding: { xs: 2, md: 4 }, backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
            
            {/* Header Section */}
            <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EngineeringIcon fontSize="large" /> Department Head Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={4}>
                Manage your department staff and assign pending tickets to them.
            </Typography>

            <Grid container spacing={4}>
                
                {/* --- CARD 1: ADD NEW STAFF --- */}
                <Grid item xs={12} md={4}>
                    <Card elevation={4} sx={{ borderRadius: 3, height: '100%' }}>
                        <CardContent>
                            <Typography variant="h6" fontWeight="bold" color="primary" mb={2} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <PersonAddIcon /> Add New Staff
                            </Typography>
                            <Box component="form" onSubmit={handleAddStaff}>
                                <TextField 
                                    fullWidth label="Staff Name" value={staffName} onChange={(e) => setStaffName(e.target.value)} 
                                    required margin="normal" size="small"
                                />
                                <TextField 
                                    fullWidth label="Staff Email" type="email" value={staffEmail} onChange={(e) => setStaffEmail(e.target.value)} 
                                    required margin="normal" size="small"
                                />
                                <TextField 
                                    fullWidth label="Password" type="password" value={staffPassword} onChange={(e) => setStaffPassword(e.target.value)} 
                                    required margin="normal" size="small"
                                />
                                <Button type="submit" fullWidth variant="contained" color="success" sx={{ mt: 2, py: 1.2, fontWeight: 'bold' }}>
                                    Register Staff
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* --- CARD 2: MY STAFF LIST --- */}
                <Grid item xs={12} md={8}>
                    <Card elevation={4} sx={{ borderRadius: 3, height: '100%' }}>
                        <CardContent>
                            <Typography variant="h6" fontWeight="bold" color="primary" mb={2} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <GroupIcon /> My Department Staff
                            </Typography>
                            <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 300, overflow: 'auto' }}>
                                <Table stickyHeader size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Name</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Email</TableCell>
                                            <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {staffList.length === 0 ? (
                                            <TableRow><TableCell colSpan={3} align="center">No staff added yet.</TableCell></TableRow>
                                        ) : (
                                            staffList.map((staff) => (
                                                <TableRow key={staff.id} hover>
                                                    <TableCell sx={{ fontWeight: 'bold' }}>{staff.name}</TableCell>
                                                    <TableCell>{staff.email}</TableCell>
                                                    <TableCell align="center">
                                                        <Tooltip title="Remove Staff">
                                                            <IconButton color="error" onClick={() => handleDeleteStaff(staff.id)}>
                                                                <DeleteIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* --- SECTION 3: DEPARTMENT TICKETS --- */}
            <Box mt={5}>
                <Typography variant="h5" fontWeight="bold" color="error" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AssignmentIcon /> Department Tickets
                </Typography>
                
                <TableContainer component={Paper} elevation={4} sx={{ borderRadius: 3, overflow: 'hidden' }}>
                    <Table sx={{ minWidth: 800 }}>
                        <TableHead sx={{ backgroundColor: '#ffebee' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold' }}>Title</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', width: '30%' }}>Description</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>CR ID</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Assign to Staff</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tickets.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                                        No tickets raised for your department yet. Relax! ☕
                                    </TableCell>
                                </TableRow>
                            ) : (
                                tickets.map((ticket) => (
                                    <TableRow key={ticket.id} hover>
                                        <TableCell sx={{ fontWeight: 'bold' }}>{ticket.title}</TableCell>
                                        <TableCell>{ticket.description}</TableCell>
                                        <TableCell><Chip label={ticket.crId} size="small" variant="outlined" /></TableCell>
                                        <TableCell>
                                            <Chip label={ticket.status} color={getStatusColor(ticket.status)} size="small" sx={{ fontWeight: 'bold' }} />
                                        </TableCell>
                                        
                                        <TableCell align="center">
                                            {/* Logic for Assignment */}
                                            {ticket.status === 'RESOLVED' ? (
                                                <Typography variant="body2" color="success.main" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                                                    <CheckCircleIcon fontSize="small" /> Solved by {staffList.find(s => s.id === ticket.assignedStaffId)?.name || 'Staff'}
                                                </Typography>
                                            ) : ticket.assignedStaffId ? (
                                                <Chip label={`Assigned: ${staffList.find(s => s.id === ticket.assignedStaffId)?.name || 'Staff'}`} color="info" size="small" sx={{ fontWeight: 'bold' }} />
                                            ) : (
                                                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                                    <FormControl size="small" sx={{ minWidth: 130 }}>
                                                        <InputLabel>Select Staff</InputLabel>
                                                        <Select
                                                            value={assignSelections[ticket.id] || ''}
                                                            label="Select Staff"
                                                            onChange={(e) => handleDropdownChange(ticket.id, e.target.value)}
                                                        >
                                                            {staffList.map(staff => (
                                                                <MenuItem key={staff.id} value={staff.id}>{staff.name}</MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                    <Button 
                                                        variant="contained" color="primary" size="small" 
                                                        onClick={() => handleAssignTicket(ticket.id)}
                                                    >
                                                        Assign
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
            </Box>

        </Box>
    );
};

export default HeadDashboard;