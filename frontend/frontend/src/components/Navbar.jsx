import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// 🔥 MUI Components Import
import { AppBar, Toolbar, Typography, Button, Box, Avatar, Chip } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // LocalStorage se role nikal kar format kar rahe hain
    const rawRole = localStorage.getItem('userRole') || '';
    const displayRole = rawRole.replace('ROLE_', '').replace('_', ' ');

    // Login ya Register page par navbar mat dikhao
    if (location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/') {
        return null;
    }

    const handleLogout = () => {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('userRole');
        navigate('/login', { replace: true });
    };

    return (
        <AppBar 
            position="sticky" 
            elevation={3} 
            sx={{ 
                // 🔥 Naya Premium Dark Gradient Background
                background: 'linear-gradient(90deg, #0f2027 0%, #203a43 50%, #2c5364 100%)', 
                marginBottom: 4 
            }}
        >
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                
                {/* --- LEFT SECTION: Logo & Title --- */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar sx={{ bgcolor: '#ff5722', width: 35, height: 35 }}>🎓</Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: 1, color: '#ffffff' }}>
                        HelpDesk Pro
                    </Typography>
                </Box>

                {/* --- RIGHT SECTION: Role Badge & Logout --- */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    
                    {/* User Role dikhane ke liye stylish pill/chip */}
                    {displayRole && (
                        <Chip 
                            label={displayRole} 
                            size="small" 
                            sx={{ 
                                backgroundColor: 'rgba(255, 255, 255, 0.15)', 
                                color: 'white', 
                                fontWeight: 'bold',
                                letterSpacing: 0.5,
                                border: '1px solid rgba(255, 255, 255, 0.3)'
                            }} 
                        />
                    )}
                    
                    {/* Naya Rounded Logout Button */}
                    <Button 
                        variant="contained" 
                        color="error"
                        size="small"
                        onClick={handleLogout} 
                        endIcon={<LogoutIcon />}
                        sx={{ 
                            textTransform: 'none', 
                            borderRadius: '20px', // Pill shape
                            paddingX: 2,
                            fontWeight: 'bold',
                            boxShadow: 'none'
                        }}
                    >
                        Logout
                    </Button>
                </Box>
                
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;