import { AddressesSchema, type Address } from "common";
import { z } from "zod";

type FetchResult<T> =
  | { success: true; status: number; data: T }
  | { success: false; error: string; status?: number };

export async function fetchSuggestions(
  query: string,
): Promise<FetchResult<Address[]>> {
  try {
    const response = await fetch(`/api/address?q=${encodeURIComponent(query)}`);
    if (response.ok) {
      const json: unknown = await response.json();

      const result = AddressesSchema.safeParse(json);

      if (!result.success) {
        return {
          success: false,
          error: z.prettifyError(result.error)
        };
      }

      return {
        success: true,
        status: response.status,
        data: result.data,
      };
    } else {
      return {
        success: false,
        status: response.status,
        error: response.statusText,
      };
    }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error.",
    };
  }
}
