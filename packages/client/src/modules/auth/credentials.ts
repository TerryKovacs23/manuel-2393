import type { PasswordCredential } from './types';

type CryptoBytes = Uint8Array<ArrayBuffer>;

const KDF_ITERATIONS = 600_000;
const SALT_LENGTH_BYTES = 16;
const VERIFIER_LENGTH_BITS = 256;
const VERIFIER_LENGTH_BYTES = VERIFIER_LENGTH_BITS / 8;
const encoder = new TextEncoder();

function bytesToBase64(bytes: CryptoBytes): string {
  let binary = '';

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary);
}

function base64ToBytes(value: string): CryptoBytes | null {
  try {
    const binary = atob(value);
    const bytes = new Uint8Array(binary.length);

    for (let index = 0; index < binary.length; index += 1) {
      bytes[index] = binary.charCodeAt(index);
    }

    return bytes;
  } catch {
    return null;
  }
}

async function deriveVerifier(
  password: string,
  salt: CryptoBytes,
): Promise<CryptoBytes> {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  );

  const verifier = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt,
      iterations: KDF_ITERATIONS,
      hash: 'SHA-256',
    },
    key,
    VERIFIER_LENGTH_BITS,
  );

  return new Uint8Array(verifier);
}

function matchesBytes(actual: CryptoBytes, expected: CryptoBytes): boolean {
  if (actual.length !== expected.length) {
    return false;
  }

  // Compara todos los bytes, sin salir en el primer desacuerdo.
  let difference = 0;

  for (let index = 0; index < actual.length; index += 1) {
    const actualByte = actual[index] ?? 0;
    const expectedByte = expected[index] ?? 0;
    difference |= actualByte ^ expectedByte;
  }

  return difference === 0;
}

export async function createPasswordCredential(
  password: string,
): Promise<PasswordCredential> {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH_BYTES));
  const verifier = await deriveVerifier(password, salt);

  return {
    version: 1,
    kdf: 'PBKDF2',
    digest: 'SHA-256',
    iterations: KDF_ITERATIONS,
    saltBase64: bytesToBase64(salt),
    verifierBase64: bytesToBase64(verifier),
  };
}

export async function verifyPassword(
  password: string,
  credential: PasswordCredential,
): Promise<boolean> {
  if (
    credential.version !== 1 ||
    credential.kdf !== 'PBKDF2' ||
    credential.digest !== 'SHA-256' ||
    credential.iterations !== KDF_ITERATIONS
  ) {
    return false;
  }

  const salt = base64ToBytes(credential.saltBase64);
  const expectedVerifier = base64ToBytes(credential.verifierBase64);

  if (
    !salt ||
    salt.length !== SALT_LENGTH_BYTES ||
    !expectedVerifier ||
    expectedVerifier.length !== VERIFIER_LENGTH_BYTES
  ) {
    return false;
  }

  const actualVerifier = await deriveVerifier(password, salt);
  return matchesBytes(actualVerifier, expectedVerifier);
}