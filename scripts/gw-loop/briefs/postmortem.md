# FPL GW{{GW}} post-mortem brief (backward phase)

You were woken by the deterministic gameweek loop (`scripts/gw-loop/tick.mjs`). FPL has
**finalised GW{{GW}}**: `events[{{GW}}].finished` and `data_checked` are both true on
the live `bootstrap-static` endpoint and the autosub veto has cleared. Season folder:
`docs/gw-decisions/{{SEASON}}/`. Manager entry {{ENTRY}}. Repo: `{{REPO}}`.

Headline numbers from the gate: our points **{{OUR_POINTS}}**, overall rank
**{{OUR_RANK}}**, GW average **{{AVG}}**, highest **{{HIGHEST}}**, most captained
**{{MOST_CAPTAINED}}**. Verify them yourself against the live API before writing.

The decision log `gw{{GW}}.md` {{DOC_EXISTS}}.

## What you produce

Fill in `docs/gw-decisions/{{SEASON}}/gw{{GW}}.md`, in the house style. Read the
previous gameweek's completed file in the same folder first and match it section for
section:

1. **`## Outcome`**: actual points (gross, hit, net, bench), GW average, highest score,
   overall rank with the delta, GW rank, season total, most captained in the game. Then
   the per-player table: minutes, points, and a notes column that names the mechanism
   (clean sheet, DC banked or missed with the DC number, xG behind a goal, bonus,
   autosub). All eleven starters and all four bench slots. State whether an autosub
   fired.
2. **`### Flag outcomes`**: resolve **every** watch flag, one bullet each, ticked,
   with a verdict in caps first (`YES`, `NO`, `UNTESTED`, `RIGHT ANSWER, WRONG
   MECHANISM`, ...) and then the numbers. If the lock phase added deviation flags
   (human overrode the proposal), price each one: what the proposal would have
   returned against what the decision returned.
3. **Armband ledger**: fill the GW{{GW}} row (our captain's points and x2, the field's
   captain's points and x2, the swing, the cumulative).
4. **`## Learnings`**: what we got right, what we got wrong, gut calibration,
   numbered adjustments for next time, chip planning notes. The adjustments are the
   constraints the next research run will read, so make them operational (a rule, a
   threshold, a player to sell), not a mood.
5. Update the GW{{GW}} line in `docs/gw-decisions/README.md` with the outcome.

Get the numbers from the API, not from memory: `bootstrap-static/`,
`event/{{GW}}/live/`, `entry/{{ENTRY}}/event/{{GW}}/picks/`, `entry/{{ENTRY}}/history/`.
Do **not** rely on `mcp__fpl__get_fixtures.is_finished` for the gate: the MCP caches the
bootstrap for 24h and lagged the live API by most of a day in GW4.

## Git

Branch `gw{{GW}}-outcome` off `origin/main`, in a worktree
(`git -C {{REPO}} worktree add /workspace/fpl-ai-assist-gw{{GW}}-outcome -b gw{{GW}}-outcome origin/main`).
Commit, push, `gh pr create`, remove the worktree. Never touch `{{REPO}}` itself.

Do not register `pr-watch`; the loop sees the Outcome land on main and moves on. Do
not message the human; the loop already sent the "finalised" notification. The next
research run (GW{{GW}}+1, at T-72h) will read your Learnings, so the loop waits for
this PR to merge before it starts; if the deadline is inside 24h it goes ahead without.

Your final message is your report: net points against the average, the rank move, the
one flag that mattered most, and the PR link.
