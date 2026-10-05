import type { LoginErrors, LoginInput, StoredAccount } from '../types';
import { verifyPassword } from '../credentials';
import { normalizeEmail, validateLogin } from '../validation';
import {
  readAccounts,
  type KeyValueStorage,
} from '../../../services/storage/accountStorage';

type AuthenticatedAccount = Pick<StoredAccount,'fullName' | 'email' | 'balanceCents'>;

export type LoginAccountResult =
  | { status: 'success'; account: AuthenticatedAccount }
  | { status: 'invalid'; errors: LoginErrors }
  | { status: 'unauthenticated'; message: string };

export async function loginAccount(loginInput: LoginInput, storage: KeyValueStorage,): Promise<LoginAccountResult> {
  const validationErrors = validateLogin(loginInput);

  if (validationErrors) {
    return { status: 'invalid', errors: validationErrors };
  }

  const email = normalizeEmail(loginInput.email);
  const account = readAccounts(storage).find(
    (storedAccount) => storedAccount.email === email,
  );

  if (!account || !(await verifyPassword(loginInput.password, account.credential))) {
    return {
      status: 'unauthenticated',
      message: 'El correo electrónico o la contraseña no son correctos.',
    };
  }

  return {
    status: 'success',
    account: {
      fullName: account.fullName,
      email: account.email,
      balanceCents: account.balanceCents,
    },
  };
}