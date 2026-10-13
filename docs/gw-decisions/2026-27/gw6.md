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
| 6 | **Haaland** *(LIV away, FDR 4; A proposed B.Fernandes)* | 6 (12) | Haaland *(`most_captained` 411 after the deadline)* | 6 (12) | **0** *(same player)* | **+4** |

First week of the season in which **we own the field's captain, and captain him**.
`bootstrap-static` confirms `most_captained: 411` after the deadline, so GW6 is a
zero-swing week by construction. The armband call that the ledger cannot see is Haaland
against B.Fernandes (sold) and Mbeumo; that one is scored in the watch flags.

**Finalised:** Haaland 6 (12) against Haaland 6 (12), zero swing as built, cumulative
**+4**. The armband call the ledger cannot see, Haaland against B.Fernandes, was **+10**.

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

**Actual points: 49** (gross 49, no hit on the wildcard, net 49; bench **11**) · **GW average: 58** · **Highest score: 131**
**Overall rank: 3,420,647** (down from 2,376,841, **-1,043,806 places**)
**GW rank:** 8,027,230 · **Season total: 373**
**Most captained in the game:** Haaland (6 pts, x2 = 12), and ours too

Finalisation gate confirmed before writing, on the live `bootstrap-static` endpoint per
GW4 adjustment #6: `events[5].finished = true`, `data_checked = true`. `automatic_subs`
is **empty** on `entry/5047923/event/6/picks/`, because all eleven starters played.
`entry/5047923/history/` agrees on every field: `points: 49`, `total_points: 373`
(324 + 49), `event_transfers: 0`, `event_transfers_cost: 0`, `points_on_bench: 11`,
`bank: 2`, `value: 998`, `active_chip: wildcard`.

| Player | Min | Pts | Notes |
|---|---|---|---|
| Raya | 90 | 3 | Conceded 1, 4 saves (+1). 0.62 xGC. ARS 2-1 LEE |
| **Thomas** | 90 | 4 | **DC 22 banked** (+2), more than double the threshold. Conceded 1 from 1.84 xGC, no clean sheet. COV 4-1 NEW |
| **Branthwaite** | 90 | 3 | **DC 10 banked** (exactly the threshold, +2). Conceded 2, -1. HUL 2-2 EVE |
| Gabriel | 90 | **2** | Appearance only. **DC 5, missed.** Conceded 1, no clean sheet |
| Mbeumo (V) | 90 | **8** | **Goal from 0.24 xG** + 1 bonus. MUN 1-1 TOT. Best in the XI |
| **Janelt** | 90 | 3 | **DC 14 banked** (+2), yellow (-1). AVL 2-2 BRE |
| **Le Fée** | 80 | 2 | Appearance only. 0.25 xA, no return. SUN 0-2 BHA |
| Gibbs-White | 90 | 2 | Appearance only. 0.45 xA. DC 8. CRY 3-1 NFO |
| **Haaland (C)** | 79 | **6 x2 = 12** | **Goal from 0.40 xG**, no bonus (bps 30). LIV 0-3 MCI. Subbed at 79 |
| **Thiago** | 90 | 4 | Assist (3), yellow (-1). 0.07 xG, 0.13 xA. AVL 2-2 BRE |
| Barry | 85 | 6 | **Goal from 0.90 xG.** HUL 2-2 EVE |
| *Bench: Dubravka* | 0 | 0 | Sixth week without a minute |
| *Bench: Hall* | 90 | **0** | **Conceded 4** (-2). DC 6, missed. COV 4-1 NEW |
| *Bench: Guéhi* | 90 | **6** | **Clean sheet at Anfield** (+4). DC 4 |
| *Bench: Gomez* | 87 | **5** | Clean sheet (+1) + **DC 19 banked** (+2). SUN 0-2 BHA |

**No autosub fired.** All eleven starters played, so the bench was never reached, and
it was the best bench of the season: **11**, Guéhi 6 and Gomez 5, both outscoring six of
the starters. The first bench slot (Hall) was the one that returned 0.

XI total **49**, no hit. **Nine below the average, -1,043,806 places**, the first week
below the average since GW1 and the largest rank drop of the season. The XI
had no failure in it worth the name: every starter played, nine of eleven returned 2 to
4, and the captain scored. What it did not have was the template. The players the field
owned and we did not returned **55 between them**: João Pedro 12 (69.4% owned, sold in
the wildcard), De Cuyper 15 (34.9%), Cherki 10 (31.3%), Calafiori 9 (52.2%, sold),
Rogers 9 (44.8%). Two of those five were ours on Friday.

### Where the points went (added 2026-10-13, after Snorre asked why)

The top 50 of the overall league averaged **85** this week (44 of them with no chip), the
nplol rivals **71**, the Schrödingers Glass rivals **60**. Team TH scored 89 and
Overtenningsklubben 88 with no chip and no hit. Read against the top 50's effective
ownership (share who fielded him, captain twice), times his points:

| Player | Club | Pts | Top-50 EO | Ours | Gap | Mini-league rivals who had him |
|---|---|---|---|---|---|---|
| De Cuyper | BHA | 15 | 94% | 0 | **-14.1** | 6 of 17 |
| João Pedro | CHE | 12 | 116% | 0 *(sold)* | **-13.9** | 10 of 17 |
| Calafiori | ARS | 9 | 94% | 0 *(sold)* | -8.5 | 15 of 17 |
| Rogers | CHE | 9 | 86% | 0 | -7.7 | 11 of 17 |
| Palmer | CHE | 8 | 84% | 0 | -6.7 | 7 of 17 |
| Groß | BHA | 6 | 94% | 0 | -5.6 | 10 of 17 |
| Verbruggen | BHA | 9 | 42% | 0 | -3.8 | 4 of 17 |
| Mbeumo | MUN | 8 | 24% | 1 | +6.1 | 3 of 17 |
| Barry | EVE | 6 | 16% | 1 | +5.0 | 2 of 17 |
| Haaland | MCI | 6 | 126% | 2 | +4.4 | 17 of 17 |

**By club: Chelsea -28, Brighton -24.** The top 50 fielded 2.3 Chelsea and 2.4 Brighton
players a team; we fielded **none of either** (Gomez, our one Brighton player, was on the
bench). CHE 5-1 BOU and SUN 0-2 BHA were the two results of the week, and the whole of
the gap to the elite is in those two fixtures plus Calafiori.

**Where the read went wrong, in order of cost:**

1. **The stale-flag rule removed two of the three Chelsea template players.** João Pedro
   (`d` 75%, news from 09-16) was read as 25% and sold; Palmer (`d` 75%, news from 09-21)
   failed the gate "on status" in the community cross-check. Both played: 12 and 8. The
   rule (GW5 adjustment #6) was written after one week and applied to two players it was
   never tested on.
2. **Rogers was listed and never priced.** 40.8% owned, CHE at home to Bournemouth,
   named under "template players we will not own" and given no number.
3. **The model read Brighton's defence as bad** (1.73 xGA a game, the worst in our table) and so never looked at De Cuyper and Groß. They are not clean-sheet picks: De
   Cuyper scored and took 3 bonus, Groß assisted. Our model rates players through their
   team's defence first; the field picked them on their own attacking returns.
4. **Calafiori was sold** to fund the wildcard (52% owned, 9 points).

**Would doing nothing have saved it? No.** The written-down roll scores **46**: the old
squad had no Chelsea starter either (João Pedro was benched on the same stale-flag read)
and the same one benched Brighton player. The wildcard did not lose the week; the read
that both squads shared did. Mini-league rivals who made no move at all scored 62 to 89
because they already owned the template.

### Flag outcomes

- [x] (+6) **B against A: YES, B +6, ALL OF IT FROM THE ARMBAND.** Version A as written
      (Murillo for Gabriel, B.Fernandes (C) for Gibbs-White, Haaland vice, bench Ajer
      first) scores **43**: Raya 3, Murillo 2, Thomas 4, Branthwaite 3, Mbeumo 8,
      B.Fernandes 1 x2, Janelt 3, Le Fée 2, Haaland 6, Thiago 4, Barry 6; no autosub
      either. B 49. The calc had A +1.7. Decomposed: the armband +5 (Haaland's second 6
      against B.Fernandes's second 1), Gibbs-White over B.Fernandes +1, Gabriel against
      Murillo 0, bench 11 against 11 and never used. **The kept scorers returned 2, 2 and
      a benched 6**; keeping them did not pay this week, the captain did. Running total
      to GW11: **B +6**.
- [x] (+1) **B.Fernandes sold, Gibbs-White kept: YES, +1.** Gibbs-White 2 (0.45 xA, CRY 3-1
      NFO), B.Fernandes **1** (0.16 xGI, 90 minutes, conceded 1). His series since the
      GW2 haul is now 2, 2, 2, 2, 1: Snorre's points-scored read held for a fifth week.
      Running: **+1**.
- [x] (=) **Gabriel kept over Murillo: LEVEL, 0.** Gabriel 2 (DC 5, conceded 1), Murillo 2
      (**DC 10 banked**, conceded 3 at Palace, -1). Same score by opposite routes:
      Murillo did the DC work the model priced him on and lost it to the goals against.
      Running: **0**.
- [x] (=) **Guéhi kept over Ajer: NEITHER CAME ON, BOTH SCORED 6.** Guéhi 6 (clean sheet at
      Anfield, the fixture he was benched for); Ajer 6 (goal from 0.19 xG, DC 9, missed
      the threshold by one). Every starter in both versions played, so neither bench
      slot counted. The cost that matters is inside B: **Guéhi 6 on the bench against
      Gabriel 2 in the XI, -4.**
- [x] (+3) **The wildcard against the zero-transfer alternative: YES, +3, LESS THAN HALF THE
      ESTIMATE.** The written-down roll (4-5-1: Raya; Gabriel, Calafiori, Guéhi, Hall;
      B.Fernandes (C), Mbeumo, Gibbs-White, Gomez, Semenyo; Barry) scores **46**: 3 + 2
      + 9 + 6 + 0 + 1x2 + 8 + 2 + 5 + 3 + 6, every starter played, João Pedro's 12 on
      its bench. Estimate was +7 to +8. Player for player the six bought returned **22**
      (Haaland 6, Thiago 4, Thomas 4, Branthwaite 3, Janelt 3, Le Fée 2) and the six
      sold **29** (João Pedro 12, Calafiori 9, Mitchell 4, Semenyo 3, B.Fernandes 1,
      Obi 0), though João Pedro's 12 would have sat on the alternative's bench. The
      wildcard's edge this week was **the armband** (Haaland's second 6 against
      B.Fernandes's second 1), **not the players**. Running total to
      GW11: **+3** against the model's +44.
- [x] (+) **Haaland's first week: YES, A GOAL AT ANFIELD, 6.** 79 minutes (subbed with City
      3-0 up, no sign of the Norway "exhaustion"), goal from 0.40 xG, no bonus on bps
      30. LIV 0-3 MCI. The worst fixture of his six returned the field's average
      captain score, which is all owning him was meant to guarantee.
- [x] (+10) **The armband: HAALAND WAS RIGHT, +10 AGAINST THE MODEL'S PICK, -4 AGAINST THE
      VICE.** Haaland 6 (12), B.Fernandes 1 (2), Mbeumo 8 (16). The model had
      B.Fernandes 5.5 v Haaland 5.1; the decision captained the six-week leader and the
      field's captain, and it was worth **+10** over A's armband. Mbeumo, the best in
      the XI, would have been +4 more; nobody's model finds that from a 0.4 gap.
- [x] (=) **The DC defenders: 3 OF 4 BANKED DC, 0 CLEAN SHEETS, 15 POINTS FROM 4 SLOTS.**
      Thomas DC 22 (4 pts), Branthwaite DC 10 (3), Murillo DC 10 (2), Ajer DC 9, missed
      by one, but scored (6). Every one conceded. Comparators: Tarkowski DC 17, 3 pts;
      Gvardiol 24 minutes, 4 (assist); **De Cuyper 15** (goal, clean sheet, 3 bonus,
      DC 3). The DC mechanism worked exactly as modelled (+2 a slot, banked three times
      in four) and was worth less than one clean sheet anywhere else.
- [x] (+2) **Thiago over Calvert-Lewin: YES, +2.** Thiago 4 (assist, yellow, 0.07 xG),
      Calvert-Lewin 2 (0.00 xGI). Priced at -1.9. Thiago's underperformance continues
      (0.07 xG in a 2-2), so the regression case is still a case and not a result.
- [x] (-) **Groß and Rogers, not owned: THEY SCORED 15 BETWEEN THEM.** Groß 6 (assist,
      clean sheet, DC 10 short of the MID threshold), now **39.1%** owned; Rogers 9
      (goal, DC 13 banked), **44.8%**. At field ownership, about -6.4 against us on the
      two. Not the week's biggest template cost: see João Pedro.
- [x] (-12) **João Pedro: THE API WAS RIGHT AND OUR READ WAS WRONG. HE PLAYED 71 AND SCORED
      12.** Two goals from 0.60 xG and 2 bonus in CHE 5-1 BOU, at **69.4%** owned. The
      flag read `d` 75% with a three-week-old `news_added`; the research run read the
      stale timestamp as "about 25%" (GW5 adjustment #6) and sold him on it. Now `a`
      100%. At field ownership that is about **-8.3** relative to the field, the
      single most expensive call of the week, and it was a rule we wrote ourselves.
- [x] (=) **Semenyo at Anfield (sold): PLAYED 90, 3 POINTS.** Clean sheet (+1) and 0.31 xA,
      no return. Janelt, his replacement, also 3. **Level.**
- [x] (-7) **The bench: YES, TWO OF THEM OUTSCORED SIX STARTERS, AND NO AUTOSUB FIRED.**
      Guéhi 6 and Gomez 5 on the bench against Gabriel, Le Fée and Gibbs-White on 2 and
      Raya, Branthwaite and Janelt on 3. The best legal XI from the same fifteen
      (Guéhi for Gabriel, Gomez for Le Fée) scores **56**, +7. The ordering itself
      (Hall first) cost nothing because it was never used; Hall's 0 was the one score
      it would have brought on.
- [x] (?) **B's extra clashes: UNTESTED, THEY ARE GW7 AND GW8.** Gibbs-White against Raya
      and Gabriel (NFO v ARS, GW7) and Barry against Raya and Gabriel (EVE v ARS, GW8)
      have not been played. Carried to those logs. The only GW6 clash (MUN v Dubravka)
      cost nothing: Dubravka did not play.

---

## Learnings

### What we got right

- **The armband.** Haaland over B.Fernandes was the decision's call against the model's
  GW6 number (5.5 v 5.1), and it was worth **+10**. It was also the field's captain, so
  the week we finally owned the 75% player was the week he scored, and the ledger held
  at +4 instead of taking a hit. That one call is the whole of B's +6 over A and the
  whole of the wildcard's +3 over the roll.
- **Snorre's points-scored read on B.Fernandes.** 2, 2, 2, 2, and now **1**. Selling him
  to keep Gibbs-White, Gabriel and Guéhi was +1 on the player and freed the armband
  from him. The model rated him the best captain in the game this week.
- **The DC mechanism did what the model said.** Thomas DC 22, Branthwaite 10, Janelt 14,
  Gomez 19, and Murillo 10 in A: five of six DC-profile players banked the +2. The model
  bought them for the floor and the floor was there.
- **Thiago over Calvert-Lewin, +2**, and **Barry scored for a second week running** (0.90
  xG). Sixth week in a row the minutes-first attacking pick returned at least the
  alternative.
- **Every starter played.** Six new players, no flag in the XI, eleven starters, no
  autosub needed. The minutes gate as a hard constraint held completely.

### What we got wrong

- **João Pedro, and it was our own rule.** GW5 adjustment #6 said a `d` with a stale
  `news_added` is "no information". The GW6 research run turned "no information" into
  **"about 25%"**, sold him on it, and he scored **12 at 69.4% owned**: about -8 against
  the field, the biggest single cost of the week. The adjustment was right about the
  timestamp and wrong about what to do with it. No information is not a low
  probability. It is the API's number with a wider error bar, and for a 65%+ owned
  player the error bar cuts against selling.
- **The template, unpriced, and two fixtures missed whole.** The proposal listed the
  players we would not own (João Pedro, Calafiori, Rogers, Groß, Cherki, De Cuyper) and
  did not put a number on them. Against the top 50 the gap is **Chelsea -28 and Brighton
  -24**: we fielded none of either club in the two results of the week, and the stale-flag
  rule removed Palmer as well as João Pedro. The wildcard was argued against the roll and
  against A, never against the field. See *Where the points went* above.
- **The fixture-benched defender kept the clean sheet.** Guéhi was put third on the
  bench for being at Anfield (FDR 4) and kept a clean sheet there; Gabriel started at
  home to Leeds and returned 2 on DC 5. Gomez (DC 19, clean sheet) sat behind Le Fée and
  Gibbs-White (2 each). The same fifteen had a **56** in it. The XI was picked on FDR,
  the bench was right on the model's own DC numbers.
- **The wildcard's model edge did not show up as players.** The six bought returned 22,
  the six sold 29. One week is noise and the case was six weeks, but the estimate for
  the week was +7 to +8 and the result was +3, with all of it from one armband.
- **Hall's points series now agrees with his DC series.** 0 points, DC 6, four conceded
  at Coventry. Points 3, 11, 4, 0, 13, **0**; DC 11, 13, 6, 6, 10, **6**. GW5's
  "only sold if both say so" is now met.

### Gut calibration

**Lost on ownership, not on picks.** Nothing in the XI failed: every starter played,
the captain scored, three DC players banked. The squad scored 49 because it had none of
the five template players who hauled, and two of them had been in it on Friday. Of the
-9, about -8 traces to one call (João Pedro) and the rest to Calafiori, De Cuyper,
Rogers and Cherki at field ownership. That is a process fault in one place and variance
in the others.

**Human against model, scored honestly.** Two human calls this week (sell B.Fernandes
not Gibbs-White, keep Gabriel and Guéhi; captain Haaland) against the model's A. The
human was **+6**, all of it the armband, and the model's GW6 margin for A (1.7) was
smaller than the variance in a single captain pick. The six-week score is what decides
it, and it is +6 to B after one.

**The armband ledger is +4 after six weeks of which five faded Haaland.** The first week
we captained him, the field did too. The fade's record (0, +20, -14, +6, -8) is level
with variance, as GW5 said; ending it cost nothing this week.

**Rank.** -1.04m is the largest drop of the season, from the best position of the
season. At 3.42m we are about where GW3 left us (3.50m). The wildcard squad has not
had a bad week, it has had an average week in a week the template was good.

### Adjustments for next time

1. **A stale `news_added` is the API's number, not a lower one.** Replaces GW5
   adjustment #6. A `d` flag whose timestamp has not moved for 7+ days is read **at the
   API's percentage**, flagged as unconfirmed, and checked against the club's latest
   presser. A player owned by **50%+** is **never sold on a stale flag alone**: only on
   fresh negative news (a new `news_added` or a presser ruling him out).
2. **Price the template, against the top 50 as well as the whole game.** Every proposal
   lists the players owned by **30%+** (or fielded by **60%+ of the overall top 50**,
   the outcome page's method) that we will not own, with their GW xPts and
   `ownership × xPts`, and sums it next to the model's gain. **And by club:** a team the
   top 50 fields two or more of a side, in a home fixture against a bottom-half defence,
   gets at least one of ours or a written reason and a number. A move that sells a 50%+ owned player has to beat that number, not
   just the replacement's xPts. João Pedro (69.4%, `a` 100%, CHE at EVE in GW7, TOT at
   home in GW8) is the first thing the GW7 run argues, on this rule.
3. **The XI is picked on model xPts including DC, not on FDR.** Guéhi and Gomez sat
   behind lower-xPts starters because their fixture looked worse. In GW7 Guéhi is MCI v
   IPS (H) and Gabriel is at NFO: the third defender slot is argued on the model, and
   Gomez (BHA v CRY, H) is argued against Le Fée (at BOU) the same way.
4. **Hall is the first sale.** GW5 adjustment #2's condition is met: both series say
   sell. If the GW7 FT is spent, Hall goes before anyone else on the bench (NEW v AVL
   is not a reason to wait).
5. **When the model's captaincy gap is under 0.5 xP and we own the field's captain,
   captain him.** GW6: gap 0.4, field's captain owned, armband worth +10 against the
   model's pick. This protects rank in exactly the weeks where the model cannot see
   the difference.
6. **TC Haaland v Ipswich (GW7, H) is argued on its own model.** Carried from the GW6
   chip note. He played 79 minutes at Anfield and scored from 0.40 xG. Ipswich just beat
   Fulham 2-1 at home; the minutes risk (79, not 90) goes into the TC number.
7. **Carry the running totals to GW11:** B against A **+6**, wildcard against the roll
   **+3** (model said +44), B.Fernandes against Gibbs-White **+1**, Gabriel against
   Murillo **0**. And score B's clashes: Gibbs-White v Raya and Gabriel in GW7 (NFO v
   ARS), Barry v Raya and Gabriel in GW8 (ARS v EVE).
8. **GW7 steer from Snorre (2026-10-13): "I would consider a hit if that helps us get both
   João Pedro and Haaland."** Haaland is already owned. Forwards are full (Haaland,
   Thiago, Barry), so João Pedro has to replace one of them. The GW7 research run prices
   both versions against each other on its model:
   - **Free:** Thiago → João Pedro (£7.8m for £7.8m, bank stays £0.2m). This is the default.
   - **-4 hit:** Barry → João Pedro (+ £2.2m) funded by Gabriel → Calafiori (frees
     £2.0m), so Thiago stays. Only worth it if the hit version wins **by more than 4 points
     over GW7 alone**, because Gabriel → Calafiori is free in GW8. A gain spread over six
     weeks does not pay for a hit when the same move costs nothing next week.
   - Either way, João Pedro is **at Everton in GW7**, against Branthwaite (and Barry, if
     kept). Under the hedging rule, that is a clash to price or to resolve on the bench.
   - Free transfers read **1** after GW6, not the 2 the Decision expected. Use the live
     `budget.free_transfers`.

### Chip planning notes

- **Wildcard: spent (GW6).** The first-half wildcard is gone. TC, BB and FH remain,
  all expiring **GW19**. `free_transfers` should read **2** for GW7 (a wildcard does
  not burn the saved FT); confirm before the GW7 research run plans moves.
- **Triple Captain: GW7, Haaland v Ipswich at home**, to be argued (adjustment #6). The
  case is the fixture and the 75% ownership: a TC on the field's captain is a +1 on
  the field's x2 for most of it, and pure gain against the quarter that does not own
  him.
- **Bench Boost: one move from live.** The bench returned **11** this week with three
  playing slots (Hall 0, Guéhi 6, Gomez 5) and one dead one (Dubravka, 0 minutes in
  six). Dubravka to a playing £4.0-4.5m keeper makes it a chip; pair it with Hall's
  sale (adjustment #4) only if both fit the FTs without a hit.
- **Free Hit:** no DGW or BGW in sight. The in-season emergency now the wildcard is gone.
