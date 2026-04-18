---
name: evaluate-gw
description: Run the full Gameweek evaluation process — pull squad, check forward fixtures and community trends, read prior GW decisions for chip-plan context, and produce transfer/captain/chip recommendations. Always asks at the end whether to save the session as a new GW decision log.
---

# Evaluate Next Gameweek

Walks through the full pre-deadline GW evaluation. Use when the user says "evaluate next GW", "fix tomorrow's team", "what should I do for GW33", or any pre-deadline planning request.

## When This Is Triggered

- User asks to evaluate, plan, or fix the team for the next/current GW
- User asks "what's my team doing this week"
- User mentions a specific GW number with "plan", "transfers", "captain", or "chips"
- After running, ALWAYS prompt the user about saving the session as a `gw-decisions/` log

## Execution Order (do not skip steps)

### Step 0 — STALE DATA PRE-FLIGHT CHECK (HARD STOP)

**Run `mcp__fpl__get_my_squad` FIRST and ALONE.** Do not parallelize this with anything else. Do not pull fixtures, trends, prior decisions, or anything until this check passes.

Inspect the response:
- If `data_source.is_stale: true` OR `data_source.type: "public_fallback"` OR `data_source.warning` is present → **HARD STOP IMMEDIATELY**.
- Do NOT continue to Step 1.
- Do NOT pull any other data.
- Do NOT make any recommendations.

Tell the user verbatim:

> ⛔ **Stale data — cannot proceed.** The FPL token has expired. Please run `source setup.sh` in a terminal, then restart Claude Code so the MCP server picks up the new token. I'll resume the GW evaluation once fresh data is available.

Then end the turn. Do not run other tools. Wait for the user to refresh and re-invoke the skill.

Only if `data_source.is_stale: false` AND `data_source.type: "authenticated"` → proceed to Step 1.

### Step 1 — Refresh state (parallel)

Now that auth is verified, run in parallel:
- `mcp__fpl__get_fixtures` (no args = current GW) — to detect current GW state
- `mcp__fpl__get_fixtures` for the NEXT GW — fixtures + deadline

### Step 2 — Read prior GW decisions

```
Read /Users/vongohren/code/personal-projects/fpl-ai-assist/docs/gw-decisions/README.md
```

Then read the **most recent** decision file (e.g. `gw32.md` if planning GW33). Extract:
- Locked chip plan (which chips for which GWs)
- Prior reasoning that constrains current options
- Any "watch" flags or hypotheses to verify

If a chip plan is locked (e.g. WC GW34 → BB GW36 → TC GW38), do NOT propose breaking it without explicitly flagging the deviation.

### Step 3 — Identify dead weight

From the squad, flag:
- `chance_of_playing < 100` (injury/doubt)
- `form < 2` AND `ep_next < 3` (out of favour)
- Any player whose team has FDR ≥ 4 next 3 GWs and form < 4

### Step 4 — Pull forward fixtures (parallel)

For ALL teams represented in the squad PLUS any DGW/standout teams identified, run `mcp__fpl__get_fixture_difficulty` with `from_gw=<next GW>` and `gameweeks=6`.

Detect:
- DGW teams (`is_double: true`)
- BGW teams (null fixtures in any GW)
- Top fixture-rank teams (rank 1-5) for transfer-in candidates

### Step 5 — Pull community trends (parallel)

Run all three:
- `mcp__fpl__get_community_trends` with `topic=transfers, gameweek=<next GW>`
- `mcp__fpl__get_community_trends` with `topic=captaincy, gameweek=<next GW>`
- `mcp__fpl__get_community_trends` with `topic=differentials, gameweek=<next GW>`

Weight community signal heavily — surface differentials with high mention counts even if not in your stat-driven shortlist.

### Step 6 — Search transfer-in candidates

For each dead-weight position, run `mcp__fpl__search_players`:
- Sort by `form`
- Filter by team (target DGW or top-fixture teams)
- Constrain by `max_price` (selling price + bank)

If the user asks for "differentials", filter `selected_by < 10%` mentally when ranking.

### Step 7 — Validate captain options

Cross-reference top-form players against next-GW fixtures:
- Captain must have favourable FDR (≤ 3) AND DGW where possible
- Verify community sentiment (multiple mentions = consensus, single mention = differential)
- **Always re-check fixtures from the GW fixtures list, not from `next_fixture` field on player records — that field can show prior GW.** Got burned on this with Palmer once.

### Step 8 — Build recommendation

Present in this format:

```
## GWxx Plan

**Deadline:** <date/time UTC>
**State:** <FTs> free transfers, £<bank>m bank, chips: <list>
**Locked chip plan from prior decisions:** <if any>

### Dead weight identified
- <Player> (<team>, £<price>, form <X>, ep <Y>) — <reason>

### Transfer options (X-transfer plans)
| Plan | OUT | IN | Net cost | Pros / cons |

### Captain shortlist
1. <Player> — fixtures, form, community
2. ...

### Chip call
<Use / hold / save for X>

### Bench order suggestion
<if relevant>
```

### Step 9 — Confirm before executing

Never auto-call `mcp__fpl__make_transfers` or `mcp__fpl__save_team`. Always wait for explicit user approval. List exactly which players are moving and the captain/VC/bench changes.

### Step 10 — Ask about saving the session log (REQUIRED)

After the user confirms or declines, ALWAYS ask:

> "Want me to save this evaluation as `docs/gw-decisions/gw<NN>.md` in the existing format? It captures the context, flags, decision, projected XI, and leaves Outcome + Learnings sections blank to fill in after the GW."

If yes: write the file using the same structure as `gw29.md` / `gw33.md`. Include:
- Pre-GW context (squad, budget, chips, prior GW result if known)
- Flags & key signals (DGW/BGW context, fixture leaders, community buzz, captaincy reframes)
- Panel/community analysis (transfer plans considered, captain debate)
- Decision made (transfers executed, rationale, captain, chip strategy locked)
- Projected starting XI table
- Empty Outcome section (Actual Points + per-player table + flag outcomes checklist)
- Empty Learnings section (what we got right/wrong, gut calibration, adjustments, lessons for next chip)

Then add a one-line entry to `docs/gw-decisions/README.md` Decision Files list.

## Memory awareness

Memory at `/Users/vongohren/.cloak/profiles/mine/projects/-Users-vongohren-code-personal-projects-fpl-ai-assist/memory/` may contain:
- `chip_strategy_2026.md` — locked multi-GW chip plan
- `user_fpl_style.md` — collaboration preferences (community-weighted, differential-aware, confirm before executing)

Read MEMORY.md early in the session if it exists.

## Common pitfalls (from prior sessions)

1. **Player `next_fixture` field can be stale** — always cross-check against the GW fixtures list.
2. **Club limit is 3** — when adding multiple players from one team (e.g. MCI signings), check `club_counts` first.
3. **Selling price ≠ purchase price** — use `selling_price` from squad data when calculating budget.
4. **DGW followed by BGW** — most DGWs precede a blank for the same teams. If a Wildcard or Free Hit isn't available, warn the user before they overload on DGW assets.
5. **Don't suggest using a chip outside the locked plan** without explicitly flagging the deviation and the reason.
