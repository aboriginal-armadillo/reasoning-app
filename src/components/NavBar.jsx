import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useAuth } from '../AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

export default function NavBar() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();


  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AppBar position="static" sx={{ mb: 4 }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Button color="inherit" component={Link} to="/">
            Reasoning Studio
          </Button>
        </Typography>

        {currentUser && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              color="inherit"
              component={Link}
              to="/create"
              sx={{ textTransform: 'none' }}
            >
              + New Project
            </Button>

            <Typography variant="subtitle1" sx={{ mr: 2 }}>
              {currentUser.email}
            </Typography>

            <Button
              color="inherit"
              onClick={handleLogout}
              variant="outlined"
              sx={{
                borderColor: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.08)'
                }
              }}
            >
              Logout
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}