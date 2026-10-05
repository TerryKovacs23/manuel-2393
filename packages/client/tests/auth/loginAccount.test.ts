import { describe, expect, it } from 'vitest';
import { createPasswordCredential } from '../../src/modules/auth/credentials';
import { loginAccount } from '../../src/modules/auth/services/loginAccount';
import {
  readAccounts,
  writeAccounts,
  type KeyValueStorage,
} from '../../src/services/storage/accountStorage';
import type { LoginInput, StoredAccount } from '../../src/modules/auth/types';

const validLogin: LoginInput = {
  email: 'ada@example.com',
  password: 'pas$word123',
};

const existingAccountPromise = createPasswordCredential(validLogin.password).then(
  (credential): StoredAccount => ({
    fullName: 'Ada Lovelace',
    email: 'ada@example.com',
    credential,
    balanceCents: 1250,
  }),
);

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

describe('loginAccount', () => {
  it('authenticates a matching account and returns its public profile', async () => {
    const storage = createMemoryStorage();
    const account = await existingAccountPromise;
    writeAccounts([account], storage);

    const result = await loginAccount(
      { ...validLogin, email: ' Ada@Example.COM ' },
      storage,
    );

    expect(result).toEqual({
      status: 'success',
      account: {
        fullName: account.fullName,
        email: account.email,
        balanceCents: account.balanceCents,
      },
    });

    if (result.status === 'success') {
      expect(result.account).not.toHaveProperty('credential');
    }
  });

  it('rejects an incorrect password with a generic message', async () => {
    const storage = createMemoryStorage();
    writeAccounts([await existingAccountPromise], storage);

    await expect(
      loginAccount({ ...validLogin, password: 'incorrecta' }, storage),
    ).resolves.toEqual({
      status: 'unauthenticated',
      message: 'El correo electrónico o la contraseña no son correctos.',
    });
  });

  it('rejects an email that has no registered account', async () => {
    const storage = createMemoryStorage();

    await expect(loginAccount(validLogin, storage)).resolves.toMatchObject({
      status: 'unauthenticated',
      message: 'El correo electrónico o la contraseña no son correctos.',
    });
  });

  it('returns validation errors without reading or writing accounts', async () => {
    const storage = createMemoryStorage();

    await expect(
      loginAccount({ email: 'no-es-un-correo', password: '' }, storage),
    ).resolves.toMatchObject({
      status: 'invalid',
      errors: {
        fieldErrors: {
          email: 'Ingresa un correo electrónico válido.',
          password: 'La contraseña es obligatoria.',
        },
      },
    });

    expect(readAccounts(storage)).toEqual([]);
  });

  it('propagates storage errors', async () => {
    const storage: KeyValueStorage = {
      getItem: () => {
        throw new Error('Storage unavailable');
      },
      setItem: () => {},
    };

    await expect(loginAccount(validLogin, storage)).rejects.toThrow(
      'No se pudieron leer las cuentas del almacenamiento local.',
    );
  });
});