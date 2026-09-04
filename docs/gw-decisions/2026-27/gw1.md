# GW1 Decision Log — SEASON OPENER, FULL SQUAD REBUILD

**Deadline:** Friday 2026-08-21 17:30 UTC
**Fixtures:** Fri-Mon (Aug 21-24), single GW
**Date of analysis:** 2026-08-17

---

## Pre-GW Context

### Squad State (pre-rebuild)
- **Budget:** £0.0m ITB, transfers **unlimited** (pre-season)
- **Chips available:** Bench Boost, Triple Captain (first-half set, GW1-19)
- **Squad value:** £100.0m
- **Starting point:** the auto-generated random squad FPL assigns on registration. Not a considered team — the whole 15 was up for review.

### Season rollover state
- 2026/27 is live in the API: 20 teams incl. promoted **COV, HUL, IPS**; 587 players; 5.2m managers registered.
- No gameweek has finished, so **`form` is 0.0 for all 587 players**. All ranking below is prior-season carryover, price, xGI/90, defensive contribution and fixtures.
- **Wildcard and Free Hit are NOT available in GW1** — both open at GW2. Only BB and TC are playable now, and both expire GW19.

---

## Flags & Key Signals

### Opening fixture run is unusually flat
Average FDR over GW1-6 spans only **2.83 (EVE, LIV, MUN, NEW) to 3.67 (BOU)**. There is no standout six-game run to build around, so fixtures were a tiebreak here rather than a driver.

### GW1 fixtures for the assets that mattered
| Team | GW1 | FDR |
|---|---|---|
| ARS | COV (H) | 2 |
| MUN | HUL (A) | 2 |
| NFO | LEE (H) | 2 |
| MCI | BOU (H) | 3 |
| CHE | FUL (A) | 3 |

MUN then face IPS (H) in GW2 — back-to-back promoted sides.

### Community signal (via WebSearch — `BRAVE_SEARCH_API_KEY` unset, so `get_community_trends` was unavailable)
- **The Scout's four must-haves:** Haaland (£15.5m, 71% owned), B.Fernandes (£12.0m, 48.5%), Gabriel (£8.0m), João Pedro (£7.5m, 58%).
- **Consensus captain is Haaland**, "the No 1 captain by a huge margin", MCI at home to BOU.
- **B.Fernandes is the named next-best armband** if you don't own Haaland, explicitly on the HUL/IPS opening pair.
- Gabriel flagged as a must-have but **explicitly not a captain option**.
- Raya is the only defensive asset above 30% ownership.
- Differentials named: Havertz (6.9%, best diff score in pool), Saka (~10%), Foden (~5%), Elliot Anderson (£6.5m, 90% don't own).

---

## Analysis

### Method
Projected each available player as `points_per_game × 34`, weighted by minutes reliability (`min(1, minutes/2400)`) with a price-implied fallback for players with little or no PL evidence, then tilted mildly by GW1-6 FDR. Optimised the best legal XI by local search under all squad constraints, with the captain's doubled score in the objective.

### Three builds compared
| Build | Projection | Captain | Note |
|---|---|---|---|
| **A — spread, no premium FWD** | **1966** | B.Fernandes | Chosen |
| B — Haaland anchor | 1942 | Haaland | Template-safe |
| C — Haaland + B.Fernandes | 1926 | Haaland | £27.5m on two players thins defence and bench |

The gap between A and B is 24 points over a full season (~0.7/GW), which is inside model error. The decision was therefore **not** made on projection — it was made on risk appetite, and taken by the manager.

### The real trade-off
Haaland is owned by **71.6%**. Not owning him is a double hit when he hauls: his points, plus the doubled points that two thirds of the field bank via the armband. Build A accepts that exposure in exchange for a deeper XI (Gibbs-White + O'Reilly + a playable bench) and B.Fernandes on the softest opening pair in the game.

---

## Decision

**12 transfers executed** (free — unlimited pre-season). Kept only **Guéhi, Bruno G., Dubravka** from the random squad.

| OUT | IN |
|---|---|
| A.Becker (LIV) £5.5 | Raya (ARS) £6.0 |
| Virgil (LIV) £6.5 | Gabriel (ARS) £8.0 |
| Tarkowski (EVE) £6.0 | Muñoz (CRY) £5.5 |
| Murillo (NFO) £5.5 | O'Reilly (MCI) £6.5 |
| Aït-Nouri (MCI) £5.5 | Mitchell (CRY) £4.5 |
| Palmer (CHE) £9.5 | B.Fernandes (MUN) £12.0 |
| Wirtz (LIV) £7.5 | Semenyo (MCI) £8.5 |
| Enzo (CHE) £7.0 | Gibbs-White (NFO) £8.0 |
| Anderson (MCI) £6.5 | Wilson (LEE) £6.5 |
| Watkins (AVL) £8.0 | João Pedro (CHE) £7.5 |
| Thiago (BRE) £8.0 | Georginio (BHA) £5.5 |
| Gyökeres (ARS) £7.5 | Obi (MUN) £4.5 |

**Captain: B.Fernandes** (MUN away at HUL, FDR 2). **Vice: Gabriel** (ARS home to COV, FDR 2).

### Projected XI (4-5-1)
| Pos | Player | Team | £m | GW1 | FDR |
|---|---|---|---|---|---|
| GK | Raya | ARS | 6.0 | COV (H) | 2 |
| DEF | Gabriel (V) | ARS | 8.0 | COV (H) | 2 |
| DEF | Guéhi | MCI | 6.0 | BOU (H) | 3 |
| DEF | Muñoz | CRY | 5.5 | EVE (A) | 3 |
| DEF | O'Reilly | MCI | 6.5 | BOU (H) | 3 |
| MID | B.Fernandes (C) | MUN | 12.0 | HUL (A) | 2 |
| MID | Semenyo | MCI | 8.5 | BOU (H) | 3 |
| MID | Bruno G. | ARS | 7.0 | COV (H) | 2 |
| MID | Gibbs-White | NFO | 8.0 | LEE (H) | 2 |
| MID | Wilson | LEE | 6.5 | NFO (A) | 3 |
| FWD | João Pedro | CHE | 7.5 | FUL (A) | 3 |

**Bench:** Dubravka (GK) → Mitchell → Georginio → Obi
**Final state:** £100.0m spent, £0.0m ITB, ARS×3, MCI×3, CRY×2, MUN×2. No GW1 intra-squad hedges.

### Chip strategy
**No chip in GW1.** WC and FH are unavailable until GW2. BB and TC are live but both run to GW19, and burning TC on a non-Haaland captain in week one wastes it. Nothing locked beyond that — revisit once the squad has real form data.

---

## Watch flags for GW1

- [ ] **Haaland exposure.** He is 71.6% owned and captained by most of the field. If he hauls vs BOU, quantify the rank damage — this is the defining risk of the build.
- [ ] **B.Fernandes captaincy vs HUL (A).** Did the promoted-side opener deliver? Community called him the clear #2 armband.
- [ ] **Gibbs-White (NFO) vs Wilson (LEE) play each other.** Both midfielders so not an anti-correlated hedge under the rule, but the same-fixture pairing is worth watching — did owning both sides dilute the return?
- [ ] **Prior-season stats at a new club.** Semenyo, Guéhi, Bruno G., Wilson, O'Reilly all moved in the window. Did their carryover numbers translate to the new side?
- [ ] **O'Reilly / Muñoz minutes.** Both were picked partly on prior-season starts. Confirm they actually start.
- [ ] **Bench fodder.** Georginio and Obi are non-playing filler. Fine now, but confirm no autosub was needed.

---

## Checkpoint: 2026-08-24, 9 of 10 fixtures played

**NOT FINAL.** João Pedro (CHE) still to play at FUL, Monday 2026-08-24 19:00 UTC. `event.finished = false`, `data_checked = false`, and no autosubs have been applied yet. Everything below is provisional and must be re-confirmed after the Monday game.

**Provisional points:** 34 (XI) · 6 left on the bench
**GW average:** 36 · **Highest score in the game:** 114
**Provisional overall rank:** 4,983,466 (~56th percentile, of ~5.2m)

| Player | Pts | Notes |
|---|---|---|
| Raya (ARS) | 6 | Clean sheet vs COV |
| Gabriel (ARS) | 5 | Clean sheet |
| Guéhi (MCI) | 10 | Squad top scorer |
| Muñoz (CRY) | 0 | 54 min, EVE 2-0 CRY |
| O'Reilly (MCI) | 2 | 62 min, started. Minutes risk was real but mild |
| **B.Fernandes (C)** | 2 → **4** | 90 min, HUL 2-0 MUN |
| Semenyo (MCI) | 2 | |
| Bruno G. (ARS) | 0 | **0 min, thigh injury** |
| Gibbs-White (NFO) | 2 | |
| Wilson (LEE) | 3 | 65 min |
| João Pedro (CHE) | n/a | Yet to play |
| *Bench: Georginio* | *5* | *90 min, BHA 4-0 AVL* |
| *Bench: Mitchell* | *1* | *90 min* |
| *Bench: Dubravka, Obi* | *0* | *0 min each* |

### Flag outcomes

- [x] **Haaland exposure, cost so far: zero.** Haaland scored **2** (90 min, no goal, no assist, 7 BPS) in MCI 2-1 BOU. He was confirmed as the GW's `most_captained` and `most_selected` player at 69.1% ownership. As the field's captain he returned **4**; our B.Fernandes captaincy also returned **4**. **Net armband swing: 0.** Raw ownership swing (had we held him as a non-captain): **−2**.
- [x] **B.Fernandes captaincy vs HUL (A): 2 pts (4 doubled).** The promoted-side opener did *not* deliver. MUN lost 2-0 away at Hull. The pick was right on process and wrong on outcome; it broke even against the consensus armband only because Haaland also blanked.
- [x] **Gibbs-White / Wilson same-fixture pairing: no meaningful dilution.** NFO 0-1 LEE returned 2 and 3 respectively. Low return from both, but the pairing itself was not the cause.
- [x] **New-club carryover: mixed, and the split is informative.** Guéhi (MCI) 10 was the squad's best return. Semenyo (MCI) 2, Wilson (LEE) 3, O'Reilly (MCI) 2 were flat. Bruno G. (ARS) never got on the pitch.
- [x] **Minutes risks: both started, neither lasted.** O'Reilly 62 min, Muñoz 54 min. The starts were correctly predicted; the *completion* was not, and both were subbed before any late-game returns.
- [x] **Bench fodder: one autosub required, and the bench order cost us.** See learnings below.

---

## Learnings

### What we got right

- **The differential risk was correctly identified and correctly priced.** The GW1 doc named Haaland exposure as "the defining risk of the build" before a ball was kicked, and framed it precisely: his points *plus* the doubled points the field banks. That is exactly the variable that decided the week, and it resolved in our favour.
- **Refusing to burn Triple Captain in week one.** TC on B.Fernandes would have turned a 2-point return into a wasted chip with 18 gameweeks of runway still on it.
- **Guéhi retained from the random squad.** The one carryover player that was actively re-evaluated rather than swept out returned the squad's top score.

### What we got wrong

- **Bench ordering was never considered, and it cost 4 points.** Bruno G. played 0 minutes, so an autosub will fire at GW finalisation. Bench order is Dubravka (GK) → Mitchell → Georginio → Obi. FPL takes the *first* eligible bench player whose introduction keeps a legal formation. Mitchell (DEF, **1 pt**) qualifies (5-4-1 is legal), so he comes in ahead of Georginio (FWD, **5 pts**), who would *also* have been a legal swap (4-4-2). **Net +1 instead of +5.** The GW1 doc treated the bench purely as "non-playing filler" and ordered it arbitrarily. That was a free option we declined to take.
- **The squad was built for spread but the spread did not spread.** The whole case for Build A over Build B was a deeper XI. Five midfielders returned 2, 2, 2, 3 and 0. Depth only pays if the depth returns; this week it was breadth without output.
- **`points_per_game × 34` over-trusted prior-season output for players at new clubs.** Semenyo, Wilson and O'Reilly were all projected on carryover numbers from a different side and all landed flat. The minutes-reliability weighting handled *availability* but nothing in the model handled *role change at a new club*.
- **No injury re-check between analysis and deadline.** The analysis was dated 2026-08-17; the deadline was 2026-08-21. Bruno G.'s thigh problem cost a starting slot and there is no evidence in the log that fitness was re-verified in that four-day window.

### Gut calibration

**Was skipping the 71.6%-owned captain defensible?** Yes, and this week is weak evidence for it, not strong evidence. The correct read is *risk validated, execution mediocre*. We did not get punished, but we did not gain either: we sit 2 points **below** the 36-point average, with the one week most likely to blow the build up now behind us. The call survived its worst-case test; it has not yet been shown to be a *good* call, only a non-fatal one.

The honest counterfactual is narrower than "we dodged a bullet": one 2-point Haaland blank is a single draw from a distribution where he is captained by two thirds of the field every week. Surviving week one says nothing about weeks 2-38. The exposure is still live and still the defining risk of the season.

**Was `points_per_game × 34` reasonable?** Adequate as a ranking device, poor as a point estimate. It correctly separated tiers but produced no usable signal within them, and it has a known blind spot on transferred players (above).

### Adjustments for next time

1. **Order the bench deliberately, every single week.** Highest-expected-return outfielder first, and check the formation legality of each swap. This is a zero-cost decision we simply were not making.
2. **Re-verify injuries and press-conference news in the final 24h before deadline**, not at analysis time. Add it as a hard pre-deadline checklist item.
3. **Discount projections for players who changed clubs in the window**: carryover PPG assumes a role that may no longer exist. Apply an explicit haircut rather than trusting `minutes` alone to catch it.
4. **Track the Haaland differential cumulatively, not per-GW.** A running "swing vs. the field's captain" ledger across the season is the only way to judge the build decision. One week is noise.
5. **Do not treat a survived risk as a vindicated one.** Re-examine the no-Haaland structure when the wildcard opens at GW2 on its merits, not on relief that week one was fine.

### Chip planning notes

- BB and TC both still unused, both expire **GW19**.
- **Wildcard and Free Hit open at GW2.** The opener did not expose a structural break (the squad's shape is sound and the returns were simply low), so there is no case for a panic GW2 wildcard off one below-average week. Revisit at GW4-6 once real form data exists.
- Bench Boost is not close to playable: Dubravka, Obi and Georginio are filler and two of the four bench players recorded 0 minutes.

---

## Finalisation check: 2026-08-25 (post-mortem attempted, BLOCKED)

The GW1 post-mortem was attempted on 2026-08-25 and deliberately **not written**. FPL has not finalised the gameweek, so no final points, rank or per-player table is recorded here. The Outcome section stays empty on purpose.

### Gate status

```
events[0].finished     = false
events[0].data_checked = false
```

Confirmed on two cache-busted refetches (`Cache-Control: no-cache`, random query string), so this is not a stale CDN response.

All 10 fixtures report `minutes: 90` and `finished_provisional: true`, including FUL v CHE (Mon 2026-08-24 19:00 UTC). The football is complete. FPL's final data check has not run.

### Why the gap is not cosmetic here

- **The autosub has not fired.** `/api/entry/5047923/event/1/picks/` returns `automatic_subs: []`. Bruno G. played 0 minutes and has not been replaced, so the live total of 45 is a **10-man XI score**. Recording 45 as the final total would be wrong within hours, and would silently bury the single flag this doc most wants validated.
- **Bonus is provisional.** Guéhi (2) and João Pedro (2) show bonus in the live feed, but bonus is not locked until `data_checked` flips.
- **Rank is still drifting.** Two calls minutes apart returned 5,156,448 (`/picks/`) and 5,156,373 (`/entry/`).
- **The benchmarks themselves moved.** Since the 2026-08-24 checkpoint the GW average went 36 to 48 and the highest score 114 to 131. The numbers this post-mortem would grade itself against are not settled either.

### Live state at check time (NOT FINAL, do not cite)

Recorded only as a starting point for whoever finishes the job. The one genuinely new data point versus the 08-24 checkpoint is João Pedro, who was still to play then and returned the squad's top score.

| Player | Min | Pts | | Player | Min | Pts |
|---|---|---|---|---|---|---|
| Raya | 90 | 6 | | Gibbs-White | 90 | 2 |
| Gabriel | 90 | 5 | | Wilson | 65 | 3 |
| Guéhi | 90 | 10 | | **João Pedro** | 90 | **11** |
| Muñoz | 54 | 0 | | *Mitchell (bench)* | 90 | *1* |
| O'Reilly | 62 | 2 | | *Georginio (bench)* | 90 | *5* |
| **B.Fernandes (C)** | 90 | **2 x2** | | *Dubravka, Obi (bench)* | 0 | *0* |
| Semenyo | 90 | 2 | | | | |

Live XI total **45**, bench 6. Unvalidated prediction: removing Bruno G. leaves 4-4-1, and Mitchell (DEF, 1 pt) is the first legal swap at 5-4-1, ahead of Georginio (FWD, 5 pts) at 4-4-2. That points to a final of **46** and would confirm the bench-ordering lesson above, but it has **not** happened yet and must be read from `automatic_subs` when it does.

### Still to confirm once the gate opens

- [ ] Final GW1 total after the autosub applies
- [ ] That the Bruno G. to Mitchell autosub fired as predicted (validates the bench-ordering lesson)
- [ ] Final overall rank once `data_checked = true`
- [ ] Final bonus points

### Process learning from this check

- **The finalisation gate is `finished && data_checked` on the *event*, not `finished_provisional` on the *fixtures*.** Every fixture can read 90 minutes and provisionally final while the gameweek is still open. Checking fixture state alone would have produced a confident, wrong post-mortem.
- **`automatic_subs == []` on a squad with a 0-minute starter is the cheap tell** that finalisation has not run. It is a one-field check and it is more legible than the event flags, because it names the specific number that is about to change.
- **A post-mortem's headline number should be gated, not caveated.** The 08-24 checkpoint handled this correctly by labelling itself NOT FINAL rather than presenting provisional numbers as results, and that convention is carried forward here.
- No recurring watcher was scheduled to catch finalisation. Re-run this check manually before writing the post-mortem.

---

## Finalisation resolved: 2026-09-03

The gameweek finalised. `events[0].finished = true`, `data_checked = true`. Filling in
the four items left open above.

**Final points: 46** · **GW average: 50** · **Overall rank: 5,572,584**
**Most captained in the game:** Haaland (2 pts)

### The four open items

- [x] **Final GW1 total after the autosub: 46.** The 2026-08-25 check predicted exactly
      46. The prediction was correct.
- [x] **The Bruno G. → Mitchell autosub fired as predicted.** `automatic_subs` reads
      `[{element_out: Bruno G., element_in: Mitchell}]`. Mitchell came on for **1 point**
      where Georginio, also a legal swap at 4-4-2, would have returned **5**.
      **The bench-ordering lesson is confirmed, and it cost 4 points.**
- [x] **Final overall rank: 5,572,584.** Below the GW average of 50 by 4 points.
- [x] **Final bonus:** included in the per-player totals below; no change from the
      provisional reading.

### Final per-player

| Player | Min | Pts | | Player | Min | Pts |
|---|---|---|---|---|---|---|
| Raya | 90 | 6 | | Wilson | 65 | 3 |
| Gabriel | 90 | 5 | | João Pedro | 90 | 11 |
| Guéhi | 90 | 10 | | **Mitchell (autosub in)** | 90 | **1** |
| Muñoz | 54 | 0 | | *Bench: Georginio* | 90 | *5* |
| O'Reilly | 62 | 2 | | *Bench: Bruno G.* | 0 | *0* |
| **B.Fernandes (C)** | 90 | **2 x2** | | *Bench: Dubravka, Obi* | 0 | *0* |
| Semenyo | 90 | 2 | | | | |
| Gibbs-White | 90 | 2 | | | | |

### What the resolved data confirms

- **The gating discipline was correct and worth the delay.** Recording the provisional
  45 would have been wrong. Recording 46 with the autosub named is right, and the
  prediction method (read the formation legality, not just the points) held up exactly.
- **The bench-ordering loss is now measured, not estimated: −4 points.** That is the
  single most actionable lesson of the season so far, and it was applied from GW3 onward.
- **The Haaland armband swing for GW1 is 0.** Our B.Fernandes returned 4 doubled; the
  field's Haaland returned 4 doubled. Recorded in the cumulative ledger in
  [gw3.md](gw3.md).
