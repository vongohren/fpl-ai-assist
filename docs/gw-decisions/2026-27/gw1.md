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

## Outcome (fill in after GW1)

**Actual points:**
**Overall rank:**
**Captain return:**

| Player | Points | Notes |
|---|---|---|
| | | |

### Flag outcomes
- [ ] Haaland exposure — cost in rank terms:
- [ ] B.Fernandes captaincy return:
- [ ] Gibbs-White / Wilson same-fixture dilution:
- [ ] New-club players' carryover accuracy:
- [ ] Minutes risks (O'Reilly, Muñoz):

---

## Learnings (fill in after GW1)

### What we got right
-

### What we got wrong
-

### Gut calibration
- Was skipping the 71.6%-owned captain defensible, or did it cost more than the 24 projected points it was supposed to save?
- Did `points_per_game × 34` prove a reasonable pre-season projection, or did it over-trust prior-season output for players at new clubs?

### Adjustments for next time
-

### Chip planning notes
- First-half BB and TC both expire **GW19** — do not let them roll unused.
- Wildcard and Free Hit open at GW2; a GW2-4 wildcard is a live option if the opener exposes structural problems.
