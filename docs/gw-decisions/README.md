# FPL Gameweek Decision Log

Tracking decisions, hypotheses, and outcomes to calibrate intuition over time.

## Layout

Logs are namespaced by season: `<season>/gw<NN>.md`, e.g. `2026-27/gw1.md`.

This matters more than it looks. Gameweek numbers restart every August, so an
un-namespaced `gw1.md` sits ambiguously next to the previous season's `gw37.md`
— and "read the most recent decision file for chip-plan context" would hand you
a chip plan that expired in May. Always read within the **current** season
folder, and treat a prior season's locked plan as history, not as a constraint.

## Structure

Each gameweek file records:
- **Context** - Squad state, budget, chips, injuries
- **Panel analysis** - What the advisory council recommended
- **Flags** - Key signals and watchpoints for the week
- **Decision** - What we actually did and why
- **Outcome** - Actual results (filled in after the GW)
- **Learnings** - What we got right/wrong and why

## Seasons

### 2026-27 (current)
- [GW1](2026-27/gw1.md) - **Season opener, full squad rebuild.** 12 transfers off the auto-generated random squad. Deliberately Haaland-less (71.6% EO) in favour of a spread build. Captain B.Fernandes (MUN: HUL away), VC Gabriel. Finalised at 46; the bench-ordering error cost 4 pts.
- [GW2](2026-27/gw2.md) - *Retro-written.* No transfers, no evaluation run. 93 pts on a B.Fernandes haul (+20 armband swing vs Haaland), rank 5.57m -> 3.35m. Masked three dead squad slots.
- [GW3](2026-27/gw3.md) - **First hit of the season (-4).** Bruno G./Wilson/Munoz out, Mbeumo/Hall/Gomez in. Built an underlying-stats xPts model and found the premium tier is a value trap: every player above £9m is worse value than everything below. Captain B.Fernandes, VC moved to Gibbs-White. No chip.
- [GW4](2026-27/gw4.md) - **First armband change of the season.** O'Reilly out, Calafiori in (1 FT, no hit). Captain moved off B.Fernandes to Joao Pedro: the whole squad bar one player sat in an FDR-4 fixture, incl. six players in the MUN v MCI derby. Found Hull had conceded **zero** goals in three games, which de-rated the community's TC-Palmer-into-Hull consensus and killed the Lacroix buy. No chip. Finalised at **75** (avg 69), rank 3.50m -> 3.20m: the armband switch was worth +20 against the incumbent (Joao Pedro 24 vs B.Fernandes 4), ARS×3 returned 29. Hall's DC series (11, 13, 6, 6) now a red flag; Obi loaned out, bench 3/4 dead.
- [GW5](2026-27/gw5.md) - **Executed exactly as proposed: the first zero-deviation week of the season.** Georginio out, Barry in (1 FT, no hit) to cover a 75%-doubt João Pedro whose lineup landed ninety minutes after the deadline, with a FWD bench (Georginio, Obi loaned out) that could not autosub for him. Captain Gibbs-White (NFO v COV: 9 conceded, 0 scored), VC B.Fernandes, 4-4-2 with Mitchell first bench so a João Pedro absence falls automatically into 5-4-1. Hall kept one more week over Bogle, priced at -2 and re-priced at -3 after Newcastle's injury list. No chip; wildcard argued on GW4's list and held to GW6, after the international break. Locked at 14:10 UTC on Snorre's "Go please!", the moves made from the research session rather than in the app. Finalised at **58** (avg 48, the lowest of the season), rank 3.20m -> **2.38m** (+823k, the largest move of the season). João Pedro did not play and Mitchell autosubbed in for 7, exactly as built; the Barry transfer was worth +5 against the written-down zero-transfer alternative. Captain Gibbs-White blanked (NFO 0-1 COV, -8 vs Haaland, armband ledger +4) while Semenyo returned 17 from the XI; ARS×3 conceded 3 at Brighton for 3 points; Hall, twice named the next sale, scored for 13. Wildcard draft is the GW6 default.

### 2025-26
- [GW29](2025-26/gw29.md) - Wirtz + Guiu out, Dewsbury-Hall + Sesko in
- [GW33](2025-26/gw33.md) - DGW33 triple transfer: Šeško/Stach/Timber out, Welbeck/Okafor/Guéhi in. Captain Palmer. Chip plan locked: WC34 → BB36 → TC38.
- [GW34](2025-26/gw34.md) - **WILDCARD**. BGW34 escape: 8 moves (Hen/Sen/Col/Gué/O'Rei/Pal/Scott/JP out → Hermansen/N.Wil/Muk/Ald/Sal/GW/Rog/Watkins in). Captain Gibbs-White (NFO h BUR FDR 1).
- [GW37](2025-26/gw37.md) - **BENCH BOOST** (chip-plan deviation: BB36 was missed). 3 transfers w/ surprise -4 hit (squad showed 3 FTs, FPL credited 2): Okafor/Gibbs-White/Rogers out → Hinshelwood/Saka/Cherki in. Captain Haaland, VC Saka. TC38 still locked.
