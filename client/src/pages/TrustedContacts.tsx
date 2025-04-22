import React from 'react';
import { Box, Typography, Container, Paper } from '@mui/material';

const TrustedContacts: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Trusted Contacts
        </Typography>
        <Paper sx={{ p: 3 }}>
          <Typography variant="body1">
            This is where you can manage your trusted contacts who can access your vault in case of emergency.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default TrustedContacts; 