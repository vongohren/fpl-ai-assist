# GW3 Decision Log — FIRST HIT OF THE SEASON (-4)

**Deadline:** Friday 2026-09-04 17:30 UTC
**Fixtures:** Fri-Sun (Sep 4-6), single GW, no DGW/BGW
**Date of analysis:** 2026-09-03

---

## Pre-GW Context

### Squad state (pre-transfer)
- **Budget:** £0.0m ITB, **2 free transfers** (none used in GW1 or GW2)
- **Squad value:** £99.7m
- **Chips:** all four available and playable (BB, TC, WC, FH), first-half set, **all expire GW19**
- **Rank:** 3,345,863 after GW2 (up from 5,572,584)

### Season so far
| GW | Pts | Avg | Bench | Rank |
|---|---|---|---|---|
| 1 | 46 | 50 | 5 | 5,572,584 |
| 2 | **93** | 81 | 0 | **3,345,863** |

GW2 was driven almost entirely by the captain: B.Fernandes returned 23 (46 doubled)
against the field's Haaland at 13 (26 doubled). See the armband ledger below.

### Prior-decision context
[GW1](gw1.md) locked no chip plan and explicitly deferred the wildcard question:
*"revisit at GW4-6 once real form data exists"*. That guidance was followed here —
no chip played. GW1's other standing instruction, *"order the bench deliberately,
every single week"*, was applied (see Decision).

---

## Flags & Key Signals

### Dead weight had reached £18.6m of the squad
| Player | £ | Form | Minutes | Problem |
|---|---|---|---|---|
| Bruno G. (ARS) | 6.8 | 0.5 | 19 of 180 | Thigh injury in GW1, fit again but out of the side |
| Muñoz (NFO) | 5.4 | 0.0 | 54, **0 in GW2** | Moved CRY→NFO in the window, not first choice |
| Wilson (LEE) | 6.4 | 2.0 | 110, 45 in GW2 | Fringe, and LEE have the joint-worst 5-round run |

Three squad slots were returning essentially nothing while the XI was forced to
field Mitchell (form 0.5) to reach eleven bodies.

### Newcastle own the fixture run
Over GW3-7 they are **the only team in the league with zero fixtures rated FDR 4+**,
three of them at home: `BOU(H)3 LEE(a)3 HUL(H)2 COV(a)2 AVL(H)3`, average **2.60**.
Every other top-tier run contains at least one hard game. Man City, the team the
community is piling into, has two (MUN away, LIV away).

### Community signal was almost entirely Man City
Six Brave searches (general / transfers / differentials, plus position-filtered
MID / DEF / FWD) aggregated to:

| Player | Mentions | £ | Owned |
|---|---|---|---|
| Haaland | 17 | 15.5 | 71.0% |
| Cherki | 12 | 7.7 | 26.2% |
| Barry | 6 | 5.5 | 4.4% |
| Foden | 6 | 7.0 | 5.1% |

The Scout's GW3 piece is titled *"Piling up on Man City"* (MCI host promoted COV,
whose away difficulty is 5). "Triple-Captain Haaland in GW3?" articles were running.
Newcastle barely registered — which is precisely why their assets were still cheap.

**Cherki was unbuyable regardless:** the squad was already at MCI×3. Worth recording
that the community's top target had **one start** (27 min sub, then 81 min) and was
over-performing his xG.

---

## Analysis

### Method: two models, not one

GW1's learning said `points_per_game × 34` was *"adequate as a ranking device, poor
as a point estimate"*. So this week the ranking was rebuilt from **underlying stats**
rather than form:

```
xPts per fixture = 2.0 (appearance)
                 + (xG90 × goal_value[pos] + xA90 × 3) × (1 + (3 − FDR) × 0.12)
                 + P(clean sheet | FDR) × cs_value[pos]
                 + defensive-contribution points (2.0 if DC90 ≥ positional threshold)
          × minutes-security factor
```

summed over each team's actual GW3-7 fixtures. Then the whole thing was **run twice**:
once on raw rates, once with attacking rates regressed 50% toward the positional
average, to see which conclusions survived small-sample noise. Only players appearing
in both were trusted.

### The finding that decided the week: the premium tier is a value trap

| Player | £ | xPts GW3-7 (regressed) | **per £m** |
|---|---|---|---|
| Haaland | 15.5 | 24.6 | **1.59** ← worst in the pool |
| Palmer | 9.6 | 25.8 | 2.69 |
| Saka | 9.5 | 25.7 | 2.71 |
| Isak | 9.0 | 26.7 | 2.97 |
| B.Fernandes *(owned)* | 12.0 | 36.0 | 3.00 |
| **Mbeumo** | **8.0** | **33.7** | **4.21** |
| Hall | 5.1 | 34.3 | 6.73 |
| De Cuyper | 4.7 | 32.1 | 6.83 |
| Egan | 4.0 | 27.4 | 6.84 |

**Every player above £9m is worse value than everything below it.** The instinct to
"sell three and buy one expensive thing" was structurally right but would have
destroyed points if aimed at the £9.5m+ tier.

### Form vs underlying: who is fake

| Player | Goals | xG (2 GWs) | Read |
|---|---|---|---|
| Elanga | 2 | 0.42 | Heavily over-performing → will regress **down** |
| Groß | 1 | 0.05 | Heavily over-performing → regress down |
| Cherki | 2 | 0.35 | Over-performing, and only 1 start |
| **Mbeumo** | **1** | **2.26** | **Under**-performing → regresses **up** |

This inverted the shortlist. Elanga had been the leading candidate on form (8.5) and
was dropped once the underlying was checked; his regressed xPts is 17.9, roughly half
of Hall's at a higher price.

### Robustness check

Hall is **the only candidate whose rating improves under regression** (32.8 → 34.3 →
35.3 at 80% shrink), because his points come from defensive contributions (11 and 13,
both clearing the 10-threshold) and clean sheets on the best fixture run, not from a
lucky xG spike. That is the single most robust pick on the board.

### Optimiser

Every legal 2, 3 and 4-transfer combination was enumerated under both models, subject
to budget, exact position matching and the 3-per-club limit, scored on **best legal
starting XI** (bench points only arrive via autosubs, so XI strength is the decision
metric, not squad total).

| Package | XI xPts raw | XI xPts regressed |
|---|---|---|
| **Bruno G.+Wilson+Muñoz → Mbeumo+Hall+Gomez** | 319-328 | **290-294** |
| Bruno G.+Muñoz+Obi → Hall+Scott+Barry | 304 | 287 |
| Bruno G.+Muñoz → Hall+Szoboszlai (no hit) | 300 | 284 |
| Bruno G.+Muñoz+Georginio → Elanga+Hall+Wissa | 295 | 276 |
| **no transfers** | 255 | 245 |

**Mbeumo appears in the winning package under both models.** That reconciled the
apparent contradiction that value-per-£m favours cheap defenders: with 15 fixed slots
and a fixed budget, total XI points is what matters, and Mbeumo maximises it.

---

## Decision

**3 transfers, -4 hit** (2 free + 1 paid).

| OUT | £ | IN | £ |
|---|---|---|---|
| Bruno G. (ARS, MID) | 6.8 | **Mbeumo** (MUN, MID) | 8.0 |
| Wilson (LEE, MID) | 6.4 | **Gomez** (BHA, MID) | 5.0 |
| Muñoz (NFO, DEF) | 5.4 | **Hall** (NEW, DEF) | 5.1 |

£18.6m freed, £18.1m spent, **£0.5m ITB**. Confirmed by the API:
`transfers: {cost: 4, limit: 2, made: 3, bank: 5, value: 992}`.

**Captain: B.Fernandes** (MUN away at EVE, FDR 3) — form 12.5, the highest of any
player in the game, and top of the underlying model too (36.0 regressed xPts).
**Vice: Gibbs-White**, moved off Gabriel deliberately: Gabriel faces ARS v CHE at
FDR 4, and the VC should not sit in the squad's worst fixture.

### Starting XI (4-5-1)
| Pos | Player | Team | £m | GW3 | FDR |
|---|---|---|---|---|---|
| GK | Raya | ARS | 6.0 | CHE (H) | 4 |
| DEF | Gabriel | ARS | 8.0 | CHE (H) | 4 |
| DEF | Guéhi | MCI | 6.0 | COV (H) | 2 |
| DEF | **Hall** | NEW | 5.1 | BOU (H) | 3 |
| DEF | O'Reilly | MCI | 6.5 | COV (H) | 2 |
| MID | **B.Fernandes (C)** | MUN | 12.0 | EVE (A) | 3 |
| MID | Semenyo | MCI | 8.5 | COV (H) | 2 |
| MID | **Mbeumo** | MUN | 8.0 | EVE (A) | 3 |
| MID | **Gibbs-White (V)** | NFO | 7.9 | TOT (H) | 3 |
| MID | **Gomez** | BHA | 5.0 | LEE (H) | 2 |
| FWD | João Pedro | CHE | 7.7 | ARS (A) | 5 |

**Bench (ordered deliberately, per GW1 learning #1):** Dubravka (GK) → Mitchell →
Georginio → Obi. Mitchell first among outfielders on minutes certainty (180/180) over
Georginio's higher ceiling but 75% injury doubt; a Mitchell swap keeps a legal 5-4-1
and a Georginio swap a legal 4-4-2, so both are valid autosubs.

**Final state:** £99.2m value, £0.5m ITB, 0 FTs. MUN×3, MCI×3, ARS×2, BHA×2.

### Chip strategy
**No chip.** All four remain available. The -4 was effectively a mini-wildcard on the
midfield, which *weakens* the case for burning the real one. Bench Boost remains
unplayable (Dubravka and Obi have 0 minutes between them all season). Next wildcard
decision point: **GW5-6**, per GW1's deferral.

---

## Accepted risks

- **MUN is 3 of 15**, and the captain plus the new signing are in the same match at
  Everton. Deliberate concentration on the best available midfield value, but it is
  concentration.
- **ARS v CHE remains an unresolved intra-squad clash**: Raya (GK) and Gabriel (DEF)
  against João Pedro (FWD). Unfixable within three transfers without selling a good
  player. Mitigating factor: FPL rates it 4/5, so it is a hard game for both sides.
- **Haaland exposure is still live.** He is 71.0% owned and was most-captained in both
  GW1 and GW2. The model rates him the *worst value in the pool* (1.59/£m), which is an
  argument against buying him but **not** an answer to the rank-variance problem. Those
  are different risks and this decision only addresses the first. He remains unreachable
  without a wildcard: buying him requires selling a forward, and the best forward sale
  (João Pedro, £7.6m) leaves £7.9m short.
- **Gomez is the weakest link** in the package (25.6 regressed xPts) and was chosen over
  Lewis-Potter (25.3) mainly on fixtures, BHA 2.80 vs BRE 3.40, and for leaving £0.5m ITB.

---

## Armband ledger (GW1 learning #4: track the Haaland swing cumulatively)

| GW | Our captain | Pts (x2) | Field's captain | Pts (x2) | Swing | Cumulative |
|---|---|---|---|---|---|---|
| 1 | B.Fernandes | 2 (4) | Haaland | 2 (4) | 0 | 0 |
| 2 | B.Fernandes | 23 (46) | Haaland | 13 (26) | **+20** | **+20** |
| 3 | B.Fernandes | | Haaland | | | |

---

## Watch flags for GW3

- [ ] **Mbeumo's xG converts.** The entire premium-is-a-trap thesis rests on 2.26 xG
      from one goal reverting upward. If he blanks repeatedly the model's regression
      assumption is wrong, not just unlucky.
- [ ] **Hall's DC points hold.** He needs 10+ defensive contributions to bank the 2.
      He hit 11 and 13. If that rate drops, the most robust pick on the board was noise.
- [ ] **Was -4 the right price?** Compare the three incoming players' combined return
      against what Bruno G./Wilson/Muñoz would have scored, plus 4.
- [ ] **Elanga regression.** Deliberately *not* bought despite form 8.5. Track whether
      the xG-based rejection was correct.
- [ ] **MUN triple-up.** Captain and new signing in the same fixture at Everton.
- [ ] **ARS v CHE clash.** Did owning both sides cancel out as feared?
- [ ] **Bench order.** Mitchell ahead of Georginio. If an autosub fires, was the
      minutes-certainty choice right?

---

## Outcome

*(fill in after GW3)*

**Actual points:**
**GW average:**
**Overall rank:**

| Player | Min | Pts | Notes |
|---|---|---|---|
| Raya | | | |
| Gabriel | | | |
| Guéhi | | | |
| Hall | | | |
| O'Reilly | | | |
| B.Fernandes (C) | | | |
| Semenyo | | | |
| Mbeumo | | | |
| Gibbs-White (V) | | | |
| Gomez | | | |
| João Pedro | | | |
| *Bench: Dubravka* | | | |
| *Bench: Mitchell* | | | |
| *Bench: Georginio* | | | |
| *Bench: Obi* | | | |

### Flag outcomes

- [ ] Mbeumo's xG converts
- [ ] Hall's DC points hold
- [ ] Was -4 the right price
- [ ] Elanga regression
- [ ] MUN triple-up
- [ ] ARS v CHE clash
- [ ] Bench order

---

## Learnings

*(fill in after GW3)*

### What we got right

### What we got wrong

### Gut calibration

### Adjustments for next time

### Chip planning notes
