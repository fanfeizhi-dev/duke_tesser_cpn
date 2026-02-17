import { z } from "zod";
/**
 * Network key constants for referencing networks by name.
 * Use NETWORK_KEYS.POLYGON instead of string literals like "POLYGON".
 */
export declare const NETWORK_KEYS: {
    readonly POLYGON: "POLYGON";
    readonly POLYGON_AMOY: "POLYGON_AMOY";
    readonly ETHEREUM: "ETHEREUM";
    readonly SOLANA: "SOLANA";
    readonly STELLAR: "STELLAR";
};
export type NetworkKey = (typeof NETWORK_KEYS)[keyof typeof NETWORK_KEYS];
export declare const networkKeySchema: z.ZodPipe<z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodString>, z.ZodEnum<{
    POLYGON: "POLYGON";
    POLYGON_AMOY: "POLYGON_AMOY";
    ETHEREUM: "ETHEREUM";
    SOLANA: "SOLANA";
    STELLAR: "STELLAR";
}>>;
/** @deprecated Use NetworkKey instead */
export type ChainKey = NetworkKey;
/** @deprecated Use networkKeySchema instead */
export declare const chainKeySchema: z.ZodPipe<z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodString>, z.ZodEnum<{
    POLYGON: "POLYGON";
    POLYGON_AMOY: "POLYGON_AMOY";
    ETHEREUM: "ETHEREUM";
    SOLANA: "SOLANA";
    STELLAR: "STELLAR";
}>>;
/**
 * Supported stablecoin currencies with their network information.
 *
 * To add the same currency on a different network, add a separate entry:
 * Example: If you want to add USDT on Ethereum:
 *   { value: "USDT", label: "Tether USD", network: "ETHEREUM", decimals: 6 },
 *
 * This will result in multiple entries with the same `value` but different `network`,
 * which is the correct pattern for multi-network support.
 */
export declare const STABLECOIN_CURRENCIES: readonly [{
    readonly value: "USDC";
    readonly label: "Circle USD";
    readonly network: "POLYGON";
    readonly decimals: 6;
}, {
    readonly value: "USDT";
    readonly label: "Tether USD";
    readonly network: "POLYGON";
    readonly decimals: 6;
}, {
    readonly value: "USDC";
    readonly label: "Circle USD";
    readonly network: "STELLAR";
    readonly decimals: 6;
}];
export declare const FIAT_CURRENCIES: readonly [{
    readonly value: "USD";
    readonly label: "USD";
    readonly flag: "🇺🇸";
    readonly decimals: 2;
}, {
    readonly value: "MXN";
    readonly label: "MXN";
    readonly flag: "🇲🇽";
    readonly decimals: 2;
}, {
    readonly value: "BRL";
    readonly label: "BRL";
    readonly flag: "🇧🇷";
    readonly decimals: 2;
}, {
    readonly value: "ARS";
    readonly label: "ARS";
    readonly flag: "🇦🇷";
    readonly decimals: 2;
}, {
    readonly value: "COP";
    readonly label: "COP";
    readonly flag: "🇨🇴";
    readonly decimals: 2;
}];
export type SupportedCurrency = (typeof STABLECOIN_CURRENCIES)[number]["value"] | (typeof FIAT_CURRENCIES)[number]["value"];
export declare function isValidCurrency(currency: string): currency is SupportedCurrency;
export declare function getDecimalsForCurrency(currency: SupportedCurrency): number;
export declare function convertToSmallestUnits(amount: string | number, currency: SupportedCurrency): bigint;
export declare function convertFromSmallestUnits(amount: bigint, currency: SupportedCurrency): string;
export declare function formatCurrencyAmount(amount: bigint, currency: SupportedCurrency, options?: {
    showSymbol?: boolean;
    precision?: number;
}): string;
export declare function parseCurrencyInput(input: string, currency: SupportedCurrency): bigint;
/**
 * Maps generic network names to provider-specific network names
 * Used when calling external provider APIs that use different naming conventions
 */
export declare function mapNetworkToAlfred(network: NetworkKey | string): string;
/** @deprecated Use mapNetworkToAlfred instead */
export declare const mapChainToAlfred: typeof mapNetworkToAlfred;
//# sourceMappingURL=currency.d.ts.map