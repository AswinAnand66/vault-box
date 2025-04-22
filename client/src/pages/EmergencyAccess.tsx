import React from 'react';
import { Box, Typography, Container, Paper } from '@mui/material';

const EmergencyAccess: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Emergency Access
        </Typography>
        <Paper sx={{ p: 3 }}>
          <Typography variant="body1">
            This is where you can request emergency access to a vault or manage emergency access requests.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default EmergencyAccess; 