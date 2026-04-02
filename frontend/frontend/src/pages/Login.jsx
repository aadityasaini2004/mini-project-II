import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import api from '../utils/api';

// 🔥 MUI Components Import Kar Rahe Hain
import { 
    Container, 
    Box, 
    Typography, 
    TextField, 
    Button, 
    Paper, 
    Link 
} from '@mui/material';

const Login = () => {
    // 👇 LOGIC EKDUM SAME HAI (KUCH BHI CHANGE NAHI KIYA)
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        const rawRole = localStorage.getItem('userRole');

        if (token && rawRole) {
            const role = rawRole.replace('ROLE_', '').toUpperCase();
            if (role === 'ADMIN') navigate('/admin-dashboard', { replace: true });
            else if (role === 'SUB_ADMIN') navigate('/subadmin-dashboard', { replace: true });
            else if (role === 'DEPARTMENT_ADMIN' || role === 'DEPT_ADMIN') navigate('/dept-admin-dashboard', { replace: true });
            else if (role === 'STAFF') navigate('/staff-dashboard', { replace: true });
            else if (role === 'CR' || role === 'STUDENT') navigate('/cr-dashboard', { replace: true });
            else if (role === 'DEPARTMENT_HEAD' || role === 'DEPT_HEAD') navigate('/head-dashboard', { replace: true });
            else navigate('/dashboard', { replace: true });
        }
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/api/auth/login', { email, password });
            
            const token = response.data.token || response.data; 
            const rawRole = response.data.role || "ROLE_UNKNOWN"; 

            localStorage.setItem('jwtToken', token);
            localStorage.setItem('userRole', rawRole);

            const role = rawRole.replace('ROLE_', '').toUpperCase();

            if (role === 'ADMIN') navigate('/admin-dashboard', { replace: true });
            else if (role === 'SUB_ADMIN') navigate('/subadmin-dashboard', { replace: true });
            else if (role === 'DEPARTMENT_ADMIN' || role === 'DEPT_ADMIN') navigate('/dept-admin-dashboard', { replace: true });
            else if (role === 'STAFF') navigate('/staff-dashboard', { replace: true });
            else if (role === 'CR' || role === 'STUDENT') navigate('/cr-dashboard', { replace: true });
            else if (role === 'DEPARTMENT_HEAD' || role === 'DEPT_HEAD') navigate('/head-dashboard', { replace: true });
            else navigate('/dashboard', { replace: true }); 

        } catch (error) {
            console.error("Login Error:", error);
            alert("Login Failed! Please check your credentials.");
        }
    };

    // 👇 YAHAN SE MUI KA JADU SHURU (UI Part)
    return (
        <Container component="main" maxWidth="xs">
            {/* Box is like a modern div */}
            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                
                {/* Paper gives a nice card look with shadow (elevation) */}
                <Paper elevation={4} sx={{ padding: 4, width: '100%', borderRadius: 3 }}>
                    
                    <Typography component="h1" variant="h4" align="center" fontWeight="bold" gutterBottom>
                        Help Desk 🎓
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
                        Sign in to continue
                    </Typography>

                    <Box component="form" onSubmit={handleLogin} sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            sx={{ mt: 3, mb: 2, py: 1.5, borderRadius: 2, fontWeight: 'bold' }}
                        >
                            Login
                        </Button>
                        
                        <Box textAlign="center" sx={{ mt: 2 }}>
                            <Typography variant="body2">
                                New CR?{' '}
                                {/* MUI Link combined with React Router Link */}
                                <Link component={RouterLink} to="/register" variant="body2" underline="hover">
                                    Register Here
                                </Link>
                            </Typography>
                        </Box>
                    </Box>

                    <Box textAlign="right" sx={{ mt: 1, mb: 1 }}>
                    <Link component={RouterLink} to="/forgot-password" variant="body2" underline="hover">
                        Forgot password?
                        </Link>
                    </Box>

                </Paper>
            </Box>
        </Container>
    );
};

export default Login;