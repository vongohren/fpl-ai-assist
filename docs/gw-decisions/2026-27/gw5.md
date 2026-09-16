# GW5 Decision Log — THE BENCH CANNOT COVER THE CAPTAIN

**Deadline:** Friday 2026-09-18 17:30 UTC
**Fixtures:** Fri-Sun (Sep 18-20), single GW, no DGW/BGW. **Followed by a three-week international break (GW6 is Oct 10).**
**Date of analysis:** 2026-09-16 (proposal; the Decision section is written at lock)

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
| 5 | **Gibbs-White** *(proposed)* | | Haaland *(SUN home, FDR 2)* | | | |

Second armband change in two weeks, and the first onto a sub-15%-owned player. Note for
the post-mortem: the field's captain is in his easiest fixture of the season, so the
raw swing will overstate the evidence against the pick if he hauls, exactly as GW4's
note said the reverse.

---

## Watch flags for GW5

- [ ] **João Pedro.** Did he play, and for how long? If he missed, did the Mitchell
      autosub fire cleanly into 5-4-1? If he played a cameo and banked 1, that is the
      uncovered risk landing.
- [ ] **The armband, second week off B.Fernandes.** Gibbs-White (x2) against
      B.Fernandes (x2) and against Haaland (x2). Three numbers, not one.
- [ ] **Barry over Wissa.** Straight comparison. And did Barry's xGI convert, or is the
      "due" profile still due?
- [ ] **Hall kept over Bogle.** Priced at -2. What was the actual gap?
- [ ] **Delap and Igor Jesus.** Did the minutes gate call it right, i.e. did only one of
      them start against Coventry?
- [ ] **Calvert-Lewin filter cost.** Priced at -1 against Barry. Actual?
- [ ] **ARS×3 at Brighton.** Clean sheet or not, and how many goals conceded.
- [ ] **Mitchell benched.** First time he sits since GW3's autosub haul. Did Palace
      concede again?
- [ ] **Wildcard decision point moved to GW6.** After the break: how many of the new
      fifteen would have been injured on internationals? That is the evidence for or
      against the timing call.

---

## Outcome

*To be filled in after GW5 finalises. Respect the finalisation gate from GW1:*
*`events[4].finished = true`, `data_checked = true`, and `automatic_subs` populated.*
*Per GW4 adjustment #6, check the live `bootstrap-static` endpoint, not `get_fixtures.is_finished`.*

**Actual points:**
**Overall rank:**
**GW rank:**
**Season total:**
**Most captained in the game:**

| Player | Min | Pts | Notes |
|---|---|---|---|
| Raya | | | |
| Gabriel | | | |
| Calafiori | | | |
| Guéhi | | | |
| Hall | | | |
| B.Fernandes (V) | | | |
| Mbeumo | | | |
| Semenyo | | | |
| Gibbs-White (C) | | | |
| João Pedro | | | |
| Barry | | | |
| *Bench: Dubravka* | | | |
| *Bench: Mitchell* | | | |
| *Bench: Gomez* | | | |
| *Bench: Obi* | | | |

### Flag outcomes

- [ ] João Pedro:
- [ ] The armband, second week off B.Fernandes:
- [ ] Barry over Wissa:
- [ ] Hall kept over Bogle:
- [ ] Delap and Igor Jesus:
- [ ] Calvert-Lewin filter cost:
- [ ] ARS×3 at Brighton:
- [ ] Mitchell benched:
- [ ] Wildcard decision point moved to GW6:

---

## Learnings

### What we got right

### What we got wrong

### Gut calibration

### Adjustments for next time

### Chip planning notes
