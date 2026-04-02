import React, { useState } from 'react';
import api from '../utils/api';

// 🔥 MUI Components Import
import { Box, Typography, TextField, Button, Paper, Grid, Container } from '@mui/material';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';

const DeptAdminDashboard = () => {
    // 👇 LOGIC WAHI PURANA HAI
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleCreateDeptHead = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/api/deptadmin/create-dept-head', {
                name: name,
                email: email,
                password: password
            });
            
            alert(response.data); 
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

    // 👇 MUI UI SHURU
    return (
        <Box sx={{ backgroundColor: '#f4f6f8', minHeight: '100vh', pt: 5, pb: 5 }}>
            <Container maxWidth="md">
                
                {/* Header Section */}
                <Box sx={{ mb: 4, textAlign: 'center' }}>
                    <Typography variant="h4" fontWeight="bold" color="primary" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                        <ManageAccountsIcon fontSize="large" /> Department Admin Panel
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                        Aap apne department ke liye ek 'Department Head' (Manager) create kar sakte hain.
                    </Typography>
                </Box>

                {/* Form Section in a Premium Card */}
                <Paper elevation={4} sx={{ padding: { xs: 3, md: 5 }, borderRadius: 3 }}>
                    <Typography variant="h5" fontWeight="bold" color="text.primary" mb={1} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PersonAddAlt1Icon color="primary" /> Add Department Head
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={4}>
                        Yeh naya user automatically aapke hi department se link ho jayega. Dropdown ki zaroorat nahi hai.
                    </Typography>

                    <Box component="form" onSubmit={handleCreateDeptHead}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField 
                                    fullWidth 
                                    label="Full Name" 
                                    placeholder="e.g., Amit Verma" 
                                    value={name} 
                                    onChange={(e) => setName(e.target.value)} 
                                    required 
                                    variant="outlined"
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField 
                                    fullWidth 
                                    label="Email Address" 
                                    type="email" 
                                    placeholder="amit.head@college.edu.in" 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)} 
                                    required 
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField 
                                    fullWidth 
                                    label="Password" 
                                    type="password" 
                                    placeholder="Create a strong password" 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    required 
                                />
                            </Grid>
                        </Grid>

                        <Box sx={{ mt: 4, textAlign: 'right' }}>
                            <Button 
                                type="submit" 
                                variant="contained" 
                                color="primary" 
                                size="large" 
                                sx={{ borderRadius: 2, fontWeight: 'bold', px: 4, py: 1.5 }}
                                startIcon={<PersonAddAlt1Icon />}
                            >
                                Register Dept Head
                            </Button>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default DeptAdminDashboard;