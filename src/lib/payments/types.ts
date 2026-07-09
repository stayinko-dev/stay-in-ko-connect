/**
 * Payment provider abstraction.
 *
 * No real payment gateway is connected yet. When one is chosen (PortOne,
 * Toss Payments, etc.), create a new file in this folder (e.g. `portone.ts`)
 * that implements `PaymentProvider`, and swap the export in `index.ts`.
 * Nothing outside this folder should need to change.
 */

export interface CheckoutRequest {
  bookingId: string;
  amount: number; // KRW, integer
  orderName: string;
  buyerEmail?: string;
  buyerName?: string;
}

export interface CheckoutResult {
  /** Whether the checkout was successfully started/completed. */
  success: boolean;
  /** Provider identifier, e.g. "portone", "toss", "manual". */
  provider: string;
  /** Provider-side transaction/payment reference, if any. */
  reference?: string;
  /** New payment status to persist on the booking. */
  status: "unpaid" | "pending" | "paid" | "failed";
  /** User-facing message, e.g. reason for failure. */
  message?: string;
}

export interface PaymentProvider {
  /** Human-readable provider name shown in UI/logs. */
  readonly name: string;

  /**
   * Starts (and for redirect-based PGs, completes) a checkout for a booking.
   * Real implementations will open a PG widget/redirect and verify the
   * result with the provider's server-side API before returning "paid".
   */
  createCheckout(request: CheckoutRequest): Promise<CheckoutResult>;
}
