import { manualProvider } from "./manualProvider";
import { isPortOneReady, portoneProvider } from "./portoneProvider";
import { CheckoutRequest, CheckoutResult, PaymentProvider } from "./types";

/**
 * Uses PortOne when its credentials are configured on the backend, and falls
 * back to the manual (no-charge) flow otherwise, so bookings never break.
 */
export const paymentProvider: PaymentProvider = {
  name: "portone",
  async createCheckout(request: CheckoutRequest): Promise<CheckoutResult> {
    const ready = await isPortOneReady();
    return ready ? portoneProvider.createCheckout(request) : manualProvider.createCheckout(request);
  },
};

export { isPortOneReady };
export * from "./types";
