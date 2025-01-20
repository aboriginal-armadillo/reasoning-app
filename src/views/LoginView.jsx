import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { TextField, Button, Container, Typography } from '@mui/material';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import GoogleIcon from '@mui/icons-material/Google';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            alert(`Login failed: ${error.message}`);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (error) {
            alert(`Google login failed: ${error.message}`);
        }
    };


    return (
        <Container maxWidth="xs">
            <Typography variant="h4" sx={{ mt: 4, mb: 2 }}>
                Login
            </Typography>
            <form onSubmit={handleLogin}>
                <TextField
                    label="Email"
                    fullWidth
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                    label="Password"
                    type="password"
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 2 }}
                >
                    Sign In
                </Button>

                <Button
                    fullWidth
                    variant="contained"
                    sx={{
                        mt: 2,
                        mb: 2,
                        backgroundColor: '#4285F4',
                        '&:hover': { backgroundColor: '#357ABD' }
                    }}
                    startIcon={<GoogleIcon />}
                    onClick={handleGoogleLogin}
                >
                    Continue with Google
                </Button>
            </form>
        </Container>
    );
}