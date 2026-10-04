import { describe, expect, it } from 'vitest';
import { registerAccount } from '../../src/modules/auth/services/registerAccount';
import { readAccounts, writeAccounts } from '../../src/services/storage/accountStorage';
import type { KeyValueStorage } from '../../src/services/storage/accountStorage';
import type { RegistrationInput, StoredAccount } from '../../src/modules/auth/types';
// Arrange 
const STORAGE_KEY = 'slow-rush.accounts';

const validRegistration: RegistrationInput = {
    fullName: ' Ada Lovelace ',
    email: ' Ada@Example.COM ',
    password: 'pas$word123',
    confirmPassword: 'pas$word123',
};

const existingAccount: StoredAccount = {
    fullName: 'Ada Lovelace',
    email: 'ada@example.com',
    credential: {
        version: 1,
        kdf: 'PBKDF2',
        digest: 'SHA-256',
        iterations: 600_000,
        saltBase64: 'AAAAAAAAAAAAAAAAAAAAAA==',
        verifierBase64: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=',
    },
    balanceCents: 0,
};

function createMemoryStorage(): KeyValueStorage {
    const values = new Map<string, string>();

    return {
        getItem(key) {
            return values.get(key) ?? null;
        },
        setItem(key, value) {
            values.set(key, value);
        },
    };
}

describe('registerAccount', () => {
    it('creates and persists a normalized account with an initial zero balance', async () => {
        //Arrange
        const storage = createMemoryStorage();
        // Act
        const result = await registerAccount(validRegistration, storage);
        // Assert
        expect(result.status).toBe('success');

        if (result.status !== 'success') {
            return;
        }

        expect(result.account).toMatchObject({
            fullName: 'Ada Lovelace',
            email: 'ada@example.com',
            balanceCents: 0,
            credential: {
                version: 1,
                kdf: 'PBKDF2',
                digest: 'SHA-256',
                iterations: 600_000,
            },
        });
        expect(readAccounts(storage)).toEqual([result.account]);

        const storedData = storage.getItem(STORAGE_KEY);
        expect(storedData).not.toBeNull();
        expect(storedData).not.toContain(validRegistration.password);
    });

    it('returns validation errors without persisting an account', async () => {
        //Arrange
        const storage = createMemoryStorage();
        // Act
        const result = await registerAccount(
            { ...validRegistration, fullName: '  ' },
            storage,
        );
        // Assert
        expect(result).toMatchObject({
            status: 'invalid',
            errors: {
                fieldErrors: {
                    fullName: 'El nombre completo es obligatorio.',
                },
            },
        });
        expect(readAccounts(storage)).toEqual([]);
    });

    it('rejects an email that already exists after normalization', async () => {
        //Arrange
        const storage = createMemoryStorage();
        writeAccounts([existingAccount], storage);
        // Act
        const result = await registerAccount(
            { ...validRegistration, email: ' ADA@EXAMPLE.COM ' },
            storage,
        );
        // Assert
        expect(result).toMatchObject({
            status: 'invalid',
            errors: {
                fieldErrors: {
                    email: 'Ya existe una cuenta con este correo electrónico.',
                },
            },
        });
        expect(readAccounts(storage)).toEqual([existingAccount]);
    });

    it('propaga un error cuando no se puede persistir la cuenta', async () => {
        const storage: KeyValueStorage = {
            getItem: () => null,
            setItem: () => {
                throw new Error('Storage unavailable');
            },
        };

        await expect(registerAccount(validRegistration, storage)).rejects.toThrow(
            'No se pudieron guardar las cuentas en el almacenamiento local.',
        );
});
});