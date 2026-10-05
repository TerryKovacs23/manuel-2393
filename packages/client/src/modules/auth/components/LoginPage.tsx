import {
  Alert,
  Box,
  Button,
  Container,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { loginAccount } from '../services/loginAccount';
import type { LoginErrors, LoginInput } from '../types';
import { writeSession } from '../../../services/storage/sessionStorage';

type FormFeedback = {
  message: string;
};

const emptyLogin: LoginInput = {
  email: '',
  password: '',
};

export function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginInput>(emptyLogin);
  const [fieldErrors, setFieldErrors] =
    useState<LoginErrors['fieldErrors']>({});
  const [feedback, setFeedback] = useState<FormFeedback | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFieldChange =
    (field: keyof LoginInput) => (event: ChangeEvent<HTMLInputElement>) => {
      setFormData((current) => ({
        ...current,
        [field]: event.target.value,
      }));
      setFieldErrors({});
      setFeedback(null);
    };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFieldErrors({});
    setFeedback(null);
    setIsSubmitting(true);

    try {
      const result = await loginAccount(formData, window.localStorage);

      if (result.status === 'invalid') {
        setFieldErrors(result.errors.fieldErrors);
        return;
      }

      if (result.status === 'unauthenticated') {
        setFeedback({ message: result.message });
        return;
      }

      if (result.status === 'success') {
        writeSession(
        {
          version: 1,
          email: result.account.email,
          fullName: result.account.fullName,
          balanceCents: result.account.balanceCents,
          loggedInAt: new Date().toISOString(),
        },
        window.localStorage,);

        navigate('/dashboard', { state: { account: result.account } });
        return;
      }
    } catch (error: unknown) {
      setFeedback({
        message:
          error instanceof Error
            ? error.message
            : 'No se pudo iniciar sesión.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      component="main"
      sx={{
        alignItems: 'center',
        bgcolor: 'background.default',
        display: 'flex',
        minHeight: '100vh',
        py: { xs: 3, md: 6 },
      }}
    >
      <Container maxWidth="sm">
        <Paper component="section" elevation={2} sx={{ p: { xs: 3, sm: 5 } }}>
          <Stack spacing={3}>
            <Stack spacing={1}>
              <Typography component="p" fontWeight={700} variant="overline">
                Slow Rush
              </Typography>
              <Typography component="h1" variant="h4">
                Inicia sesión
              </Typography>
              <Typography color="text.secondary">
                Ingresa las credenciales de tu cuenta.
              </Typography>
            </Stack>

            {feedback && <Alert severity="error">{feedback.message}</Alert>}

            <Stack
              component="form"
              noValidate
              spacing={2}
              onSubmit={handleSubmit}
            >
              <TextField
                autoComplete="username"
                disabled={isSubmitting}
                error={Boolean(fieldErrors.email)}
                helperText={fieldErrors.email ?? ' '}
                label="Correo electrónico"
                onChange={handleFieldChange('email')}
                required
                type="email"
                value={formData.email}
              />

              <TextField
                autoComplete="current-password"
                disabled={isSubmitting}
                error={Boolean(fieldErrors.password)}
                helperText={fieldErrors.password ?? ' '}
                label="Contraseña"
                onChange={handleFieldChange('password')}
                required
                type="password"
                value={formData.password}
              />

              <Button
                disabled={isSubmitting}
                fullWidth
                size="large"
                type="submit"
                variant="contained"
              >
                {isSubmitting ? 'Ingresando…' : 'Iniciar sesión'}
              </Button>
            </Stack>

            <Typography color="text.secondary" variant="body2">
              ¿Aún no tienes cuenta?{' '}
              <Link component={RouterLink} to="/register">
                Crear una cuenta
              </Link>
            </Typography>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}