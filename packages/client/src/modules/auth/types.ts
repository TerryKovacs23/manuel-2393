export interface RegistrationInput{
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface RegistrationErrors {
    fieldErrors: Partial<Record<keyof RegistrationInput, string>> & { message?: string };
}

export interface PasswordCredential {
    version: 1;
    kdf: 'PBKDF2';
    digest: 'SHA-256';
    iterations: number;
    saltBase64: string;
    verifierBase64: string;
}

export interface StoredAccount {
    fullName: string;
    email: string;
    credential: PasswordCredential;
    balanceCents: number;
}

export interface SessionData {
    version: 1;
    email: string;
    fullName: string;
    balanceCents: number;
    loggedInAt: string;
}

export interface LoginInput {
    email: string;
    password: string;
}

export interface LoginErrors {
    fieldErrors: Partial<Record<keyof LoginInput, string>>;
}