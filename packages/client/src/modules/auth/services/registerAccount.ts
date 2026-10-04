import { createPasswordCredential } from "../credentials";
import type { RegistrationErrors, RegistrationInput, StoredAccount } from "../types";
import { normalizeEmail, validateRegistration } from "../validation";
import { readAccounts, writeAccounts } from "../../../services/storage/accountStorage";
import type { KeyValueStorage } from "../../../services/storage/accountStorage";

export type RegisterAccountResult =
| { status: 'success'; account: StoredAccount }
| { status: 'invalid'; errors: RegistrationErrors }

export async function registerAccount(
    registrationInput: RegistrationInput,
    storage: KeyValueStorage,
): Promise<RegisterAccountResult> {
    const validationErrors = validateRegistration(registrationInput);

    if (validationErrors) {
        return { status: 'invalid', errors: validationErrors };
    }

    const email = normalizeEmail(registrationInput.email);
    const accounts = readAccounts(storage);

    if (accounts.some((account) => account.email === email)) {
        return {
            status: 'invalid',
            errors: {
                fieldErrors: {
                    email: 'Ya existe una cuenta con este correo electrónico.',
                },
            },
        };
    }

    const credential = await createPasswordCredential(registrationInput.password);

    const account: StoredAccount = {
        fullName: registrationInput.fullName.trim(),
        email,
        credential,
        balanceCents: 0,
    };

    writeAccounts([...accounts, account], storage);
    return { status:'success', account }
}