import { z } from "zod";
import type { FPLApiClient } from "../api/client.js";
import { FPLCache } from "../cache/sqlite.js";
import { CACHE_KEYS } from "../cache/keys.js";
import type { SaveTeamPayload, SaveTeamPick } from "../types/index.js";

function getDefaultManagerId(): number | undefined {
  const envValue = process.env.FPL_MANAGER_ID;
  if (envValue) {
    const parsed = parseInt(envValue, 10);
    return isNaN(parsed) ? undefined : parsed;
  }
  return undefined;
}

const pickSchema = z.object({
  element: z.number().describe("Player ID"),
  position: z.number().min(1).max(15).describe("Squad position (1-11 = starting XI, 12-15 = bench)"),
  is_captain: z.boolean().describe("Is this player the captain?"),
  is_vice_captain: z.boolean().describe("Is this player the vice captain?"),
});

export const saveTeamSchema = z.object({
  manager_id: z.number().optional().describe("Your FPL manager ID. Optional if FPL_MANAGER_ID env var is set."),
  picks: z.array(pickSchema).length(15).describe("All 15 squad picks with positions, captain, and vice captain"),
  chip: z
    .enum(["bboost", "3xc"])
    .nullable()
    .optional()
    .describe("Chip to activate: 'bboost' for Bench Boost, '3xc' for Triple Captain, null for none"),
});

export type SaveTeamInput = z.infer<typeof saveTeamSchema>;

export const saveTeamTool = {
  name: "save_team",
  description: `Save your FPL team selection - set starting XI, bench order, captain, vice captain, and activate chips.

⚠️ This modifies your actual FPL team! Always confirm with the user first.

The picks array must contain exactly 15 players:
- Positions 1-11: Starting XI
- Positions 12-15: Bench (12 = first sub, 15 = last sub)
- Exactly 1 player must have is_captain: true
- Exactly 1 player must have is_vice_captain: true

Get player IDs and current positions from get_my_squad first.

Chip options:
- "bboost": Bench Boost (bench players score points this GW)
- "3xc": Triple Captain (captain scores 3x this GW)
- null: No chip`,
  inputSchema: {
    type: "object" as const,
    properties: {
      manager_id: {
        type: "number",
        description: "Your FPL manager ID. Optional if FPL_MANAGER_ID env var is set.",
      },
      picks: {
        type: "array",
        items: {
          type: "object",
          properties: {
            element: { type: "number", description: "Player ID" },
            position: { type: "number", description: "Squad position 1-15" },
            is_captain: { type: "boolean", description: "Is captain?" },
            is_vice_captain: { type: "boolean", description: "Is vice captain?" },
          },
          required: ["element", "position", "is_captain", "is_vice_captain"],
        },
        description: "All 15 squad picks",
      },
      chip: {
        type: ["string", "null"],
        enum: ["bboost", "3xc", null],
        description: "Chip to activate, or null",
      },
    },
    required: ["picks"],
  },
};

export async function handleSaveTeam(
  input: SaveTeamInput,
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

  // Validate picks
  const picks = input.picks;

  if (picks.length !== 15) {
    return { success: false, message: `Expected 15 picks, got ${picks.length}` };
  }

  const positions = picks.map((p) => p.position).sort((a, b) => a - b);
  const expectedPositions = Array.from({ length: 15 }, (_, i) => i + 1);
  if (JSON.stringify(positions) !== JSON.stringify(expectedPositions)) {
    return { success: false, message: "Picks must have positions 1 through 15, each used exactly once." };
  }

  const captains = picks.filter((p) => p.is_captain);
  if (captains.length !== 1) {
    return { success: false, message: `Expected exactly 1 captain, got ${captains.length}` };
  }

  const viceCaptains = picks.filter((p) => p.is_vice_captain);
  if (viceCaptains.length !== 1) {
    return { success: false, message: `Expected exactly 1 vice captain, got ${viceCaptains.length}` };
  }

  if (captains[0].element === viceCaptains[0].element) {
    return { success: false, message: "Captain and vice captain must be different players." };
  }

  const payload: SaveTeamPayload = {
    chip: input.chip ?? null,
    picks: picks.map((p): SaveTeamPick => ({
      element: p.element,
      position: p.position,
      is_captain: p.is_captain,
      is_vice_captain: p.is_vice_captain,
    })),
  };

  try {
    const result = await client.postMyTeam(managerId, payload);

    // Invalidate cached squad data
    cache.invalidate(CACHE_KEYS.myTeam(managerId));

    return {
      success: true,
      message: `Team saved successfully${input.chip ? ` with ${input.chip === "3xc" ? "Triple Captain" : "Bench Boost"} chip activated` : ""}.`,
      details: result,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      message: `Save team failed: ${message}`,
    };
  }
}
