import type { PasswordCredential, StoredAccount } from '../../modules/auth/types';

export interface KeyValueStorage {
    getItem(key: string): string | null;
    setItem(key: string, value: string): void;
}

interface StoredAccountsEnvelope {
    version: 1
    accounts: StoredAccount[];
}

const STORAGE_KEY = 'slow-rush.accounts';
const STORAGE_VERSION = 1;

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isPasswordCredential(value: unknown): value is PasswordCredential {
    if (!isRecord(value)) {
        return false;
    }

    return (
    value.version === 1 &&
    value.kdf === 'PBKDF2' &&
    value.digest === 'SHA-256' &&
    typeof value.iterations === 'number' &&
    Number.isSafeInteger(value.iterations) &&
    value.iterations > 0 &&
    typeof value.saltBase64 === 'string' &&
    typeof value.verifierBase64 === 'string'
  );
}

function isStoredAccount(value: unknown): value is StoredAccount {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.fullName === 'string' &&
    value.fullName.trim().length > 0 &&
    typeof value.email === 'string' &&
    value.email.trim().length > 0 &&
    isPasswordCredential(value.credential) &&
    typeof value.balanceCents === 'number' &&
    Number.isSafeInteger(value.balanceCents) &&
    value.balanceCents >= 0
  );
}

function isStoredAccountsEnvelope(
  value: unknown,
): value is StoredAccountsEnvelope {
  return (
    isRecord(value) &&
    value.version === STORAGE_VERSION &&
    Array.isArray(value.accounts) &&
    value.accounts.every(isStoredAccount)
  );
}

export function readAccounts(storage: KeyValueStorage): StoredAccount[] {
  let serialized: string | null;

  try {
    serialized = storage.getItem(STORAGE_KEY);
  } catch {
    throw new Error('No se pudieron leer las cuentas del almacenamiento local.');
  }

  if (serialized === null) {
    return [];
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(serialized);
  } catch {
    throw new Error('Los datos de cuentas almacenados no tienen un formato válido.');
  }

  if (!isStoredAccountsEnvelope(parsed)) {
    throw new Error('Los datos de cuentas almacenados no son válidos.');
  }

  return parsed.accounts;
}

export function writeAccounts(
  accounts: StoredAccount[],
  storage: KeyValueStorage,
): void {
  if (!accounts.every(isStoredAccount)) {
    throw new Error('No se pueden guardar cuentas con datos no válidos.');
  }

  const envelope: StoredAccountsEnvelope = {
    version: STORAGE_VERSION,
    accounts,
  };

  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(envelope));
  } catch {
    throw new Error('No se pudieron guardar las cuentas en el almacenamiento local.');
  }
}