import { describe, expect, it } from 'vitest';
import {
  createPasswordCredential,
  verifyPassword,
} from '../../src/modules/auth/credentials';
import type { PasswordCredential } from '../../src/modules/auth/types';

const password = 'pas$word123';

const credentialWithValidMetadata: PasswordCredential = {
  version: 1,
  kdf: 'PBKDF2',
  digest: 'SHA-256',
  iterations: 600_000,
  saltBase64: btoa('salt'),
  verifierBase64: btoa('verifier'),
};

describe('createPasswordCredential', () => {
  it('creates a credential with the expected algorithm and byte lengths', async () => {
    const credential = await createPasswordCredential(password);

    expect(credential).toMatchObject({
      version: 1,
      kdf: 'PBKDF2',
      digest: 'SHA-256',
      iterations: 600_000,
    });
    expect(atob(credential.saltBase64)).toHaveLength(16);
    expect(atob(credential.verifierBase64)).toHaveLength(32);
    expect(credential).not.toHaveProperty('password');
  });

  it('uses a different random salt for each credential', async () => {
    const firstCredential = await createPasswordCredential(password);
    const secondCredential = await createPasswordCredential(password);

    expect(firstCredential.saltBase64).not.toBe(secondCredential.saltBase64);
  });
});

describe('verifyPassword', () => {
  it('accepts the original password and rejects a different one', async () => {
    const credential = await createPasswordCredential(password);

    await expect(verifyPassword(password, credential)).resolves.toBe(true);
    await expect(verifyPassword('another-password', credential)).resolves.toBe(
      false,
    );
  });

  it('rejects unsupported credential metadata', async () => {
    const credential = {
      ...credentialWithValidMetadata,
      iterations: 1,
    };

    await expect(verifyPassword(password, credential)).resolves.toBe(false);
  });

  it('rejects invalid Base64 data', async () => {
    const credential = {
      ...credentialWithValidMetadata,
      saltBase64: '%%%',
    };

    await expect(verifyPassword(password, credential)).resolves.toBe(false);
  });

  it('rejects salt and verifier with unexpected lengths', async () => {
    await expect(
      verifyPassword(password, credentialWithValidMetadata),
    ).resolves.toBe(false);
  });
});