# gw-loop: the gameweek cycle, automated forwards and backwards

One hourly job, `fpl-gw-loop`, runs `tick.sh`. The tick is deterministic (no LLM): it
reads the public FPL API, works out which phase every gameweek is in, and wakes an
agent only at the three points where judgement is needed. The rest of the hour it
watches the team and nudges the human.

```
            T-72h                    deadline              FPL finalises
              │                         │                       │
  idle ──► researching ──► proposed ──► locked ────────────► post-mortem ──► (feeds next research)
           (agent)         (tick:       (agent: record        (agent: Outcome + Learnings)
           proposal +      watch team,  what was done
           PR + JSON)      nudge)       vs proposed)
```

| Phase | Trigger (tick decides) | Who acts | Output |
|---|---|---|---|
| **research** | next deadline ≤ 72h **and** previous GW's Outcome is on main (or deadline ≤ 24h) | agent, `briefs/research.md` | `gw<N>.md` with a `## Proposal`, PR `gw<N>`, `proposals/gw<N>.json` |
| **proposed** | `proposals/gw<N>.json` exists | tick | ntfy with the summary + PR link; then hourly: compare `my-team` with the snapshot taken at research time and the proposal → `pending / partial / matched / diverged`; nudges at T-48h, T-24h, T-6h (high), T-2h (urgent) while still `pending` |
| **lock** | deadline passed, picks public | agent, `briefs/lock.md` | `## Decision` under the Proposal, ledger row, flags re-aimed at the real decision, README line |
| **post-mortem** | `events[N].finished && data_checked` (cache-busted), no 0-minute starter with empty `automatic_subs` | agent, `briefs/postmortem.md` | Outcome, flag outcomes, ledger, Learnings; PR `gw<N>-outcome` |

The forward run reads the backward run: research for GW N waits for GW N-1's Outcome to
land on `origin/main` (up to the 24h mark), and the brief tells the agent to treat the
Adjustments as constraints.

## What it never does

**No transfers, no captaincy, no chips.** The proposal is a document; the human acts in
the FPL app; the tick sees the team change via the authenticated `my-team` endpoint and
reports whether it matches. `briefs/research.md` forbids `make_transfers` / `save_team`
outright. If that policy changes later, it changes in the brief, not in `tick.mjs`.

## Notifications (ntfy, phone)

| When | Message |
|---|---|
| research spawned | "FPL GW5: research i gang", link to the agent conversation |
| proposal landed | "FPL GW5: forslag klart" (high), summary, click opens the PR |
| team changed | "ser at du har gjort noe (partial)", lists what is still open |
| still pending | T-48h, T-24h (default), T-6h (high), T-2h (urgent) |
| deadline passed | "FPL GW5 låst: matched", captain, transfers, chip |
| gameweek finalised | "FPL GW5 ferdig: 75 poeng (snitt 69)" |
| `my-team` answers 401 | "innloggingen er død" (high; urgent inside 24h) and the tick starts `auth-keepalive.sh --login` detached, so the oauth-broker's approve link arrives as the next notification; at most one per 6h |
| an agent produced nothing in 6h, three times | "sitter fast" (high) |

Agents themselves are told **not** to message the human; every buzz comes from the
tick, so there is exactly one voice.

## State

`/workspace/.spawn/fpl-gw-loop/` (durable across respawn, not in git):

```
state.json              phases per GW, attempts, nudges sent, baseline team snapshot
events.jsonl            one line per decision the tick took (grep this first)
briefs/gw5-research.md  the rendered brief the agent was told to read
snapshots/gw5-team.json my-team at research time = the "pending" baseline
proposals/gw5.json      written by the research AGENT (schema in briefs/research.md)
locks/gw5.json          proposal vs actual picks, written by the tick after the deadline
```

Every agent spawn is latched into `state.json` **before** `acp spawn` runs, so a crash
mid-dispatch costs one wake-up and never loops. An agent that produces nothing in 6h is
presumed dead and re-spawned, at most 3 times, then the human is buzzed.

## Operating it

```bash
scripts/gw-loop/tick.sh --status      # season, current/next GW, hours to deadline, full state
scripts/gw-loop/tick.sh --dry-run     # what this tick WOULD do, changes nothing, sends nothing
scripts/gw-loop/tick.sh               # one real tick (what cron runs)
jobctl log fpl-gw-loop                # cron's view
tail -20 /workspace/.spawn/fpl-gw-loop/events.jsonl
```

Install / remove:

```bash
jobctl add "7 * * * *" fpl-gw-loop -- /workspace/fpl-ai-assist/scripts/gw-loop/tick.sh
jobctl rm fpl-gw-loop
```

Re-running a phase by hand: delete the GW's entry from `state.json` (and the matching
`proposals/`, `locks/` file) and run a tick. To make the loop re-propose after the human
rejects a proposal, remove `proposals/gw<N>.json` and set `forward.<N>.phase` to `idle`.

Env overrides, all optional: `FPL_LOOP_REPO`, `FPL_LOOP_STATE`, `FPL_LOOP_BRIEFS`,
`FPL_LOOP_LEAD_H` (default 72), `FPL_LOOP_NTFY`, `FPL_LOOP_ACP`, plus `FPL_MANAGER_ID`
and `FPL_X_API_AUTH` (default: read from `~/.fpl/secrets.env`, the file the keepalive
job rotates).

## Why it looks like this

- **Deterministic gate, agent judgement.** The GW3 one-shot gate
  (`/workspace/.spawn/fpl-gw-finalisation/gate`) and the GW4 `fpl-gw4-postmortem` job
  were both hand-armed per gameweek, backward only, and each needed a session to
  remember to arm the next one. This replaces both with one season-long clock.
- **Cache-busted bootstrap, two flags, autosub veto.** Inherited from the GW3 gate. In
  GW4 the MCP server's 24h bootstrap cache reported `is_finished: false` for most of a
  day after the live API had finalised; the tick never goes through the MCP.
- **Snapshot at research time.** "Has the human acted" is answered by diffing the team
  against how it looked when the proposal was made, not against the proposal alone, so
  a proposal to roll the transfer does not read as "acted" and a human who does
  something *else* reads as `diverged`, which the lock phase then records honestly.
- **One voice.** Agents write documents; the tick talks to the phone. Otherwise every
  spawn produces its own notification and the human gets three buzzes per event.
