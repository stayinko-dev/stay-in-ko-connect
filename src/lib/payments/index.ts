import { manualProvider } from "./manualProvider";
import { PaymentProvider } from "./types";

// TODO: once a PG is selected, replace `manualProvider` with the real
// implementation, e.g.: `import { portoneProvider } from "./portoneProvider"`
export const paymentProvider: PaymentProvider = manualProvider;

export * from "./types";
