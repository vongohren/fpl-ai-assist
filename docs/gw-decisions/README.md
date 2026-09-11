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
- [GW4](2026-27/gw4.md) - **First armband change of the season.** O'Reilly out, Calafiori in (1 FT, no hit). Captain moved off B.Fernandes to Joao Pedro: the whole squad bar one player sat in an FDR-4 fixture, incl. six players in the MUN v MCI derby. Found Hull had conceded **zero** goals in three games, which de-rated the community's TC-Palmer-into-Hull consensus and killed the Lacroix buy. No chip.

### 2025-26
- [GW29](2025-26/gw29.md) - Wirtz + Guiu out, Dewsbury-Hall + Sesko in
- [GW33](2025-26/gw33.md) - DGW33 triple transfer: Šeško/Stach/Timber out, Welbeck/Okafor/Guéhi in. Captain Palmer. Chip plan locked: WC34 → BB36 → TC38.
- [GW34](2025-26/gw34.md) - **WILDCARD**. BGW34 escape: 8 moves (Hen/Sen/Col/Gué/O'Rei/Pal/Scott/JP out → Hermansen/N.Wil/Muk/Ald/Sal/GW/Rog/Watkins in). Captain Gibbs-White (NFO h BUR FDR 1).
- [GW37](2025-26/gw37.md) - **BENCH BOOST** (chip-plan deviation: BB36 was missed). 3 transfers w/ surprise -4 hit (squad showed 3 FTs, FPL credited 2): Okafor/Gibbs-White/Rogers out → Hinshelwood/Saka/Cherki in. Captain Haaland, VC Saka. TC38 still locked.
