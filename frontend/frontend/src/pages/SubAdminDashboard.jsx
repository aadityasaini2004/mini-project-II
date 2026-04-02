import React, { useState, useEffect } from 'react';
import api from '../utils/api';

// 🔥 Naye MUI Components Import Kiye
import { 
    Box, Typography, Grid, Card, CardContent, TextField, Button, 
    FormControl, InputLabel, Select, MenuItem, TableContainer, 
    Table, TableHead, TableRow, TableCell, TableBody, Paper, Chip 
} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PendingActionsIcon from '@mui/icons-material/PendingActions';

const SubAdminDashboard = () => {
    // --- STATE AUR LOGIC WAHI PURANA HAI ---
    const [deptName, setDeptName] = useState('');
    const [daName, setDaName] = useState('');
    const [daEmail, setDaEmail] = useState('');
    const [daPassword, setDaPassword] = useState('');
    const [daDeptId, setDaDeptId] = useState('');
    const [departments, setDepartments] = useState([]);
    const [pendingCRs, setPendingCRs] = useState([]);

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

    useEffect(() => {
        fetchDepartments();
        fetchPendingCRs();
    }, []);

    const handleCreateDepartment = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/api/subadmin/create-department', { name: deptName });
            alert(response.data);
            setDeptName('');
            fetchDepartments(); 
        } catch (error) {
            alert(error.response?.data || "Failed to create Department");
        }
    };

    const handleCreateDeptAdmin = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/api/subadmin/create-dept-admin', {
                name: daName, email: daEmail, password: daPassword, departmentId: daDeptId
            });
            alert(response.data);
            setDaName(''); setDaEmail(''); setDaPassword(''); setDaDeptId('');
        } catch (error) {
            alert(error.response?.data || "Failed to create Department Admin");
        }
    };

    const handleApproveCR = async (crId) => {
        try {
            const response = await api.put(`/api/subadmin/approve-cr/${crId}`);
            alert(response.data);
            fetchPendingCRs(); 
        } catch (error) {
            alert("Failed to approve CR");
        }
    };

    // --- MUI UI SHURU ---
    return (
        <Box sx={{ padding: { xs: 2, md: 4 }, backgroundColor: '#f4f6f8', minHeight: '100vh' }}>
            
            {/* Header Section */}
            <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PendingActionsIcon fontSize="large" /> Sub-Admin Control Panel
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={4}>
                Manage college departments and verify pending CR registrations.
            </Typography>

            <Grid container spacing={4}>
                
                {/* --- CARD 1: Create Department --- */}
                <Grid item xs={12} md={5}>
                    <Card elevation={3} sx={{ borderRadius: 3, height: '100%' }}>
                        <CardContent>
                            <Typography variant="h6" fontWeight="bold" color="primary" mb={2} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <BusinessIcon /> Add Department
                            </Typography>
                            <Box component="form" onSubmit={handleCreateDepartment}>
                                <TextField 
                                    fullWidth label="Department Name (e.g., IT Cell)" 
                                    value={deptName} onChange={(e) => setDeptName(e.target.value)} 
                                    required margin="normal" variant="outlined"
                                />
                                <Button 
                                    type="submit" fullWidth variant="contained" color="success" 
                                    sx={{ mt: 2, py: 1.5, fontWeight: 'bold' }}
                                >
                                    Create Department
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* --- CARD 2: Create Dept Admin --- */}
                <Grid item xs={12} md={7}>
                    <Card elevation={3} sx={{ borderRadius: 3, height: '100%' }}>
                        <CardContent>
                            <Typography variant="h6" fontWeight="bold" color="primary" mb={2} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <PersonAddIcon /> Register Department Admin
                            </Typography>
                            <Box component="form" onSubmit={handleCreateDeptAdmin}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField fullWidth label="Full Name" value={daName} onChange={(e) => setDaName(e.target.value)} required />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField fullWidth label="Email Address" type="email" value={daEmail} onChange={(e) => setDaEmail(e.target.value)} required />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField fullWidth label="Password" type="password" value={daPassword} onChange={(e) => setDaPassword(e.target.value)} required />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        {/* MUI Dropdown (Select) */}
                                        <FormControl fullWidth required>
                                            <InputLabel id="dept-select-label">Select Department</InputLabel>
                                            <Select 
                                                labelId="dept-select-label"
                                                value={daDeptId} 
                                                label="Select Department"
                                                onChange={(e) => setDaDeptId(e.target.value)}
                                            >
                                                {departments.map((dept) => (
                                                    <MenuItem key={dept.id} value={dept.id}>{dept.name}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <Button 
                                    type="submit" fullWidth variant="contained" color="primary" 
                                    sx={{ mt: 3, py: 1.5, fontWeight: 'bold' }}
                                >
                                    Register Dept Admin
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

            </Grid>

            {/* --- SECTION 3: Pending CR Approvals (MUI DATA TABLE) --- */}
            <Box mt={5}>
                <Typography variant="h5" fontWeight="bold" color="error" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    ⏳ Pending CR Approvals
                </Typography>
                
                <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
                    <Table sx={{ minWidth: 700 }} aria-label="customized table">
                        <TableHead sx={{ backgroundColor: '#ffebee' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Roll No</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>School</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Course</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Sec/Year</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {pendingCRs.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                                        No pending CR registrations. All caught up! 🎉
                                    </TableCell>
                                </TableRow>
                            ) : (
                                pendingCRs.map((cr) => (
                                    <TableRow key={cr.id} hover>
                                        <TableCell sx={{ fontWeight: 'bold' }}>{cr.name}</TableCell>
                                        <TableCell>{cr.email}</TableCell>
                                        <TableCell><Chip label={cr.universityId} size="small" variant="outlined" /></TableCell>
                                        <TableCell>{cr.school || 'N/A'}</TableCell>
                                        <TableCell>{cr.course || 'N/A'}</TableCell>
                                        <TableCell>{cr.section || '-'} / {cr.year || '-'}</TableCell>
                                        <TableCell align="center">
                                            <Button 
                                                variant="contained" color="success" size="small"
                                                onClick={() => handleApproveCR(cr.id)}
                                                sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 'bold' }}
                                            >
                                                Approve
                                            </Button>
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

export default SubAdminDashboard;