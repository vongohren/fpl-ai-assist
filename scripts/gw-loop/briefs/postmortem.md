# FPL GW{{GW}} post-mortem brief (backward phase)

You were woken by the deterministic gameweek loop (`scripts/gw-loop/tick.mjs`). FPL has
**finalised GW{{GW}}**: `events[{{GW}}].finished` and `data_checked` are both true on
the live `bootstrap-static` endpoint and the autosub veto has cleared. Season folder:
`docs/gw-decisions/{{SEASON}}/`. Manager entry {{ENTRY}}. Repo: `{{REPO}}`.

Headline numbers from the gate: our points **{{OUR_POINTS}}**, overall rank
**{{OUR_RANK}}**, GW average **{{AVG}}**, highest **{{HIGHEST}}**, most captained
**{{MOST_CAPTAINED}}**. Verify them yourself against the live API before writing.

The decision log `gw{{GW}}.md` {{DOC_EXISTS}}.

This gameweek is **item `gw{{GW}}` in the huddle project `{{PROJECT}}`**. Every
`arcforge project` command below takes `--project {{PROJECT}}`; run them from `{{REPO}}` or
your worktree. First:

```bash
arcforge project attach --title "FPL GW{{GW}} post-mortem" --item gw{{GW}} --project {{PROJECT}}
arcforge project item move gw{{GW}} working --reason "post-mortem i gang" --project {{PROJECT}}
```

(The move is refused when the item is already `working`, which is the normal case: carry on.)
Read the comments Snorre left on the gameweek before you judge it: they are part of the
record (`arcforge project memory comments gw/gw{{GW}}.md --project {{PROJECT}}`,
`arcforge project visual comments life/fpl-gw{{GW}}-proposal --project {{PROJECT}}`).

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
   with **the read in brackets first** and then a verdict in caps (`YES`, `NO`,
   `UNTESTED`, `RIGHT ANSWER, WRONG MECHANISM`, ...) and then the numbers:
   `- [x] (+6) **Flag: VERDICT.** ...`. The read is the flag's effect on our points:
   `(+N)` paid us, `(-N)` cost us, `(=)` level, `(?)` untested or still running; N is
   optional. The outcome page groups and colours the flags by it, so a flag without
   one renders as "unmarked" and the human cannot tell whether it went for or against. If the lock phase added deviation flags
   (human overrode the proposal), price each one: what the proposal would have
   returned against what the decision returned.
3. **Armband ledger**: fill the GW{{GW}} row (our captain's points and x2, the field's
   captain's points and x2, the swing, the cumulative).
4. **Calibrate the blend**, after the Outcome table is written (the actual points are
   final), from inside the worktree, exactly:

   ```
   node scripts/gw-loop/calibrate.mjs --gw {{GW}} --put
   ```

   It fills `actual` in the community doc `community/gw{{GW}}` and recomputes the `weight`
   doc (`w`, `method`, the mean absolute error of calc and of the consensus). Put its result
   in the doc as **`### Calc against the consensus`** under the Outcome: this week's error
   for calc, consensus and blended over the players that had all three, the new `w` and its
   method, and every **"The crowd says"** line of the proposal with what actually happened
   (was the crowd right). If the community doc for GW{{GW}} does not exist (a gameweek
   researched before the blend), say so in one line and skip the step. It exits 1 before
   FPL has finalised the gameweek; the tick only wakes you after that, so an exit 1 means
   the gate moved: say so in the report, do not work around it. The starting `weight` doc
   (`--init`) is not yours to write.
5. **`## Learnings`**: what we got right, what we got wrong, gut calibration,
   numbered adjustments for next time, chip planning notes. The adjustments are the
   constraints the next research run will read, so make them operational (a rule, a
   threshold, a player to sell), not a mood. Rules are written on the **blended** number,
   the way the research brief applies them, not on calc alone.
6. Update the GW{{GW}} line in `docs/gw-decisions/README.md` with the outcome.
7. **Build the outcome page**, after the doc is written and committed (it reads the
   `### Flag outcomes` block from the doc), from inside the worktree:

   ```
   node scripts/gw-loop/outcome-page.mjs --gw {{GW}} --publish
   ```

   It is deterministic and renders the same view every gameweek (hero, mini-leagues,
   who scored it, points vs average, rank, armband ledger, flags, table view). Do
   **not** hand-build a page, add sections or restyle it; if the view needs a new
   section, that is a change to `outcome-page.mjs` in the same PR, not a one-off. It
   prints the artifact URL (`https://artifacts.go.vongohren.me/life/fpl-gw{{GW}}-outcome`).
   Link it to the project (idempotent):

   ```
   arcforge project visual add life/fpl-gw{{GW}}-outcome --title "GW{{GW}} resultat: <net> (snitt <avg>)" --project {{PROJECT}}
   ```

## Into huddle

After the PR is open and the page is linked:

1. The log's copy: `arcforge project memory put gw/gw{{GW}}.md docs/gw-decisions/{{SEASON}}/gw{{GW}}.md --project {{PROJECT}}`,
   then `arcforge project memory pin gw/gw{{GW}}.md --title "GW{{GW}} beslutningslogg (resultat)" --project {{PROJECT}}`.
2. Every comment still open on the page, the outcome page or the log gets an answer in its
   thread (`arcforge project visual reply <cm-id> "<one line>" --answered`, `--applied` if
   it became an adjustment, `--version <the doc's v>` for a memory comment).
3. Link the PR and the outcome to the item:
   `arcforge project item update gw{{GW}} --link <PR url> --link visual:life/fpl-gw{{GW}}-outcome --project {{PROJECT}}`.
4. The report, to `/workspace/.spawn/fpl-gw-loop/reports/gw{{GW}}-postmortem.md`, ending in
   a `## Report` block (at most 1500 bytes): `outcome: done`, `where:` the PR, the outcome
   page and `memory:gw/gw{{GW}}.md`, `left:` the merge (the tick resolves the item when the
   Outcome is on main), `learned:` the one adjustment that matters most. Then
   `arcforge project report check <file> --project {{PROJECT}}` and
   `arcforge project report submit <file> --item gw{{GW}} --project {{PROJECT}}`. It moves the
   item to `ready_for_review`.

Nothing in a post-mortem is a question to Snorre: no ask, no decision. A rule he should
weigh in on is an adjustment, and he comments on it in the log.

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

Your final message is the visual: the outcome page's huddle link
(`arcforge project link visual life/fpl-gw{{GW}}-outcome --project {{PROJECT}}`) on its own
line, then one line (net points against the average, the rank move) and the PR link, then the
same `## Report` block you submitted. Nothing else; the page carries the rest, and the doc
carries the reasoning.
