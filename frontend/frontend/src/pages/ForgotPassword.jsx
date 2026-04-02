import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import api from '../utils/api';

// 🔥 MUI Components
import { Container, Box, Typography, TextField, Button, Paper, Link } from '@mui/material';
import LockResetIcon from '@mui/icons-material/LockReset';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';

const ForgotPassword = () => {
    // UI Steps handle karne ke liye (1 = Email daalo, 2 = OTP aur Naya Password daalo)
    const [step, setStep] = useState(1); 
    
    // Form States
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const navigate = useNavigate();

    // STEP 1: OTP Bhejne ka function
    const handleSendOtp = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/api/auth/forgot-password', { email });
            alert(response.data); // Backend ka success message
            setStep(2); // Form ko Step 2 par bhej do
        } catch (error) {
            console.error(error);
            alert(error.response?.data || "Email not found or failed to send OTP!");
        }
    };

    // STEP 2: OTP Verify karke Password Reset karne ka function
    const handleResetPassword = async (e) => {
        e.preventDefault();
        
        if (newPassword !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            const response = await api.post('/api/auth/reset-password', {
                email,
                otp,
                newPassword
            });
            alert(response.data);
            navigate('/login', { replace: true }); // Reset hote hi Login pe fek do
        } catch (error) {
            console.error(error);
            alert(error.response?.data || "Invalid OTP or OTP expired!");
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Paper elevation={4} sx={{ padding: 4, width: '100%', borderRadius: 3 }}>
                    
                    <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
                        {step === 1 ? (
                            <LockResetIcon color="primary" sx={{ fontSize: 45, mb: 1 }} />
                        ) : (
                            <MarkEmailReadIcon color="success" sx={{ fontSize: 45, mb: 1 }} />
                        )}
                        <Typography component="h1" variant="h5" fontWeight="bold">
                            {step === 1 ? 'Forgot Password?' : 'Enter OTP'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                            {step === 1 
                                ? "Enter your registered email address and we'll send you a 4-digit OTP to reset your password." 
                                : `We've sent a 4-digit OTP to ${email}. Please enter it below along with your new password.`}
                        </Typography>
                    </Box>

                    {/* Form Conditional Rendering */}
                    {step === 1 ? (
                        <Box component="form" onSubmit={handleSendOtp} sx={{ mt: 1 }}>
                            <TextField
                                margin="normal" required fullWidth autoFocus
                                id="email" label="Email Address" type="email"
                                value={email} onChange={(e) => setEmail(e.target.value)}
                            />
                            <Button type="submit" fullWidth variant="contained" size="large" sx={{ mt: 2, mb: 2, borderRadius: 2, fontWeight: 'bold' }}>
                                Send OTP
                            </Button>
                        </Box>
                    ) : (
                        <Box component="form" onSubmit={handleResetPassword} sx={{ mt: 1 }}>
                            <TextField
                                margin="normal" required fullWidth autoFocus
                                id="otp" label="4-Digit OTP" type="text"
                                inputProps={{ maxLength: 4 }}
                                value={otp} onChange={(e) => setOtp(e.target.value)}
                            />
                            <TextField
                                margin="normal" required fullWidth
                                id="newPassword" label="New Password" type="password"
                                value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <TextField
                                margin="normal" required fullWidth
                                id="confirmPassword" label="Confirm New Password" type="password"
                                value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <Button type="submit" fullWidth variant="contained" color="success" size="large" sx={{ mt: 2, mb: 2, borderRadius: 2, fontWeight: 'bold' }}>
                                Reset Password
                            </Button>
                        </Box>
                    )}

                    <Box textAlign="center" sx={{ mt: 1 }}>
                        <Link component={RouterLink} to="/login" variant="body2" underline="hover">
                            Back to Login
                        </Link>
                    </Box>

                </Paper>
            </Box>
        </Container>
    );
};

export default ForgotPassword;