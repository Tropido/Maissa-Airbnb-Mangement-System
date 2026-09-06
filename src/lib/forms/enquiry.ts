/**
 * Shared form state for the enquiry action.
 *
 * This lives outside the `'use server'` module on purpose: a server-action file
 * may only export async functions, so a plain constant exported from there
 * arrives as `undefined` on the client.
 */
export interface EnquiryState {
  status: 'idle' | 'success' | 'error';
  message: string;
  fieldErrors: Partial<Record<'name' | 'email' | 'message' | 'listing', string>>;
}

export const initialEnquiryState: EnquiryState = {
  status: 'idle',
  message: '',
  fieldErrors: {},
};
