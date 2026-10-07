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
  /**
   * What was submitted, echoed back on a validation error only. React resets a
   * form after its action completes, so without this the visitor would lose
   * everything they typed to a single mistake.
   */
  values?: Partial<Record<'name' | 'email' | 'message' | 'listing' | 'guests' | 'arriving', string>>;
}

export const initialEnquiryState: EnquiryState = {
  status: 'idle',
  message: '',
  fieldErrors: {},
};
