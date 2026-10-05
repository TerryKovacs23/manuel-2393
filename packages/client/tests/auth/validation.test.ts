import { describe, expect, it } from 'vitest';

import { normalizeEmail, validateRegistration, validateLogin } from '../../src/modules/auth/validation';
import type { RegistrationInput, LoginInput } from '../../src/modules/auth/types'; 
// Arrange
const validRegistration: RegistrationInput = {
    fullName: 'Ada Lovelace',
    email: 'ada@example.com',
    password: 'pas$word123',
    confirmPassword: 'pas$word123',
}

const validLogin: LoginInput = {
    email: 'ada@example.com',
    password: 'pas$word123',
};

describe('normalizeEmail', () => {
    it('trims surrounding whitespace and converts the email to lowercase', () => {
        // Act - Assert
        expect(normalizeEmail(' Ada@Example.COM ')).toBe('ada@example.com');
    });
});

describe('validateRegistration', () => {
    it('returns null when the registration data is valid', () => {
        // Act - Assert
        expect(validateRegistration(validRegistration)).toBeNull();
    });

    it('reports all required fields when they are missing', () => {
        // Act
        const errors = validateRegistration({
            fullName: ' ',
            email: ' ',
            password: ' ',
            confirmPassword: ' ',
        });
        // Assert
        expect(errors?.fieldErrors).toEqual({
            fullName: 'El nombre completo es obligatorio.',
            email: 'El correo electrónico es obligatorio.',
            password: 'La contraseña es obligatoria.',
            confirmPassword: 'Confirma la contraseña.',
        });
    });

    it('rejects an invalid email fromat', () => {
        // Act
        const errors = validateRegistration({
            ...validRegistration,
            email: 'not-an-email',
        });
        // Assert
        expect(errors?.fieldErrors.email).toBe(
            'Ingresa un correo electrónico válido.',
        );
    });
    
    it('requires confirmation when a password is provided', () => {
        // Act
        const errors = validateRegistration({
            ...validRegistration,
            confirmPassword: '',
        });
        // Assert
        expect(errors?.fieldErrors.confirmPassword).toBe(
            'Confirma la contraseña.',
        );
    });

    it('requires an exact password match', () => {
        // Act
        const errors = validateRegistration({
            ...validRegistration,
            password: 'secret',
            confirmPassword: 'Secret'
        });
        // Assert
        expect(errors?.fieldErrors.confirmPassword).toBe(
            'Las contraseñas no coinciden.',
        );
    });
    it('rejects passwords that differ only by surrounding whitespace', () => {
        const errors = validateRegistration({
            ...validRegistration,
            password: 'secret ',
            confirmPassword: 'secret',
        });

        expect(errors?.fieldErrors.confirmPassword).toBe(
            'Las contraseñas no coinciden.',
        );
    }); 
});

describe('validateLogin', () =>{
    //Act & Assert
    it('returns null when the login data is valida', () => {
        expect(validateLogin(validLogin)).toBeNull();
    });
    // Act && Assert
    it('reports missing email and password', () => {
        expect(validateLogin({email: '', password: ''})?.fieldErrors).toEqual({
            email: 'El correo electrónico es obligatorio.',
            password: 'La contraseña es obligatoria.',
        });
    });
    
    const invalidLogin: LoginInput = {
        ...validLogin,
        email: 'no-email',
    };

    // Act && Assert
    it('rejects an invalid email format', () => {
        expect(validateLogin(invalidLogin)?.fieldErrors.email)
        .toBe('Ingresa un correo electrónico válido.');
    });
});