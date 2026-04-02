import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import api from '../utils/api';

// 🔥 MUI Components
import { Container, Box, Typography, TextField, Button, Paper, Link, Grid } from '@mui/material';
import HowToRegIcon from '@mui/icons-material/HowToReg';

const RegisterCR = () => {
    // 👇 LOGIC EKDUM SAME HAI
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [universityId, setUniversityId] = useState(''); 
    const [school, setSchool] = useState('');
    const [course, setCourse] = useState('');
    const [section, setSection] = useState('');
    const [year, setYear] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/api/auth/register-cr', {
                name, email, password, universityId, school, course, section, year
            });
            alert(response.data);
            navigate('/login');
        } catch (error) {
            console.error("Registration Error:", error);
            alert("Registration Failed! Email might already exist.");
        }
    };

    // 👇 MUI UI JADU
    return (
        <Container component="main" maxWidth="sm">
            <Box sx={{ marginTop: 6, marginBottom: 6, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                
                <Paper elevation={5} sx={{ padding: 4, width: '100%', borderRadius: 3 }}>
                    
                    <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
                        <HowToRegIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                        <Typography component="h1" variant="h5" fontWeight="bold">
                            CR Registration
                        </Typography>
                        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                            Your account requires Admin approval before login.
                        </Typography>
                    </Box>

                    <Box component="form" onSubmit={handleRegister} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            {/* --- Basic Info --- */}
                            <Grid item xs={12} sm={6}>
                                <TextField required fullWidth label="Full Name" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField required fullWidth label="Roll No (e.g., CR-101)" value={universityId} onChange={(e) => setUniversityId(e.target.value)} />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField required fullWidth label="College Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                            </Grid>

                            {/* --- Academic Info --- */}
                            <Grid item xs={12} sm={6}>
                                <TextField required fullWidth label="School (e.g., SOE)" value={school} onChange={(e) => setSchool(e.target.value)} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField required fullWidth label="Course (e.g., B.Tech)" value={course} onChange={(e) => setCourse(e.target.value)} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField required fullWidth label="Section" value={section} onChange={(e) => setSection(e.target.value)} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField required fullWidth label="Year" value={year} onChange={(e) => setYear(e.target.value)} />
                            </Grid>

                            {/* --- Password --- */}
                            <Grid item xs={12}>
                                <TextField required fullWidth label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                            </Grid>
                        </Grid>

                        <Button type="submit" fullWidth variant="contained" size="large" sx={{ mt: 4, mb: 2, py: 1.5, borderRadius: 2, fontWeight: 'bold' }}>
                            Submit Request
                        </Button>
                        
                        <Box textAlign="center">
                            <Typography variant="body2">
                                Already registered?{' '}
                                <Link component={RouterLink} to="/login" variant="body2" underline="hover">
                                    Log in here
                                </Link>
                            </Typography>
                        </Box>
                    </Box>

                </Paper>
            </Box>
        </Container>
    );
};

export default RegisterCR;