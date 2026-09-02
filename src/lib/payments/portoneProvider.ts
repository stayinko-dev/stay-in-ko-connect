import { supabase } from "@/integrations/supabase/client";
import { CheckoutRequest, CheckoutResult, PaymentProvider } from "./types";

type PortOneConfig = { configured: boolean; storeId: string; channelKey: string };

type PortOneSdk = {
  requestPayment: (args: Record<string, unknown>) => Promise<{
    code?: string;
    message?: string;
    paymentId?: string;
    txId?: string;
  }>;
};

let configPromise: Promise<PortOneConfig> | null = null;
let sdkPromise: Promise<PortOneSdk> | null = null;

const getConfig = () => {
  if (!configPromise) {
    configPromise = supabase.functions
      .invoke("portone-verify", { body: { action: "config" } })
      .then(({ data, error }) => {
        if (error) throw error;
        return data as PortOneConfig;
      })
      .catch(() => ({ configured: false, storeId: "", channelKey: "" }));
  }
  return configPromise;
};

/** Loads the PortOne browser SDK once, from their CDN. */
const getSdk = () => {
  if (!sdkPromise) {
    sdkPromise = new Promise<PortOneSdk>((resolve, reject) => {
      const existing = (window as unknown as { PortOne?: PortOneSdk }).PortOne;
      if (existing) return resolve(existing);
      const script = document.createElement("script");
      script.src = "https://cdn.portone.io/v2/browser-sdk.js";
      script.async = true;
      script.onload = () => {
        const sdk = (window as unknown as { PortOne?: PortOneSdk }).PortOne;
        sdk ? resolve(sdk) : reject(new Error("PortOne SDK failed to load"));
      };
      script.onerror = () => reject(new Error("PortOne SDK failed to load"));
      document.head.appendChild(script);
    });
  }
  return sdkPromise;
};

/** Is PortOne ready to take real payments? */
export const isPortOneReady = async () => (await getConfig()).configured;

export const portoneProvider: PaymentProvider = {
  name: "portone",

  async createCheckout(request: CheckoutRequest): Promise<CheckoutResult> {
    const config = await getConfig();
    if (!config.configured) {
      return {
        success: false,
        provider: "portone",
        status: "unpaid",
        message: "Payments are not configured yet. Please try again later.",
      };
    }

    const paymentId = `booking_${request.bookingId}_${Date.now()}`;

    try {
      const PortOne = await getSdk();
      const response = await PortOne.requestPayment({
        storeId: config.storeId,
        channelKey: config.channelKey,
        paymentId,
        orderName: request.orderName,
        totalAmount: request.amount,
        currency: "CURRENCY_KRW",
        payMethod: "CARD",
        customData: JSON.stringify({ bookingId: request.bookingId }),
        customer: {
          email: request.buyerEmail,
          fullName: request.buyerName,
        },
        redirectUrl: `${window.location.origin}/mypage`,
      });

      if (response?.code) {
        return {
          success: false,
          provider: "portone",
          status: "failed",
          reference: paymentId,
          message: response.message || "Payment was cancelled or failed.",
        };
      }

      // Server-side verification is authoritative: it re-checks the payment
      // with PortOne and writes payment_status / payment_reference.
      const { data, error } = await supabase.functions.invoke("portone-verify", {
        body: { bookingId: request.bookingId, paymentId },
      });
      if (error) throw error;

      const status = (data?.status ?? "pending") as CheckoutResult["status"];
      return {
        success: status === "paid" || status === "pending",
        provider: "portone",
        status,
        reference: paymentId,
        message:
          status === "paid"
            ? "Payment completed."
            : status === "pending"
              ? "Payment is pending confirmation."
              : "We could not confirm this payment.",
      };
    } catch (err) {
      return {
        success: false,
        provider: "portone",
        status: "failed",
        reference: paymentId,
        message: err instanceof Error ? err.message : "Payment failed.",
      };
    }
  },
};
