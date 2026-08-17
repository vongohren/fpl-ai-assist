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

Paths are **relative to the repo root** — do not hardcode a machine-specific path,
this repo is worked on from more than one box.

```
Read docs/gw-decisions/README.md
```

Logs are namespaced by season: `docs/gw-decisions/<season>/gw<NN>.md`, e.g.
`docs/gw-decisions/2026-27/gw1.md`.

Then read the most recent decision file **within the current season folder**. Extract:
- Locked chip plan (which chips for which GWs)
- Prior reasoning that constrains current options
- Any "watch" flags or hypotheses to verify

If a chip plan is locked (e.g. WC GW34 → BB GW36 → TC GW38), do NOT propose breaking it without explicitly flagging the deviation.

⚠️ **Never carry a chip plan across a season boundary.** Gameweek numbers restart
every August. If you are planning GW1–3 and the newest file you can find is a
`gw37.md` from the previous season, that plan is dead — chips have been reset.
Read it as history only.

### Step 2b — Pre-season and early-season handling (GW1–4)

Before the first gameweek finishes, most of the usual signals are empty:

- **`form` is 0.0 for every player.** It cannot rank anything. `search_players`
  detects this and silently sorts by prior-season `points_per_game` instead,
  reporting it in `preseason_notice`. Do not ask for `sort_by: form` and treat
  the result as meaningful.
- **Rank on** `points_per_game`, `total_points`, `ep_next`, `xgi_per_90`,
  `defensive_contribution_per_90` and `starts` from the prior season, plus price
  and fixtures.
- **Prior-season stats belong to a player's PREVIOUS club** if they moved in the
  window. Check `team_join_date`. A player with 180 points who joined in July
  earned them somewhere else, in a different role and system.
- **Skip the Step 3 dead-weight rule entirely.** `form < 2 AND ep_next < 3` will
  flag nearly the whole squad pre-season. Use minutes/starts risk instead.
- **Promoted-club and new-signing players have no PL evidence at all** (0 minutes).
  Treat high ownership as the community's expectation, not as data.

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

**This tool needs `BRAVE_SEARCH_API_KEY`.** If it is unset the tool returns nothing
— do NOT silently skip the step and present a stat-only recommendation. Fall back
to `WebSearch` over the same three angles (template/transfers, captaincy,
differentials) and say in the output which source was used.

Cross-check community picks against the API rather than trusting an article's
numbers: ownership percentages and fixtures move, and articles are often written
days earlier. **The API is authoritative for fixtures, prices and ownership.**

The single most useful thing from this step is **effective ownership on the
captain**. Not owning a 70%-owned captain is a double hit when he hauls: his
points plus the doubled points everyone else banks. Always state that risk
explicitly rather than burying it.

### Step 6 — Search transfer-in candidates

For each dead-weight position, run `mcp__fpl__search_players`:
- Sort by `form`
- Filter by team (target DGW or top-fixture teams)
- Constrain by `max_price` (selling price + bank)

If the user asks for "differentials", filter `selected_by < 10%` mentally when ranking.

**Hard rule — no intra-squad fixture hedging.** Before recommending any transfer IN, check that the candidate is NOT playing against a defender or GK already in the squad in the same GW (and vice versa: don't bring in a defender against an attacker you already own). Even if both players are in form, owning both sides of the same fixture cancels out — one player's points come at the direct expense of the other's clean sheet / save bonus / goal. Build for concentrated upside, not hedges. If a candidate triggers this conflict, drop them from the shortlist and surface the next option, OR flag the conflict explicitly and recommend resolving by also moving the conflicting squad player. Apply the same check in Step 7 (captain) and Step 8 (final recommendation).

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

> "Want me to save this evaluation as `docs/gw-decisions/<season>/gw<NN>.md` in the existing format? It captures the context, flags, decision, projected XI, and leaves Outcome + Learnings sections blank to fill in after the GW."

If yes: write it into the **current season's** folder, using the same structure as
`2025-26/gw33.md` or `2026-27/gw1.md`. Include:
- Pre-GW context (squad, budget, chips, prior GW result if known)
- Flags & key signals (DGW/BGW context, fixture leaders, community buzz, captaincy reframes)
- Panel/community analysis (transfer plans considered, captain debate)
- Decision made (transfers executed, rationale, captain, chip strategy locked)
- Projected starting XI table
- Empty Outcome section (Actual Points + per-player table + flag outcomes checklist)
- Empty Learnings section (what we got right/wrong, gut calibration, adjustments, lessons for next chip)

Then add a one-line entry under the current season's heading in
`docs/gw-decisions/README.md`. If the season has no heading yet (first log of a
new campaign), add one and mark it `(current)`, moving the marker off the old season.

## Chip windows — there are TWO of each chip

Since 2025/26 the season is split in half and you get a full set of chips per half:

| Chip | First half | Second half |
|---|---|---|
| Wildcard | GW2–19 | GW20–38 |
| Free Hit | GW2–19 | GW20–38 |
| Bench Boost | GW1–19 | GW20–38 |
| Triple Captain | GW1–19 | GW20–38 |

Consequences to reason about, not just report:
- A first-half chip **expires at GW19**. It does not roll over. Flag an unused
  first-half chip from about GW15 onward.
- Wildcard and Free Hit are **not available in GW1** — they open at GW2.
- `get_my_squad` returns `chips.available_detail` with `half`, `start_event`,
  `stop_event` and `playable_now`, plus `chips.playable_now`. Use those. The bare
  `chips.available` name list can contain the same name twice and cannot tell you
  which half a chip belongs to.

## Memory awareness

Session memory may contain a locked multi-GW chip plan and collaboration
preferences (community-weighted, differential-aware, confirm before executing).
Read `MEMORY.md` early in the session if it exists. Do not hardcode an absolute
memory path here — it differs per machine.

## Common pitfalls (from prior sessions)

1. **Player `next_fixture` field can be stale** — always cross-check against the GW fixtures list.
2. **Club limit is 3** — when adding multiple players from one team (e.g. MCI signings), check `club_counts` first.
3. **Selling price ≠ purchase price** — use `selling_price` from squad data when calculating budget.
3b. **Free transfers roll up to 5**, not 1. Read `budget.free_transfers`; don't assume. And check `budget.unlimited_transfers` — pre-season and during a wildcard it is `true`, transfers cost nothing, and the squad can be rebuilt wholesale. Do not compute hits in that state.
4. **DGW followed by BGW** — most DGWs precede a blank for the same teams. If a Wildcard or Free Hit isn't available, warn the user before they overload on DGW assets.
5. **Don't suggest using a chip outside the locked plan** without explicitly flagging the deviation and the reason.
6. **No intra-squad fixture hedging** — never recommend an attacker who plays against a defender/GK already in the squad (or the reverse). Owning both sides of the same fixture is anti-correlated, not diversification. See Step 6 hard rule. Cross-reference the next-GW fixture list against squad team IDs before finalising any plan.
