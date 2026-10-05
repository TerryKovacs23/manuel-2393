import { describe, expect, it } from 'vitest';
import {
  clearSession,
  readSession,
  writeSession,
} from '../../src/services/storage/sessionStorage';
import type { KeyValueStorage } from '../../src/services/storage/accountStorage';
import type { SessionData } from '../../src/modules/auth/types';

const STORAGE_KEY = 'slow-rush.session';

const session: SessionData = {
  version: 1,
  email: 'ada@example.com',
  fullName: 'Ada Lovelace',
  balanceCents: 1250,
  loggedInAt: '2026-10-05T00:00:00.000Z',
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
      removeItem(key) {
        values.delete(key);
      },
    },
    setRawValue(key, value) {
      values.set(key, value);
    },
  };
}

describe('readSession', () => {
  it('returns null when there is no session saved', () => {
    const { storage } = createMemoryStorage();

    expect(readSession(storage)).toBeNull();
  });

  it('reads a previously saved session', () => {
    const { storage } = createMemoryStorage();
    writeSession(session, storage);

    expect(readSession(storage)).toEqual(session);
  });

  it('throws when the stored JSON is malformed', () => {
    const { storage, setRawValue } = createMemoryStorage();
    setRawValue(STORAGE_KEY, '{invalid json');

    expect(() => readSession(storage)).toThrow(
      'Los datos de sesión almacenados no tienen un formato válido.',
    );
  });

  it('throws when storage cannot be read', () => {
    const storage: KeyValueStorage = {
      getItem: () => {
        throw new Error('Storage unavailable');
      },
      setItem: () => undefined,
    };

    expect(() => readSession(storage)).toThrow(
      'No se pudieron leer la sesión del almacenamiento local.',
    );
  });
});

describe('writeSession', () => {
  it('stores a versioned session envelope', () => {
    const { storage } = createMemoryStorage();

    writeSession(session, storage);

    const storedValue = storage.getItem(STORAGE_KEY);
    expect(storedValue).not.toBeNull();
    expect(JSON.parse(storedValue!)).toEqual({
      version: 1,
      email: session.email,
      fullName: session.fullName,
      balanceCents: session.balanceCents,
      loggedInAt: session.loggedInAt,
    });
  });

  it('throws when the session payload is invalid', () => {
    const { storage } = createMemoryStorage();
    const invalidSession = { ...session, balanceCents: -1 };

    expect(() => writeSession(invalidSession, storage)).toThrow(
      'No se pueden guardar datos de sesión con información no válida.',
    );
  });

  it('throws when storage cannot be written', () => {
    const storage: KeyValueStorage = {
      getItem: () => null,
      setItem: () => {
        throw new Error('Storage unavailable');
      },
    };

    expect(() => writeSession(session, storage)).toThrow(
      'No se pudieron guardar la sesión en el almacenamiento local.',
    );
  });
});

describe('clearSession', () => {
  it('removes the stored session and leaves the rest untouched', () => {
    const { storage } = createMemoryStorage();
    writeSession(session, storage);

    clearSession(storage);

    expect(readSession(storage)).toBeNull();
    expect(storage.getItem(STORAGE_KEY)).toBeNull();
  });
});
