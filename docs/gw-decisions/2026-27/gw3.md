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
| 3 | B.Fernandes | 2 (4) | Haaland | 9 (18) | **-14** | **+6** |

Haaland was the most-captained player in the game for the third consecutive week.
Three gameweeks in, the whole no-Haaland structure is **+6 points ahead** on the
armband: one big week and one bad week have very nearly cancelled.

---

## Watch flags for GW3

*Resolved in [Flag outcomes](#flag-outcomes) below.*

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

**Actual points: 56 gross, -4 hit, 52 net** (bench 0) · **GW average: 51** ·
**Highest score: 119**
**Overall rank: 3,504,624** (down from 3,345,863, **-158,761 places**)
**GW rank:** 3,726,330 · **Season total: 191**
**Most captained in the game:** Haaland (9 pts)

Finalisation gate confirmed before writing: `events[2].finished = true`,
`data_checked = true`, and `automatic_subs` is populated, per the GW1 process learning.

| Player | Min | Pts | Notes |
|---|---|---|---|
| Raya | 90 | 3 | 4 saves, conceded 1. ARS 2-1 CHE |
| Gabriel | 90 | 2 | No clean sheet. DC 7, below the 10 threshold |
| Guéhi | 90 | 8 | Clean sheet + 2 bonus, DC 9. MCI 1-0 COV |
| **Hall** | 89 | 4 | Assist, conceded 2. **DC 6** (see flag) |
| O'Reilly | 0 | 0 | **Autosubbed out.** Unused, not in the matchday squad |
| **B.Fernandes (C)** | 90 | **2 x2 = 4** | Appearance only, 0.15 xG. EVE 2-2 MUN |
| Semenyo | 90 | 6 | Assist + clean sheet |
| **Mbeumo** | 90 | **8** | Goal + 1 bonus, from **0.05 xG** (see flag) |
| Gibbs-White (V) | 90 | 3 | Clean sheet, 0.48 xG, no return. NFO 0-0 TOT |
| **Gomez** | 90 | 2 | Appearance only. DC 9, MID threshold is 12 |
| João Pedro | 90 | 1 | Yellow card, no return |
| **Mitchell (autosub in)** | 73 | **15** | **2 goals + 2 bonus** from 0.66 xG. FUL 2-3 CRY |
| *Bench: Dubravka* | 0 | 0 | |
| *Bench: Georginio* | 0 | 0 | |
| *Bench: Obi* | 0 | 0 | |

**Autosub:** O'Reilly → Mitchell (O'Reilly played 0 minutes). A defender-for-defender
swap, so the XI stayed 4-5-1.

XI total **56**, bench **0**, transfer cost **-4**, net **52**. Beat the GW average by
1 net (5 gross) and still **lost rank**, because the field's captain hauled.

### Flag outcomes

- [x] **Mbeumo's xG converts: RETURN YES, THESIS UNTESTED.** He scored and took 8
      points, joint second-best in the squad. But the goal came from **0.05 xG in GW3**.
      His season xG moved 2.26 to **2.31** and goals 1 to 2. The 2.26-xG backlog did not
      convert; a near-zero-xG goal landed on top of it. **Right answer, wrong mechanism.**
      The regression thesis got a good week but no evidence, and the unconverted backlog
      is still sitting there.
- [x] **Hall's DC points hold: NO, FAILED.** DC of **6** against 11 and 13 in GW1-2,
      below the 10 threshold, so **0 DC points banked**. His 4 came from an assist minus
      a goal-conceded. NEW drew 2-2 at home to BOU, so no clean sheet either. The
      "single most robust pick on the board" returned 4 in the *easiest* fixture of the
      run it was bought for.
- [x] **Was -4 the right price: YES, +9.** In: Mbeumo 8, Hall 4, Gomez 2 = **14**.
      Out: Bruno G. 0 (0 min), Wilson 0 (17 min), Muñoz 1 (31 min) = **1**. So 14
      against 1 + 4 = 5, **net +9**. The full-XI counterfactual agrees: leaving the
      squad untouched puts those three into the same slots for 1 point combined and no
      hit, giving **43** against the actual **52**. Same +9 either way. The three
      outgoing players managed **48 minutes between them**.
- [x] **Elanga regression: YES, THE REJECTION WAS CORRECT.** 76 minutes, **1 point**,
      **0.00 xG**. His season xG is unchanged at 0.42 and he is still on 2 goals. Buying
      him over Mbeumo would have been a straight 7-point downgrade in week one of the
      decision.
- [x] **MUN triple-up: SURVIVED, BUT THE CAPTAIN BROKE IT.** EVE 2-2 MUN returned
      Mbeumo 8, B.Fernandes 2 (4 doubled) and Obi 0 from the bench: **12 of 56 from one
      fixture**. The concentration itself was not punished. The armband inside it was.
- [x] **ARS v CHE clash: YES, IT CANCELLED, AND BOTH SIDES LOST.** ARS 2-1 CHE gave
      Raya 3, Gabriel 2 and João Pedro 1: **6 points from £21.7m across three squad
      slots**. Chelsea's goal denied the clean sheet that was the whole case for holding
      Raya and Gabriel, and Arsenal winning denied João Pedro. The pre-deadline note that
      FDR 4 "is a hard game for both sides" was not mitigation, it was the loss condition
      for both halves at once.
- [x] **Bench order: YES, AND IT WAS THE WEEK.** O'Reilly played 0 minutes and Mitchell
      came in for **15**, against 0 from both Georginio and Obi. GW1's costed lesson
      (bench order, -4) was applied in GW3 and paid **+15** the first week it was tested.
      One correction to the pre-deadline note: it anticipated a 5-4-1 swap for a
      midfielder, and what actually fired was defender-for-defender at 4-5-1. The
      ordering rule produced the right result anyway, because it ranked on minutes
      certainty rather than on which specific slot would open.

---

## Learnings

### What we got right

- **Bench ordering, applied deliberately for the first time, returned +15.** Mitchell
  ahead of Georginio on minutes certainty (180/180) was the single largest decision of
  the week. GW1 measured this lesson at **-4**; GW3 collected **+15** on it. It is the
  clearest process-to-points link in the log so far.
- **The dead-weight audit and the -4 that followed were correct: +9.** Bruno G., Wilson
  and Muñoz played 48 minutes between them for 1 point. Without the restructure this is
  a **43-point** week against a 51 average: a bad week, not a mediocre one.
- **The xG-based rejection of Elanga held.** 1 point, 0.00 xG. Form-based shortlisting
  would have cost 7 points against Mbeumo in the very first week.
- **The finalisation gate was respected.** `finished && data_checked` plus a populated
  `automatic_subs`, exactly as GW1's process learning specified. The 15-point autosub is
  the number that would have been missed by writing this early.

### What we got wrong

- **The captaincy, and it cost more than every transfer decision earned.** B.Fernandes
  returned 2 (4 doubled) against Haaland's 9 (18): a **-14 swing** that wiped out the +9
  from the restructure and then some. Three weeks in, the transfer market has been the
  profitable half of this operation and the armband has been the volatile half.
- **Hall's "most robust pick on the board" failed its first test.** The robustness claim
  rested on two DC readings (11, 13) that happened to sit above a hard threshold of 10.
  A third reading of 6 puts his mean roughly *on* the threshold, which is the worst
  possible place for a binary scoring rule to sit. Two samples on one side of a cliff is
  not robustness, it is a coin flip that landed twice.
- **The premium-is-a-value-trap thesis got no test at all.** GW3 split the tier it was
  meant to condemn: Isak 13 and Haaland 9 against Saka 2 and Palmer 1. Nothing was
  discriminated, and the week must not be read as confirmation.
- **Mbeumo's 8 points are not evidence for the model that bought him.** 0.05 xG produced
  that goal. Counting it as the regression thesis paying off would be exactly the
  reasoning error the GW3 analysis was built to avoid, the "form is fake" trap pointed
  inward at our own pick.
- **The ARS v CHE clash was labelled unfixable and then treated as priced.** It was
  neither. Three slots, £21.7m, 6 points, and the two failure modes are perfectly
  anti-correlated: any result that pays one side blanks the other. "Unfixable within
  three transfers" is a statement about one week's constraints, not a reason to stop
  costing it.

### Gut calibration

**We beat the average and lost 158,761 places.** That sentence is the season's
structural problem in one line. 56 gross against a 51 average, minus the hit, is a net
+1 week, and a net +1 week is a losing week whenever 71% of the field has the haul
captained. The Haaland exposure does not show up as a single catastrophic gameweek. It
shows up as a slow leak on every week where he returns and we merely match the average.

**Is the armband ledger still evidence for the build?** Barely. **+6 cumulative** after
three weeks, with enormous variance: 0, +20, -14. GW1's log warned that one week is
noise, and the same caution now cuts the other way: +20 should not have been read as
vindication in GW2 any more than -14 should be read as refutation now. What the ledger
actually says after three weeks is that the no-Haaland build is running approximately
level while carrying materially more week-to-week variance than the field. That is a
defensible position to hold and it is not yet a winning one.

**Separate process from outcome.** Four of the seven flags resolved in favour of the
process (bench order, the -4, Elanga, the MUN concentration), one against (Hall), one
cancelled out (ARS v CHE), and one is a right answer reached by the wrong route
(Mbeumo). The decision-making was the best of the season so far and the week still lost
rank. Both of those are true and neither should be used to argue with the other.

### Adjustments for next time

1. **Grade defensive-contribution picks on a rolling 4-6 game rate, not two readings.**
   DC scoring is a hard threshold, so a player averaging ~10 is worth far less than a
   player averaging 13. Record the per-game DC series, not just the average, and treat
   a threshold-adjacent mean as a red flag rather than a robustness claim.
2. **Give the captaincy its own model.** Three gameweeks, three B.Fernandes armbands,
   cumulative +6. The armband is currently chosen on season form while the transfers are
   chosen on per-fixture underlying xPts. Run the captaincy through the same
   fixture-level framework the transfers already use.
3. **Cost intra-squad clashes explicitly instead of declaring them unfixable.** Put a
   number on the anti-correlation and carry it into the next wildcard as a constraint,
   rather than re-discovering it as an accepted risk every week.
4. **Never read a goal as confirmation of an xG thesis without checking which xG
   produced it.** Mbeumo's return would have passed an outcome-only check and told us
   nothing. Check the mechanism first, then the result.
5. **Keep auditing minutes, not points, on every squad slot** (carried from GW2, and it
   worked). O'Reilly has now recorded 0 minutes in a home fixture against a promoted
   side and is the next dead-weight candidate.

### Chip planning notes

- **No chip played. All four still available**, all expiring **GW19**, so 16 gameweeks
  of runway and a narrowing useful window.
- **Bench Boost remains unplayable and got worse.** The bench returned **0** in GW3, and
  Dubravka and Obi have **0 minutes between them all season**. Georginio added 0 this
  week too. Three of four bench slots are non-playing filler.
- **Wildcard: the case has shifted from "the midfield is dead" to "the armband is the
  problem".** The -4 already did the midfield surgery, which was GW1's stated wildcard
  trigger. What remains unresolved is the thing this log has now said three times:
  Haaland is unreachable without selling a forward, and the best forward sale leaves
  £7.9m short. **That is now the wildcard's actual job**, and the GW5-6 decision point
  should be argued on that basis rather than on squad health.
- **Free Hit and Triple Captain:** no case yet. Both want a DGW or a fixture outlier and
  GW3-7 contains neither for this squad.
