# GW5 Decision Log — THE BENCH CANNOT COVER THE CAPTAIN

**Deadline:** Friday 2026-09-18 17:30 UTC
**Fixtures:** Fri-Sun (Sep 18-20), single GW, no DGW/BGW. **Followed by a three-week international break (GW6 is Oct 10).**
**Date of analysis:** 2026-09-16 (proposal), 2026-09-17 (Thursday recheck), **2026-09-18 (Decision, written at lock)**

---

## Pre-GW Context

### Squad state (pre-transfer)
- **Budget:** £1.3m ITB, **1 free transfer**
- **Squad value:** £98.5m
- **Chips:** all four available and playable (BB, TC, WC, FH), first-half set, **all expire GW19**
- **Rank:** 3,200,152 after GW4

### Season so far
| GW | Pts | Avg | Bench | Rank |
|---|---|---|---|---|
| 1 | 46 | 50 | 5 | 5,572,584 |
| 2 | **93** | 81 | 0 | 3,345,863 |
| 3 | 52 net (56 gross, -4) | 51 | 0 | 3,504,624 |
| 4 | **75** | 69 | 3 | **3,200,152** |

### Prior-decision context: the GW4 constraints

[GW4](gw4.md) left seven adjustments and a chip note. They are read here as constraints,
not suggestions. Applied this week:

1. **"Hall is the next transfer candidate."** DC series 11, 13, 6, 6; two starts for 4
   points. *Applied as a candidate, **overridden as the transfer**: see below. Hall's
   GW5 fixture (NEW v HUL at home) is the best he has had, and the free transfer is
   needed more urgently elsewhere.*
2. **"Minutes-audit the buy list, not just the squad."** *Applied as the first gate on
   every candidate. It removed Delap and Igor Jesus from the forward shortlist before
   form was considered.*
3. **"Discount FDR against promoted sides until their results say otherwise."** *Applied
   with the API's four-game results: the discount stays on Hull (2 conceded in 4) and is
   lifted on Coventry (9 conceded, 0 scored) and Ipswich (10 conceded).*
4. **"A fixture-run average is not a fixture."** *Applied: every candidate is read on
   the GW5 fixture first and the GW5-10 run second.*
5. **"Price the structural filters."** *Applied: the hedging rule removed Calvert-Lewin
   and Bogle this week; both costs are written down.*
6. *Finalisation-gate note. Applies to the post-mortem, not here.*
7. **"Run the captaincy model again from scratch for GW5 rather than defaulting to
   João Pedro."** *Applied, and the model did not get the chance to default: João Pedro
   is a 75% doubt with a knee injury.*

**Chip note:** *"The GW5 evaluation should argue the wildcard seriously and on this
list"* (Haaland unreachable, Obi a permanent zero, Hall's DC failed, MUN×3 returned 4
from £24.4m, both Brighton slots wrong). Argued below.

---

## Flags & Key Signals

### João Pedro is a doubt, and the bench cannot cover him

The API has him `status: d`, **75% chance of playing**, `ep_next` cut from 8.2 to 6.1.
The story behind it: he hurt his knee in an aerial challenge against Hull, played on
and scored, then failed examinations afterwards. On 2026-09-16 he **withdrew from the
Brazil squad**, with the CBF stating he is injured, and he **has not been seen in
Chelsea training**. Xabi Alonso's press conference is Thursday 12:30 UTC. Chelsea play
**Friday 19:00 UTC**, ninety minutes after the deadline, so the lineup lands after we
lock. He is **75.4% owned**, the most-owned player in the game.

The structural problem is ours, not the field's. If he misses, the autosub is the
first bench player who yields a legal formation, and with a 5-4-1 that can only be a
forward: **Georginio** (BHA at home to ARS, 90 minutes all season, unused in a 5-0) or
**Obi** (loaned to Willem II, status `u`). The field's benches carry an Emersonn or a
Kostoulas; ours carries a zero, and if Georginio did play he would be in direct
opposition to our own ARS×3. A João Pedro absence costs us the slot outright.

### The armband: every fixture, from scratch (GW4 adjustment #7)

Four-game results from the API, which is what adjustment #3 asked for:

| Opponent | Conceded (4) | Scored (4) | Read |
|---|---|---|---|
| **Coventry** (v NFO, away) | **9** | **0** | Pointless and goalless. Promoted-side discount **lifted** |
| **Ipswich** (v EVE, away) | **10** | 7 | Concede like a bottom side, but score. Discount lifted on the defence |
| **Hull** (v NEW, away) | **2** | 5 | Discount **stays**. Beat MUN, drew at CHE |
| Fulham (v MUN, home) | 7 (3, 3 at home) | 4 | Softer than FDR 3 for MUN's attackers |
| Sunderland (v MCI, away) | 5 | 3 | FDR 5 for them; City have scored 1, 1 in the last two |
| Brighton (v ARS, home) | 5 | **13** | Scored in every game. Bad week for an ARS clean sheet |
| Leeds (v CRY, home) | 3 | 7 | Scored four last week. Bad week for Mitchell |
| Brentford (v CHE, home) | 4 | 6 | Tight at home (0, 1, 1 conceded) |

| Candidate | GW5 | FDR | xGI/90 | Form | Read |
|---|---|---|---|---|---|
| **Gibbs-White** | NFO (H) v COV | **2** | 0.65 | 6.5 | 0.91 xA and 7 attempts last week; COV have not scored. 12.8% owned |
| B.Fernandes | MUN (a) at FUL | 3 | **0.85** | 7.2 | 2, 23, 2, 2. FUL concede 3 at home; MUN scored 0 in the derby |
| Mbeumo | MUN (a) at FUL | 3 | 0.84 | 5.8 | Same fixture, lower floor |
| Guéhi | MCI (H) v SUN | 2 | 0.32 | 6.5 | Best clean-sheet spot of the week, but a defender's ceiling |
| Semenyo | MCI (H) v SUN | 2 | 0.29 | 4.0 | 16 points in four, 0.06 xGI in the derby |
| João Pedro *(incumbent)* | CHE (a) at BRE | 3 | 0.59 | 8.2 | **75% doubt**, lineup after the deadline |
| Gabriel / Calafiori / Raya | ARS (a) at BHA | 3 | | | Brighton have scored 13 in four |

The model picks **Gibbs-White**: the only squad player in an FDR-2 fixture whose
opponent's results confirm the rating rather than undercut it. B.Fernandes is the
higher-xGI player in a fixture that is softer than its FDR, and is the vice.

**Effective ownership, stated plainly.** The field's captain is **Haaland, at home to
Sunderland, 72.5% owned**, the most-captained player in all four gameweeks so far and
the community's unanimous GW5 pick (OneFPL, RotoWire, Scout Picks, Ingenuity). We do
not own him. If he scores twice, that is roughly 20 to 26 points against us before our
captain kicks a ball. GW4 was the cheapest week of the season to be Haaland-less; **GW5
is the most expensive**. This is the accepted cost of the build and it is stated, not
buried. His one risk is City's EFL Cup tie on Thursday 17 September.

### Dead weight

| Player | £ | Form | ep | Problem |
|---|---|---|---|---|
| **Obi** (MUN, FWD) | 4.5 | 0 | 0 | Loaned to Willem II, status `u`, 0% |
| **Georginio** (BHA, FWD) | 5.4 | 1.2 | 1.2 | 90 min all season, unused in a 5-0, and now the only autosub for a doubtful captain-tier forward |
| Hall (NEW, DEF) | 5.1 | 4.5 | 4.5 | DC 11, 13, 6, 6 (mean 9.0, under the 10 threshold). GW4 adjustment #1 |
| Mitchell (CRY, DEF) | 4.5 | 4.2 | 4.2 | **Palace have conceded 11 in four**, incl. 3 at home to Ipswich. Away at Leeds (scored 4 last week) |

Dubravka (£4.0m, 0 min) is structural filler. Gomez (348 min, 16 pts) is a working
bench slot, but he is BHA and therefore against our ARS×3 this week.

### Fixture runs, GW5-10, rank among 20 teams

| Team | Avg FDR | Rank | Squad exposure |
|---|---|---|---|
| NEW | 2.7 | **3** | Hall |
| ARS | 2.8 | **4** | Raya, Gabriel, Calafiori |
| MCI | 2.8 | 5 | Guéhi, Semenyo |
| CRY | 3.0 | 7 | Mitchell |
| EVE | 3.0 | 8 | *(Barry, candidate)* |
| NFO | 3.0 | 10 | Gibbs-White |
| CHE | 3.2 | 13 | João Pedro |
| MUN | 3.2 | 16 | B.Fernandes, Mbeumo, Obi |
| LEE | 3.5 | 19 | *(Bogle, candidate)* |
| **BHA** | 3.7 | **20** | Gomez, Georginio |

Read per adjustment #4: this is the second input, not the first. Bogle's Leeds are 19th
over the run and have the softest home fixture of the round this week.

### Community (source: Brave via `get_community_trends`, plus WebSearch)

Brave returned partial results on all three angles (429 rate-limit on part of every
query) and **nothing at all for differentials**; that angle and the injury news came
from `WebSearch` over the same sources (Scout, FFFix, OneFPL, RotoWire, Ingenuity).

- **Transfers:** Gibbs-White is the most-mentioned buy (5 mentions), with a "Forest
  triple-up" (Scout Picks: Williams, Gibbs-White, Delap) into Coventry. White (ARS, 3),
  Munoz (2), Tzolis (2), Mbeumo (2, "due"). Hall and Barnes flagged as Newcastle-v-Hull
  options. Cross-check: Munoz and Tzolis are not in our budget, White is a 75% doubt
  himself, and ARS is already at three.
- **Captaincy:** Haaland (5 mentions) then Palmer (4), then Saka. Gibbs-White and Delap
  appear as "talisman" mentions. No source ranks João Pedro, which given his ownership
  tells you the injury news has landed.
- **Differentials (WebSearch):** Josh King (FUL, £5.5m, 1.5%), Garner (EVE, £6.0m,
  1.0%, 17 DC points last week), Ndoye (NFO, £5.5m, 0.7%, 0.68 xGI/90). Cross-check:
  Ndoye's 258 minutes in four starts fails the minutes audit for a starter; King plays
  Liverpool.
- **Hot topics:** "Wildcard timing" is top of the captaincy feed, which is the
  international break talking.

---

## Analysis

### The transfer: the hole is at forward, not at left-back

GW4 named Hall as the next transfer. The João Pedro news changes the order, not the
verdict. One free transfer can do one of three jobs this week:

| Job | Move | This week | Structural |
|---|---|---|---|
| **A. Cover the captain-tier forward** | Georginio → live FWD | Insurance worth ~4 × P(JP misses); if he plays, a real second forward in a 4-4-2 | Fixes the dead FWD bench, the autosub, and one of the two "wrong Brighton players" |
| B. Sell Hall (adjustment #1) | Hall → Bogle / Gvardiol | +1.5 to +2 expected on the slot | Bogle's run is 19th; Gvardiol makes MCI×3 |
| C. Sell João Pedro | JP → live FWD | Locks in a downgrade on a 75%-owned player, before the manager has spoken | Loses 0.2m on the rebuy at minimum |

**A.** The failure mode is asymmetric. If João Pedro plays and we have covered him, we
have a £5.6m forward on the bench (or Mitchell on the bench, see the XI). If he misses
and we have not covered him, we have ten players and a Georginio. At the API's own 75%
the insurance is worth about a point; on the reporting (out of the national squad,
absent from training, "highly unlikely") it is worth three or four. The move also
survives every branch: it is not undone by a fit João Pedro, and it is not undone by a
GW6 wildcard, which throws the squad away for free anyway.

**B is overridden this week, and the override is priced.** Hall at home to Hull is the
best fixture on his card (NEW run rank 3, FDR 2 discounted to 3), and the two
candidates carry their own problems: Bogle (37 pts, highest in the game, 3.8% owned) is
an LEE defender at home to *our* CRY defender, exactly the shape GW4 rejected him on
against Hall, and Gvardiol makes MCI×3. Adjustment #5 says write the cost down:
**Bogle over Hall is worth roughly +2 this week and we are not taking it.**

**C is rejected.** Selling the most-owned player in the game on a knee knock, a day
before his manager speaks, is the one move that cannot be walked back.

### The forward shortlist, minutes first (adjustment #2)

Budget: Georginio £5.4m + £1.3m = **£6.7m**.

| Candidate | £ | Min / starts | Gate | GW5 | Opp conceded (4) | xGI/90 | Pts | Own |
|---|---|---|---|---|---|---|---|---|
| **Barry** (EVE) | 5.6 | 327 / 4 | ✓ | IPS (H), FDR 2 | **10** | **0.86** | 14 | 6.6% |
| Wissa (NEW) | 6.2 | 351 / 4 | ✓ | HUL (H), FDR 2→3 | 2 | 0.40 | 15 | 18.1% |
| Calvert-Lewin (LEE) | 6.0 | 329 / 4 | ✓ | CRY (H), FDR 3 | 11 | 0.70 | 20 | 23.0% |
| Emersonn (IPS) | 5.5 | 237 / 4 | ~ (59 min/start) | EVE (a), FDR 3 | 3 | 0.60 | 24 | 2.7% |
| Delap (NFO) | 5.5 | **187 / 2** | ✗ | COV (H), FDR 2 | 9 | 0.44 | 8 | 1.6% |
| Igor Jesus (NFO) | 5.8 | **226 / 2** | ✗ | COV (H), FDR 2 | 9 | 0.46 | 11 | 2.6% |
| Kostoulas (BHA) | 5.5 | 278 / 3 | ✗ BHA×3, v ARS | | | | | |

- **Delap and Igor Jesus fail the minutes gate.** Forest rotate the striker: two starts
  each in four. The Scout's "Forest triple-up" has Delap in it; the audit says he is a
  coin flip to start, and a bench forward who might not start is the problem we are
  solving, not a solution. This is exactly the Lacroix hole from GW4, closed.
- **Calvert-Lewin is removed by the hedging rule**: he attacks the Palace defence Mitchell
  is in. Cost of the filter, written down: he has the best fixture on the list (Palace
  have conceded 11) and 0.70 xGI/90. **Priced at roughly -1 against Barry this week.**
- **Barry over Wissa.** Barry's xGI/90 is more than double Wissa's, his opponent has
  conceded five times as many goals, and he is £0.6m cheaper. Wissa is the safer,
  more-owned pick with the better six-week run (NEW rank 3 v EVE rank 8), and he is
  positively correlated with Hall. That is a real argument for Wissa if the human wants
  the lower-variance version; on this week's fixture and on underlying, it is Barry.
  Barry's 14 points from ~3.1 xGI is the "due" profile, and GW3 learning #4 applies:
  that is a reason to expect regression, not a guarantee of it.

Hedge check on Barry: EVE v IPS, we own nobody from Ipswich. ✓ Club counts after:
ARS 3, MUN 3, MCI 2, BHA 1, EVE 1.

### The XI: 4-4-2, and the bench does the branching

With a live second forward the formation question is Barry v Mitchell for the last
slot, and it is not close: Mitchell is away at a Leeds side that scored four last
week, in a Palace defence that has conceded 11 in four, with 0.28 xGI/90. Barry is at
home to a defence that has conceded 10. **Barry starts, Mitchell is first bench.**

That ordering makes the João Pedro branch automatic. If he does not play, the autosub
is the first bench player who yields a legal formation: Mitchell, giving 5-4-1 with
Barry as the lone forward. If he plays, both forwards play. Nobody has to react to a
Friday-evening lineup that lands after the deadline. The residual risk is the one
autosubs cannot cover: he starts, lasts a few minutes, and banks 1.

Gomez is second bench, not first, because his fixture is against our own ARS×3.

### Pricing the intra-squad clash this week

GW4's post-mortem promised this: **BHA v ARS puts ARS×3 (Raya, Gabriel, Calafiori,
£19.7m) directly against BHA×2.** After the transfer BHA×2 is BHA×1, Gomez, and he is
on the bench. The clash is now a bench-vs-XI clash with a MID clean-sheet point at
stake on one side: priced at well under a point, and not worth a second transfer.

The derby anti-correlation from GW4 does not exist this week: Guéhi and Semenyo (MCI v
SUN) and B.Fernandes and Mbeumo (FUL v MUN) are in different fixtures.

### Chips: the wildcard argued on GW4's list, and held

The GW4 triggers, updated:

| Trigger | Status this week |
|---|---|
| Haaland unreachable | **Worse.** Home to Sunderland, the field's TC spot. The EO cost is at its season high |
| Obi a permanent zero | Unchanged |
| Hall's DC series failed | Unchanged, but his best fixture of the season this week |
| MUN×3 returned 4 from £24.4m | MUN at Fulham, who concede 3 a game at home. Better week for them than the run suggests |
| Both Brighton slots wrong | **Half fixed** by this transfer (Georginio out) |
| *New:* João Pedro doubt with no bench cover | **Fixed** by this transfer |
| *New:* Mitchell's Palace have conceded 11 in four | Benched, not sold |

Against playing it now:

- **The international break.** GW6 is 10 October. A GW5 wildcard locks a fresh fifteen
  through three weeks of internationals; a GW6 wildcard is drafted after them, with
  every injury (including João Pedro's knee) known. "Wildcard timing" is the top hot
  topic in the captaincy feed for exactly this reason.
- **A 75-point week with a working core.** Raya, Gabriel, Calafiori, Guéhi,
  B.Fernandes, Mbeumo, Gibbs-White and João Pedro are eight keepers. The job GW3 gave
  the wildcard, "the armband is the problem", was solved in GW4 by the captaincy model
  rather than by a rebuild.
- **The GW5 fixture set is the wrong week to judge a new squad on** (GW4's own note):
  ARS at Brighton, MUN at Fulham.

**Call: hold the wildcard for GW5, and move the decision point from "GW5-6" to
"GW6, drafted after the break".** The GW6 evaluation should open with a wildcard draft
by default and argue *against* it, rather than for it, on this list. If João Pedro's
knee is a multi-week injury, that settles it.

- **TC:** the field's TC spot is Haaland at home to Sunderland. We do not own him. No case.
- **BB:** dead. Even after this transfer the bench is Dubravka (0 min), Obi (loaned),
  Gomez and one of Mitchell/Barry.
- **FH:** no DGW/BGW in sight.

### Thursday recheck (2026-09-17, after the six press conferences)

Re-run on request. Live `bootstrap-static` (the MCP cache was 24h stale, GW4 adjustment
#6) shows **no new flags on the squad**: João Pedro still `d` 75%, everyone else `a`.
What the pressers changed:

| News | Effect on the proposal |
|---|---|
| **João Pedro:** Alonso: "no-one is ruled out for Friday", late fitness test after Friday training, "it's a possibility" he plays and skips Brazil | Unchanged. Still decided after our deadline; the 4-4-2 with Mitchell first bench covers a non-appearance automatically |
| **Newcastle:** N. González (concussion), Dedić (hamstring), Burn, Joelinton, Ramsey all out; Elanga MRI | A NEW clean sheet v Hull is less likely. **Hall's price for staying rises from about -2 to about -3 against Bogle**; still under the 4-point hit, still starts over Mitchell (Palace have conceded 11) |
| **Coventry:** Amenda (calf) out, Awoniyi suspended, on top of 0 scored / 9 conceded | Captain Gibbs-White strengthened |
| **Sunderland:** Reinildo suspended (two yellows) | Guéhi and Semenyo v SUN strengthened |
| **Hull:** Mendy (concussion) and Hughes out, Targett doubtful | Newcastle more likely to score: helps Hall's attacking side, and Wissa if the human prefers him to Barry |
| **Arsenal:** Gabriel's half-time sub "was planned", Timber being managed, White 75% | ARS×3 intact |
| **Forest:** Milenković out, Jair Cunha doubtful | Gibbs-White unaffected |
| Arsenal, Brighton, Everton, City, United pressers are **Friday** | No word yet on Barry, Haaland's EFL Cup minutes, or Shaw (75%) |

**Proposal unchanged.** A pitch-view for the phone was published at
https://artifacts.go.vongohren.me/life/fpl-gw5-team.

---

## Proposal

### Do this in the app

1. **Transfer:** OUT Georginio (BHA, £5.4m) → IN **Barry** (EVE, £5.6m). 1 FT, no hit.
   Bank after: £1.1m.
2. **Formation 4-4-2:** Raya; Gabriel, Calafiori, Guéhi, Hall; B.Fernandes, Mbeumo,
   Semenyo, Gibbs-White; João Pedro, Barry.
3. **Captain: Gibbs-White. Vice: B.Fernandes.**
4. **Bench order:** Dubravka, **Mitchell**, Gomez, Obi.
5. **No chip.**
6. **Thursday 12:30 UTC, Alonso's press conference.** If João Pedro is ruled out, swap
   him with Mitchell (5-4-1) so the dead slot sits on the bench. If he is a doubt or
   fit, leave it: Mitchell autosubs in if he does not play.

### Transfer

| OUT | £ | IN | £ |
|---|---|---|---|
| Georginio (BHA, FWD) | 5.4 | **Barry** (EVE, FWD) | 5.6 |

Cost: 0. Bank after: £1.1m. Overrides GW4 adjustment #1 (Hall) for one week, as argued
above; Hall remains the next defender out.

### Projected XI (4-4-2)
| Pos | Player | Team | £m | GW5 | FDR |
|---|---|---|---|---|---|
| GK | Raya | ARS | 6.0 | BHA (a) | 3 |
| DEF | Gabriel | ARS | 8.0 | BHA (a) | 3 |
| DEF | Calafiori | ARS | 5.7 | BHA (a) | 3 |
| DEF | Guéhi | MCI | 6.0 | SUN (H) | 2 |
| DEF | Hall | NEW | 5.1 | HUL (H) | 2 (read as 3) |
| MID | **B.Fernandes (V)** | MUN | 12.0 | FUL (a) | 3 |
| MID | Mbeumo | MUN | 7.9 | FUL (a) | 3 |
| MID | Semenyo | MCI | 8.4 | SUN (H) | 2 |
| MID | **Gibbs-White (C)** | NFO | 8.0 | COV (H) | 2 |
| FWD | João Pedro *(75%)* | CHE | 7.6 | BRE (a) | 3 |
| FWD | **Barry** | EVE | 5.6 | IPS (H) | 2 |

**Bench (minutes certainty, then correlation):** Dubravka (GK) → **Mitchell** (329 min,
4 starts; first so a João Pedro absence yields 5-4-1) → Gomez (348 min, but v our ARS×3)
→ Obi (loaned, 0%).

**Projected state after:** £98.7m value, £1.1m ITB, 0 FT. ARS×3, MUN×3, MCI×2, BHA×1, EVE×1.

### Zero-transfer alternative

Roll the FT (2 for GW6, or into the wildcard). Same XI minus Barry: 5-4-1 with Mitchell
at left-back, captain Gibbs-White, vice B.Fernandes, bench Dubravka, Gomez, Georginio,
Obi. **Expected cost: about 2 to 3 points.** Roughly 1 point from Mitchell over Barry
if João Pedro plays, and 4 points × P(he misses) from the Georginio autosub if he does
not, where the reporting puts P well above the API's 25%. The rolled FT is worth less
than that in a week that is followed by a wildcard decision.

### Chip strategy
**No chip.** All four remain available, all expiring **GW19**. Wildcard decision point
moved to **GW6, drafted after the international break**, with the GW6 evaluation
required to open with a wildcard draft and argue against it.

---

## Decision

**The proposal was executed in full. One transfer, no hit, no chip.** Status from the
loop's own comparison: **`matched`, 5 of 5 checks** (transfers, captain, vice, XI, chip).

Verified after the deadline against the public `entry/5047923/event/5/picks/` endpoint,
which is the truth the loop's snapshot is checked against — and re-checked element by
element against `get_my_squad`. The two agree on all fifteen ids, the captain flag, the
vice flag and the bench order.

### Transfer

| OUT | £ | IN | £ |
|---|---|---|---|
| Georginio (BHA, FWD) | 5.4 | **Barry** (EVE, FWD) | 5.6 |

Cost: **0**. API confirmation: `event_transfers: 1`, `event_transfers_cost: 0`,
`active_chip: null`, `bank: 11`, `value: 998`. Read the way [GW4](gw4.md) had to learn
to read this object: `value` is squad **plus** bank, so £99.8m is £98.7m of squad and
£1.1m banked — exactly the projected state. The `make_transfers` response again
returned `cost: 4`, again describing the *next* transfer rather than this one, and
again it was not a hit. Second gameweek running that this field has had to be
disbelieved, and the reason GW4 wrote it down.

Prices have drifted up since the proposal was written — `now_cost` for Calafiori 5.7 →
5.8, Hall 5.1 → 5.2, João Pedro 7.6 → 7.8. The table below shows **purchase** prices,
which is why João Pedro reads £7.5m there: bought at 7.5, sells at 7.6, listed at 7.8.

**Captain: Gibbs-White** (element 480, `multiplier: 2`). **Vice: B.Fernandes** (426).
Second armband change in two weeks, and the first of the season onto a player under 15%
owned.

### Starting XI (4-4-2)

| Pos | Player | Team | £m | GW5 | FDR |
|---|---|---|---|---|---|
| GK | Raya | ARS | 6.0 | BHA (a) | 3 |
| DEF | Gabriel | ARS | 8.0 | BHA (a) | 3 |
| DEF | Calafiori | ARS | 5.7 | BHA (a) | 3 |
| DEF | Guéhi | MCI | 6.0 | SUN (H) | 2 |
| DEF | Hall | NEW | 5.1 | HUL (H) | 2 |
| MID | **B.Fernandes (V)** | MUN | 12.0 | FUL (a) | 3 |
| MID | Mbeumo | MUN | 7.9 | FUL (a) | 3 |
| MID | Semenyo | MCI | 8.4 | SUN (H) | 2 |
| MID | **Gibbs-White (C)** | NFO | 8.0 | COV (H) | 2 |
| FWD | João Pedro *(75% doubt)* | CHE | 7.5 | BRE (a) | 3 |
| FWD | **Barry** | EVE | 5.6 | IPS (H) | 2 |

Fixtures and FDR read off the live `fixtures/?event=5` endpoint. Noted for the
post-mortem, and a repeat of GW4 adjustment #6: `get_my_squad`'s `next_fixture` block
was still serving **GW4** fixtures at lock time, so it is not a source for this table.

**Bench, in order:** Dubravka (GK, TOT h AVL) → **Mitchell** (CRY a LEE) → Gomez (BHA h
ARS) → Obi (MUN a FUL). With a 4-4-2 on the pitch, a João Pedro absence autosubs
Mitchell in for a legal 5-4-1 without anyone having to react to a lineup that lands
ninety minutes after the deadline.

**Final state:** £98.7m squad value, **£1.1m ITB**, 0 FT. ARS×3, MUN×3, MCI×2, NEW×1,
NFO×1, CHE×1, EVE×1, TOT×1, CRY×1, BHA×1. All four chips available, all expiring GW19.

### Proposal vs decision

**Nothing deviated.** Every line of the proposal — the transfer, the 4-4-2, the armband,
the vice, the bench order, no chip — is what the account shows. There is no dissent to
quote: PR [#39](https://github.com/vongohren/fpl-ai-assist/pull/39) (proposal) and
[#40](https://github.com/vongohren/fpl-ai-assist/pull/40) (Thursday recheck) both merged
with no comments and no reviews, and no commit message argues against any part of it.

What *is* recorded is the opposite of dissent. In the research conversation
([c576](https://acp.go.vongohren.me/?c=c576)) Snorre answered the standing offer with
**"Execute"**, then **"We ready? 😊"**, then **"Go please!"**, and the moves were made
from that session rather than by hand in the app: transfer first, then the lineup saved
at **14:10 UTC**, three hours and twenty minutes before the deadline. The loop's tick
saw the team flip `pending → matched (5/5)` at 15:10 UTC. So GW5 is the first week of
the season with **no human override anywhere in it** — whatever the post-mortem finds is
attributable to the model alone, with nothing to separate out. That cuts both ways, and
it is the cleanest test the process has had.

Two process notes worth carrying, neither of which changed the team:

- **The first execution attempt was refused.** The auto-mode permission classifier
  blocked `make_transfers` as a destructive account action, and the session declined to
  route around it with a raw API call. It went through later from a session where the
  call could be approved. The standing policy is unchanged: the loop proposes, and only
  an explicit "execute" from Snorre, in a session that can prompt him, moves the account.
- **The team was final at 14:10 UTC, before Friday's pressers were done.** Arsenal,
  Brighton, Everton, City and United all spoke on Friday; the proposal's Thursday recheck
  explicitly had no word yet on Barry, on Haaland's EFL Cup minutes or on Shaw. Nothing
  known at 14:10 argued for a change, but the team was locked against Thursday's
  information, not Friday's. Watch flag below.

The Thursday contingency (proposal step 6: swap João Pedro for Mitchell if Alonso ruled
him out) **did not trigger** — Alonso ruled nobody out, with the fitness test set for
after Friday training, which is after our deadline. The bench order carries that branch
by design, exactly as it was built to.

---

## Accepted risks

- **Haaland at home to Sunderland, unowned, 72.5% owned, the field's captain.** The
  most expensive week of the season for the Haaland-less build. Stated, not hedged.
- **The captain is 12.8% owned.** If Gibbs-White blanks while Haaland hauls, the double
  swing is the largest the ledger has seen. The model says it anyway: Coventry have
  conceded 9 and scored 0.
- **João Pedro starts as a 75% doubt** with the lineup landing after the deadline. The
  autosub covers a non-appearance; it does not cover a 10-minute cameo.
- **Hall is kept for a week after being named the next sale.** Priced at about -2
  against Bogle this week, taken knowingly for the forward cover.
- **ARS×3 at the Amex.** Brighton have scored in every game, 13 in four. Three slots
  keyed to a clean sheet that is less likely than in any week so far.
- **Barry is a 3.5-form forward bought on xGI.** GW3 learning #4: underlying is a reason
  to expect regression, not evidence it has arrived. If he blanks and Wissa returns at
  home to Hull, the pick was the higher-variance one and should be judged as such.
- **The Calvert-Lewin filter cost**, written down per adjustment #5: about -1 this week.

---

## Armband ledger (GW1 learning #4)

| GW | Our captain | Pts (x2) | Field's captain | Pts (x2) | Swing | Cumulative |
|---|---|---|---|---|---|---|
| 1 | B.Fernandes | 2 (4) | Haaland | 2 (4) | 0 | 0 |
| 2 | B.Fernandes | 23 (46) | Haaland | 13 (26) | **+20** | +20 |
| 3 | B.Fernandes | 2 (4) | Haaland | 9 (18) | **-14** | **+6** |
| 4 | João Pedro | 12 (24) | Haaland *(MUN away, FDR 4)* | 9 (18) | **+6** | **+12** |
| 5 | **Gibbs-White** | 2 (4) | Haaland *(SUN home, FDR 2)* | 6 (12) | **-8** | **+4** |

Confirmed captain: **Gibbs-White**, `multiplier: 2` on the locked picks. The field's
captain is **Haaland** — `most_captained: 411` and `most_selected: 411` on the live
bootstrap, 73.2% owned — at home to Sunderland.

Second armband change in two weeks, and the first onto a sub-15%-owned player. Note for
the post-mortem: the field's captain is in his easiest fixture of the season, so the
raw swing will overstate the evidence against the pick if he hauls, exactly as GW4's
note said the reverse.

---

## Watch flags for GW5

These test the decision that was made. Since it is identical to the proposal, every
proposal-time flag survives unchanged in substance; the three added at the bottom exist
because **there were no deviations to measure the human against**, which is itself the
thing worth measuring this week.

- [ ] **João Pedro, and the autosub.** Did he play, and for how long? The Thursday
      contingency never fired (Alonso ruled nobody out), so the whole branch rests on
      the bench order: if he missed, did Mitchell autosub cleanly into 5-4-1? If he
      played a cameo and banked 1, that is the uncovered risk landing — and it is the
      one outcome the 4-4-2 was explicitly unable to cover.
- [ ] **The armband, second week off B.Fernandes.** Gibbs-White (x2) against
      B.Fernandes (x2) and against Haaland (x2). Three numbers, not one.
- [ ] **Barry over Wissa.** Straight comparison. And did Barry's xGI convert, or is the
      "due" profile still due?
- [ ] **Hall kept over Bogle.** Priced at -2 on Tuesday, **re-priced at about -3 after
      the Newcastle pressers** (González, Dedić, Burn, Joelinton and Ramsey all out).
      What was the actual gap, and did the NEW clean sheet the price assumed away
      actually fail?
- [ ] **Delap and Igor Jesus.** Did the minutes gate call it right, i.e. did only one of
      them start against Coventry?
- [ ] **Calvert-Lewin filter cost.** Priced at -1 against Barry. Actual?
- [ ] **ARS×3 at Brighton.** Clean sheet or not, and how many goals conceded.
- [ ] **Mitchell benched.** First time he sits since GW3's autosub haul. Did Palace
      concede again?
- [ ] **Wildcard decision point moved to GW6.** After the break: how many of the new
      fifteen would have been injured on internationals? That is the evidence for or
      against the timing call.
- [ ] **The zero-deviation week.** *(new at lock)* First gameweek of the season executed
      exactly as proposed, with no human override anywhere in it. The score is therefore
      an unmixed measurement of the model. Price it against the **zero-transfer
      alternative** written into the proposal (roll the FT, 5-4-1 with Mitchell at
      left-back, Georginio the only autosub, estimated -2 to -3): was the Georginio →
      Barry transfer worth making, or was the rolled FT into a GW6 wildcard decision the
      better line? That comparison is the whole point of having written the alternative
      down.
- [ ] **Locked at 14:10 UTC, on Thursday's information.** *(new at lock)* The team was
      final three hours and twenty minutes before the deadline, and Arsenal, Brighton,
      Everton, City and United all held their pressers on Friday — the recheck had no
      word yet on Barry, on Haaland's EFL Cup minutes or on Shaw. Did anything in those
      pressers have changed the XI, the armband or the bench order? If yes, executing on
      "go" the moment it is given has a measurable cost, and the loop's nudge should sit
      later in the day.
- [ ] **The transfer was executed by the agent, not in the app.** *(new at lock)* First
      time this season. The account state came out correct on every field, but check the
      finalised entry history for anything the `save_team` / `make_transfers` round trip
      got wrong that the post-deadline read did not catch — in particular
      `event_transfers_cost`, which the API's own `cost: 4` field again misdescribed.

---

## Outcome

**Actual points: 58** (bench 8, no hit) · **GW average: 48** · **Highest score: 126**
**Overall rank: 2,376,841** (up from 3,200,152, **+823,311 places**)
**GW rank:** 2,124,288 · **Season total: 324**
**Most captained in the game:** Haaland (6 pts)

Finalisation gate confirmed before writing, on the live `bootstrap-static` endpoint per
GW4 adjustment #6: `events[4].finished = true`, `data_checked = true`, and
`automatic_subs` populated (one entry: Mitchell in, João Pedro out). `entry/5047923/history/`
agrees on every field: `points: 58`, `total_points: 324`, `event_transfers: 1`,
`event_transfers_cost: 0`, `points_on_bench: 8`, `bank: 11`, `value: 998`.

| Player | Min | Pts | Notes |
|---|---|---|---|
| Raya | 90 | **1** | **Conceded 3**, -1. 2 saves, 1.31 xGC. BHA 3-0 ARS |
| Gabriel | 90 | **1** | Conceded 3, -1. **DC 9, missed the threshold by one.** 0.14 xA |
| Calafiori | 90 | **1** | Conceded 3, -1. DC 5, bps -3 |
| Guéhi | 90 | 4 | Assist (3), **conceded 3**, -1. MCI 5-3 SUN, 3.57 xGC. DC 4 |
| **Hall** | 90 | **13** | **Goal** (0.19 xG) + **3 bonus** + **DC 10 banked** (exactly the threshold, +2). Conceded 1. NEW 2-1 HUL |
| B.Fernandes (V) | 90 | 2 | Appearance only. 0.47 xGI. FUL 1-1 MUN |
| Mbeumo | 90 | 2 | Appearance only. 0.52 xGI, no return |
| **Semenyo** | 90 | **17** | **2 goals + assist + 2 bonus from 0.33 xGI.** Joint top scorer in the whole game. MCI 5-3 SUN |
| **Gibbs-White (C)** | 90 | **2 x2 = 4** | **Appearance only.** 0.00 xG, 0.40 xA. **NFO 0-1 COV**: Coventry's first goal and first win of the season, at the City Ground |
| João Pedro | **0** | 0 | **Did not play.** Still `d`, 75%, news unchanged since 2026-09-16. Autosubbed out. BRE 3-0 CHE |
| **Barry** | 90 | 6 | **Goal from 0.52 xG.** EVE 1-0 IPS. Started, 90 minutes |
| *Bench: Dubravka* | 0 | 0 | |
| *Bench: Mitchell* | 90 | **7** | **AUTOSUB IN** for João Pedro. **Clean sheet** + 1 bonus, DC 8. LEE 0-0 CRY |
| *Bench: Gomez* | 85 | **8** | Assist + clean sheet + **DC 13 banked** (+2). BHA 3-0 ARS. All 8 bench points |
| *Bench: Obi* | 0 | 0 | Loaned to Willem II, status `u`. Permanently zero |

**Autosub fired: Mitchell in for João Pedro**, exactly the branch the 4-4-2 with a
defender at first bench was built to carry. The formation on the pitch was 5-4-1, the
one it was designed to fall into, and nobody reacted to a lineup that landed ninety
minutes after the deadline. Bench 8, all Gomez, the most bench points of the season.

XI total **58**, bench **8**, no transfer cost. Beat the GW average by **10** and gained
**823,311 places**, the largest rank move of the season, in the lowest-scoring week of
the season (average 48). It was carried by Semenyo 17, Hall 13, Mitchell 7 and Barry 6:
**43 of 58 from four slots**, two of which (Hall, Mitchell) were named as problems in
the proposal. The captain and the ARS×3 block returned **7 from four slots**.

### Flag outcomes

- [x] **João Pedro, and the autosub: HE DID NOT PLAY, AND THE BRANCH WORKED EXACTLY AS
      BUILT.** 0 minutes, status still `d` 75% with the news text unchanged since
      Wednesday; Chelsea lost 3-0 at Brentford with Welbeck up front. Mitchell autosubbed
      into 5-4-1 for **7** (clean sheet, 1 bonus). The uncovered risk (a cameo banking 1)
      did not land. This is the first autosub of the season that was *designed* rather
      than suffered (GW1's cost 4; GW3's happened to pay 15). Ownership note for GW6:
      he has fallen from 75.4% to **66.4%** during the week.
- [x] **The armband, second week off B.Fernandes: BLANK. 0 AGAINST THE INCUMBENT, -8
      AGAINST THE FIELD, -30 AGAINST OUR OWN XI.** Three numbers, as asked: Gibbs-White
      2 (4), B.Fernandes 2 (4), Haaland 6 (12). Coventry, 0 scored and 9 conceded in
      four, scored once (Dasilva) and won at the City Ground; Forest's xG was low enough
      that Gibbs-White finished with 0.00 xG and 0.40 xA. The fourth number is the one
      that hurts: **Semenyo 17 (34)** was in our XI, a candidate the model rejected on
      0.29 xGI/90 and 0.06 xGI in the derby, and returned 17 from 0.33 xGI. That is not
      a number any model finds. The pick was made on the opponent's four-game results,
      and those results turned out to be a small sample: see adjustments.
- [x] **Barry over Wissa: YES, +6.** Barry 6 (goal, 0.52 xG); **Wissa 0** (90 minutes,
      0.85 xGI, **missed a penalty**, -2). Barry's xGI converted on the first attempt;
      Wissa's was the higher underlying number and it went the other way. The
      higher-variance pick was the right one this week, and the reason it was made
      (xGI/90 more than double, opponent conceding five times as many) held: Ipswich
      conceded, Hull conceded two, but Wissa was the one who missed.
- [x] **Hall kept over Bogle: RIGHT ANSWER, WRONG MECHANISM, +8.** Hall **13** (goal,
      3 bonus, DC 10 banked), Bogle 5 (clean sheet, yellow, subbed at 66). The price was
      set at -3 on the assumption that the NEW clean sheet the hold depended on would
      fail after the injury list, and **it did fail**: Newcastle conceded. Hall scored
      anyway, from 0.19 xG, and banked the DC threshold exactly. His series is now **11,
      13, 6, 6, 10**, rolling mean 9.2, still under 10. The "next transfer candidate"
      named twice in a row has just returned 13. See adjustment #2.
- [x] **Delap and Igor Jesus: YES, THE MINUTES GATE CALLED IT.** Delap started and
      played 90 (1 point, yellow); Igor Jesus came off the bench for 31 (1 point).
      Exactly one of them started, as the two-starts-in-four record said. Both blanked
      in the 0-1, so the Scout's "Forest triple-up" returned 1 + 1 + 4 (Gibbs-White x2)
      from three slots. The gate was right and the fixture read behind the triple-up was
      wrong for everyone who made it.
- [x] **Calvert-Lewin filter cost: NONE, THE FILTER GAINED +4.** Priced at -1 against
      Barry. Actual: Calvert-Lewin 2 (LEE 0-0 CRY, 0.52 xGI, no goal), Barry 6. And
      Mitchell's clean sheet in the same fixture is the other side of the hedge holding.
      Second week in a row the hedging rule removed the candidate with the best fixture
      on paper; first week it cost nothing. Written down per adjustment #5.
- [x] **ARS×3 at Brighton: THE ACCEPTED RISK LANDED IN FULL. NO CLEAN SHEET, CONCEDED
      3, 3 POINTS FROM £19.7M.** BHA 3-0 ARS. Raya 1, Gabriel 1, Calafiori 1, every one
      a -1 for goals conceded. Gabriel's DC 9 missed the threshold by one. On the other
      side: Groß 14, Kostoulas 10, De Cuyper 6, and **our own Gomez 8 on the bench**.
      "Brighton have scored 13 in four" was the read, and it was right. Two data points
      for the block now: 29 in GW4, 3 in GW5, 32 across six slot-weeks, 5.3 per slot,
      which is about an XI average. Positive concentration and negative concentration
      are the same bet; the block has now shown both faces.
- [x] **Mitchell benched: NO, PALACE DID NOT CONCEDE, AND IT DID NOT MATTER.** LEE 0-0
      CRY. "Palace have conceded 11 in four, at Leeds who scored four" was the read, and
      Palace kept a clean sheet away from home. Wrong prediction, zero cost: the autosub
      brought him in for 7. Against Barry (the player he was benched for): Barry 6,
      Mitchell 7, -1 on the ordering, and both played. The only ordering cost in the
      week was Mitchell ahead of Gomez (7 v 8, -1), which was the minutes-and-correlation
      call and stands.
- [x] **Wildcard decision point moved to GW6: UNTESTED, THE BREAK IS NOW.** GW6 deadline
      is 2026-10-10 10:00 UTC. The evidence this flag asks for (how many of a fresh
      fifteen would have come back injured) does not exist until the break ends; the
      GW6 research run resolves it. What is known today: João Pedro is still `d` with a
      knee, the news field unchanged since 09-16, and the GW6 fixtures are ARS v LEE
      (H, FDR 2), MCI at LIV (FDR 4), MUN v TOT (H, 3), NEW at COV (2), NFO at CRY (3,
      Gibbs-White against Mitchell), EVE at HUL (2, discount stays), CHE v BOU (3).
- [x] **The zero-deviation week (vs the zero-transfer alternative): THE TRANSFER WAS
      WORTH +5, ABOUT DOUBLE THE ESTIMATE.** The written-down alternative was: roll the
      FT, 5-4-1 with Mitchell at left-back, bench Dubravka, Gomez, Georginio, Obi. Run it
      against the actual results: João Pedro misses, Gomez cannot autosub (six
      defenders), so **Georginio** (14 minutes, 1 point) comes in: Raya 1 + Gabriel 1 +
      Calafiori 1 + Guéhi 4 + Hall 13 + Mitchell 7 + B.Fernandes 2 + Mbeumo 2 +
      Semenyo 17 + Gibbs-White 4 + Georginio 1 = **53**. Actual 58. The estimate was
      "about 2 to 3", the actual gap is **5**, because the branch the transfer was
      insuring against (João Pedro absent) is the one that happened, and Barry scored
      in it. The unmixed measurement of the model, with no human override to separate
      out: +10 against the average, +823,311 places, on a week where its captain and
      its biggest block both blanked.
- [x] **Locked at 14:10 UTC, on Thursday's information: NO MEASURABLE COST.** The three
      open questions at lock were Barry, Haaland's EFL Cup minutes and Shaw. Barry
      started and played 90. Haaland played 90 (irrelevant to our XI). Shaw is not in
      the squad. Every one of our ten fit starters played 90 minutes, so nothing a Friday
      presser could have said would have changed a name in the XI; the only actionable
      Friday fact was João Pedro's non-appearance, which landed after the deadline and
      which the bench order handled for exactly the points a manual swap would have
      given (Mitchell 7 either way). The loop's nudge can stay where it is.
- [x] **The transfer was executed by the agent, not in the app: YES, THE FINALISED
      HISTORY IS CLEAN.** `entry/5047923/history/` for GW5: `event_transfers: 1`,
      `event_transfers_cost: 0`, `bank: 11`, `value: 998`, `total_points: 324` (266 +
      58), `chips: []`. Every field matches the post-deadline read, and the
      `make_transfers` response's `cost: 4` was, for the second week running, a
      description of the *next* transfer and not a hit. Nothing for the round trip to
      answer for.

---

## Learnings

### What we got right

- **The bench did the branching, and it was the right branch.** João Pedro did not
  play. Mitchell autosubbed into 5-4-1 for 7 without anyone touching the team after
  14:10 UTC. The whole GW5 analysis was built around one structural fact ("the bench
  cannot cover the captain-tier forward") and the transfer that fixed it was worth
  **+5** against the written-down alternative, double the estimate.
- **Barry over Wissa, +6.** The higher-variance, lower-owned pick on xGI and the
  opponent's results, over the safer, more-owned pick with the better run. Barry
  scored from 0.52 xG; Wissa missed a penalty. Fifth consecutive week the minutes-first
  transfer produced a positive.
- **The minutes gate on the buy list (GW4 adjustment #2) called Forest's striker
  rotation exactly:** one of Delap and Igor Jesus started, and the one who did returned
  1. The community's "Forest triple-up" was a trap the audit walked past.
- **The hedging filter cost nothing and gained 4.** Calvert-Lewin 2 against Barry 6,
  with Mitchell's clean sheet on the other side of the same fixture.
- **Hall held, +8 against Bogle**, though see below: the reason was wrong.
- **Beat the average by 10 and gained 823,311 places**, the largest move of the
  season, in the lowest-scoring week of the season. And the process was unmixed: no
  human override anywhere, so this is the model's number.

### What we got wrong

- **The captain returned 2, and the read behind him was a small sample.** Coventry (0
  scored, 9 conceded in four) scored and won at the City Ground. The captaincy model
  picked the *fixture* over the *player*: Gibbs-White's 0.65 xGI/90 was the fourth-best
  in the shortlist, and he was chosen because his opponent's four-game results
  "confirmed the FDR rather than undercut it". Four games is not a confirmation. The
  same table said Palace would concede at Leeds (0-0) and Sunderland would be a clean
  sheet (5-3). Three of the seven fixture reads in it were wrong on the day.
- **The ARS×3 block returned 3 points from £19.7m, and the log said it would if Brighton
  scored.** This is not a process error, it was the stated accepted risk. But it is the
  second gameweek (GW3 ARS v CHE, GW5 BHA v ARS) where the block has been keyed to a
  fixture the log itself called bad, and both times the block was held because moving
  three players is a wildcard's job. That is the wildcard argument, restated by the
  points.
- **Hall was priced at -3 and returned +8 against the alternative.** The mechanism the
  price assumed (a NEW clean sheet) failed as predicted, and Hall scored anyway. Two
  weeks in a row the log has named him the next sale, and this week he was the
  second-highest scorer in the squad. The DC series (11, 13, 6, 6, 10) still says what
  it said; the *points* series (3, 11, 4, 0, 13) says a different thing. The sale rule
  was written on one series and should have been reading two.
- **Semenyo 17 was in the XI and the armband was one slot away.** Nothing in the model
  finds 17 from 0.33 xGI, and this is not a mistake to correct. It is a reminder that
  the armband decides the week and the model's edge on it is small: GW4 +20, GW5 0
  against the incumbent.
- **Georginio played 14 minutes.** The "unused in a 5-0" bench forward got on the pitch
  in a 3-0, which is the one small thing the proposal's "dead slot" reading got wrong,
  and it would have cost us nothing had we kept him (1 point). Noted for accuracy, not
  for action.

### Gut calibration

**The week was won on structure, not on picks.** Of the four decisions the proposal
argued hardest (transfer, XI shape, bench order, captain), three resolved positively and
the one that decides most weeks, the captain, blanked. The score still beat the average
by 10 because the structural decisions (Barry in, Mitchell first bench, 4-4-2 falling
into 5-4-1) were worth +5 against the alternative and the two biggest returns (Semenyo
17, Hall 13) came from slots nobody was arguing about. The captaincy model is 1 for 2
against the incumbent; the transfer-and-bench process is 5 for 5 across the season.

**Is the armband ledger evidence for the build now?** Less than it was, and honestly so.
**+4 cumulative** over five weeks (0, +20, -14, +6, -8), and this week's -8 came with
Haaland in his easiest fixture of the season and returning a modest 6, exactly the
overstatement the pre-deadline note warned about in reverse. The build is still
"level with more variance" on the armband. What has changed since GW3 is that the
variance is now chosen on a model rather than on autopilot, and the model's two
outings have been +20 and 0 against the default. That is not proof. It is the same
position as after GW4 with one more data point that neither confirms nor refutes it.

**Separate process from outcome, both directions.** Ten flags resolved for the process,
one untested (wildcard timing, by construction), one against (the captain read). The
biggest single return was 17 from 0.33 xGI and the biggest single failure was a
promoted side scoring its first goal of the season against our captain. Neither is
skill. The rank gain is real, and about half of it is variance going our way for once.

**The Haaland cost this week was -8 on the armband, not the 20 to 26 the proposal
feared.** He scored once in a 5-3. The most expensive week of the season for the
Haaland-less build was cheaper than priced.

### Adjustments for next time

1. **GW6 opens with a wildcard draft by default, and argues against it** (carried from
   the GW5 chip call, now with more evidence). The list, updated after GW5: ARS×3 has
   shown both faces (29, 3) and is keyed to a single clean sheet; João Pedro is still
   `d` with news unchanged since 09-16 and has lost 9 points of ownership; Obi is a
   permanent zero; MUN×3 returned 4 from £24.4m for the second week running (B.Fernandes
   2, Mbeumo 2, Obi 0); the field's captain remains unowned. Against: the GW5 core
   worked, £1.1m ITB, 1 FT, and Hall and Semenyo just returned 30 between them.
2. **Hall is not sold on the DC series alone.** The rule from GW3 ("rolling DC mean
   under 10 is a red flag") was written for a defender whose points come from DC; Hall's
   came from a goal and 3 bonus. New rule: a player flagged for sale who then returns
   10+ in the flagged week is re-argued on **both** the DC series and the points/xGI
   series, and is only sold if both say so or the wildcard replaces him. Hall's GW6 is
   NEW at Coventry, FDR 2, and after this week Coventry have scored and won.
3. **The four-game opponent-results table is a tiebreak, not a primary.** It shifts a
   fixture by at most one FDR notch and never overrides the player's own xGI/90. Three
   of its seven reads were wrong this week (Coventry, Palace, Sunderland). Concretely
   for the captaincy: the shortlist is ranked on the player's xGI/90 first, and the
   opponent's results break ties between candidates within 0.1 of each other. Under
   that rule GW5's captain would have been B.Fernandes (0.85), who also returned 2, so
   this is a rule for the process, not a claim it would have saved the week.
4. **Keep the captaincy model and run it from scratch for GW6.** Record: +20, 0 against
   the incumbent. One blank is not a redesign; three in a row would be. Do not default
   to Semenyo because he hauled once, which is the GW3 autopilot with a new name.
5. **The doubtful-starter rule is now a standing rule, not a GW5 special.** A player
   whose lineup lands after the deadline stays in the XI only if the first bench player
   yields a legal formation and has a nailed 90 in a fixture we are not hedged against.
   GW5 proved the pattern; it should not have to be re-argued.
6. **Check `news_added` before trusting a status.** João Pedro's 75% has carried the
   same timestamp (2026-09-16) through the whole gameweek and into the break. A `d`
   with a stale timestamp is a "no information" flag, not a 75%. The GW6 research run
   reads the timestamp first and treats him as a sale candidate under the wildcard if
   it has not moved.
7. **The bench has a live asset, and the BB note is wrong by one.** Gomez: 85 minutes,
   assist, clean sheet, DC 13, 8 points from the bench, 24 for the season across bench
   and XI. GW4's "three dead slots and one Gomez" is still the shape, but the one Gomez
   is a starter-quality defender being held behind ARS×3. The wildcard draft should
   count him as a keep, not as bench filler.
8. **The lock-timing flag is closed, with no change to the loop.** Executing on "go"
   at 14:10 UTC cost nothing measurable. Do not move the nudge later on the strength of
   a hypothesis the week did not support.

### Chip planning notes

- **No chip played. All four still available**, all expiring **GW19**: 13 gameweeks of
  runway after the break.
- **Wildcard: GW6 is the decision point, and the draft is the default.** The three-week
  break makes GW6 the cheapest wildcard of the first half: every international injury is
  known before the deadline (2026-10-10 10:00 UTC), and João Pedro's knee will either
  have a new timestamp or it will not. The GW6 evaluation opens with a fifteen and
  argues against it on adjustment #1's list. If the draft keeps fewer than ten of the
  current fifteen, play it. If it keeps eleven or more, the wildcard is not worth the
  hit-free transfers it replaces, and the FT (2 by then) does the work.
- **Bench Boost: still dead, by less.** Gomez is real (8 this week). Dubravka has 0
  minutes in five, Obi cannot play. Two of four slots are structurally zero and it takes
  two transfers to make the chip playable. Only a wildcard makes it so; if the wildcard
  is played at GW6, the BB is the first chip the new squad should be built to use.
- **Triple Captain:** the field's TC spot was Haaland at home to Sunderland, and he
  returned 6 in a 5-3. The community's TC week paid 18 for a chip. Holding was right.
  GW6 has MCI at Liverpool, so there is no TC case for anyone next week either.
- **Free Hit:** no DGW/BGW in sight.
