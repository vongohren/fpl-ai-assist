# GW6 Decision Log: THE WILDCARD, AND HAALAND COMES IN

**Deadline:** Saturday 2026-10-10 10:00 UTC
**Fixtures:** Sat-Mon (Oct 10-12), single GW, no DGW/BGW. First gameweek after a three-week international break.
**Date of analysis:** 2026-10-07 (proposal; Guéhi claim corrected the same day). **Revised to version B and executed 2026-10-09**, see the top of the Proposal. **Locked 2026-10-10: B as played, 5 of 5 matched**, see Decision.
**Proposal page:** https://artifacts.go.vongohren.me/life/fpl-gw6-proposal

---

## Pre-GW Context

### Squad state (pre-transfer)
- **Budget:** £1.1m ITB, **1 free transfer** (not 2: GW5's chip note assumed a rolled FT, but the GW5 FT was spent on Barry)
- **Squad value:** £98.4m at selling prices, so **£99.5m to spend on a wildcard**
- **Chips:** all four available and playable (BB, TC, WC, FH), first-half set, **all expire GW19**
- **Rank:** 2,376,841 after GW5

### Season so far
| GW | Pts | Avg | Bench | Rank |
|---|---|---|---|---|
| 1 | 46 | 50 | 5 | 5,572,584 |
| 2 | **93** | 81 | 0 | 3,345,863 |
| 3 | 52 net (56 gross, -4) | 51 | 0 | 3,504,624 |
| 4 | **75** | 69 | 3 | 3,200,152 |
| 5 | 58 | 48 | 8 | **2,376,841** |

### Prior-decision context: the GW5 constraints

[GW5](gw5.md) left eight adjustments and a chip note. Read as constraints:

1. **"GW6 opens with a wildcard draft by default, and argues against it."** *Applied: the
   draft is below, built by optimiser against the real £99.5m, and the case against it
   has its own section. It keeps **7 of 15**.*
2. **"Hall is not sold on the DC series alone... only sold if both say so or the wildcard
   replaces him."** *Applied: re-argued on both series (DC 11, 13, 6, 6, 10; points 3,
   11, 4, 0, 13). Neither says sell. Keeping him on the wildcard costs **0.7 points over
   six weeks** on the model, so he stays.*
3. **"The four-game opponent-results table is a tiebreak, not a primary."** *Applied and
   extended: the model no longer reads results at all. Team attack and defence come from
   underlying xG and xGC, shrunk 50% to the league mean. Results appear only in the table
   below, as context.*
4. **"Keep the captaincy model and run it from scratch for GW6. Do not default to
   Semenyo."** *Applied. Semenyo is not on the shortlist: he is a 75% ankle doubt at
   Anfield.*
5. **"The doubtful-starter rule is now a standing rule."** *Applied: every GW6 match kicks
   off after the deadline. The proposed XI has no flagged starter. The rule decides the
   zero-transfer alternative's XI, see there.*
6. **"Check `news_added` before trusting a status."** *Applied. João Pedro's 75% still
   carries **2026-09-16T19:00**, three weeks stale. The reporting says knee oedema, a
   London specialist, "return expected later in October". Read as about 25% for GW6, and
   **he is sold** under the wildcard, exactly as the adjustment said.*
7. **"Gomez counts as a keep, not as bench filler."** *Applied: kept, at a model cost of
   0.3 points over six weeks.*
8. *Lock-timing flag closed. No change.*

**Chip note:** *"If the draft keeps fewer than ten of the current fifteen, play it. If it
keeps eleven or more, the FT does the work."* The draft keeps seven. **Play it.**

---

## Flags & Key Signals

### What the break did to the squad

Live `bootstrap-static`, read 2026-10-07 10:10 UTC (not the MCP cache, GW4 adjustment #6):

| Player | API | `news_added` | Reporting |
|---|---|---|---|
| **João Pedro** | `d` 75% | **2026-09-16** (unchanged) | Knee oedema, "up to four weeks", seeing a specialist; Chelsea expect him back **later in October**, no decision for Bournemouth. 64.7% owned (down from 75.4%) |
| **Semenyo** | `d` 75% | 2026-09-24 (**new**) | Ankle knock in the 5-3 v Sunderland; withdrew from Ghana duty to heal. "Precautionary", but a doubt for **Liverpool away** |
| Guéhi | `a` | none | *Corrected 2026-10-07:* the "withdrew from England" line came from a November 2025 story. He [stayed with England](https://sports.yahoo.com/articles/man-city-star-withdraws-england-134104853.html) and played the Czech Republic; O'Reilly was the City player sent home. Fit. The sale stands on role risk (used in midfield) and the model |
| **B.Fernandes** | `a` | none | Missed one Portugal game with "pain for three matches", then played 89 minutes v Denmark with **two assists**. Treated as fit |
| Obi | `u` | 09-14 | On loan at Willem II. Permanent zero |
| Dubravka | `a` | none | 0 minutes in five. Structural filler |

Two squad players flagged, one permanent zero, one bench GK who has never played. That is
four of fifteen slots carrying a question.

### Team quality, underlying (5 games)

The new model's inputs, shrunk 50% to the mean. Actual results for context only
(adjustment #3).

| Team | xGF/g | xGA/g | GF-GA | CS | Read |
|---|---|---|---|---|---|
| ARS | 1.70 | **0.81** | 8-4 | 3 | Best defence in the league by a distance |
| NFO | 1.50 | 0.97 | 4-5 | 1 | Second-best defence, no attack |
| LIV | 1.68 | 1.22 | 7-4 | 3 | Third-best defence. **Haaland's GW6 opponent** |
| BRE | **2.04** | 1.26 | 10-4 | 2 | Fourth-best attack, solid behind it |
| EVE | 1.42 | 1.31 | 6-3 | 3 | |
| MUN | **2.05** | 1.36 | 8-8 | 0 | Third-best attack by xG; the defence has no clean sheet |
| MCI | **2.15** | 1.51 | 13-5 | 2 | |
| TOT | 1.00 | 1.56 | 2-8 | 2 | **Second-worst attack.** MUN's GW6 opponent |
| COV | 0.99 | 1.70 | 1-10 | 1 | Results far worse than underlying |
| BHA | **2.31** | 1.73 | 16-5 | 3 | Best attack |
| SUN | 1.97 | 1.72 | 6-10 | 1 | |

### Fixture runs, GW6-11

| Team | GW6 | GW7 | GW8 | GW9 | GW10 | GW11 | Avg | Exposure after the wildcard |
|---|---|---|---|---|---|---|---|---|
| **MCI** | LIV (a) 4 | **IPS (H) 2** | AVL (H) 3 | BHA (H) 3 | NFO (a) 3 | FUL (H) 2 | 2.83 | Haaland |
| COV | NEW (H) 3 | TOT (a) 3 | FUL (H) 2 | SUN (H) 3 | EVE (a) 3 | CRY (H) 2 | **2.67** | Thomas |
| SUN | BHA (H) 3 | BOU (a) 3 | LEE (H) 3 | COV (a) 2 | CHE (H) 4 | AVL (a) 3 | 3.00 | Le Fée |
| ARS | LEE (H) 3 | NFO (a) 3 | EVE (H) 3 | LIV (a) 4 | HUL (H) 2 | NEW (a) 3 | 3.00 | Raya |
| NEW | COV (a) 2 | AVL (H) 3 | CRY (a) 3 | EVE (H) 3 | FUL (a) 3 | ARS (H) 4 | 3.00 | Hall |
| MUN | **TOT (H) 2** | LEE (a) 3 | BOU (H) 3 | CHE (H) 4 | AVL (H) 3 | LIV (a) 4 | 3.17 | B.Fernandes, Mbeumo |
| BRE | AVL (a) 3 | LIV (H) 4 | HUL (a) 2 | NFO (H) 3 | BHA (a) 4 | EVE (H) 3 | 3.17 | Ajer, Janelt, Thiago |
| EVE | HUL (a) 2 | CHE (H) 4 | ARS (a) 5 | NEW (a) 3 | COV (H) 2 | BRE (a) 3 | 3.17 | Branthwaite, Barry |
| NFO | CRY (a) 3 | ARS (H) 4 | IPS (a) 2 | BRE (a) 3 | MCI (H) 4 | BOU (a) 3 | 3.17 | Murillo |
| BHA | SUN (a) 3 | CRY (H) 2 | LIV (a) 4 | MCI (a) 5 | BRE (H) 3 | HUL (a) 2 | 3.17 | Gomez |
| CHE | BOU (H) 3 | EVE (a) 3 | TOT (H) 2 | MUN (H) 4 | SUN (a) 3 | LEE (H) 3 | 3.00 | *(João Pedro, sold)* |

Read per GW4 adjustment #4: the run is the second input. City's GW7-11 is the reason
Haaland is a six-week buy and not a GW6 one.

### Community (source: Brave via `get_community_trends`, **mostly WebSearch**)

Brave hit **429 on every angle**. Transfers returned ten names, all from GW4 and GW5
articles (stale); captaincy and differentials returned **nothing**. All three angles were
re-run through `WebSearch` (RotoWire, OneFPL, AllAboutFPL, FFHub, FFFix, Scout,
Ingenuity). Every claim below was checked against the API.

- **Captaincy:** "one of the first genuinely open captaincy weeks". RotoWire ranks
  **B.Fernandes first (7.0 xPts)**, Saka second (7.0), Palmer third, **Haaland "an
  unusually lowly fourth"** at Anfield. AllAboutFPL's poll: **B.Fernandes 23, Haaland
  19**. Differential captains named: Dewsbury-Hall, **Barry** (5.0 xPts). *Cross-check:
  Palmer is `d` 75% (09-21), so he fails the gate on status; Barry is ours.*
- **Transfers:** **Groß** is the most-bought player of the break (800k+, 29.8% owned,
  47 points, retired from internationals). Then Schade, Kostoulas, De Cuyper, **Hall**,
  Iwobi (FUL's IPS-HUL-COV run), Brobbey. "GW6 is a logical wildcard window" is the
  consensus, with "wait if your team is healthy" as the caveat. *Cross-check: Brobbey
  is `d` 75%; Kostoulas has 4 starts in 5 and 28 points from 0.36 xGI/90.*
- **Differentials:** Le Fée (SUN, £5.7m, 3.3%), Tavernier (BOU), Schade, Josh King (FUL),
  **Bobby Thomas (COV, £4.0m, 8.6%)**, Tarkowski, Affengruber. *Two of these (Le Fée,
  Thomas) are in the draft, found by the model first and the community second.*
- **Hot topics:** "Wildcard timing", "Price rises/falls".

---

## Analysis

### Method: the GW3 model, rebuilt for six weeks

```
xPts per fixture = P(start) × [ 2 (appearance)
                 + (xG90 × goal_value + xA90 × 3) × attack_mult
                 + P(CS) × cs_value − 0.5 × λ_against (GK/DEF)
                 + 2 × P(DC threshold)
                 + saves (GK) + bonus ]

λ_against   = league mean × own xGA factor × opponent xGF factor × (0.9 home / 1.1 away)
P(CS)       = exp(−λ_against)
attack_mult = opponent xGA factor × (1.1 home / 0.9 away)
P(DC)       = 0.5 + 1.5 × (DC90 / threshold − 1), clamped to [0.03, 0.8]
P(start)    = minutes / 450, × flag; João Pedro 0.25 (GW6) / 0.55 (GW7), Semenyo 0.70 (Guéhi's 0.85 was based on the wrong withdrawal story; at 1.0 his GW6-11 is 21.5 instead of 21.1, still a sale)
```

Summed over GW6-11, then a mixed-integer optimiser picks the best 15, XI and captain under
the real budget (£99.5m with selling prices for owned players), 2/5/5/3, three per club,
**the minutes gate as a hard constraint** (300+ minutes, 4+ starts, status `a` for every
new player: GW4 adjustment #2) and **the hedging rule as a hard constraint for GW6, 7
and 8** (no owned attacker against an owned GK/DEF).

Robustness, as in GW3: run on raw rates, on 50% and 80% regression, and with a "friction"
charge of 0, 2 and 4 points on every new player to price the winner's curse.

| Variant | Wildcard − best 1 FT (GW6-11) | Kept | In every variant |
|---|---|---|---|
| Raw, no friction | +50.3 | 4 | Haaland, B.Fernandes, Mbeumo, Barry, Raya |
| 50% regressed, no friction | +42.8 | 4 | same |
| 80% regressed, no friction | +43.2 | 2 | Haaland, Mbeumo, Raya |
| 50% regressed, **4 pts friction per new player** | **+16.2** | 6 | Haaland, B.Fernandes, Mbeumo, Barry, Raya |
| 80% regressed, 4 pts friction | +15.2 | 5 | same |

**The wildcard wins in every variant**, by between 15 and 50 points over six gameweeks.
And **Haaland is in every single draft**, including the most heavily regressed and the
most friction-loaded.

### The finding that decided the week: Haaland is no longer a value trap

GW3's finding was that every player above £9m is worse value than everything below it,
and Haaland the worst of all (1.59 points per £m). The build has been Haaland-less since
GW1 on that basis. Three things have changed:

1. **The armband.** The optimiser picks a captain each week, and over GW7-11 Haaland's
   run (IPS H, AVL H, BHA H, NFO a, FUL H) is the best armband run in the game. Most of
   his value is the second multiplier, not the first.
2. **The alternative is weaker.** The best Haaland-less wildcard (Saka in) scores **8.4
   points worse** over six weeks.
3. **Effective ownership.** He is **73.9% owned** and has been the most-captained
   player in all five gameweeks. The armband ledger is +4 after five weeks of fading him;
   the evidence for the fade is now level, and the fade costs a double hit every time he
   hauls.

This is a deliberate reversal of the season's defining build decision and it is
stated as one.

### The wildcard draft

| Pos | Player | Team | £ | Min / starts | GW6 | xPts GW6 | xPts GW6-11 | Own | |
|---|---|---|---|---|---|---|---|---|---|
| GK | **Raya** | ARS | 6.0 | 450 / 5 | LEE (H) | 3.9 | 23.2 | 42.4% | keep |
| GK | Dubravka | TOT | 4.0 | 0 / 0 | | 0 | 0 | 17.1% | keep (bench) |
| DEF | **Murillo** | NFO | 5.5 | 449 / 5 | CRY (a) | 4.8 | 27.3 | 2.1% | **new** |
| DEF | **Thomas** | COV | 4.0 | 437 / 5 | NEW (H) | 4.9 | 26.5 | 8.6% | **new** |
| DEF | **Branthwaite** | EVE | 5.5 | 450 / 5 | HUL (a) | 4.3 | 25.7 | 2.5% | **new** |
| DEF | **Ajer** | BRE | 4.5 | 450 / 5 | AVL (a) | 4.4 | 24.8 | 3.9% | **new** |
| DEF | Hall | NEW | 5.2 | 449 / 5 | COV (a) | 3.9 | 23.6 | 17.7% | keep |
| MID | **Mbeumo** | MUN | 7.9 | 450 / 5 | TOT (H) | 5.6 | 31.4 | 20.5% | keep |
| MID | **B.Fernandes** | MUN | 11.9 | 450 / 5 | TOT (H) | 5.5 | 30.8 | 38.4% | keep |
| MID | **Janelt** | BRE | 5.0 | 450 / 5 | AVL (a) | 4.9 | 28.9 | 2.5% | **new** |
| MID | **Le Fée** | SUN | 5.7 | 438 / 5 | BHA (H) | 5.1 | 28.8 | 3.3% | **new** |
| MID | Gomez | BHA | 5.0 | 433 / 5 | SUN (a) | 3.7 | 22.2 | 3.9% | keep |
| FWD | **Haaland** | MCI | 15.6 | 450 / 5 | LIV (a) | 5.1 | **34.7** | 73.9% | **new** |
| FWD | **Thiago** | BRE | 7.8 | 442 / 5 | AVL (a) | 4.9 | 29.0 | 9.2% | **new** |
| FWD | **Barry** | EVE | 5.6 | 417 / 5 | HUL (a) | 4.6 | 28.7 | 8.4% | keep |

**Cost £99.2m, £0.3m ITB.** Clubs: BRE 3, MUN 2, EVE 2, one each of ARS, TOT, NFO, COV,
NEW, SUN, BHA, MCI. **Kept 7 of 15.** Eight moves, all through the minutes gate, none of
them flagged.

**Out:** Gabriel, Calafiori, Guéhi, Mitchell, Semenyo, Gibbs-White, João Pedro, Obi.

How the draft was finished, and what each judgement cost on the model:

- **Hall and Gomez kept** (adjustments #2 and #7): -0.7 and -0.3 over six weeks.
- **Silva (BOU) and Muharemović (LEE) removed by the hedging rule** in GW7 (Le Fée at
  Bournemouth; MUN at Leeds). Extending the rule from GW6 to GW6-8: **-2.9.**
- **Botman removed** to stop four of our players sitting in the same COV v NEW fixture
  (Hall, Botman against Thomas and a COV keeper): **-0.8.** Dasilva (third COV defender)
  removed for the same reason.
- **Dubravka kept over Rushworth, and a third COV defender (Dasilva) ruled out:** -1.7
  together, most of it the model's 10% bench weight on a reserve keeper who only plays if
  Raya misses. Frees £0.5m.

The cheap defenders are the least certain part of it. Murillo (23 points), Branthwaite
(27), Thomas (24) and Ajer (21) are DC-threshold players with modest totals; the model
likes them for **DC90 of 10-12** on teams with good underlying defences. Between them and
the points leaders the gap is one to three points over six weeks, which is noise. The
like-for-like swaps if you prefer the names (model cost over GW6-11, hedging checked):

| Instead of | Take | £ change | Model cost |
|---|---|---|---|
| Murillo | Tarkowski (EVE, 43 pts, makes EVE×3) | +0.7 | -2.4 |
| Janelt | Groß (BHA, 47 pts, 29.8% owned, makes BHA×2) | +0.9 | -2.7 |
| Thiago | Calvert-Lewin (LEE, 24.7% owned) | -1.8 | -1.9 |
| Branthwaite | Gvardiol (MCI, 26.9% owned, makes MCI×2) | +0.2 | -6.9 |

**Thiago is the one pick to watch.** 0.64 xG/90 and **10 points**, the biggest
underperformer in the game. GW3 learning #4: that is a reason to expect regression, not
a guarantee. Calvert-Lewin is the lower-variance version for £1.8m less.

### The case against the wildcard (adjustment #1)

| Argument | Weight |
|---|---|
| **It spends the first-half wildcard at GW6**, leaving GW7-19 to FTs. | Real, but there is no DGW/BGW in the first half to save it for, and the Free Hit is still there for an emergency week. The problems it fixes are now: a 25% captain-tier forward, a doubt at Anfield, a loanee, a 74%-owned striker we do not own |
| **Model error.** The optimiser picks the maximum of noisy estimates. | Priced: with 4 points of friction on every new player the gain is still **+15 over six weeks**. It shrinks, it never turns |
| **João Pedro comes back later in October at 64.7% owned** and we will not own him. | Real EO risk for the weeks after his return. He is 25% for GW6, Chelsea then play EVE (a) and TOT (H). If he returns hot, he is one FT away |
| **ARS×3 is broken up**, and Arsenal have the best underlying defence by a distance. | Raya stays. Gabriel (£8.0m) and Calafiori score 25.6 and 23.0 on the model, behind four cheaper defenders. The block has shown both faces (29, 3) |
| **Semenyo just scored 17.** | 0.30 xGI/90; the 17 came from 0.33 xGI. He is a 75% doubt at Anfield. GW5 adjustment #4 says do not chase it |
| **The squad just beat the average by 10.** | On structure, with a captain and an ARS block that returned 7 from four slots. The structure survives the wildcard: the bench still branches |
| **Haaland at Anfield in his first week.** | The worst fixture of his next six. He is bought for GW7-11, and his GW6 is covered by the captaincy going elsewhere |

**Call: play the wildcard.** None of the arguments against it changes sign under any
model variant, and the GW5 chip rule (fewer than ten kept) is not close. For the draft as
finished below (after the hedging and keep judgements): **+44 against rolling and +36
against the best single transfer** over GW6-11, and still **+12 and +8** with 4 points of
friction on every new player.

### The captaincy, from scratch (adjustments #3 and #4)

| Candidate | GW6 | xGI/90 | Attacking xP (goals + assists) | Total xP (raw / 50% reg) | Own |
|---|---|---|---|---|---|
| **B.Fernandes** | MUN (H) v TOT | 0.77 | **2.55** | **6.80 / 5.50** | 38.4% |
| Mbeumo | MUN (H) v TOT | 0.77 | 2.66 | 7.03 / 5.61 | 20.5% |
| Haaland | MCI (a) at LIV | **0.99** | 2.45 | 5.85 / 5.07 | 73.9% |
| Le Fée | SUN (H) v BHA | 0.70 | 2.40 | 6.19 / 5.09 | 3.3% |
| Thiago | BRE (a) at AVL | 0.67 | 2.33 | 5.17 / 4.90 | 9.2% |
| Barry | EVE (a) at HUL | 0.79 | 2.18 | 5.05 / 4.60 | 8.4% |

**Captain B.Fernandes, vice Haaland.**

- **MUN v TOT is the fixture of the week for attackers.** Tottenham have the
  second-worst underlying attack (1.00 xG a game, 2 goals in five) and concede 1.56 xG.
  United are third in the league on xG. The two United players are level on xGI/90
  (0.77 each) and within 0.2 on every total; B.Fernandes over Mbeumo on **penalties and
  set pieces**, which is where the bonus sits.
- **Adjustment #3, read literally, says Haaland** (xGI/90 0.99 v 0.77, a gap over 0.1).
  **Overridden, and why:** the rule was written to stop a four-game *results* table from
  overruling a player's underlying numbers. The gap here is not a results read. It is
  venue plus the opponent's *underlying* defence (Liverpool, 1.22 xGA a game, third-best),
  and once those are in, the attacking expectation is level (2.45 v 2.55) and United's
  total is higher. The community agrees (RotoWire #1, poll 23-19).
- **Effective ownership, stated plainly.** The field's captaincy is split between
  B.Fernandes and Haaland this week. Owning Haaland caps the downside: if he hauls at
  Anfield we have him once against the field's roughly 1.2-1.4×. Captaining B.Fernandes
  (38.4% owned) is the upside play: if he hauls we have him twice against the field's
  roughly 0.5-0.6×. Template players we will **not** own: João Pedro (64.7%, 25% to
  play), Calafiori (50.6%), **Rogers (40.8%, CHE v BOU)**, Szoboszlai (32.5%), **Groß
  (29.8%)**, Cherki, De Cuyper, Gvardiol.
- **Never the incumbent by default.** Gibbs-White (GW5 captain) is sold.

### The XI: 3-4-3, and the bench

Raya; Murillo, Thomas, Branthwaite; Mbeumo, B.Fernandes, Janelt, Le Fée; Haaland, Thiago,
Barry.

**Bench: Dubravka → Ajer → Hall → Gomez.** A defender goes first so any absence in a
back three autosubs legally; Ajer (4.4) over Hall (3.9) on GW6 xP, both 450 minutes.
Gomez last: he is a midfielder in a 3-4-3 with four nailed midfielders ahead of him.

No starter in the XI carries a flag, so the doubtful-starter rule (adjustment #5) has
nothing to branch on.

### Hedging check

| GW | Clash | Price |
|---|---|---|
| 6 | B.Fernandes, Mbeumo v **Dubravka** (TOT) | Zero unless Raya misses. Dubravka has never played |
| 7 | none | |
| 8 | **Barry at ARS v Raya** | Bench decision in GW8 |
| 9 | Janelt, Thiago v Murillo; Le Fée v Thomas; Barry v Hall | Three clashes. A GW9 FT problem, flagged now |

### Chips

- **Wildcard: play it now.** Argued above.
- **Triple Captain:** the new squad's TC week is **Haaland v Ipswich at home in GW7**
  (Ipswich concede 1.78 xG a game, 11 goals in five). Not this week: GW6 has nobody in a
  TC fixture. **The GW7 evaluation should argue TC Haaland v IPS on its own model.**
- **Bench Boost:** closer than it has been. Ajer, Hall and Gomez all play; the fourth slot
  is Dubravka (0 minutes). One move (Dubravka → a playing £4.0-4.5m keeper) makes the
  chip live. Not before a good double-fixture week or the best bench fixture week.
- **Free Hit:** no DGW/BGW in sight. Held as the in-season emergency now that the
  wildcard is spent.

---

## Proposal

### Revised 2026-10-09: version B, executed

Snorre read the proposal page and pushed back on two things: the draft sold too many
players who had just delivered (the eight sold had 202 points between them, the eight
bought 190), and B.Fernandes had scored 2, 2, 2, 2 since his GW2 haul. Both are fair
against the model, which rates on xG, xA and DC and ignores points scored.

Re-solved with his agreements fixed (Thiago, Haaland, Branthwaite, Mbeumo, Barry, Hall,
Gomez) and Gabriel, Guéhi and Gibbs-White kept. With Haaland bought, the money for those
three has to come from B.Fernandes: keeping all of them alongside B.Fernandes is
infeasible. Same model, Guéhi at 1.0:

| | GW6 XI calc | GW6-11 calc (page) | New players |
|---|---|---|---|
| A (below) | 59.1 | 349.7 | 8 |
| **B** | **57.4** | **344.1** | **6** |

B is 1.7 lower in GW6 and 5.6 lower over six weeks, and buys two fewer players; at the
4-points-per-new-player friction used for the wildcard case, the two come out even. B
adds two clashes A did not have: Gibbs-White v Raya and Gabriel (NFO v ARS, GW7), and
Barry v Gabriel (EVE v ARS, GW8; Barry v Raya was already in A). Semenyo goes in both:
75% doubt, Anfield, and keeping him means selling Raya. Captain Haaland: GW6 is a coin
flip on the model (B.Fernandes 5.5 v Haaland 5.1, moot once B.Fernandes is sold) and
over six weeks Haaland leads.

**Executed from this session at 11:36 UTC on Snorre's "Execute plan B please"**, the
wildcard sent with the transfers in one request: `transfers.made` 0, wildcard
`active` for GW6, no hit. Prices were unchanged since the page was built.

- **Six transfers:** Calafiori → Thomas, Mitchell → Branthwaite, Semenyo → Janelt,
  B.Fernandes → Le Fée, João Pedro → Haaland, Obi → Thiago. Bank £0.2m.
- **3-4-3:** Raya; Thomas, Branthwaite, Gabriel; Mbeumo, Janelt, Le Fée, Gibbs-White;
  Haaland, Thiago, Barry.
- **Captain Haaland, vice Mbeumo.** Bench: Dubravka, Hall, Guéhi, Gomez.

Version A, as proposed on 2026-10-07, follows unchanged so the post-mortem can score
both.

### Do this in the app (version A, superseded)

1. **Play the Wildcard** (Transfers → Wildcard). Do this first, then make the moves: no
   points are deducted on a wildcard.
2. **Eight transfers:**
   - Gabriel → **Murillo** (NFO)
   - Calafiori → **Thomas** (COV)
   - Guéhi → **Branthwaite** (EVE)
   - Mitchell → **Ajer** (BRE)
   - Semenyo → **Janelt** (BRE)
   - Gibbs-White → **Le Fée** (SUN)
   - João Pedro → **Haaland** (MCI)
   - Obi → **Thiago** (BRE)

   Bank after: **£0.3m**. If a price rise lands first and the money is short, swap Thiago
   for **Calvert-Lewin** (LEE, £6.0m): -1.9 on the model, £1.8m freed.
3. **Formation 3-4-3:** Raya; Murillo, Thomas, Branthwaite; Mbeumo, B.Fernandes, Janelt,
   Le Fée; Haaland, Thiago, Barry.
4. **Captain: B.Fernandes. Vice: Haaland.**
5. **Bench order:** Dubravka, Ajer, Hall, Gomez.
6. **Friday pressers to check** (not a reason to wait): City on Haaland (subbed at 67'
   for Norway, "exhaustion"); United on B.Fernandes. If either is ruled out, swap the
   armband to Mbeumo.

### Transfers

| OUT | £ (sell) | IN | £ |
|---|---|---|---|
| Gabriel (ARS, DEF) | 8.0 | **Murillo** (NFO, DEF) | 5.5 |
| Calafiori (ARS, DEF) | 5.8 | **Thomas** (COV, DEF) | 4.0 |
| Guéhi (MCI, DEF) | 6.0 | **Branthwaite** (EVE, DEF) | 5.5 |
| Mitchell (CRY, DEF) | 4.5 | **Ajer** (BRE, DEF) | 4.5 |
| Semenyo (MCI, MID) | 8.4 | **Janelt** (BRE, MID) | 5.0 |
| Gibbs-White (NFO, MID) | 8.0 | **Le Fée** (SUN, MID) | 5.7 |
| João Pedro (CHE, FWD) | 7.6 | **Haaland** (MCI, FWD) | 15.6 |
| Obi (MUN, FWD) | 4.5 | **Thiago** (BRE, FWD) | 7.8 |
| | **52.8** | | **53.6** |

Cost: **0 (wildcard)**. Bank £1.1m → **£0.3m**.

### Projected XI (3-4-3)

| Pos | Player | Team | £m | GW6 | xPts |
|---|---|---|---|---|---|
| GK | Raya | ARS | 6.0 | LEE (H) | 3.9 |
| DEF | Murillo | NFO | 5.5 | CRY (a) | 4.8 |
| DEF | Thomas | COV | 4.0 | NEW (H) | 4.9 |
| DEF | Branthwaite | EVE | 5.5 | HUL (a) | 4.3 |
| MID | Mbeumo | MUN | 7.9 | TOT (H) | 5.6 |
| MID | **B.Fernandes (C)** | MUN | 11.9 | TOT (H) | 5.5 |
| MID | Janelt | BRE | 5.0 | AVL (a) | 4.9 |
| MID | Le Fée | SUN | 5.7 | BHA (H) | 5.1 |
| FWD | **Haaland (V)** | MCI | 15.6 | LIV (a) | 5.1 |
| FWD | Thiago | BRE | 7.8 | AVL (a) | 4.9 |
| FWD | Barry | EVE | 5.6 | HUL (a) | 4.6 |

**Model XI with the armband: about 59 expected points.**

**Bench:** Dubravka (GK) → Ajer (DEF, 450 min) → Hall (DEF, 449 min) → Gomez (MID, 433 min).

**Projected state after:** £99.2m squad, £0.3m ITB. Since 2024/25 a wildcard does not burn
saved FTs, so the current FT should carry and GW7 should open with **2 FTs**; confirm on
`budget.free_transfers` at GW7. BRE×3, MUN×2, EVE×2. Chips left: TC, BB, FH (first half).

### Zero-transfer alternative

Roll the FT (2 for GW7), hold the wildcard. XI 4-5-1: Raya; Gabriel, Calafiori, Guéhi,
Hall; B.Fernandes (C), Mbeumo (V), Gibbs-White, Gomez, Semenyo; Barry. Bench Dubravka,
**Mitchell**, João Pedro, Obi.

Adjustment #5 applied to it: Semenyo (75%, lineup after the deadline) can only start if
the first bench player is legal and unhedged. Mitchell is legal (5-4-1) but **is hedged:
CRY v NFO puts him against Gibbs-White**. There is no clean answer in this squad, which
is itself part of the case for the wildcard; the alternative accepts the hedge on the
autosub branch.

**Expected cost: about 7 to 8 points in GW6** (model XI ~51 against ~59), and **about 44
over GW6-11** on the model; **about 12** after charging each of the eight new players 4
points of model error.

*Middle line, if you will not wildcard:* 1 FT, João Pedro → Thiago (£7.6m → £7.8m, bank
£0.9m). Worth about +8 over six weeks against rolling, and it keeps the wildcard.

### Chip strategy
**Wildcard, GW6.** TC, BB and FH remain, all expiring **GW19**. TC Haaland v IPS (GW7)
is the first thing the GW7 evaluation should argue.

---

## Decision

**Wildcard, 6 transfers, no hit. Version B, exactly as revised.**

| OUT | £ (sell) | IN | £ |
|---|---|---|---|
| Calafiori (ARS, DEF) | 5.8 | **Thomas** (COV, DEF) | 4.0 |
| Mitchell (CRY, DEF) | 4.5 | **Branthwaite** (EVE, DEF) | 5.5 |
| Semenyo (MCI, MID) | 8.4 | **Janelt** (BRE, MID) | 5.0 |
| B.Fernandes (MUN, MID) | 11.9 | **Le Fée** (SUN, MID) | 5.7 |
| João Pedro (CHE, FWD) | 7.6 | **Haaland** (MCI, FWD) | 15.6 |
| Obi (MUN, FWD) | 4.5 | **Thiago** (BRE, FWD) | 7.8 |
| | **42.7** | | **43.6** |

All six stamped 2026-10-09 11:36:56 UTC in `entry/5047923/transfers/`. Confirmed after the
deadline on the public `entry/5047923/event/6/picks/` and on `get_my_squad`
(authenticated, not stale): `active_chip: wildcard`, `event_transfers: 0`,
`event_transfers_cost: 0`, `bank: 2` (£0.2m). Every id matches the lock snapshot.

**Captain: Haaland** (MCI at LIV, FDR 4). **Vice: Mbeumo** (MUN v TOT, FDR 2).
**Chip: Wildcard.**

### Starting XI (3-4-3)
| Pos | Player | Team | £m | GW6 | FDR |
|---|---|---|---|---|---|
| GK | Raya | ARS | 6.1 | LEE (H) | 3 |
| DEF | **Thomas** | COV | 4.0 | NEW (H) | 3 |
| DEF | **Branthwaite** | EVE | 5.5 | HUL (a) | 2 |
| DEF | Gabriel | ARS | 8.0 | LEE (H) | 3 |
| MID | **Mbeumo (V)** | MUN | 7.9 | TOT (H) | 2 |
| MID | **Janelt** | BRE | 5.0 | AVL (a) | 3 |
| MID | **Le Fée** | SUN | 5.7 | BHA (H) | 3 |
| MID | Gibbs-White | NFO | 8.0 | CRY (a) | 3 |
| FWD | **Haaland (C)** | MCI | 15.6 | LIV (a) | 4 |
| FWD | **Thiago** | BRE | 7.8 | AVL (a) | 3 |
| FWD | Barry | EVE | 5.7 | HUL (a) | 2 |

**Bench:** Dubravka (GK, TOT at MUN) → **Hall** (DEF, NEW at COV, FDR 2) → **Guéhi** (DEF,
MCI at LIV, FDR 4) → Gomez (MID, BHA at SUN, FDR 3). Two defenders first, so any absence in
the back three autosubs legally; every outfield bench player is `a` with 433+ minutes.

**Final state:** £99.6m squad at current prices, **£0.2m ITB**. ARS×2, EVE×2, BRE×2,
MCI×2, one each of COV, MUN, SUN, NFO, TOT, NEW, BHA. Chips left: BB, TC, FH (first half,
expire GW19). `free_transfers` reads 1 after the deadline; GW7 should open with 2, confirm
then.

### Proposal vs decision

**Against the proposal as it stood at the deadline (version B): matched, 5 of 5**
(transfers, captain, vice, XI, chip), bench order identical too. B was executed from the
research session on Snorre's explicit instruction, quoted from
[c1747](https://acp.go.vongohren.me/?c=c1747): *"So you just go for B and you can make the
transfers because you have the capabilities. I want you to set the whole team up and make
sure the wildcard is triggered before the transfer so we don't get any hits please.
Execute plan B please"*.

**Against version A as first proposed on 2026-10-07: partly followed.** Four of A's eight
moves were made as written (Calafiori → Thomas, Semenyo → Janelt, João Pedro → Haaland,
Obi → Thiago), Branthwaite and Le Fée came in for different players (Mitchell and
B.Fernandes, not Guéhi and Gibbs-White), and Gabriel → Murillo and Mitchell → Ajer were
not made. The armband went to **Haaland, not B.Fernandes**, vice **Mbeumo, not Haaland**,
and the bench is Hall and Guéhi where A had Ajer and Hall. The reason is Snorre's feedback
on the proposal page, as the research session summarised it (his own words are not in the
session transcript): A sold too many players who were scoring (the eight out had 202
points, the eight in 190), and B.Fernandes had scored 2, 2, 2, 2 since his GW2 haul. Both
are points-scored arguments the model does not read. B is 1.7 lower in GW6 and 5.6 lower
over GW6-11 on the model, even with A after 4 points of friction per new player.

---

## Accepted risks

- **Haaland's first week is Anfield**, the worst fixture of his next six. He is bought
  for GW7-11 and is not the captain this week.
- **The captain is not the most-owned player.** If Haaland hauls and B.Fernandes blanks,
  we still have Haaland once, so the swing is smaller than any week of the season so far.
- **Four cheap DC defenders** (Murillo 23 pts, Thomas 24, Branthwaite 27, Ajer 21) over
  the points leaders. The model likes their DC90; their totals are modest and the edge is
  one to three points over six weeks.
- **Thiago's 10 points from 0.64 xG/90.** Bought on underlying. Calvert-Lewin is the
  lower-variance version.
- **BRE×3** (Ajer, Janelt, Thiago) and **MUN×2 in the captain's fixture**: positive
  concentration. United have no clean sheet in five, but United's defence is not in the
  squad.
- **João Pedro sold at 64.7% owned** before his return. He comes back later in October.
- **£0.3m ITB.** A price rise on Haaland (90k transfers in this round) or Thiago (71k)
  before the moves are made can make the draft unaffordable. Fallback in the checklist.
- **The hedging rule cost 2.9 points** over six weeks by removing Silva and Muharemović,
  written down per GW4 adjustment #5.

---

## Armband ledger (GW1 learning #4)

| GW | Our captain | Pts (x2) | Field's captain | Pts (x2) | Swing | Cumulative |
|---|---|---|---|---|---|---|
| 1 | B.Fernandes | 2 (4) | Haaland | 2 (4) | 0 | 0 |
| 2 | B.Fernandes | 23 (46) | Haaland | 13 (26) | **+20** | +20 |
| 3 | B.Fernandes | 2 (4) | Haaland | 9 (18) | **-14** | **+6** |
| 4 | João Pedro | 12 (24) | Haaland *(MUN away, FDR 4)* | 9 (18) | **+6** | **+12** |
| 5 | Gibbs-White | 2 (4) | Haaland *(SUN home, FDR 2)* | 6 (12) | **-8** | **+4** |
| 6 | **Haaland** *(LIV away, FDR 4; A proposed B.Fernandes)* | | Haaland *(`most_captained` 411 after the deadline)* | | **0** *(same player)* | **+4** |

First week of the season in which **we own the field's captain, and captain him**.
`bootstrap-static` confirms `most_captained: 411` after the deadline, so GW6 is a
zero-swing week by construction. The armband call that the ledger cannot see is Haaland
against B.Fernandes (sold) and Mbeumo; that one is scored in the watch flags.

---

## Watch flags for GW6

- [ ] **B against A (the human's call against the model's).** Score version A (8 moves,
      XI with Murillo and B.Fernandes, captain B.Fernandes, bench Ajer first) against B
      as played, GW6 and running to GW11. Calc says A +1.7 in GW6, +5.6 over six weeks,
      even after friction. Did keeping the scorers pay?
- [ ] **B.Fernandes sold, Gibbs-White kept** (A did the opposite). Their GW6-11 points
      side by side.
- [ ] **Gabriel kept over Murillo.** GW6-11 points; A priced Gabriel at 25.6 against
      Murillo's 27.3.
- [ ] **Guéhi kept over Ajer.** Guéhi sits third on the bench at Anfield; Ajer would have
      been first bench at Villa. Points, and whether either would have come on.
- [ ] **The wildcard against the zero-transfer alternative.** Score the written-down
      alternative (4-5-1 above, Mitchell first bench, captain B.Fernandes) against the
      actual results. Estimated: -7 to -8 in GW6. The six-week number (+44 on the model,
      +12 after friction) is the one that matters; carry a running total to GW11.
- [ ] **Haaland's first week.** Points at Anfield, and minutes after the Norway sub.
- [ ] **The armband: Haaland (C) against B.Fernandes (A's captain, sold) and Mbeumo (V).**
      Haaland (x2) against each of them (x2). The model had B.Fernandes 5.5 v Haaland 5.1
      for GW6; the decision captained the six-week leader.
- [ ] **The DC defenders.** Thomas and Branthwaite (B), Murillo and Ajer (A only): how many cleared the DC
      threshold, and how many clean sheets? Against Tarkowski, Gvardiol, De Cuyper.
- [ ] **Thiago over Calvert-Lewin.** Straight comparison, priced at -1.9.
- [ ] **Groß and Rogers, not owned.** 29.8% and 40.8%. What did they score?
- [ ] **João Pedro.** Did he play against Bournemouth? The 25% read against the API's 75%.
- [ ] **Semenyo at Anfield (sold).** Did he play, and what did he score?
- [ ] **The bench: Hall, Guéhi, Gomez.** Did any of them outscore a starter, and did an
      autosub fire?
- [ ] **B's extra clashes.** Gibbs-White v Raya and Gabriel (NFO v ARS, GW7) and Barry v
      Gabriel (EVE v ARS, GW8): what each one cost or saved, for the GW7 and GW8 logs.

---

## Outcome

*To be filled in after GW6 finalises. Respect the finalisation gate from GW1:*
*`events[5].finished = true`, `data_checked = true`, and `automatic_subs` populated.*
*Per GW4 adjustment #6, check the live `bootstrap-static` endpoint, not `get_fixtures.is_finished`.*

**Actual points:**
**Overall rank:**
**GW rank:**
**Season total:**
**Most captained in the game:**

| Player | Min | Pts | Notes |
|---|---|---|---|
| Raya | | | |
| Thomas | | | |
| Branthwaite | | | |
| Gabriel | | | |
| Mbeumo (V) | | | |
| Janelt | | | |
| Le Fée | | | |
| Gibbs-White | | | |
| Haaland (C) | | | |
| Thiago | | | |
| Barry | | | |
| *Bench: Dubravka* | | | |
| *Bench: Hall* | | | |
| *Bench: Guéhi* | | | |
| *Bench: Gomez* | | | |

### Flag outcomes

- [ ] B against A:
- [ ] B.Fernandes sold, Gibbs-White kept:
- [ ] Gabriel kept over Murillo:
- [ ] Guéhi kept over Ajer:
- [ ] The wildcard against the zero-transfer alternative:
- [ ] Haaland's first week:
- [ ] The armband:
- [ ] The DC defenders:
- [ ] Thiago over Calvert-Lewin:
- [ ] Groß and Rogers, not owned:
- [ ] João Pedro:
- [ ] Semenyo at Anfield:
- [ ] The bench:
- [ ] B's extra clashes:

---

## Learnings

### What we got right

### What we got wrong

### Gut calibration

### Adjustments for next time

### Chip planning notes
