import React from 'react';
import { Container, Typography, Button, Box } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import memoriesLogo from '../images/memoriesLogo.png';

const LandingPage = () => {
  const history = useHistory();

  return (
    <Box
      minHeight="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      style={{
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      }}
    >
      <Container maxWidth="sm" style={{ textAlign: 'center', background: 'rgba(255,255,255,0.9)', borderRadius: 16, padding: 32, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
        <img src={memoriesLogo} alt="Memories Logo" style={{ width: 80, marginBottom: 16 }} />
        <Typography variant="h3" component="h1" gutterBottom style={{ fontWeight: 700 }}>
          Welcome to Memories
        </Typography>
        <Typography variant="h6" color="textSecondary" paragraph>
          A modern social media app to share, like, and comment on your favorite moments. Built with the MERN stack.
        </Typography>
        <Box mt={4} display="flex" justifyContent="center" gap={2}>
          <Button variant="contained" color="primary" size="large" onClick={() => history.push('/posts')} style={{ marginRight: 16 }}>
            View Memories
          </Button>
          <Button variant="outlined" color="primary" size="large" onClick={() => history.push('/auth')}>
            Sign Up
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default LandingPage;
