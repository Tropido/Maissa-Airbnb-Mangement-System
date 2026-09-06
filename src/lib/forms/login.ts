/**
 * Shared form state for the magic-link action. Kept out of the `'use server'`
 * module for the same reason as the enquiry state — server-action files may only
 * export async functions.
 */
export interface LoginState {
  status: 'idle' | 'sent' | 'error' | 'unconfigured';
  message: string;
}

export const initialLoginState: LoginState = { status: 'idle', message: '' };
