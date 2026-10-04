import { describe, expect, it } from 'vitest';
import {
    readAccounts,
    writeAccounts,
} from '../../src/services/storage/accountStorage';
import type { KeyValueStorage } from '../../src/services/storage/accountStorage';
import type { StoredAccount } from '../../src/modules/auth/types';

const STORAGE_KEY = 'slow-rush.accounts';

const account: StoredAccount = {
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

function createMemoryStorage(): {
    storage: KeyValueStorage;
    setRawValue: (key: string, value: string) => void;
} {
    const values = new Map<string, string>();

    return {
        storage: {
            getItem(key) {
                return values.get(key) ?? null;
            },
            setItem(key, value) {
                values.set(key, value);
            },
        },
        setRawValue(key, value) {
            values.set(key, value);
        },
    };
}

describe('readAccounts', () => {
    it('returns an empty list when no accounts have been saved', () => {
        // Arrange
        const { storage } = createMemoryStorage();
        // Act & Assert
        expect(readAccounts(storage)).toEqual([]);
    });

    it('reads accounts previously written to storage', () => {
        // Arrange
        const { storage } = createMemoryStorage();

        // Act
        writeAccounts([account], storage);

        // Assert
        expect(readAccounts(storage)).toEqual([account]);
    });

    it('throws when stored JSON is malformed', () => {
        // Arrange
        const { storage, setRawValue } = createMemoryStorage();
        setRawValue(STORAGE_KEY, '{invalid json');

        // Act & Assert
        expect(() => readAccounts(storage)).toThrow(
            'Los datos de cuentas almacenados no tienen un formato válido.',
        );
    });

    it('throws when storage cannot be read', () => {
        // Arrange
        const storage: KeyValueStorage = {
            getItem: () => {
                throw new Error('Storage unavailable');
            },
            setItem: () => undefined,
        };
        // Act & Assert
        expect(() => readAccounts(storage)).toThrow(
            'No se pudieron leer las cuentas del almacenamiento local.',
        );
    });

    it('throws when the stored envelope is invalid', () => {
        // Arrange
        const { storage, setRawValue } = createMemoryStorage();
        setRawValue(
            STORAGE_KEY,
            JSON.stringify({ version: 2, accounts: [] }),
        );
        // Act & Assert
        expect(() => readAccounts(storage)).toThrow(
            'Los datos de cuentas almacenados no son válidos.',
        );
    });
});

describe('writeAccounts', () => {
    it('stores a versioned envelope', () => {
        // Arrange
        const { storage } = createMemoryStorage();
        // Act
        writeAccounts([account], storage);
        // Assert
        const storedValue = storage.getItem(STORAGE_KEY);
        expect(storedValue).not.toBeNull();
        expect(JSON.parse(storedValue!)).toEqual({
        version: 1,
        accounts: [account],
        });
    });

    it('rejects accounts with invalid data', () => {
        // Arrange
        const { storage } = createMemoryStorage();
        const invalidAccount: StoredAccount = {
            ...account,
            balanceCents: -1,
        };
        // Act & Assert
        expect(() => writeAccounts([invalidAccount], storage)).toThrow(
            'No se pueden guardar cuentas con datos no válidos.',
        );
    });

    it('throws when storage cannot be written', () => {
        // Arrange
        const storage: KeyValueStorage = {
            getItem: () => null,
            setItem: () => {
                throw new Error('Storage unavailable');
            },
        };
        // Act & Assert
        expect(() => writeAccounts([account], storage)).toThrow(
            'No se pudieron guardar las cuentas en el almacenamiento local.',
        );
    });
});