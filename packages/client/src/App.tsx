import {  Alert, CircularProgress, Container, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { getHealth } from './services/api/health';

type HealthState =
  | { status: 'checking' }
  | { status: 'available' }
  | { status: 'unavailable'; message: string };
 

export function App() {
  const [health, setHealth] = useState<HealthState>({ status: 'checking' });

  useEffect(() => {
    const controller = new AbortController();
    void getHealth(controller.signal).then(
      () => setHealth({ status: 'available' }),
      (error: unknown) =>   {
        if(controller.signal.aborted) {
          return;
        }

        setHealth({ 
          status: 'unavailable',
          message: error instanceof Error ? error.message 
          : 'Ocurrio un error inesperado'
        });
      },
    );
    return () => controller.abort();
  }, []);

  return (
    <Container component="main" maxWidth="md" sx={{ py: 6 }}>
      <Typography component="h1" variant="h3">
        Slow Rush
      </Typography>
      <Typography color="text.secondary" sx={{ mt: 2 }}>
        Aplicación lista para configurar.
      </Typography>
      <Stack sx={{ mt: 4 }}>
        {health.status === 'checking' && (
          <Stack alignItems="center" direction="row" spacing={2}>
            <CircularProgress size={20} />
            <Typography>Comprobando conexión con la API...</Typography>
          </Stack>
        )}

        {health.status === 'available' && (
          <Alert severity="success">API disponible.</Alert>
        )}

        {health.status === 'unavailable' && (
          <Alert severity="error">
            No se pudo conectar con la API: {health.message}
          </Alert>
        )}
      </Stack>
    </Container>
  );
}
