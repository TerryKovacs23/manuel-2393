import type { KeyValueStorage } from './accountStorage';
import type { SessionData } from '../../modules/auth/types';

const STORAGE_KEY = 'slow-rush.session';
const STORAGE_VERSION = 1;

interface SessionEnvelope extends SessionData {
  version: 1;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isSessionData(value: unknown): value is SessionData {
  if (!isRecord(value)) {
    return false;
  }

  return (
    value.version === STORAGE_VERSION &&
    typeof value.email === 'string' &&
    value.email.trim().length > 0 &&
    typeof value.fullName === 'string' &&
    value.fullName.trim().length > 0 &&
    typeof value.balanceCents === 'number' &&
    Number.isSafeInteger(value.balanceCents) &&
    value.balanceCents >= 0 &&
    typeof value.loggedInAt === 'string' &&
    value.loggedInAt.length > 0
  );
}

export function readSession(storage: KeyValueStorage): SessionData | null {
  let serialized: string | null;

  try {
    serialized = storage.getItem(STORAGE_KEY);
  } catch {
    throw new Error('No se pudieron leer la sesión del almacenamiento local.');
  }

  if (serialized === null) {
    return null;
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(serialized);
  } catch {
    throw new Error('Los datos de sesión almacenados no tienen un formato válido.');
  }

  if (!isSessionData(parsed)) {
    throw new Error('Los datos de sesión almacenados no son válidos.');
  }

  return parsed;
}

export function writeSession(session: SessionData, storage: KeyValueStorage): void {
  const validSession = session;

  if (!isSessionData(validSession)) {
    throw new Error('No se pueden guardar datos de sesión con información no válida.');
  }

  const envelope: SessionEnvelope = {
    version: STORAGE_VERSION,
    email: validSession.email,
    fullName: validSession.fullName,
    balanceCents: validSession.balanceCents,
    loggedInAt: validSession.loggedInAt,
  };

  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(envelope));
  } catch {
    throw new Error('No se pudieron guardar la sesión en el almacenamiento local.');
  }
}

export function clearSession(storage: KeyValueStorage): void {
  if (typeof storage.removeItem === 'function') {
    try {
      storage.removeItem(STORAGE_KEY);
      return;
    } catch {
      throw new Error('No se pudieron borrar la sesión del almacenamiento local.');
    }
  }

  try {
    storage.setItem(STORAGE_KEY, '');
  } catch {
    throw new Error('No se pudieron borrar la sesión del almacenamiento local.');
  }
}
