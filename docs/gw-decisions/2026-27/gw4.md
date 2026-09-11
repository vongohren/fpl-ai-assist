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
| 4 | **João Pedro** | | Haaland *(MUN away, FDR 4)* | | | |

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

*To be filled in after GW4 finalises. Respect the finalisation gate from GW1:*
*`events[3].finished = true`, `data_checked = true`, and `automatic_subs` populated.*

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
| Hall | | | |
| Mitchell | | | |
| Guéhi | | | |
| B.Fernandes (V) | | | |
| Mbeumo | | | |
| Semenyo | | | |
| Gibbs-White | | | |
| João Pedro (C) | | | |
| *Bench: Dubravka* | | | |
| *Bench: Gomez* | | | |
| *Bench: Georginio* | | | |
| *Bench: Obi* | | | |

### Flag outcomes

- [ ] Hull's clean-sheet run:
- [ ] The armband switch:
- [ ] Calafiori over Lacroix:
- [ ] The derby clash:
- [ ] Guéhi over Gomez:
- [ ] ARS×3 concentration:
- [ ] Bench order:
- [ ] MUN/BHA fixture collapse:

---

## Learnings

### What we got right

### What we got wrong

### Gut calibration

### Adjustments for next time

### Chip planning notes
