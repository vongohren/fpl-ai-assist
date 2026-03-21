import { z } from "zod";
import type { FPLApiClient } from "../api/client.js";
import { FPLCache } from "../cache/sqlite.js";
import { CACHE_KEYS } from "../cache/keys.js";
import type { TransferPayload } from "../types/index.js";

function getDefaultManagerId(): number | undefined {
  const envValue = process.env.FPL_MANAGER_ID;
  if (envValue) {
    const parsed = parseInt(envValue, 10);
    return isNaN(parsed) ? undefined : parsed;
  }
  return undefined;
}

const transferItemSchema = z.object({
  element_in: z.number().describe("Player ID to buy"),
  element_out: z.number().describe("Player ID to sell"),
  purchase_price: z.number().describe("Buy price in tenths of millions (e.g., 75 = £7.5m). Get this from search_players now_cost."),
  selling_price: z.number().describe("Sell price in tenths of millions. Get this from get_my_squad selling_price (already in tenths)."),
});

export const makeTransfersSchema = z.object({
  manager_id: z.number().optional().describe("Your FPL manager ID. Optional if FPL_MANAGER_ID env var is set."),
  event: z.number().describe("Gameweek number to make transfers for (e.g., 32)"),
  transfers: z.array(transferItemSchema).min(1).describe("Array of transfers to make"),
  chip: z
    .enum(["freehit", "wildcard"])
    .nullable()
    .optional()
    .describe("Chip to activate with these transfers. null for normal transfers."),
});

export type MakeTransfersInput = z.infer<typeof makeTransfersSchema>;

export const makeTransfersTool = {
  name: "make_transfers",
  description: `Submit transfers to the FPL API. This performs REAL transfers on your account.

⚠️ DESTRUCTIVE ACTION - This will actually make transfers on the user's FPL team!
Always confirm with the user before calling this tool. Show them exactly which players
are being transferred in/out and any point hits involved.

Prices are in TENTHS of millions:
- To convert from display price: £7.5m = 75
- get_my_squad returns selling_price already in millions, multiply by 10
- search_players returns cost in millions, multiply by 10

Chip options:
- "freehit": Free Hit chip (team reverts next GW)
- "wildcard": Wildcard (unlimited free transfers)
- null: Normal transfers (may incur point hits)`,
  inputSchema: {
    type: "object" as const,
    properties: {
      manager_id: {
        type: "number",
        description: "Your FPL manager ID. Optional if FPL_MANAGER_ID env var is set.",
      },
      event: {
        type: "number",
        description: "Gameweek number to make transfers for",
      },
      transfers: {
        type: "array",
        items: {
          type: "object",
          properties: {
            element_in: { type: "number", description: "Player ID to buy" },
            element_out: { type: "number", description: "Player ID to sell" },
            purchase_price: { type: "number", description: "Buy price in tenths of millions" },
            selling_price: { type: "number", description: "Sell price in tenths of millions" },
          },
          required: ["element_in", "element_out", "purchase_price", "selling_price"],
        },
        description: "Array of transfers to make",
      },
      chip: {
        type: ["string", "null"],
        enum: ["freehit", "wildcard", null],
        description: "Chip to activate with transfers, or null for normal transfers",
      },
    },
    required: ["event", "transfers"],
  },
};

export async function handleMakeTransfers(
  input: MakeTransfersInput,
  client: FPLApiClient,
  cache: FPLCache
): Promise<{ success: boolean; message: string; details?: unknown }> {
  const managerId = input.manager_id ?? getDefaultManagerId();

  if (!managerId) {
    return {
      success: false,
      message: "No manager ID provided and FPL_MANAGER_ID environment variable not set.",
    };
  }

  if (!client.hasAuth()) {
    return {
      success: false,
      message: "Authentication required. Set FPL_COOKIE or FPL_X_API_AUTH environment variable.",
    };
  }

  const payload: TransferPayload = {
    chip: input.chip ?? null,
    entry: managerId,
    event: input.event,
    transfers: input.transfers,
  };

  try {
    const result = await client.postTransfers(payload);

    // Invalidate cached squad data since transfers changed it
    cache.invalidate(CACHE_KEYS.myTeam(managerId));

    return {
      success: true,
      message: `Successfully submitted ${input.transfers.length} transfer(s) for GW${input.event}${input.chip ? ` with ${input.chip} chip` : ""}.`,
      details: result,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      message: `Transfer failed: ${message}`,
    };
  }
}
