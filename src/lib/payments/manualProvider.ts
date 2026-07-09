import { CheckoutRequest, CheckoutResult, PaymentProvider } from "./types";

/**
 * Temporary stand-in until a real PG (PortOne, Toss, etc.) is integrated.
 *
 * It does NOT charge anyone. It simply marks the booking as "pending"
 * payment so the rest of the app (host dashboard, booking status, etc.)
 * already works with the payment_status field. Replace this with a real
 * provider before taking real bookings publicly.
 */
export const manualProvider: PaymentProvider = {
  name: "manual",

  async createCheckout(request: CheckoutRequest): Promise<CheckoutResult> {
    console.warn(
      "[payments] No payment gateway is connected yet. " +
        `Booking ${request.bookingId} (₩${request.amount.toLocaleString("ko-KR")}) ` +
        "was created without a real charge."
    );
    return {
      success: true,
      provider: "manual",
      status: "pending",
      message: "Payment integration is not live yet; the host will be asked to confirm payment manually.",
    };
  },
};
