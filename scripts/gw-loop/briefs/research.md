# FPL GW{{GW}} research brief (forward phase)

You were woken by the deterministic gameweek loop (`scripts/gw-loop/tick.mjs`), not by
a human. Deadline: **{{DEADLINE}}** (about {{HOURS_LEFT}}h away). Season folder:
`docs/gw-decisions/{{SEASON}}/`. Manager entry {{ENTRY}}. Repo: `{{REPO}}`.

{{PREV_NOTE}}

## What you produce

1. `docs/gw-decisions/{{SEASON}}/gw{{GW}}.md`: a full decision log in the house style
   (read `gw4.md` in the same folder for the shape), with **`## Proposal`** in place of
   `## Decision`. The Decision section is written later by the lock phase, from what
   was actually done. Leave `## Outcome` and `## Learnings` as empty templates with the
   finalisation-gate note, exactly like the earlier files.
2. `{{PROPOSAL_JSON}}`: the machine-readable version of the proposal (schema below).
   **The loop does not consider you finished until this file exists.** Write it last,
   after the PR is open, so `pr_url` is real.
3. A PR from branch `gw{{GW}}` with the doc, plus the GW{{GW}} line in
   `docs/gw-decisions/README.md` (mark it as a proposal; the lock phase rewrites it).

## How

Run the `evaluate-gw` skill end to end (`.claude/skills/evaluate-gw/SKILL.md`), with
these loop-specific rules layered on top:

- **Step 0 is a hard stop as written.** If `get_my_squad` reports stale data, do not
  write a proposal. Write `{{PROPOSAL_JSON}}` with `{"gw": {{GW}}, "error": "auth"}` and
  a one-line summary, so the loop can alert instead of waiting six hours for you.
- **Read backwards first.** The previous gameweek's `### Adjustments for next time`
  and `### Chip planning notes` are constraints, not suggestions. Quote the ones you
  apply and say explicitly which you are overriding and why.
- **Captaincy gets its own fixture-level model** (GW3 adjustment #2, +20 in its first
  outing). Never default to last week's captain.
- **Minutes-audit every transfer target before form, xGI or DC** (GW4 adjustment #2).
- **Community matching is mandatory.** Run all three `get_community_trends` angles;
  fall back to `WebSearch` if Brave is unavailable and say which source you used.
  State effective ownership on the captain pick and on any template player we do not
  own. Cross-check every community claim against the API.
- **Propose the whole setup**: transfers (with hit, if any), captain and vice, the
  starting XI and formation, bench order on minutes certainty, chip call, and the
  accepted risks. The human should be able to open the FPL app and copy it in under
  two minutes, so put a compact **"Do this in the app"** checklist at the top of the
  Proposal section.
- Always give one **zero-transfer alternative** (roll the FT) with its cost in expected
  points, so the human can decline without re-deriving anything.
- Fill the GW{{GW}} row of the **armband ledger** with the proposal (captain chosen,
  field's captain) and leave the points columns empty.

## What you must NOT do

- **Never call `make_transfers` or `save_team`.** This loop proposes; the human acts
  in the app; the loop watches the team and records what was done. No exceptions, even
  if the numbers look obvious.
- Never work in `{{REPO}}` itself. Worktree:
  `git -C {{REPO}} worktree add /workspace/fpl-ai-assist-gw{{GW}} -b gw{{GW}} origin/main`,
  commit and push from there, open the PR with `gh pr create`, then
  `git -C {{REPO}} worktree remove /workspace/fpl-ai-assist-gw{{GW}}`.
- Do not register `pr-watch`; the loop owns the follow-up for this PR.
- Do not send the human any message yourself (no ntfy, no chat). The loop sends one
  notification from `summary` the moment the JSON lands; a second one from you is noise.

## Proposal JSON schema

Element ids are FPL `element` ids from the API, not names. Names are for the reader.

```json
{
  "gw": {{GW}},
  "season": "{{SEASON}}",
  "generated_at": "<ISO8601>",
  "pr_url": "https://github.com/.../pull/NN",
  "summary": "one line for a phone notification, e.g. 'Hall -> Bogle (0 FT hit), C Joao Pedro, VC Bruno, hold chips'",
  "transfers": [{ "out": 449, "out_name": "Hall", "in": 330, "in_name": "Bogle" }],
  "hit": 0,
  "chip": null,
  "captain": 165, "captain_name": "João Pedro",
  "vice": 426, "vice_name": "B.Fernandes",
  "xi": [1, 4, 8, 204, 388, 330, 426, 427, 397, 480, 165],
  "bench": [497, 127, 125, 441],
  "zero_transfer_alternative": "one line",
  "must_react_by": "{{DEADLINE}}"
}
```

`chip` is `null`, `"wildcard"`, `"freehit"`, `"bboost"` or `"3xc"` (the API names).
If the proposal is to roll the transfer, `transfers` is `[]` and `hit` is 0.

Your final message is your report: what you proposed, the PR link, and the one thing
the human most needs to decide.
