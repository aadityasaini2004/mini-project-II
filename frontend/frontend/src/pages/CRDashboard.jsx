import React, { useState, useEffect } from 'react';
import api from '../utils/api';

// 🔥 MUI Components Import
import { 
    Box, Typography, Button, TableContainer, Table, TableHead, TableRow, 
    TableCell, TableBody, Paper, Chip, Dialog, DialogTitle, DialogContent, 
    DialogActions, TextField, FormControl, InputLabel, Select, MenuItem, Fab 
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AssignmentIcon from '@mui/icons-material/Assignment';

const CRDashboard = () => {
    // --- STATES ---
    const [tickets, setTickets] = useState([]);
    const [departments, setDepartments] = useState([]);
    
    // Modal (Pop-up) handle karne ka state
    const [open, setOpen] = useState(false);
    
    // Naya ticket form states
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [departmentId, setDepartmentId] = useState('');

    // --- DATA FETCHING ---
    const fetchMyTickets = async () => {
        try {
            // (Apne backend ki exact API link check kar lena agar alag ho toh)
            const response = await api.get('/api/cr/my-tickets'); 
            setTickets(response.data);
        } catch (error) {
            console.error("Error fetching tickets:", error);
        }
    };

    const fetchDepartments = async () => {
        try {
            const response = await api.get('/api/department/all');
            setDepartments(response.data);
        } catch (error) {
            console.error("Error fetching departments:", error);
        }
    };

    useEffect(() => {
        fetchMyTickets();
        fetchDepartments();
    }, []);

    // --- HANDLERS ---
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setTitle('');
        setDescription('');
        setDepartmentId('');
    };

    const handleRaiseTicket = async (e) => {
        e.preventDefault();
        try {
            // (Apne backend ki exact API link check kar lena)
            const response = await api.post('/api/cr/raise-ticket', {
                title,
                description,
                departmentId
            });
            alert(response.data);
            fetchMyTickets(); // Table refresh karo
            handleClose();    // Modal band karo
        } catch (error) {
            alert("Failed to raise ticket!");
            console.error(error);
        }
    };

    // Status ke hisaab se color decide karne ka function
    const getStatusColor = (status) => {
        if (status === 'RESOLVED') return 'success';
        if (status === 'IN_PROGRESS') return 'warning';
        return 'error'; // PENDING ke liye Red
    };

    return (
        <Box sx={{ padding: { xs: 2, md: 5 }, backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            
            {/* Header Area */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Typography variant="h4" fontWeight="bold" color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AssignmentIcon fontSize="large" /> CR Dashboard
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Welcome! You can raise new issues and track their status here.
                    </Typography>
                </Box>
                
                {/* Desktop "Raise Ticket" Button */}
                <Button 
                    variant="contained" 
                    color="primary" 
                    startIcon={<AddIcon />} 
                    onClick={handleOpen}
                    sx={{ borderRadius: 2, fontWeight: 'bold', px: 3, py: 1.5, display: { xs: 'none', sm: 'flex' } }}
                >
                    Raise New Ticket
                </Button>
            </Box>

            {/* Tickets Table */}
            <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
                <Table sx={{ minWidth: 650 }}>
                    <TableHead sx={{ backgroundColor: '#e3f2fd' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', fontSize: '16px' }}>Ticket Title</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', fontSize: '16px' }}>Description</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', fontSize: '16px', width: '20%' }}>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tickets.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={3} align="center" sx={{ py: 4, color: 'text.secondary', fontSize: '16px' }}>
                                    You haven't raised any tickets yet. Relax! ☕
                                </TableCell>
                            </TableRow>
                        ) : (
                            tickets.map((ticket) => (
                                <TableRow key={ticket.id} hover>
                                    <TableCell sx={{ fontWeight: 'bold' }}>{ticket.title}</TableCell>
                                    <TableCell>{ticket.description}</TableCell>
                                    <TableCell>
                                        <Chip 
                                            label={ticket.status} 
                                            color={getStatusColor(ticket.status)} 
                                            variant="filled"
                                            sx={{ fontWeight: 'bold', letterSpacing: 1 }}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Mobile "Raise Ticket" Floating Action Button (FAB) */}
            <Fab 
                color="primary" 
                aria-label="add" 
                onClick={handleOpen}
                sx={{ position: 'fixed', bottom: 30, right: 30, display: { sm: 'none' } }}
            >
                <AddIcon />
            </Fab>

            {/* 🔥 YEH HAI TERA POP-UP MODAL (DIALOG) */}
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    Raise a New Ticket 📝
                </DialogTitle>
                <form onSubmit={handleRaiseTicket}>
                    <DialogContent dividers>
                        <Typography variant="body2" color="text.secondary" mb={2}>
                            Please provide detailed information about the issue so the department can resolve it quickly.
                        </Typography>
                        
                        <TextField
                            autoFocus required fullWidth margin="dense"
                            label="Ticket Title" placeholder="e.g., Projector not working in Room 302"
                            value={title} onChange={(e) => setTitle(e.target.value)}
                        />
                        
                        <TextField
                            required fullWidth margin="dense" multiline rows={4}
                            label="Problem Description" placeholder="Explain the issue in detail..."
                            value={description} onChange={(e) => setDescription(e.target.value)}
                            sx={{ mt: 2 }}
                        />

                        <FormControl fullWidth required sx={{ mt: 2 }}>
                            <InputLabel id="dept-label">Select Department</InputLabel>
                            <Select
                                labelId="dept-label"
                                value={departmentId}
                                label="Select Department"
                                onChange={(e) => setDepartmentId(e.target.value)}
                            >
                                {departments.map((dept) => (
                                    <MenuItem key={dept.id} value={dept.id}>{dept.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </DialogContent>
                    <DialogActions sx={{ px: 3, py: 2 }}>
                        <Button onClick={handleClose} color="error" sx={{ fontWeight: 'bold' }}>Cancel</Button>
                        <Button type="submit" variant="contained" color="success" sx={{ fontWeight: 'bold' }}>Submit Ticket</Button>
                    </DialogActions>
                </form>
            </Dialog>

        </Box>
    );
};

export default CRDashboard;