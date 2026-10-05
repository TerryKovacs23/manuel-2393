import {
  Alert,
  Box,
  Button,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
  Link,
} from '@mui/material';
import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { registerAccount } from '../services/registerAccount';
import type {
  RegistrationErrors,
  RegistrationInput,
} from '../types';

type FormFeedback = {
  severity: 'success' | 'error';
  message: string;
};

const emptyRegistration: RegistrationInput = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
};

export function RegistrationPage() {
  const [formData, setFormData] =
    useState<RegistrationInput>(emptyRegistration);
  const [fieldErrors, setFieldErrors] =
    useState<RegistrationErrors['fieldErrors']>({});
  const [feedback, setFeedback] = useState<FormFeedback | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFieldChange =
    (field: keyof RegistrationInput) =>
    (event: ChangeEvent<HTMLInputElement>) => {
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
      const result = await registerAccount(formData, window.localStorage);

      if (result.status === 'invalid') {
        setFieldErrors(result.errors.fieldErrors);
        return;
      }

      setFormData(emptyRegistration);
      setFeedback({
        severity: 'success',
        message: 'Tu cuenta se creó correctamente.',
      });
    } catch (error: unknown) {
      setFeedback({
        severity: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'No se pudo completar el registro.',
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
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'grid',
            gap: { xs: 2, md: 3 },
            gridTemplateColumns: { xs: '1fr', md: '0.9fr 1.1fr' },
          }}
        >
          <Paper
            component="section"
            elevation={2}
            sx={{
              bgcolor: 'primary.main',
              borderRadius: 3,
              color: 'primary.contrastText',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: { md: 580 },
              p: { xs: 3, sm: 5, md: 6 },
            }}
          >
            <Stack spacing={5}>
              <Typography component="p" fontWeight={700} variant="overline">
                Slow Rush
              </Typography>

              <Stack spacing={2}>
                <Typography
                  component="h1"
                  sx={{
                    fontSize: { xs: '2.5rem', sm: '3.25rem', md: '3.75rem' },
                    fontWeight: 700,
                    lineHeight: 1.1,
                  }}
                >
                  La emoción de las carreras, a un ritmo lento.
                </Typography>
                <Typography sx={{ opacity: 0.85 }} variant="h6">
                  Sigue cada carrera de caracoles y disfruta la experiencia
                  Slow Rush.
                </Typography>
              </Stack>
            </Stack>

            <Stack
              spacing={1}
              sx={{
                borderColor: 'primary.contrastText',
                borderTop: 1,
                mt: 6,
                opacity: 0.85,
                pt: 2,
              }}
            >
              <Typography fontWeight={600} variant="subtitle1">
                La adrenalina empieza aquí.
              </Typography>
              <Typography variant="body2">
                Crea tu cuenta completamente gratis. El registro es rápido y seguro.
              </Typography>
            </Stack>
          </Paper>

          <Paper
            component="section"
            elevation={2}
            sx={{
              borderRadius: 3,
              p: { xs: 3, sm: 5, md: 6 },
            }}
          >
            <Stack spacing={3}>
              <Stack spacing={1}>
                <Typography component="h2" variant="h4">
                  Crea tu cuenta
                </Typography>
                <Typography color="text.secondary">
                  Ingresa tus datos para unirte a Slow Rush.
                </Typography>
              </Stack>

              {feedback && (
                <Alert severity={feedback.severity}>{feedback.message}</Alert>
              )}

              <Stack
                component="form"
                noValidate
                spacing={2}
                onSubmit={handleSubmit}
              >
                <TextField
                  autoComplete="name"
                  disabled={isSubmitting}
                  error={Boolean(fieldErrors.fullName)}
                  helperText={fieldErrors.fullName ?? ' '}
                  label="Nombre completo"
                  onChange={handleFieldChange('fullName')}
                  required
                  value={formData.fullName}
                />

                <TextField
                  autoComplete="email"
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
                  autoComplete="new-password"
                  disabled={isSubmitting}
                  error={Boolean(fieldErrors.password)}
                  helperText={fieldErrors.password ?? ' '}
                  label="Contraseña"
                  onChange={handleFieldChange('password')}
                  required
                  type="password"
                  value={formData.password}
                />

                <TextField
                  autoComplete="new-password"
                  disabled={isSubmitting}
                  error={Boolean(fieldErrors.confirmPassword)}
                  helperText={fieldErrors.confirmPassword ?? ' '}
                  label="Confirmar contraseña"
                  onChange={handleFieldChange('confirmPassword')}
                  required
                  type="password"
                  value={formData.confirmPassword}
                />

                <Button
                  disabled={isSubmitting}
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                >
                  {isSubmitting ? 'Registrando…' : 'Crear cuenta'}
                </Button>
                <Typography color="text.secondary" variant="body2">
                    ¿Ya tienes cuenta?{' '}
                    <Link component={RouterLink} to="/login">
                        Iniciar sesión
                    </Link>
                </Typography>
              </Stack>
            </Stack>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
}
