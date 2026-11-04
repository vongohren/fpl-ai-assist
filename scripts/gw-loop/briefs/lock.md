# FPL GW{{GW}} lock brief (deadline has passed)

You were woken by the deterministic gameweek loop (`scripts/gw-loop/tick.mjs`). The
GW{{GW}} deadline is gone and the picks are public. Season folder:
`docs/gw-decisions/{{SEASON}}/`. Manager entry {{ENTRY}}. Repo: `{{REPO}}`.

This gameweek is **item `gw{{GW}}` in the huddle project `{{PROJECT}}`**. Every
`arcforge project` command below takes `--project {{PROJECT}}`; run them from `{{REPO}}` or
your worktree. First:

```bash
arcforge project attach --title "FPL GW{{GW}} lock" --item gw{{GW}} --project {{PROJECT}}
```

The tick has already moved the item back to `working` if Snorre's ask was still open: what
he did in the app is the answer now. Read what was asked and answered before you write:
`arcforge project item ls --json --project {{PROJECT}}` (the item's history),
`arcforge project decisions --project {{PROJECT}}`, and the open comments on the page and the
log (`arcforge project visual comments life/fpl-gw{{GW}}-proposal --project {{PROJECT}}`,
`arcforge project memory comments gw/gw{{GW}}.md --project {{PROJECT}}`).

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
     were not, and, if the human left a reason anywhere you can find (his answer to the
     ask or decision on the item, a comment on the page or the log, a PR comment, the acp
     conversation for the research agent), quote it. If no reason is recorded, say so
     plainly rather than inventing one.
   - If status is `pending` (nothing changed): say the proposal was not acted on and
     record the roll. That is a legitimate outcome, not a failure; the post-mortem
     will price it.
2. Fill the GW{{GW}} row of the **armband ledger** with the actual captain.
3. Update the **watch flags** so they test the decision that was made, not the
   proposal that was not. Add a flag for every deviation, so the post-mortem
   measures the human's call against the model's. A deviation that followed a
   **"The crowd says"** line (he went with the crowd against the blended number, or the
   other way round) gets its own flag, priced on blended and on actual points later.
4. Rewrite the GW{{GW}} line in `docs/gw-decisions/README.md` to describe the decision.

Cross-check the ids in the lock JSON against `mcp__fpl__get_my_squad` and the public
`entry/{{ENTRY}}/event/{{GW}}/picks/` endpoint; the JSON is a snapshot, the API is the
truth.

## Into huddle

After the commit is pushed:

1. The log's copy: `arcforge project memory put gw/gw{{GW}}.md docs/gw-decisions/{{SEASON}}/gw{{GW}}.md --project {{PROJECT}}`
   (it is pinned already; re-pin with `memory pin` if it is not).
2. Comments still open on the page or the log: answer each in its thread with what the
   decision did about it (`arcforge project visual reply <cm-id> "<one line>" --answered`,
   `--version <the doc's v>` for a memory comment). An ask or decision of the research run
   that is still open is withdrawn by its own session, not by you: say in your report
   that it is open.
3. The report, to `/workspace/.spawn/fpl-gw-loop/reports/gw{{GW}}-lock.md`, ending in a
   `## Report` block (at most 1500 bytes): `outcome: partial` (the item stays `working`
   until the post-mortem), `where:` the PR and `memory:gw/gw{{GW}}.md`, `left:` the
   post-mortem, and the decision with its deviations in one line. Then
   `arcforge project report check <file> --project {{PROJECT}}` and
   `arcforge project report submit <file> --item gw{{GW}} --project {{PROJECT}}`.

Never move the item to `needs_human` from here: nothing can be decided after the deadline.

## Git

- If the proposal PR is still **open**, add your commit to **its branch** (fetch it,
  work in a worktree on that branch, push). One PR per gameweek until the outcome.
- If it is merged, branch `gw{{GW}}-lock` off `origin/main` and open a new PR.
- Never work in `{{REPO}}` itself. Remove your worktree when done.
- Do not register `pr-watch`; the loop owns the follow-up. Do not message the human;
  the loop already sent the lock notification.

Your final message is your report: the decision in one line, the deviations, the PR,
ending with the same `## Report` block you submitted.
