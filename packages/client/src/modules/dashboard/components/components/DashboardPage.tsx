import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  clearSession,
  readSession,
} from '../../../../services/storage/sessionStorage';

export function DashboardPage() {
  const navigate = useNavigate();
  const session = readSession(window.localStorage);

  const handleLogout = () => {
    clearSession(window.localStorage);
    navigate('/login', { replace: true });
  };

  return (
    <Box
      component="main"
      sx={{
        bgcolor: 'background.default',
        minHeight: '100vh',
        py: { xs: 3, md: 6 },
      }}
    >
      <Container maxWidth="md">
        <Paper elevation={2} sx={{ p: { xs: 3, sm: 5 } }}>
          <Stack spacing={3}>
            <Typography component="h1" variant="h4">
              Dashboard
            </Typography>

            {session ? (
              <>
                <Typography variant="body1">
                  Bienvenido/a, {session.fullName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Correo: {session.email}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Saldo actual: ${session.balanceCents / 100}
                </Typography>
              </>
            ) : (
              <Typography color="text.secondary">
                No hay sesión activa.
              </Typography>
            )}

            <Button
              color="secondary"
              onClick={handleLogout}
              variant="contained"
            >
              Cerrar sesión
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}