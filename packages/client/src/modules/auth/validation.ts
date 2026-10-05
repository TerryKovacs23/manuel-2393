import type { RegistrationErrors, RegistrationInput, LoginInput, LoginErrors } from './types';

const EMAIL_FORMAT = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function validateRegistration(
  registrationInput: RegistrationInput,
): RegistrationErrors | null {
  const fieldErrors: RegistrationErrors['fieldErrors'] = {};

  if (!registrationInput.fullName.trim()) {
    fieldErrors.fullName = 'El nombre completo es obligatorio.';
  }

  const normalizedEmail = normalizeEmail(registrationInput.email);

  if (!normalizedEmail) {
    fieldErrors.email = 'El correo electrónico es obligatorio.';
  } else if (!EMAIL_FORMAT.test(normalizedEmail)) {
    fieldErrors.email = 'Ingresa un correo electrónico válido.';
  }

  if (!registrationInput.password.trim()) {
    fieldErrors.password = 'La contraseña es obligatoria.';
  }

  if (!registrationInput.confirmPassword.trim()) {
    fieldErrors.confirmPassword = 'Confirma la contraseña.';
  } else if (
    registrationInput.password.trim() &&
    registrationInput.password !== registrationInput.confirmPassword
  ) {
    fieldErrors.confirmPassword = 'Las contraseñas no coinciden.';
  }

  if (Object.keys(fieldErrors).length === 0) {
    return null;
  }

  return { fieldErrors };
}

export function validateLogin(loginInput: LoginInput): LoginErrors | null {
  const fieldErrors: LoginErrors['fieldErrors'] = {};
  const normalizedEmail = normalizeEmail(loginInput.email);

  if(!normalizedEmail) {
    fieldErrors.email = 'El correo electrónico es obligatorio.';
  } else if (!EMAIL_FORMAT.test(normalizedEmail)) {
    fieldErrors.email = 'Ingresa un correo electrónico válido.';
  }

  if(!loginInput.password) {
    fieldErrors.password = 'La contraseña es obligatoria.';
  }

  if(Object.keys(fieldErrors).length === 0) {
    return null
  }

  return { fieldErrors };
}