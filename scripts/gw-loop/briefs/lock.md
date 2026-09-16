# FPL GW{{GW}} lock brief (deadline has passed)

You were woken by the deterministic gameweek loop (`scripts/gw-loop/tick.mjs`). The
GW{{GW}} deadline is gone and the picks are public. Season folder:
`docs/gw-decisions/{{SEASON}}/`. Manager entry {{ENTRY}}. Repo: `{{REPO}}`.

The loop already compared what was proposed with what was actually done:

- `{{LOCK_JSON}}`: the proposal, the actual picks (ids and names), captain, vice,
  transfers made and their cost, active chip, and a per-check comparison.
- Overall status: **{{STATUS}}** (`matched` / `partial` / `diverged` / `pending` =
  nothing was changed / `no-proposal` = the loop never got a proposal for this week).
- Proposal PR: {{PROPOSAL_PR}}

## What you produce

Turn `## Proposal` in `docs/gw-decisions/{{SEASON}}/gw{{GW}}.md` into the record of
what happened, in the house style (read `gw4.md` for the shape):

1. Keep the Proposal section as written; **do not rewrite history**. Below it add
   **`## Decision`** with:
   - the transfers actually made (OUT / IN / £, hit), captain, vice, chip, XI table
     with fixture and FDR, bench order;
   - a short **"Proposal vs decision"** paragraph: which parts were followed, which
     were not, and, if the human left a reason anywhere you can find (PR comment,
     commit message, the acp conversation for the research agent), quote it. If no
     reason is recorded, say so plainly rather than inventing one.
   - If status is `pending` (nothing changed): say the proposal was not acted on and
     record the roll. That is a legitimate outcome, not a failure; the post-mortem
     will price it.
2. Fill the GW{{GW}} row of the **armband ledger** with the actual captain.
3. Update the **watch flags** so they test the decision that was made, not the
   proposal that was not. Add a flag for every deviation, so the post-mortem
   measures the human's call against the model's.
4. Rewrite the GW{{GW}} line in `docs/gw-decisions/README.md` to describe the decision.

Cross-check the ids in the lock JSON against `mcp__fpl__get_my_squad` and the public
`entry/{{ENTRY}}/event/{{GW}}/picks/` endpoint; the JSON is a snapshot, the API is the
truth.

## Git

- If the proposal PR is still **open**, add your commit to **its branch** (fetch it,
  work in a worktree on that branch, push). One PR per gameweek until the outcome.
- If it is merged, branch `gw{{GW}}-lock` off `origin/main` and open a new PR.
- Never work in `{{REPO}}` itself. Remove your worktree when done.
- Do not register `pr-watch`; the loop owns the follow-up. Do not message the human;
  the loop already sent the lock notification.

Your final message is your report: the decision in one line, the deviations, the PR.
