# GW4 Decision Log — THE ARMBAND MOVES OFF BRUNO

**Deadline:** Saturday 2026-09-12 12:30 UTC
**Fixtures:** Sat-Mon (Sep 12-14), single GW, no DGW/BGW
**Date of analysis:** 2026-09-10

---

## Pre-GW Context

### Squad state (pre-transfer)
- **Budget:** £0.5m ITB, **1 free transfer**
- **Squad value:** £99.0m
- **Chips:** all four available and playable (BB, TC, WC, FH), first-half set, **all expire GW19**
- **Rank:** 3,504,624 after GW3

### Season so far
| GW | Pts | Avg | Bench | Rank |
|---|---|---|---|---|
| 1 | 46 | 50 | 5 | 5,572,584 |
| 2 | **93** | 81 | 0 | 3,345,863 |
| 3 | 52 net (56 gross, -4) | 51 | 0 | **3,504,624** |

### Prior-decision context
[GW3](gw3.md) locked no chip plan and set the next wildcard decision point at **GW5-6**,
reframing the wildcard's job from "the midfield is dead" (already solved by the -4) to
**"the armband is the problem"**. It also left five explicit adjustments, four of which
drove this week's analysis:

1. Grade DC picks on a rolling rate, not two readings — a threshold-adjacent mean is a
   red flag, not a robustness claim.
2. **Give the captaincy its own model**, at fixture level, like the transfers already have.
3. **Cost intra-squad clashes explicitly** instead of declaring them unfixable.
4. Never read a goal as confirmation of an xG thesis without checking the mechanism.
5. Keep auditing minutes, not points, on every slot — **O'Reilly named as the next
   dead-weight candidate**.

---

## Flags & Key Signals

### The fixture that defines the week: MUN v MCI, FDR 4 both sides

Six of fifteen squad players were in a single derby, on opposite sides:

| Side | Players | £ |
|---|---|---|
| MUN | B.Fernandes **(C)**, Mbeumo, Obi | 24.4 |
| MCI | Guéhi, O'Reilly, Semenyo | 20.9 |

£45.3m and five XI-relevant players in one FDR-4 fixture where Guéhi's clean sheet
requires our own captain to blank. GW3's learning #3 said to stop calling this
unfixable and put a number on it. This was that week.

### Hull City have not conceded a goal all season

The community's GW4 consensus was "Chelsea host promoted Hull, triple up, Triple
Captain Palmer". The Scout ran *"FPL Gameweek 4 early Scout Picks: Chelsea, Liverpool
+ Brighton triple-ups"* and *"Triple Captain Palmer in FPL Gameweek 4?"*. Solio had
Palmer top of the whole slate. The API disagrees:

| GW | Result | Conceded |
|---|---|---|
| 1 | **HUL 2-0 MUN** | 0 |
| 2 | COV 0-1 HUL | 0 |
| 3 | HUL 0-0 AVL | 0 |

**Three clean sheets from three, zero goals conceded, and they beat Man Utd.** Hull's
defenders are the top three in the entire DEF form table (Ajayi 8.3, Mendy 8.0, Egan
7.7 — all £4.0-4.1m). FPL's FDR of 2 on this fixture is priced off promotion, not off
this season's evidence.

This does not kill the fixture. It kills the *Triple Captain* version of it, and it
kills the case for buying a Chelsea defender into it.

### Haaland has his worst week of the season

MCI travel to MUN at FDR 4. The field's default captain — most-captained in all three
gameweeks so far, ~71% owned — is in the same hard derby. **This is the cheapest week
of the season so far to be Haaland-less.**

### Dead weight

| Player | £ | Form | ep | Problem |
|---|---|---|---|---|
| **O'Reilly** (MCI, DEF) | 6.5 | 1.3 | 1.0 | 75% doubt, **0 min in GW3**, not in the matchday squad |
| **Georginio** (BHA, FWD) | 5.5 | 1.7 | 1.3 | 75% doubt, 90 min all season, 1 start |

Dubravka (£4.0m) and Obi (£4.5m) are structural bench filler, not dead weight.

O'Reilly had already been displaced from the XI by Mitchell's GW3 autosub haul, so
holding him cost nothing *this week* — the case for selling is that the 75% flag is not
resolving and the slot is permanently wasted.

### Fixture runs are turning against the squad's two biggest blocks

`get_fixture_difficulty`, GW4-9, rank among 20 teams:

| Team | Avg FDR | Rank | Squad exposure |
|---|---|---|---|
| CRY | 2.7 | **2** | Mitchell |
| NEW | 2.7 | **3** | Hall |
| ARS | 3.0 | **4** | Raya, Gabriel |
| CHE | 3.0 | 6 | João Pedro |
| MCI | 3.0 | 11 | Guéhi, Semenyo |
| NFO | 3.0 | 12 | Gibbs-White |
| **MUN** | 3.3 | **19** | B.Fernandes, Mbeumo, Obi |
| **BHA** | 3.5 | **20** | Gomez, Georginio |

**Five squad slots and £33.8m sit in the two worst fixture runs in the league.** That is
the structural finding of the week and it is a wildcard argument, not a one-transfer one.

---

## Analysis

### The captaincy, run at fixture level for the first time

GW3's adjustment #2 was to stop picking the armband on season form while picking
transfers on per-fixture underlying. Applied here, every candidate in the squad except
one is in a hard fixture:

| Candidate | GW4 fixture | FDR | Form | Read |
|---|---|---|---|---|
| **João Pedro** | CHE (H) v HUL | **2** | 7.0 | xGI/90 0.68, 270/270 min, **72.7% owned** |
| B.Fernandes *(incumbent)* | MUN (H) v MCI | **4** | 9.0 | Best player in the squad, **worst armband spot of his season** |
| Mbeumo | MUN (H) v MCI | 4 | 7.0 | Same derby |
| Semenyo | MCI (a) at MUN | 4 | 4.3 | Same derby |
| Gibbs-White *(incumbent VC)* | NFO (a) at AVL | 4 | 6.0 | Bad spot for a VC |
| Mitchell | CRY (H) v IPS | 2 | 5.3 | Differential option after his 15 |

Three gameweeks of B.Fernandes on autopilot have produced a cumulative **+6** on the
armband ledger with swings of 0, +20, -14. The fixture-level answer this week is
unambiguous, and it points away from him.

**The ownership check matters and cuts the reassuring way.** João Pedro is **72.7%
owned** — higher than Haaland. Captaining him is the template-safe play, not a punt.
Combined with Haaland's FDR-4 derby, the effective-ownership risk of this armband is
the lowest it has been all season.

The Hull caveat is real and is not ignored: this is a captain pick into a defence that
has conceded nothing. It survives anyway because *every alternative in the squad is in
a worse fixture*, and because the alternative reading — TC-ing into that same defence,
as the community was proposing — is clearly worse.

### The transfer

One FT, £0.5m ITB. O'Reilly out (£6.5m selling) gives a £7.0m ceiling on a defender.

Applying the **no intra-squad hedging** rule against the real GW4 fixture list knocked
out most of the board before form was even considered:

| Rejected | Why |
|---|---|
| Ajayi / Mendy / Egan / Giles (HUL, £4.0-4.1) | Superb value, but all face João Pedro |
| Gvardiol (MCI, 5.6) | Re-enters the derby we are trying to unwind |
| Bogle / Justin (LEE, 4.5) | LEE host NEW — hedges against Hall |
| Tarkowski (EVE, 6.0) | Clean, but TOT away and DC 10.33 sits on the cliff |
| De Cuyper (BHA, 4.8) | Community pick, best DEF xGI (0.71), but **BHA rank 20** and it would make BHA×3 |

That left two:

| | Lacroix (CHE) | **Calafiori (ARS)** |
|---|---|---|
| £ | 6.0 | **5.7** |
| GW4 | HUL (H), FDR 2 | SUN (a), FDR 3 |
| Form / pts | 3.0 / 9 | **7.3 / 22** |
| xGI/90 | 0.08 | **0.43** |
| DC/90 | 10.67 | 3.43 |
| Owned | 8.1% | **48.1%** |
| GW4-9 team rank | 6 | 4 |

**Lacroix was rejected on GW3's own learning.** His case is a clean sheet against a
team that has not conceded, resting on a DC average of **10.67 against a hard threshold
of 10**. That is the Hall trap exactly: GW3 called Hall "the single most robust pick on
the board" on two readings of 11 and 13, he returned 6, and the log concluded that
*"two samples on one side of a cliff is not robustness, it is a coin flip that landed
twice."* Buying another threshold-adjacent defender one week later would be
un-learning the lesson.

**Calafiori's points come from xGI, not from a binary threshold.** He is also 48.1%
owned, which addresses the other thing GW3 identified: the rank leak from not holding
in-form template assets. And the extra £0.8m matters — at £0.5m ITB the squad had no
moves at all.

### Costing the clash instead of declaring it unfixable

Selling O'Reilly does three jobs with one transfer: removes the dead slot, removes one
leg of the derby exposure, and drops MCI to 2. The core clash (Guéhi + Semenyo against
B.Fernandes + Mbeumo) survives and is **not** fixable with one transfer.

The XI decision then costs it explicitly:

- **5-4-1 benching Gomez** — plays Guéhi (form 6.7, 20 pts, 270/270 min) in the derby.
- **4-5-1 benching Guéhi** — removes the anti-correlation, plays Gomez (form 4.3, MID
  DC threshold is 12 and he managed 9).

Chose 5-4-1. Guéhi is simply the better asset and benching your best defender purely to
decorrelate is over-correcting. **GW3's lesson was to price the clash, not to reflexively
avoid it.** The price here is roughly a point of expectation, knowingly paid.

### Chips: hold all four

- **TC** — the community was pushing TC Palmer into Hull. Hull have conceded nothing.
  Wrong week, and the reasoning is the same one that de-rated Lacroix.
- **BB** — unplayable and still getting worse. Dubravka and Obi have **0 minutes between
  them all season**; Georginio is a 75% doubt on 90 minutes.
- **WC** — no trigger this week, but MUN 19th and BHA 20th over GW4-9 is the case
  building. GW5-6 remains the decision point, as GW3 set it.
- **FH** — no DGW/BGW.

---

## Decision

**1 transfer, no hit.**

| OUT | £ | IN | £ |
|---|---|---|---|
| O'Reilly (MCI, DEF) | 6.5 | **Calafiori** (ARS, DEF) | 5.7 |

Confirmed by the API: `bank: 13`, `value: 982`, `free_transfers: 0`.

> **API note.** `save_team` returned `transfers: {cost: 4, status: "cost", limit: 1,
> made: 1}`. Read correctly, `cost`/`status` describe **the next** transfer, not one
> incurred: one transfer against a limit of one is free, and `free_transfers` duly went
> to 0 with squad value intact. Recorded because [GW37](../2025-26/gw37.md) took a
> genuine surprise -4 from a mismatch in this same object, so the field is not to be
> trusted blind.

**Captain: João Pedro** (CHE home to HUL, FDR 2) — moved off B.Fernandes for the first
time this season. **Vice: B.Fernandes**, moved off Gibbs-White, who is away at Villa on
FDR 4.

### Starting XI (5-4-1)
| Pos | Player | Team | £m | GW4 | FDR |
|---|---|---|---|---|---|
| GK | Raya | ARS | 6.0 | SUN (a) | 3 |
| DEF | Gabriel | ARS | 8.0 | SUN (a) | 3 |
| DEF | **Calafiori** | ARS | 5.7 | SUN (a) | 3 |
| DEF | Hall | NEW | 5.1 | LEE (a) | 3 |
| DEF | Mitchell | CRY | 4.5 | IPS (H) | 2 |
| DEF | Guéhi | MCI | 6.0 | MUN (a) | 4 |
| MID | **B.Fernandes (V)** | MUN | 12.0 | MCI (H) | 4 |
| MID | Mbeumo | MUN | 7.9 | MCI (H) | 4 |
| MID | Semenyo | MCI | 8.4 | MUN (a) | 4 |
| MID | Gibbs-White | NFO | 7.9 | AVL (a) | 4 |
| FWD | **João Pedro (C)** | CHE | 7.7 | HUL (H) | 2 |

**Bench (ordered on minutes certainty, per GW1 learning #1):** Dubravka (GK) →
**Gomez** (265 min, 3 starts) → Georginio (75%, 90 min, 1 start) → Obi (0 min).
Gomez first also keeps the autosubs legal: a defender dropping out gives a valid
4-5-1, and either forward covers a João Pedro absence at 4-4-2 / 5-3-2.

**Final state:** £98.2m value, **£1.3m ITB**, 0 FTs. ARS×3, MUN×3, MCI×2, BHA×2.

### Chip strategy
**No chip.** All four remain available, all expiring **GW19** — 15 gameweeks of runway.
Next wildcard decision point: **GW5-6**, unchanged from GW3, now with a concrete
trigger to evaluate (the MUN/BHA fixture collapse) rather than a vague one.

---

## Accepted risks

- **ARS is now 3 of 15** (Raya, Gabriel, Calafiori), all keyed to one clean sheet at
  Sunderland. This is *positive* concentration — all three win together — which is a
  different animal from the GW3 ARS v CHE hedge, but it is still concentration.
- **The derby anti-correlation is still in the XI.** Guéhi + Semenyo against
  B.Fernandes + Mbeumo, £34.3m across four slots. Priced at ~1 point and knowingly kept.
- **The captain plays a defence that has conceded nothing in three games.** Chosen
  because every alternative is in a worse fixture, not because the fixture is soft.
- **Georginio is still in the squad** as a 75%-doubt bench slot. Upgrading a bench slot
  for -4 is bad value; the cheap FWD pool (Wissa 6.2, Barry 5.6, Isidor 5.5) offers
  nothing worth the hit.
- **B.Fernandes at £12.0m is now a non-captain in a bad fixture run** (MUN 19th, GW4-9).
  If the armband does not come back to him soon, the price tag stops being justified.

---

## Armband ledger (GW1 learning #4)

| GW | Our captain | Pts (x2) | Field's captain | Pts (x2) | Swing | Cumulative |
|---|---|---|---|---|---|---|
| 1 | B.Fernandes | 2 (4) | Haaland | 2 (4) | 0 | 0 |
| 2 | B.Fernandes | 23 (46) | Haaland | 13 (26) | **+20** | +20 |
| 3 | B.Fernandes | 2 (4) | Haaland | 9 (18) | **-14** | **+6** |
| 4 | **João Pedro** | 12 (24) | Haaland *(MUN away, FDR 4)* | 9 (18) | **+6** | **+12** |

First armband change of the season. Note for the post-mortem: this is also the first
week where the field's captain is in a genuinely hard fixture, so a small positive swing
here is worth less as evidence than the raw number will suggest.

---

## Watch flags for GW4

- [ ] **Hull's clean-sheet run.** Zero conceded in three. If Chelsea break them, the
      "FDR 2 was right after all" reading is available — but check the *margin*, not just
      the result, and check whether Hull's XI was rotated.
- [ ] **The armband switch.** Did moving off B.Fernandes for the first time pay? Compare
      João Pedro (x2) against what B.Fernandes (x2) would have returned in the derby.
- [ ] **Calafiori over Lacroix.** The xGI-vs-threshold-DC thesis. Did Lacroix bank the
      DC 2 and a clean sheet anyway? If so, was the rejection reasoning wrong or just
      unlucky — check whether his DC actually cleared 10 this week.
- [ ] **The derby clash, priced at ~1 point.** Sum the four players' returns and check
      whether the anti-correlation actually bit: did a Guéhi clean sheet coincide with
      Bruno/Mbeumo blanks, or vice versa?
- [ ] **Guéhi over Gomez (the 5-4-1 call).** Straight comparison of the two returns.
- [ ] **ARS×3 concentration.** One clean sheet event at Sunderland, three slots.
- [ ] **Bench order, third consecutive week.** Gomez ahead of Georginio on minutes
      certainty. If an autosub fires, was it right again?
- [ ] **MUN/BHA fixture collapse.** Five slots in the two worst runs. Feeds the GW5-6
      wildcard decision — track whether the FDR is showing up in actual returns yet.

---

## Outcome

**Actual points: 75** (bench 3, no hit) · **GW average: 69** · **Highest score: 151**
**Overall rank: 3,200,152** (up from 3,504,624, **+304,472 places**)
**GW rank:** 3,763,037 · **Season total: 266**
**Most captained in the game:** Haaland (9 pts)

Finalisation gate confirmed before writing: `events[3].finished = true`,
`data_checked = true`, and `automatic_subs` is final (empty, because all eleven
starters played). One process note: `get_fixtures` still reported `is_finished: false`
at the time, because the MCP server caches the bootstrap for 24 hours; the gate was
confirmed against the live `bootstrap-static` endpoint instead. See adjustments.

| Player | Min | Pts | Notes |
|---|---|---|---|
| **Raya** | 90 | **14** | **Penalty save**, clean sheet, 3 bonus. SUN 0-2 ARS |
| Gabriel | 90 | 9 | Clean sheet, 2 bonus, **DC 11** (2 pts banked), yellow card |
| **Calafiori** | 90 | 6 | Clean sheet. DC 4, xGI 0.07: the points came from the team event, not from him |
| **Hall** | 90 | **0** | **Conceded 4**, -2. LEE 4-1 NEW. **DC 6** again (see flag) |
| Mitchell | 76 | 1 | Conceded 2, subbed. **CRY 2-3 IPS at home, FDR 2** |
| Guéhi | 90 | 6 | Clean sheet, DC 7. MUN 0-1 MCI |
| B.Fernandes (V) | 90 | 2 | Appearance only. 0.36 xGI in the derby |
| Mbeumo | 90 | 2 | Appearance only. 0.49 xG, no return |
| Semenyo | 90 | 3 | Midfield clean-sheet point, 0.06 xGI |
| Gibbs-White | 90 | 8 | Assist + 3 bonus from **0.91 xA**. AVL 1-2 NFO |
| **João Pedro (C)** | 90 | **12 x2 = 24** | **Goal + assist + 3 bonus** from 0.29 xG. CHE 2-2 HUL |
| *Bench: Dubravka* | 0 | 0 | |
| *Bench: Gomez* | 83 | 3 | Clean sheet point. BHA 5-0 COV |
| *Bench: Georginio* | 0 | 0 | **Unused in a 5-0 win.** Still a 75% doubt |
| *Bench: Obi* | 0 | 0 | **Loaned to Willem II**, status `u`. Permanently zero |

**No autosub.** All eleven starters played, so the bench order (Gomez first) was never
tested. Bench 3, all of it Gomez.

XI total **75**, bench **3**, no transfer cost. Beat the GW average by **6** and gained
**304,472 places**: the first week of the season where beating the average and gaining
rank happened together.

### Flag outcomes

- [x] **Hull's clean-sheet run: BROKEN, BUT HULL TOOK A POINT AT STAMFORD BRIDGE.**
      CHE 2-2 HUL. Hull conceded for the first time this season, and scored twice
      (Belloumi 2 goals from 0.17 xG). **Margin: none.** Rotation: no, the back line was
      Ajayi, Egan and Giles for 90 minutes each, Mendy came off at 58. So the "FDR 2 was
      right after all" reading is **not** available: Chelsea did not win, no Chelsea
      defender kept a clean sheet, and Palmer returned **5**. Both halves of the
      pre-deadline call held. The fixture was good enough for João Pedro to haul in and
      not good enough to Triple Captain into: **TC Palmer would have been 15 against our
      24 from a plain armband.**
- [x] **The armband switch: YES, +20 AGAINST THE INCUMBENT.** João Pedro 12 (24)
      against what B.Fernandes would have returned in the derby, 2 (4). Against the
      field's captain: Haaland 9 (18), a **+6 swing**, cumulative **+12**. The
      pre-deadline note said a small positive swing here would be worth less as
      evidence because Haaland was in a hard fixture, and that caution stands: he scored
      anyway. The number that matters is the internal one. **The first time the
      captaincy was run at fixture level, it moved the armband off a player who then
      blanked and onto a player who then hauled.** Without the switch this is a 55-point
      week, below the average, and a fourth week of lost rank.
- [x] **Calafiori over Lacroix: YES, +5, FOR A REASON WE NEVER PRICED.** Lacroix
      played **4 minutes** off the bench for 1 point. Calafiori played 90 for 6. The DC
      question is moot: nobody banks a threshold from the bench. The rejection was
      argued entirely on the threshold-adjacent DC mean, and the actual failure mode was
      **minutes**. Right pick, incomplete reasoning: the minutes audit that GW2-3 applied
      to holds was never applied to the buy list. And the other half of the thesis got no
      test either: Calafiori's 6 came from the Arsenal clean sheet (xGI 0.07), not from
      the xGI that bought him. GW3 learning #4 applies inward: **do not read this as
      confirmation of the xGI model.**
- [x] **The derby clash: THE ANTI-CORRELATION BIT EXACTLY AS DESCRIBED.** MUN 0-1 MCI.
      City side: Guéhi 6 + Semenyo 3 = **9**. United side: B.Fernandes 2 + Mbeumo 2 =
      **4**. **13 points from £34.3m across four XI slots**, 3.25 per slot against an XI
      average of 6.8. Guéhi's clean sheet coincided with both United blanks, which is
      precisely the mechanism the pre-deadline analysis costed. The price was set at
      "roughly a point" and the true cost is not separable from the fixture being hard
      for everyone in it, but the thing that made the derby survivable was moving the
      armband out of it. Footnote: Gvardiol, rejected for "re-entering the derby we are
      trying to unwind", returned **11**.
- [x] **Guéhi over Gomez: YES, +3.** 6 against 3. Both kept clean sheets; a defender's
      is worth 4 and a midfielder's 1. Benching the best defender in the squad to
      decorrelate would have cost 3 points. Pricing the clash instead of reflexively
      avoiding it, GW3's adjustment #3, paid in its first week.
- [x] **ARS×3 concentration: PAID, 29 POINTS.** SUN 0-2 ARS. Raya 14 (penalty save
      plus 3 bonus), Gabriel 9, Calafiori 6. **39% of the week from one clean sheet.**
      This is what positive concentration looks like when it hits; the same three slots
      return roughly 6 combined if Sunderland score once. Note for GW5: the fixture is
      **BHA v ARS**, which puts ARS×3 directly against BHA×2. That is the GW3 ARS v CHE
      shape again, one week after the log promised to cost such clashes rather than
      re-discover them.
- [x] **Bench order: UNTESTED.** No autosub fired. The order was right in principle,
      Gomez was the only bench player who scored, but there is no evidence either way.
      What the bench did produce is a squad-health finding: Georginio did not get on the
      pitch in a match Brighton won **5-0**, and **Obi has been loaned to Willem II**
      (status `u`, 0% chance of playing). Three of four bench slots are now structurally
      zero, and one of them cannot return this season.
- [x] **MUN/BHA fixture collapse: HALF RIGHT, AND THE WRONG HALF IS THE INSTRUCTIVE
      ONE.** The MUN half showed up in returns: B.Fernandes 2, Mbeumo 2, Obi 0, **4 points
      from £24.4m**. The BHA half did not: Brighton won **5-0** at Coventry, Groß was the
      **top scorer in the whole game (17)**, Dunk 12, De Cuyper 11. Our two Brighton
      slots returned 3 from the bench and 0 unused. The "rank 20 over GW4-9" figure was a
      six-week average that concealed an FDR-2 fixture in the very week it was used.
      **Our Brighton problem is not their fixtures, it is that we own the wrong Brighton
      players.** The De Cuyper rejection (BHA×3, rank 20) cost 5 against Calafiori.

---

## Learnings

### What we got right

- **The captaincy model, first run, +20 against the incumbent.** Moving off B.Fernandes
  for the first time all season was the largest single decision of the week and it
  decided the week. GW3's adjustment #2 has a measured value in its first outing, and
  it is larger than the bench-order lesson's +15 in GW3.
- **The Hull read was right, both ways.** Not Triple Captain material (Palmer 5, TC
  would have been 15 against our 24) and not a defence to buy into (no Chelsea clean
  sheet, Lacroix benched anyway). Reading a promoted side off this season's data rather
  than off FDR beat the community consensus.
- **Pricing the clash instead of avoiding it: +3.** Guéhi over Gomez in the 5-4-1.
- **The dead-weight transfer.** O'Reilly played 8 minutes for 1 point; Calafiori
  returned 6. Fourth consecutive week the minutes audit produced a positive transfer.
- **ARS×3 as positive concentration: 29 points.** Correctly distinguished from the GW3
  hedge, and correctly held.
- **Beat the average by 6 and gained 304,472 places.** For the first time this season
  the process, the points and the rank all pointed the same way.

### What we got wrong

- **Hall, again, and now the series says it.** DC per game: **11, 13, 6, 6**. Rolling
  mean 9.0, below the threshold of 10. Zero points at Leeds (four conceded), 4 points
  in GW3. This is exactly the red-flag pattern GW3's adjustment #1 described, and the
  "single most robust pick on the board" has returned 4 from two starts since it was
  written. The fixture run (NEW ranked 3rd, GW4-9) did nothing: Leeds were FDR 3 and
  scored four.
- **FDR 2 against promoted sides failed twice in one week.** Palace lost **2-3 at home**
  to Ipswich (Mitchell 1). Chelsea drew at home to Hull (no clean sheet). Add Hull
  beating Man Utd in GW1. The pre-deadline Hull finding was treated as a Hull fact when
  it is a **promoted-side fact**: the FDR of 2 on these fixtures is priced off last
  season's division, not this season's results.
- **The BHA "rank 20" reading used the wrong lens.** A six-week average told us to
  avoid Brighton in a week they won 5-0 and produced the top scorer in the game. The
  average was true and irrelevant to a one-week decision. And it distracted from the
  real finding: Gomez and Georginio are the wrong Brighton assets, not Brighton the
  wrong team.
- **Three structural filters rejected the three best defensive returns on the board.**
  Bogle 15 (rejected: hedges against Hall), Gvardiol 11 (re-enters the derby),
  De Cuyper 11 (BHA×3, rank 20). Calafiori's 6 was fine; the rejected alternatives
  were better by 5 to 9. One week, and GW3's ARS v CHE showed the opposite, so this is
  not a reason to drop the rules. It is a reason to notice that they trade ceiling for
  variance reduction, and to price that trade rather than treat the rules as free.
- **The buy list was never minutes-audited.** Lacroix was rejected on DC and would
  have failed on minutes. The result was the same this week; the process had a hole.
- **Obi is a structural zero and we found out from the API, after the fact.** Loaned to
  Willem II with status `u`. Between Dubravka (0 minutes all season), Obi (gone) and
  Georginio (unused in a 5-0), the bench is three dead slots and one Gomez.

### Gut calibration

**One decision was the whole week.** 75 with the armband on João Pedro; 55 with it left
on B.Fernandes. The difference between a +304,000 week and a fourth consecutive week of
lost rank was a single fixture-level call. That is the strongest evidence yet that the
transfer market has been the stable half of this operation and the armband the lever.

**Is the armband ledger evidence for the build now?** More than it was. **+12
cumulative** over four weeks (0, +20, -14, +6), and this week's +6 came against a
Haaland who *scored*, in an FDR-4 fixture. The ledger was previously "level with more
variance". After GW4 it is "slightly positive, still with more variance, and the
variance is now partly under our control", because the captaincy is chosen on a model
rather than on autopilot. That is not a winning position yet. It is the first week the
build has looked like one.

**Separate process from outcome, both directions.** Five flags resolved for the process
(armband, Hull, Guéhi over Gomez, ARS×3, Calafiori), one untested (bench), two mixed
(derby, MUN/BHA). But the two biggest individual returns were Raya's penalty save and
João Pedro's 3 bonus, neither of which any model predicts, and three rejected
candidates outscored the pick. Good week, good process, and the good week is larger
than the good process accounts for.

### Adjustments for next time

1. **Hall is the next transfer candidate.** The DC series (11, 13, 6, 6) meets the
   red-flag definition set in GW3. He is not sold on one bad week; he is sold on a
   rolling mean below a hard threshold plus two starts for 4 points. GW5 is NEW v HUL,
   and after this week "FDR 2 against a promoted side" is not a reason to keep him.
2. **Minutes-audit the buy list, not just the squad.** "Is he nailed" becomes the first
   gate on every transfer target, before form, xGI or DC. Lacroix would have failed it.
3. **Discount FDR against promoted sides until their results say otherwise.** Hull
   drew at Chelsea and beat Man Utd; Ipswich won at Palace. Treat FDR 2 v HUL/IPS/COV
   as FDR 3 until the API shows them conceding like a bottom-half side.
4. **A fixture-run average is not a fixture.** Read the current week's FDR and the
   GW-run average as two separate inputs. Rank 20 over six weeks can contain the
   easiest fixture of the round, and it did.
5. **Price the structural filters.** "No intra-squad hedging" and "no triple-up into a
   bad run" filtered out 15, 11 and 11 this week. Keep the rules, but when a filter
   removes the highest-xPts candidate, write down what it cost, so the trade is visible
   over the season rather than rediscovered week by week.
6. **Do not trust `get_fixtures.is_finished` for the finalisation gate.** The MCP
   server's bootstrap cache is 24 hours; it reported `is_finished: false` while the live
   API had `finished` and `data_checked` both true. Check the live `bootstrap-static`
   endpoint, or shorten the TTL for the events block.
7. **Keep the captaincy model** (GW3 adjustment #2, now with a +20 first result), and
   run it again from scratch for GW5 rather than defaulting to João Pedro because it
   worked once. That would be the same autopilot that cost -14 in GW3, with a different
   name on it.

### Chip planning notes

- **No chip played. All four still available**, all expiring **GW19**: 14 gameweeks of
  runway.
- **Bench Boost is dead for this squad.** Obi cannot play (loan). Dubravka has 0
  minutes. Georginio was unused in a 5-0. Bench Boost on this bench is Gomez plus
  nothing, and it would take three transfers to make it playable.
- **Wildcard: the GW5-6 decision point is now, and the trigger list has grown.** GW3
  reframed the wildcard's job as "the armband is the problem", meaning Haaland is
  unreachable without a rebuild. GW4 adds: Obi is a permanent zero, Hall's DC series has
  failed, the MUN triple returned 4 points from £24.4m in the fixture run it was flagged
  for, and both Brighton slots are the wrong players. Against that: a 75-point week,
  £98.4m value with £1.3m ITB and 1 FT, and a captaincy model that just worked. **The
  GW5 evaluation should argue the wildcard seriously and on this list**, not on squad
  health in general. GW5 itself is a bad week to judge by: ARS×3 v BHA×2 at the Amex, and
  MUN away at Fulham (FDR 4) again.
- **Triple Captain:** the community's TC-Palmer-into-Hull would have paid 15. Holding
  was right. The field's TC spot in GW5 is Haaland at home to Sunderland (FDR 5 for
  Sunderland) and we do not own him; no case for us.
- **Free Hit:** no DGW/BGW in sight.
