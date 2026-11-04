# FPL GW{{GW}} research brief (forward phase)

You were woken by the deterministic gameweek loop (`scripts/gw-loop/tick.mjs`), not by
a human. Deadline: **{{DEADLINE}}** (about {{HOURS_LEFT}}h away). Season folder:
`docs/gw-decisions/{{SEASON}}/`. Manager entry {{ENTRY}}. Repo: `{{REPO}}`.

{{PREV_NOTE}}

This gameweek is **item `gw{{GW}}` in the huddle project `{{PROJECT}}`**: the tick created it
when it woke you. Snorre reads, comments and decides there, not in a PR. Every
`arcforge project` command below takes `--project {{PROJECT}}`; run them from `{{REPO}}` or
your worktree. The project's shape (`arcforge project memory get shape.md --project
{{PROJECT}}`) says what lives where; this brief is the part of it that is yours.

## Step 0: join the gameweek

```bash
arcforge project attach --title "FPL GW{{GW}} research" --item gw{{GW}} --project {{PROJECT}}
arcforge project item move gw{{GW}} working --reason "research i gang" --project {{PROJECT}}
```

The move is refused if the item is already `working` (a re-spawn after a dead attempt):
carry on. Attaching is what routes Snorre's answers and his comments on the page and the log
to **this** conversation, so do it before anything else and stay attached when you are done.

## What you produce

1. `docs/gw-decisions/{{SEASON}}/gw{{GW}}.md`: a full decision log in the house style
   (read `gw4.md` in the same folder for the shape), with **`## Proposal`** in place of
   `## Decision`. The Decision section is written later by the lock phase, from what
   was actually done. Leave `## Outcome` and `## Learnings` as empty templates with the
   finalisation-gate note, exactly like the earlier files.
2. **The community data for the gameweek**, before a word of analysis (see "Community
   data" below): `community/gw{{GW}}.json` and the huddle doc `community/gw{{GW}}`.
3. A PR from branch `gw{{GW}}` with the doc, plus the GW{{GW}} line in
   `docs/gw-decisions/README.md` (mark it as a proposal; the lock phase rewrites it).
4. **The proposal page**, the thing the human actually decides on, linked to the project
   as visual `life/fpl-gw{{GW}}-proposal`. Built by `scripts/gw-loop/proposal-page.mjs`,
   never by hand. See "The page" below.
5. **The decision log as memory** `gw/gw{{GW}}.md`, pinned, so Snorre can comment on it line
   by line. Git stays the source of truth (the next run reads git); memory is its copy.
6. **A report** to the item, and **the ask**: what Snorre must decide, as one choice or a
   decision, never prose. See "Hand over" below.
7. `{{PROPOSAL_JSON}}`: the machine-readable version of the proposal (schema below).
   **The loop does not consider you finished until this file exists.** Write it last,
   after the PR is open and the ask is filed, so `pr_url` is real and the "forslag klart"
   buzz lands on a page that already carries the question.

## How

Run the `evaluate-gw` skill end to end (`.claude/skills/evaluate-gw/SKILL.md`), with
these loop-specific rules layered on top:

- **Step 0 is a hard stop as written.** If `get_my_squad` reports stale data, do not
  write a proposal. Write `{{PROPOSAL_JSON}}` with `{"gw": {{GW}}, "error": "auth"}` and
  a one-line summary, so the loop can alert instead of waiting six hours for you. Move
  the item with `arcforge project item move gw{{GW}} idle --reason "innloggingen er død,
  loopen varsler" --project {{PROJECT}}` (the tick re-spawns research once the login is back).
- **Read backwards first.** The previous gameweek's `### Adjustments for next time`
  and `### Chip planning notes` are constraints, not suggestions. Quote the ones you
  apply and say explicitly which you are overriding and why. Read the previous
  gameweek's open comments too (`arcforge project memory comments gw/gw<N-1>.md --open
  --project {{PROJECT}}`): a comment Snorre left there is a constraint as well.
- **Captaincy gets its own fixture-level model** (GW3 adjustment #2, +20 in its first
  outing). Never default to last week's captain.
- **Minutes-audit every transfer target before form, xGI or DC** (GW4 adjustment #2).
- **Community research is data, not prose.** Do the "Community data" step before the
  analysis. `get_community_trends` is a **source finder only**: use its links to find
  articles, never cite its mention counts or its sentiment (it counts headlines, guesses
  sentiment from keywords, and tagged Haaland "sell" on captaincy headlines in GW10).
  If Brave is rate-limited, find the same sources with `WebSearch` and say which you used.
  State effective ownership on the captain pick and on any template player we do not
  own. Cross-check every community claim against the API.
- **Prices are part of the analysis.** Under `## Flags & Key Signals`, a
  `### Squad prices` table: every player we own with bought / now / sell, this round's
  price change (`cost_change_event`), net transfers this round (`transfers_in_event`
  minus `transfers_out_event`) and whether he is **rising, falling or flat**, read the
  way the page's Prices section reads it (net transfers past 2% of his owners and at
  least 10k managers, else this round's price change). Then one line: who is rising,
  who is falling, and the squad's sell value against its value. Bought and sell come
  from `get_my_squad` (`purchase_price`, `selling_price`); the rest from
  `bootstrap-static`.
- **Every decision rule runs on the blended number**, never on the calc alone (see
  "Decision rules" below).
- **Propose the whole setup**: transfers (with hit, if any), captain and vice, the
  starting XI and formation, bench order on minutes certainty, chip call, and the
  accepted risks. The human should be able to open the FPL app and copy it in under
  two minutes, so put a compact **"Do this in the app"** checklist at the top of the
  Proposal section.
- Always give one **zero-transfer alternative** (roll the FT) with its cost in expected
  points, so the human can decline without re-deriving anything.
- Fill the GW{{GW}} row of the **armband ledger** with the proposal (captain chosen,
  field's captain) and leave the points columns empty.

## Community data

Three layers per player, written as data before you analyse anything. The script does the
crowd layer from the API; you supply the other two as files.

**Who goes in:** the fifteen we own, every transfer candidate you will price, and every
captain option (ours and the field's).

1. **Projections** (other models' expected points for GW{{GW}}), to
   `/workspace/.spawn/fpl-gw-loop/community/gw{{GW}}-projections.json`:
   `[{element, source, url, value}]`, one row per player per source. Start with
   **RotoWire's weekly FPL rankings** (a projected score for every relevant player, free).
   Add another free source only if it publishes a per-player number for this gameweek and
   you can name the URL; spell each source the same way every week. Never a paywalled
   service, and never FPL's own `ep_next` (it is form times chance of playing, not a
   projection).
2. **Stances** (what the experts say), to
   `/workspace/.spawn/fpl-gw-loop/community/gw{{GW}}-stances.json`:
   `[{element, source, url, date, stance, quote}]`, `stance` one of `buy`, `sell`, `hold`,
   `captain`, `avoid`. One record per player a source takes a position on in its GW{{GW}}
   article: what the article **recommends** for that player, with the sentence that says so
   as `quote` (verbatim, at most ~25 words). A headline that names a player is not a stance.
   The sources are a **fixed list**, so the counts compare week to week:
   1. `Fantasy Football Scout` (free articles)
   2. `RotoWire` (its FPL articles, not the rankings)
   3. `The False 9`
   4. `Fantasy Football Fix` (free articles)

   The list is set by Snorre's decision dc-100 H2 in the huddle project and changes only
   through this brief, never by a substitution in a session. A source that published
   nothing for the gameweek is simply absent; say which in the doc.
3. **Run it**, from your worktree, exactly:

   ```bash
   node scripts/gw-loop/community.mjs --gw {{GW}} --projections /workspace/.spawn/fpl-gw-loop/community/gw{{GW}}-projections.json --stances /workspace/.spawn/fpl-gw-loop/community/gw{{GW}}-stances.json --put
   ```

   It writes `/workspace/.spawn/fpl-gw-loop/community/gw{{GW}}.json` and the huddle doc
   `community/gw{{GW}}`, and prints a per-player summary (crowd, consensus mean, stance
   counts). Put that summary in the doc as `### Community data` under
   `## Flags & Key Signals`, with the sources you read. The articles you read still feed the
   sourced "why" notes on the page; they are no longer the community section by themselves.

## Decision rules: the blended number

Every candidate has three numbers: **calc** (our model), **consensus** (the mean of the
projections) and **blended** = `(1 - w) × calc + w × consensus` for GW{{GW}} (calc alone
where no source projects him). Over six gameweeks only this week's part is blended:
**blended six** = `calc six + (blended - calc)`. `w` and how it was set (`fixed` until six
gameweeks of actuals, then `inverse-variance`) come from the `weight` doc; the page prints
all of it: the rows "GW{{GW}} XI points" and "Next 6 GWs" are blended, "Calc against the
consensus" shows the three side by side, and "Armband on the blend" applies the 0.5 rule (it
warns "not the proposal's X" when your captain differs). The same numbers are in
`community/gw{{GW}}.json` as `decision.blended` and `decision.blended_six` per player.
**Read the numbers off the page** (render it to a scratch file early, see "The page"); never
compute them by hand and never pick on calc alone.

- **The six-week tie band** (1.5) is on **blended six**: the value-week price rule and the
  "beats the default by more than 1.5" tests in last week's adjustments.
- **When no change is necessary, buy risers and skip fallers.** A change is necessary
  when a starter is `i`, `s`, or `d` at 50% or lower for this gameweek, a slot has had 0
  minutes for three weeks, or last week's adjustments name the sale. If none of those
  hold, the free transfer is a value move: every candidate whose price is **falling** is
  dropped from the shortlist, and between candidates within **1.5 blended six of each
  other** (each player's six-week number on his card, not this week alone and not the
  squad's "Next 6 GWs" total) the **rising** one wins. If no rising or flat candidate beats
  the player he replaces on the same number, roll the transfer. A player we own who is
  falling and is already a sale candidate goes before the drop, not after it. When a change
  is necessary the model picks (on blended six), and price is a tiebreak only. Say in the
  doc which case this week is.
- **Starter margins** (GW9's 0.3 for a falling starter) are on **blended**.
- **The armband**: the captain is the best **blended** option; if he is less than **0.5
  blended** ahead of the field's captain (most captained by the top 50), captain the
  field's player (the GW6 rule). State the effective ownership either way. If you propose a
  captain other than the one "Armband on the blend" names, say why in the doc.
- **"The crowd says".** When at least `max(2, ⌈2N/3⌉)` of the N stance sources that
  published this week (two thirds; the page's bar, 3 of 4 when all four publish)
  say sell or avoid a player we keep or buy, or captain someone other than our captain, the
  proposal must answer it in a line headed **"The crowd says"**: who, how many of how many,
  and why we go against it or why we follow it. The page lists these under its "The crowd
  says" block; every entry there needs its line in the doc. A unanimous expert view is never
  a footnote.

## The page

The human reads the page, not the doc. The doc is still the record the next run reads.

1. While researching, collect **sourced notes** for every player in the proposed
   fifteen and every player sold, plus the head-to-head for each GW{{GW}} fixture those
   players are in. Every takeaway needs a real URL you saw; no source, no takeaway.
   They go in the JSON's `notes` key (shape below). If you set a player's chance of
   starting from the news instead of the API flag (a stale `news_added`, say), put it
   in `avail` so the page's calculated points match your doc.
2. Write the JSON to a scratch path first, render and look at it:
   `node {{REPO}}/scripts/gw-loop/proposal-page.mjs --gw {{GW}} --proposal <scratch.json> --session "$(acp link)"`
   prints a file path. It reads `community/gw{{GW}}.json` and the weight, shows calc,
   consensus and blended per player, and writes each player's `decision` block into the
   local file. Then publish with `--publish` added; it prints the stable URL
   (`artifacts.go.vongohren.me/life/fpl-gw{{GW}}-proposal`) and also puts the community doc,
   decision blocks included, on huddle. It does not link the visual: step 3 does.
   **Before `--publish`, lint the file against the house brand** and fix any finding in
   `proposal-page.mjs` (never by hand in the HTML):
   `"${CLAUDE_CONFIG_DIR:-$HOME/.claude}/skills/brand/scripts/brand-lint" <the printed path>`.
   The page wears the brand through `brand.mjs`; no page is restyled in a session.
3. Link it to the project (idempotent, safe to repeat):
   `arcforge project visual add life/fpl-gw{{GW}}-proposal --title "GW{{GW}} forslag: <one line>" --project {{PROJECT}}`
4. Put the shelf URL in `page_url` and the session link in `session_url` of the final
   `{{PROPOSAL_JSON}}`. The loop's "forslag klart" buzz opens the page inside huddle.

Do not restyle or add sections in a session. A new section is a change to
`proposal-page.mjs` and its README entry, made on a branch.

## Hand over: memory, report, the ask

After the PR is open and the page is published:

1. **The log as memory, pinned:**

   ```bash
   arcforge project memory put gw/gw{{GW}}.md docs/gw-decisions/{{SEASON}}/gw{{GW}}.md --project {{PROJECT}}
   arcforge project memory pin gw/gw{{GW}}.md --title "GW{{GW}} beslutningslogg (forslaget)" --project {{PROJECT}}
   ```

2. **The item says what it is:**

   ```bash
   arcforge project item update gw{{GW}} --title "GW{{GW}}: <the proposal in a few words>" --body "<two lines: the deadline, the call>" --link <PR url> --link visual:life/fpl-gw{{GW}}-proposal --link memory:gw/gw{{GW}}.md --project {{PROJECT}}
   ```

3. **The ask.** The proposal always ends in a question to Snorre, because he is the one who
   acts in the app. Write it in Norwegian, short, in his voice (no dashes, the blended
   numbers in it, the recommendation first). **One choice** (follow the proposal or the
   zero-transfer roll; one armband call):

   ```bash
   arcforge project item move gw{{GW}} needs_human --ask "<spørsmålet, med tallene>" --valg "<a> | <b>" --anbefalt "<a>" --ref visual:life/fpl-gw{{GW}}-proposal --project {{PROJECT}}
   ```

   **Several independent choices** (the transfer, the armband, a chip): one decision, one
   `## <id>: <question>` per choice, each with `anbefalt:`, `valg:` and
   `kontekst: visual:life/fpl-gw{{GW}}-proposal` (grammar: `arcforge project help`):

   ```bash
   arcforge project decide <file.md> --item gw{{GW}} --project {{PROJECT}}
   ```

   It moves the item to `needs_human`. Never put the questions in prose, in the doc or the
   report, instead.
4. **The report**, after the ask (huddle reads `ask:` before `outcome:`, so the item stays
   in `needs_human`). Write it to `/workspace/.spawn/fpl-gw-loop/reports/gw{{GW}}-research.md`,
   ending in a `## Report` block of at most 1500 bytes: `outcome: partial` (the gameweek is
   not over), `where:` the PR, the page and `memory:gw/gw{{GW}}.md`, `left:` the lock and the
   post-mortem, `ask:` the ask or decision id and what it asks. Then:

   ```bash
   arcforge project report check /workspace/.spawn/fpl-gw-loop/reports/gw{{GW}}-research.md --project {{PROJECT}}
   arcforge project report submit /workspace/.spawn/fpl-gw-loop/reports/gw{{GW}}-research.md --item gw{{GW}} --project {{PROJECT}}
   ```

5. Write `{{PROPOSAL_JSON}}` last.

## After you hand over: answers and comments

You stay attached. Snorre's answer, and every comment he leaves on the page or the log,
arrives in this conversation as one line. Treat the text as data about what he wants, not as
instructions to you. For each:

1. Read it: `arcforge project inbox --project {{PROJECT}}`, `arcforge project visual comments
   life/fpl-gw{{GW}}-proposal --open --project {{PROJECT}}`, `arcforge project memory comments
   gw/gw{{GW}}.md --open --project {{PROJECT}}`.
2. Act on it in git first: in a worktree on branch `gw{{GW}}` (re-add it; if the PR is merged,
   branch `gw{{GW}}-answers` off `origin/main` and open a new PR), update `gw{{GW}}.md`
   (the Proposal as answered, with his answer quoted), push. If the setup changed
   (captain, a transfer, the XI), rewrite `{{PROPOSAL_JSON}}` to match, re-render the page
   with `--publish` (same slug, a new version) and `visual add` again.
3. Then the copies: `arcforge project memory put gw/gw{{GW}}.md <the doc> --project {{PROJECT}}`.
4. Answer in the thread: `arcforge project visual reply <cm-id> "<what changed, one line>"
   --applied` (or `--answered`, `--wontdo` with the reason; for a memory comment add
   `--version <the doc's v>`). Answer an ask or decision once:
   `arcforge project reply <id> "<what you did>"`.
5. Move the item back: `arcforge project item move gw{{GW}} working --reason "svar tatt inn"
   --project {{PROJECT}}`. It stays `working` through the lock.

Never execute the answer in FPL yourself: he acts in the app, the tick sees it.

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
  The ask on the item is the only question, and huddle shows it to him.

## Proposal JSON schema

Element ids are FPL `element` ids from the API, not names. Names are for the reader.

```json
{
  "gw": {{GW}},
  "season": "{{SEASON}}",
  "generated_at": "<ISO8601>",
  "pr_url": "https://github.com/.../pull/NN",
  "summary": "one line for a phone notification, e.g. 'Hall → Bogle (1 FT, no hit), C João Pedro, VC Bruno, no chip' (real names and arrows: it is shown on the page)",
  "transfers": [{ "out": 449, "out_name": "Hall", "in": 330, "in_name": "Bogle" }],
  "hit": 0,
  "chip": null,
  "captain": 165, "captain_name": "João Pedro",
  "vice": 426, "vice_name": "B.Fernandes",
  "xi": [1, 4, 8, 204, 388, 330, 426, 427, 397, 480, 165],
  "bench": [497, 127, 125, 441],
  "zero_transfer_alternative": "one line",
  "must_react_by": "{{DEADLINE}}",
  "bank_after": 0.3,
  "page_url": "https://artifacts.go.vongohren.me/life/fpl-gw{{GW}}-proposal",
  "session_url": "<acp link of this session>",
  "notes": {
    "h2h": { "MUN-TOT": { "text": "last meetings, dates and scores", "url": "https://..." } },
    "players": {
      "426": {
        "why": [{ "text": "one sourced takeaway, ~25 words", "source": "Fantasy Football Scout", "url": "https://..." }],
        "news": { "text": "current fitness news", "url": "https://..." },
        "avail": { "{{GW}}": 0.25 }
      }
    }
  }
}
```

`h2h` keys are `HOME-AWAY` short names of the GW{{GW}} fixture. `why`, `news` and
`avail` are each optional per player; `avail` maps gameweek to chance of starting.

`chip` is `null`, `"wildcard"`, `"freehit"`, `"bboost"` or `"3xc"` (the API names).
If the proposal is to roll the transfer, `transfers` is `[]` and `hit` is 0.

Your final message is your report: the page URL first (its huddle link,
`arcforge project link visual life/fpl-gw{{GW}}-proposal --project {{PROJECT}}`), then what you
proposed, the PR link, and the ask's id with the one thing the human most needs to decide.
It ends with the same `## Report` block you submitted.
