# GW7 Decision Log: JOÃO PEDRO BACK IN, TRIPLE CAPTAIN HAALAND

**Deadline:** Saturday 2026-10-17 10:00 UTC
**Fixtures:** Sat-Mon (Oct 17-19), single GW, no DGW/BGW. All ten fixtures kick off after the deadline (first: EVE v CHE, 11:30 UTC).
**Date of analysis:** 2026-10-14 (proposal, from the gameweek loop's research run). **Revised to the -4 and executed 2026-10-17 04:10 UTC**, see the top of the Proposal. **Locked 2026-10-17: the -4 as played, 5 of 5 matched**, see Decision.
**Proposal page:** https://artifacts.go.vongohren.me/life/fpl-gw7-proposal

---

## Pre-GW Context

### Squad state (pre-transfer)
- **Budget:** £0.2m ITB, **1 free transfer** (live `budget.free_transfers`; GW6's chip note expected 2, the steer in GW6 adjustment #8 already caught it)
- **Squad value:** £99.5m
- **Chips:** BB, TC, FH available and playable, first-half set, **all expire GW19**. Wildcard spent in GW6
- **Rank:** 3,420,647 after GW6
- **Auth:** `get_my_squad` authenticated, `is_stale: false`

### Season so far
| GW | Pts | Avg | Bench | Rank |
|---|---|---|---|---|
| 1 | 46 | 50 | 5 | 5,572,584 |
| 2 | **93** | 81 | 0 | 3,345,863 |
| 3 | 52 net (56 gross, -4) | 51 | 0 | 3,504,624 |
| 4 | **75** | 69 | 3 | 3,200,152 |
| 5 | 58 | 48 | 8 | **2,376,841** |
| 6 | 49 (WC) | 58 | 11 | 3,420,647 |

### Prior-decision context: the GW6 constraints

[GW6](gw6.md) left eight adjustments and a chip note. Read as constraints:

1. **"A stale `news_added` is the API's number, not a lower one."** *Applied. Nobody in the
   squad or on the shortlist carries a `d` flag this week. João Pedro is `a` 100% (his
   `news_added` is still 2026-09-16, now with no news text). His chance of starting is
   set at **95%**, not the model's default 80%: the default is minutes share (431 of
   540), which counts the GW5 game he missed injured. He has started every game he was
   fit for. The 95% is in `avail` so the page shows the same number as this doc.*
2. **"Price the template, against the top 50 as well as the whole game."** *Applied, see
   "The template, priced". The top 50 fielded João Pedro in **49 of 50** teams in GW6.
   The club rule fires for **Brighton** (top 50 fielded Groß 88%, De Cuyper 92%, home to
   the league's worst underlying defence). Our answer is Gomez, who starts.*
3. **"The XI is picked on model xPts including DC, not on FDR."** *Applied. Gomez (4.6) starts over
   Le Fée (4.2); Hall (4.2) over Guéhi (4.0) over Gabriel (3.5) for the third defender
   slot. Gabriel is last on the bench.*
4. **"Hall is the first sale... If the GW7 FT is spent, Hall goes before anyone else on
   the bench."** *Overridden for one week, and why: there is one FT and #2 and #8 both
   point it at João Pedro. Hall → De Cuyper is worth **+0.2** in GW7 and +0.4 over six
   on the model; doing both costs a -4 that loses **4.3** in GW7. Hall starts this week
   on the model (4.2, home to Villa) and is the GW8 sale.*
5. **"When the model's captaincy gap is under 0.5 xP and we own the field's captain,
   captain him."** *Not needed: the gap is 0.6 (Haaland 5.9, Barry 5.3), so the model
   picks Haaland by itself.*
6. **"TC Haaland v Ipswich (GW7, H) is argued on its own model."** *Applied, see "Triple
   Captain". Verdict: play it.*
7. **Running totals to GW11.** *Carried: B against A **+6**, wildcard against the roll
   **+3**, B.Fernandes against Gibbs-White **+1**, Gabriel against Murillo **0**. B's GW7
   clash (Gibbs-White v Raya and Gabriel, NFO v ARS) is in the hedging check.*
8. **Snorre's steer: "I would consider a hit if that helps us get both João Pedro and
   Haaland."** *Applied. Both versions priced below. The free one (Thiago → João Pedro)
   is the proposal. The -4 one fails its own test: it would have to win by more than 4
   in GW7 and it **loses 1.2 before the hit** (-5.2 after it).*

**Chip note:** *"Triple Captain: GW7, Haaland v Ipswich at home, to be argued."* Argued,
played. *"Bench Boost: one move from live."* Not this week: the one FT goes to João Pedro
and Dubravka is still a 0-minute fourth bench slot.

---

## Flags & Key Signals

### Squad health

Live `bootstrap-static`, read 2026-10-14. **All fifteen `a`, no flag, no news text.**
Every starter in GW6 played. Dubravka has played 0 minutes in six (structural filler).

### Team quality, underlying (6 games)

The model's inputs, from the live API: team xG for and against per game, and the factors
shrunk 50% to the league mean that the calculation uses.

| Team | xGF/g | xGA/g | Att factor | Def factor | |
|---|---|---|---|---|---|
| MCI | 2.00 | 1.42 | 1.154 | 0.969 | Haaland's side |
| **IPS** | 1.48 | **1.79** | 0.983 | 1.092 | Haaland's GW7 opponent. **12 conceded in six** (1, 5, 2, 2, 1, 1) |
| EVE | 1.47 | 1.32 | 0.980 | 0.935 | Branthwaite, Barry |
| CHE | 1.42 | 1.69 | 0.963 | 1.061 | João Pedro. Mediocre underlying attack despite 5-1 v BOU |
| BRE | 1.88 | 1.43 | 1.113 | 0.974 | Janelt |
| LIV | 1.55 | 1.22 | 1.007 | 0.904 | BRE's GW7 opponent |
| BHA | 2.16 | 1.56 | 1.206 | 1.017 | **Best attack in the league.** Gomez |
| **CRY** | 1.45 | **2.10** | 0.971 | 1.195 | **Worst defence in the league.** BHA's GW7 opponent |
| NFO | 1.81 | 1.21 | 1.090 | 0.901 | Gibbs-White |
| ARS | 1.80 | **0.78** | 1.089 | 0.757 | Best defence by a distance. Raya, Gabriel |
| LEE | 1.43 | 1.46 | 0.966 | 0.985 | MUN's GW7 opponent |
| MUN | 1.84 | 1.40 | 1.102 | 0.964 | Mbeumo |
| TOT | 1.11 | 1.42 | 0.861 | 0.971 | COV's GW7 opponent |
| COV | 1.07 | 1.72 | 0.848 | 1.070 | Thomas |
| NEW | 1.19 | 1.77 | 0.889 | 1.085 | Hall |
| AVL | 1.15 | 1.69 | 0.875 | 1.058 | NEW's GW7 opponent |
| BOU | 1.36 | 1.34 | 0.944 | 0.944 | SUN's GW7 opponent |
| SUN | 1.76 | 1.67 | 1.074 | 1.051 | Le Fée |

### Fixture runs, GW7-12

| Team | GW7 | GW8 | GW9 | GW10 | GW11 | GW12 | Avg FDR | Ours |
|---|---|---|---|---|---|---|---|---|
| COV | TOT (a) 3 | FUL (H) 2 | SUN (H) 3 | EVE (a) 3 | CRY (H) 2 | LEE (a) 3 | 2.67 | Thomas |
| TOT | COV (H) 2 | CHE (a) 4 | CRY (H) 2 | LEE (a) 3 | IPS (H) 2 | SUN (a) 3 | 2.67 | Dubravka |
| SUN | BOU (a) 3 | LEE (H) 3 | COV (a) 2 | CHE (H) 4 | AVL (a) 3 | TOT (H) 2 | 2.83 | Le Fée |
| MCI | **IPS (H) 2** | AVL (a) 3 | BHA (H) 3 | NFO (a) 3 | FUL (H) 2 | ARS (a) 5 | 3.00 | Haaland, Guéhi |
| CHE | EVE (a) 3 | TOT (H) 2 | MUN (H) 4 | SUN (a) 3 | LEE (H) 3 | NFO (a) 3 | 3.00 | **João Pedro (in)** |
| ARS | NFO (a) 3 | EVE (H) 3 | LIV (a) 4 | HUL (H) 2 | NEW (a) 3 | MCI (H) 4 | 3.17 | Raya, Gabriel |
| BHA | **CRY (H) 2** | LIV (a) 4 | MCI (a) 5 | BRE (H) 3 | HUL (a) 2 | NEW (H) 3 | 3.17 | Gomez |
| NEW | AVL (H) 3 | CRY (a) 3 | EVE (H) 3 | FUL (a) 3 | ARS (H) 4 | BHA (a) 4 | 3.33 | Hall |
| MUN | LEE (a) 3 | BOU (H) 3 | CHE (a) 4 | AVL (H) 3 | LIV (a) 4 | BRE (H) 3 | 3.33 | Mbeumo |
| BRE | LIV (H) 4 | HUL (a) 2 | NFO (H) 3 | BHA (a) 4 | EVE (H) 3 | MUN (a) 4 | 3.33 | Janelt *(Thiago sold)* |
| NFO | ARS (H) 4 | IPS (a) 2 | BRE (a) 3 | MCI (H) 4 | BOU (a) 3 | CHE (H) 4 | 3.33 | Gibbs-White |
| EVE | CHE (H) 4 | ARS (a) 5 | NEW (a) 3 | COV (H) 2 | BRE (a) 3 | LIV (H) 4 | **3.50** | Branthwaite, Barry |

### Community (source: Brave via `get_community_trends` for transfers only, **WebSearch** for the rest)

Brave answered **429** again: the transfers angle came back partial (ten names, two
queries), captaincy and differentials came back **empty**. Both were re-run through
`WebSearch` (RotoWire, Premier League, AllAboutFPL, Fantasy Football Scout, Fantasy
Football Hub, The False 9). Every claim below was checked against the API.

- **Captaincy: Haaland is the consensus.** [RotoWire](https://www.rotowire.com/soccer/article/fpl-gameweek-7-rankings-best-players-captain-picks-gw7-140686)
  ranks him first at **7.43**, then Cherki 6.41, De Cuyper 6.02, Semenyo 5.96,
  B.Fernandes 5.85. [The False 9](https://thefalse9.com/2026/10/fpl-gameweek-7-captain-picks-gross-haaland.html)
  frames it as Groß or Haaland: Groß has 53 points to Haaland's 45 at £6.0m against
  £15.6m. *Cross-check: API agrees, Groß 53, Haaland 45.*
- **Triple Captain:** the [Premier League](https://www.premierleague.com/en/news/4362085/triple-captain-haaland-in-gameweek-7-how-and-when-to-use-your-fpl-chips)
  puts Haaland v Ipswich up as a TC week: "scored in five consecutive Gameweeks", and
  says 1.7m managers already triple-captained him in GW3. *Cross-check: API history,
  goals in GW2, 3, 4, 5 and 6 (xG 0.66, 1.06, 0.87, 1.09, 0.40).*
  [AllAboutFPL](https://allaboutfpl.com/2026/10/fpl-chip-strategy-best-gameweeks-to-use-your-remaining-chips/)
  disagrees: its No. 1 TC is **Haaland v Hull in GW16** (rested by a Carabao Cup round
  before it), with GW7 v Ipswich and Saka v Hull (GW10) as alternatives. Priced below.
- **Transfers (Brave):** Cherki, De Cuyper, Isak, Rogers, **João Pedro**, Haaland, Rayan,
  Palmer, Gakpo, Bogle. *Cross-check: Isak and Gakpo are `i` 0%, out. Cherki has 392 of
  540 minutes (5 starts), the rotation risk the minutes gate exists for. João Pedro:
  **374k transfers in this round, already +£0.1** (£7.7m → £7.8m).*
- **Differentials:** [Scout](https://www.fantasyfootballscout.co.uk/2026/10/14/fpl-gameweek-7-differentials-3-low-owned-picks-to-consider)
  and [Hub](https://www.fantasyfootballhub.co.uk/articles/fantasy-premier-league-ultimate-guide-fpl-tips)
  name Solanke and Sávio (TOT v COV), Gonzalo García (FUL v HUL), Tavernier (BOU v SUN).
  *Cross-check: Solanke 260 minutes, Sávio 330: both fail the minutes gate. Solanke and
  Sávio play Thomas, Tavernier plays Le Fée: hedged. Gonzalo García (£6.1m, 511 min,
  4.8 calc v Hull) is the one clean name; not affordable for any one FT that is not a
  forward, and the forward FT goes to João Pedro.*
- **Hot topics:** price rises, wildcard timing, Free Hit usage, Triple Captain picks.

---

## Analysis

### Method: the GW6 model, unchanged

The calculation the proposal page shows (`scripts/gw-loop/proposal-page.mjs`), run over
every player in the game from a scratch copy so the options are priced on exactly the
page's numbers:

```
xPts per fixture = P(start) × [ 2 + (xG90 × goal_value + xA90 × 3) × attack_mult
                 + P(CS) × cs_value − 0.5 × λ_against (GK/DEF) + 2 × P(DC threshold)
                 + saves (GK) + bonus ]
xG90, xA90  shrunk halfway to the positional mean
team xGF/xGA from underlying xG, shrunk halfway to the league mean
P(start)    = minutes share × FPL flag; João Pedro 0.95 (adjustment #1)
```

Each option is scored as the best legal XI and captain of its fifteen, re-picked every
week, summed over GW7-12. A hit is charged in full. Every new player passed the minutes
gate (GW4 adjustment #2) before form, xGI or DC were looked at.

### The squad is close to its own optimum

Exhaustive search over every single free transfer (every owned player against every
`a` player in the same position with 300+ minutes, budget and club limit checked):

| Best single move | GW7 | GW7-12 | Problem |
|---|---|---|---|
| Gibbs-White → Groß | **+0.9** | +0.2 | Template (39.5%, top 50 88%), but the best by GW7 only |
| Hall / Guéhi / Gabriel → Silva (BOU) | +0.8 | **+4.2** | **Hedged:** BOU v SUN against Le Fée (GW6 removed him for the same clash) |
| Hall / Guéhi → Muharemović (LEE) | +0.3 | +3.6 | **Hedged:** LEE v MUN against Mbeumo |
| Guéhi → Murillo (NFO) | +0.3 | +3.3 | NFO v ARS against Raya, a second clash in the same game |
| Hall → De Cuyper (BHA) | +0.2 | +0.4 | Template (35.3%, top 50 92%) |
| **Thiago → João Pedro** | **-0.5** | **0.0** | Template (69.6%, top 50 98%), the steer |

The best clean move is worth **under one point** this week. The wildcard squad has no
hole in it the model can see. That makes this a week to spend the FT on what the model
cannot see, the template and the price, and to put the real weight on the armband.

### The transfer: Thiago → João Pedro, free (adjustments #2 and #8)

| | Thiago (out) | João Pedro (in) |
|---|---|---|
| Price | £7.8m (sell 7.8) | £7.8m (**374k in, +£0.1 this round**) |
| Minutes / starts | 532 / 6 | 431 / 5 (missed GW5, knee; 71 in GW6) |
| Points | **14** | **45** |
| Goals from xG | 1 from 3.2 | 5 from 2.8 |
| xG90 / xA90 | 0.54 / 0.05 | 0.58 / 0.06 |
| GW7 | LIV (H) 4.6 | EVE (a) 4.2 |
| GW7-12 calc | 27.2 | 27.1 |
| Owned / top 50 fielded (GW6) | 9.2% / 4% | **69.6% / 98%** |
| RotoWire GW7 | 5.51 | 5.19 |

On underlying numbers they are **the same player**: same xG90, same xA90, same six-week
calc to 0.1. Thiago is the better GW7 fixture by 0.4-0.5 (RotoWire agrees, 5.51 v 5.19).
What separates them is everything the model leaves out:

1. **The field owns João Pedro.** 49 of the top 50 fielded him in GW6 and 16% of them
   captained him. Not owning him when he scores is the GW6 loss in one line: he returned
   12 at 69.4% owned and cost about **-8** against the field. Thiago at 9.2% owned is
   the opposite bet on the same underlying numbers.
2. **Price.** 374k managers have bought him this round and he has risen once. Thiago
   (7.8) plus the bank (0.2) buys him at up to **£8.0m**: two more rises are fine,
   three make the free route impossible. Waiting a week (roll now, two FTs in GW8)
   gives the same squad in GW8 only if he has not risen three times by then.
3. **The steer.** Snorre asked for João Pedro alongside Haaland. The free route delivers
   it at a calculated cost of half a point in GW7 and none over six weeks.

**The -4 version, priced as the steer asked:** Barry → João Pedro and Gabriel → Calafiori
(Thiago stays, bank £0.0m). **-1.2 in GW7 before the hit, -5.2 after it**, -8.2 over six.
Barry (5.3, at home to Chelsea) is the second-best attacker in the squad this week and
Calafiori (3.4 at Forest) adds nothing to Gabriel (3.5) in GW7. It needed **+4 in GW7**
to pay; it is not close. Gabriel → Calafiori is free in GW8 if wanted.

**Thiago → João Pedro + Hall → De Cuyper (-4):** -4.3 in GW7, -6.1 over six. Not this week.

**The model's own pick for the FT: Gibbs-White → Groß** (£8.0m out, £6.0m in, bank
£2.2m). **+0.9 in GW7**, +0.2 over six: **1.4 better than João Pedro this week on the
calc.** It is template too (39.5% owned, 88% of the top 50) and it is the Brighton
answer the club rule asks for. It loses to João Pedro on the template (2.0 of field
expectation against 2.9, 88% of the top 50 against 98%), on Groß's run after this week
(LIV away, MCI away) and on the steer. Written down so the post-mortem can score it:
if you overrule the steer, this is the move.

### The template, priced (adjustment #2)

Players owned by 30%+, or fielded by 60%+ of the overall top 50 in GW6, that we will not
own after the move:

| Player | Club | £ | Owned | Top 50 | GW7 | calc | owned × calc |
|---|---|---|---|---|---|---|---|
| Groß | BHA | 6.0 | 39.5% | 88% | CRY (H) | 5.1 | 2.0 |
| Rogers | CHE | 7.9 | 45.0% | 78% | EVE (a) | 4.0 | 1.8 |
| Calafiori | ARS | 5.9 | 52.3% | 94% | NFO (a) | 3.4 | 1.8 |
| B.Fernandes | MUN | 11.9 | 34.7% | 8% | LEE (a) | 4.5 | 1.6 |
| De Cuyper | BHA | 5.1 | 35.3% | 92% | CRY (H) | 4.4 | 1.6 |
| Cherki | MCI | 7.9 | 31.8% | 16% | IPS (H) | 3.8 | 1.2 |
| | | | | | | **sum** | **9.9** |

Without the transfer, João Pedro adds **2.9** (69.6% × 4.2) and is the biggest single
line; with it the two biggest template players in the game (Haaland 75.2%, João Pedro
69.6%) are both ours.

**By club** (the top 50 fields two or more, at home, against a bottom-half defence):
**Brighton**, home to Crystal Palace, the worst underlying defence in the league (2.10
xGA a game). The top 50 fielded Groß and De Cuyper in nearly every team. **Ours is
Gomez, and he starts** (4.6, over Le Fée, adjustment #3). No other club triggers: Chelsea are away (João Pedro covers it anyway), Arsenal are away (Raya).

### The captaincy, from scratch

| Candidate | GW7 | Attacking calc | Total calc | Owned |
|---|---|---|---|---|
| **Haaland** | MCI (H) v IPS | **3.25** | **5.93** | 75.2% |
| Barry | EVE (H) v CHE | 2.83 | 5.34 | 8.7% |
| Janelt | BRE (H) v LIV | 0.94 | 4.82 | 2.5% |
| Mbeumo | MUN (a) at LEE | 1.95 | 4.69 | 19.9% |
| João Pedro | CHE (a) at EVE | 2.11 | 4.21 | 69.6% |

**Captain Haaland, vice Barry.** A gap of 0.6 over the next man, the best fixture on the
board (Ipswich: 12 conceded in six, 1.79 xGA a game), five scoring weeks in a row, and the
field's captain. Barry is vice on calc and because, if Haaland does not play, the
triple passes to the vice. GW6's captain was Haaland too; this is the model's pick, not
the incumbent's.

**Effective ownership.** Haaland is 75.2% owned and will be the most-captained player
again. Captaining him caps the downside: if he hauls, the field has him at roughly
1.6-1.8x and we have him at 3x. A non-Haaland armband would be the only real risk on the
board this week; there is no case for it.

### Triple Captain (adjustment #6)

Haaland's calc for every remaining first-half week, on the same model (no DGW or BGW is
known before GW19):

| GW | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Opp | **IPS (H)** | AVL (a) | BHA (H) | NFO (a) | FUL (H) | ARS (a) | LEE (H) | BRE (a) | CHE (H) | HUL (H) | NEW (a) | EVE (a) | TOT (H) |
| calc | **5.9** | 5.2 | 5.7 | 4.7 | 5.8 | 4.3 | 5.6 | 4.9 | 5.8 | 5.6 | 5.2 | 4.8 | 5.5 |

**GW7 is the best week on the model, by 0.1.** That is a tie with GW11 and GW15, and
AllAboutFPL's GW16 is 0.3 behind. On calc alone the chip is worth the same in four
weeks. What breaks the tie is everything else:

- **Certainty now.** Haaland is fit, has started all six, and scored in five in a row.
  Every week the chip is held is a week of injury and rotation risk on a chip that
  expires at GW19. GW16's case depends on a cup round that has not been played.
- **The field already spent it.** 1.7m managers triple-captained him in GW3. A TC now
  gains on most of the 75% who own him, not just the quarter who do not.
- **The minutes risk is priced in.** He went off at 79 at Anfield with City 3-0 up. The
  model's P(start) is 0.98 from minutes share; a substitution at 60-70 in a comfortable
  home win is the downside, and it costs the third 2 points of appearance, not the goal
  expectation.

**Play it.** Worth about **+5.9** in GW7 on the calc, which is the whole difference
between this week's proposal and an ordinary one.

### The XI: 3-4-3, and the bench

Raya; Branthwaite, Thomas, Hall; Janelt, Mbeumo, Gomez, Gibbs-White; **Haaland (TC)**,
Barry, João Pedro.

| Pos | Player | GW7 | calc | Why there |
|---|---|---|---|---|
| GK | Raya | NFO (a) | 3.5 | |
| DEF | Branthwaite | CHE (H) | 4.6 | DC90 10.7, banked the threshold in 4 of 6 |
| DEF | Thomas | TOT (a) | 4.5 | DC90 12.6 (22 last week); Spurs' attack joint second-worst |
| DEF | Hall | AVL (H) | 4.2 | Villa's attack fourth-worst. Starts this week, sold next |
| MID | Janelt | LIV (H) | 4.8 | DC90 13.0, banked the MID threshold in 4 of 6 |
| MID | Mbeumo | LEE (a) | 4.7 | Best in the XI last week |
| MID | **Gomez** | CRY (H) | 4.6 | Brighton v the worst defence; our Brighton answer |
| MID | Gibbs-White | ARS (H) | 4.2 | |
| FWD | **Haaland (C, TC)** | IPS (H) | 5.9 | |
| FWD | **Barry (V)** | CHE (H) | 5.3 | Scored in GW5 and GW6 |
| FWD | **João Pedro** | EVE (a) | 4.2 | |

**Bench: Dubravka → Le Fée → Guéhi → Gabriel.** Le Fée first on calc (4.2). Guéhi
(4.0) before Gabriel (3.5) and both after him: if a defender misses, the autosub skips
Le Fée (it would leave two at the back) and takes Guéhi. Everyone on the outfield bench
has 518+ minutes and six starts. Gabriel (£7.9m, form 1.5, 2 points in GW6 on DC 5) is
last on the model: adjustment #3 applied without exception.

Gomez over Le Fée and Hall over Guéhi are both small calls (0.4 and 0.2). GW6's bench
had the two best scores in it. This time the model picks the XI, and the bench order
follows the same numbers.

### Hedging check

| GW | Clash | Price |
|---|---|---|
| 7 | **João Pedro v Branthwaite** (CHE at EVE) | New. Expected points unchanged: it takes away upside, not points. Benching Branthwaite for Guéhi to remove it costs **0.65** calc. Kept: GW3 and GW4 say price the clash, do not reflexively avoid it. Branthwaite's clean-sheet chance is 29% |
| 7 | João Pedro v Barry (opposite attacks, same game) | Not a hedge under the rule (no GK/DEF), but game-state correlated. Noted |
| 7 | Gibbs-White v Raya (NFO v ARS) | Carried from B (GW6). Gabriel is benched, so it is one defensive slot, not two |
| 7 | Thomas v Dubravka (COV at TOT) | Zero unless Raya misses; Dubravka has not played |
| 8 | Barry v Raya and Gabriel (EVE at ARS) | Carried from B. A GW8 bench call |
| 8 | João Pedro v Dubravka (CHE v TOT) | Zero |

### Chips

- **Triple Captain: play it on Haaland.** Argued above.
- **Bench Boost: not this week.** The bench is three playing outfielders and Dubravka (0
  minutes in six). The FT went to João Pedro. A playing £4.0-4.5m keeper is still the one
  move that makes it a chip; pair it with Hall's sale when the FTs allow.
- **Free Hit: hold.** No DGW or BGW in sight. AllAboutFPL suggests GW9 (CHE v MUN, LIV v
  ARS) for it; not a reason to spend it with nothing broken.

---

## Proposal

### Revised 2026-10-17: -4, executed

Snorre read the proposal and asked for the hit (*"Definitely hit... we need [a defender]
out of the back end... Just go for the best approach... You're approved to do the sales
yourself"*). Overnight FPL flagged **Branthwaite (leg) and Gibbs-White (muscular) `d` 75%**
(`news_added` 2026-10-16, fresh news, so GW6 adjustment #1 allows a sale). Re-solved on the
same model with Thiago → João Pedro fixed, every second move charged -4 and the hedging
rule applied:

| Second move (-4) | GW7 net | GW7-12 net | Note |
|---|---|---|---|
| Gibbs-White → Groß | -3.05 | -2.55 | Template, but not the back line asked for |
| **Branthwaite → Van Hecke** | **-3.20** | -3.18 | Sells the injured defender and removes the João Pedro v Branthwaite clash |
| Hall → Van Hecke | -3.44 | -1.77 | Keeps an injured Branthwaite |
| Branthwaite → Murillo | -3.45 | -1.25 | Better run, worse GW7 |

Every hit is about -3 net this week on the calc; the choice between them is noise, so
the tiebreak was the injury and the clash. **The first attempt (00:15 UTC) was blocked by
the auto-mode permission classifier; executed at 04:10 UTC** from the same session on
*"So the transfers now please!"*, prices unchanged. FPL confirmed: `made` 2, `cost` 4,
bank £0.8m, `3xc` active on Haaland (multiplier 3).

- **Transfers:** Thiago → João Pedro (FT), Branthwaite → Van Hecke (TOT, £4.9m, 540 min, -4).
- **3-4-3:** Raya; Van Hecke, Thomas, Hall; Janelt, Mbeumo, Gomez, Le Fée; Haaland, Barry, João Pedro.
- **Captain Haaland (Triple Captain), vice Barry.** Bench: Dubravka, Guéhi, Gabriel, Gibbs-White (75%).

The version below (one free transfer, Branthwaite and Gibbs-White starting) is kept
unchanged so the post-mortem can score the -4 against it.

### Do this in the app (version A, superseded)

1. **Transfer: Thiago → João Pedro** (1 FT, no hit). Do it **before Thursday night's
   price change** (around 01:30 UK): he is rising, and the bank covers him only up to
   £8.0m. If news on João Pedro turns bad before you make it, roll the FT instead
   (alternative below) and keep Thiago.
2. **Play Triple Captain** (chip) on **Haaland**.
3. **Formation 3-4-3:** Raya; Branthwaite, Thomas, Hall; Janelt, Mbeumo, Gomez,
   Gibbs-White; Haaland, Barry, João Pedro.
4. **Captain: Haaland (TC). Vice: Barry.**
5. **Bench order:** Dubravka, Le Fée, Guéhi, Gabriel.
6. **Friday pressers** (not a reason to wait): City on Haaland. If he is ruled out
   before the deadline, **cancel the Triple Captain** and give the armband to Barry.

### Transfers

| OUT | £ (sell) | IN | £ |
|---|---|---|---|
| Thiago (BRE, FWD) | 7.8 | **João Pedro** (CHE, FWD) | 7.8 |

Cost: **0 (1 FT)**. Bank £0.2m → **£0.2m**.

### Projected XI (3-4-3)

| Pos | Player | Team | £m | GW7 | calc |
|---|---|---|---|---|---|
| GK | Raya | ARS | 6.1 | NFO (a) | 3.5 |
| DEF | Branthwaite | EVE | 5.5 | CHE (H) | 4.6 |
| DEF | Thomas | COV | 4.0 | TOT (a) | 4.5 |
| DEF | Hall | NEW | 5.3 | AVL (H) | 4.2 |
| MID | Janelt | BRE | 5.0 | LIV (H) | 4.8 |
| MID | Mbeumo | MUN | 7.9 | LEE (a) | 4.7 |
| MID | Gomez | BHA | 5.0 | CRY (H) | 4.6 |
| MID | Gibbs-White | NFO | 8.0 | ARS (H) | 4.2 |
| FWD | **Haaland (C, TC)** | MCI | 15.6 | IPS (H) | 5.9 |
| FWD | **Barry (V)** | EVE | 5.7 | CHE (H) | 5.3 |
| FWD | **João Pedro** | CHE | 7.8 | EVE (a) | 4.2 |

**Calculated XI with the triple: about 62.4.** Without the chip, 56.5.

**Bench:** Dubravka (GK) → Le Fée (MID, 518 min) → Guéhi (DEF, 540 min) → Gabriel (DEF, 540 min).

**Projected state after:** £99.5m squad, £0.2m ITB. EVE×2, MCI×2, ARS×2, one each of
CHE, COV, NEW, BRE, MUN, BHA, SUN, NFO, TOT. Chips left after GW7: BB, FH (first half,
expire GW19). GW8 opens with **1 FT**.

### Zero-transfer alternative

Roll the FT (2 FTs in GW8), keep Thiago, still play **Triple Captain Haaland**. Same XI
with Thiago in João Pedro's place, same bench.

**Expected cost: none on the calc.** The roll is **+0.5 in GW7** (62.9 against 62.4)
and **level over GW7-12** (340.6 each). It is the right call if you weigh the model
over the field. What it costs is not on the calc: about **2.9 points of field
expectation** on a 69.6%-owned player in GW7 (98% of the top 50), and the price risk
(three rises before you buy him in GW8 makes the free route impossible). In GW8 the two
FTs would do Thiago → João Pedro and Hall → a defender together.

Declining the Triple Captain as well: **-5.9 in GW7**, for a chip that is worth the same
in GW11 or GW15 on the calc.

### Chip strategy
**Triple Captain, GW7, Haaland v Ipswich.** BB and FH remain, both expiring **GW19**.
Bench Boost waits for a playing reserve keeper; Free Hit is the emergency.

---

## Decision

**Two transfers, -4. Triple Captain Haaland. The revised version, exactly as executed.**

| OUT | £ (sell) | IN | £ | |
|---|---|---|---|---|
| Thiago (BRE, FWD) | 7.8 | **João Pedro** (CHE, FWD) | 7.8 | free transfer |
| Branthwaite (EVE, DEF) | 5.5 | **Van Hecke** (TOT, DEF) | 4.9 | **-4** |
| | **13.3** | | **12.7** | |

Both stamped 2026-10-17 04:10:51 UTC in `entry/5047923/transfers/`, six hours before the
deadline. Confirmed after the deadline on the public `entry/5047923/event/7/picks/` and on
`get_my_squad` (authenticated, not stale): `active_chip: 3xc`, Haaland `multiplier: 3`,
`event_transfers: 2`, `event_transfers_cost: 4`, `bank: 8` (£0.8m). Every id matches the
lock snapshot.

**Captain: Haaland, Triple Captain** (MCI v IPS, FDR 2). **Vice: Barry** (EVE v CHE, FDR 4).
**Chip: Triple Captain.**

### Starting XI (3-4-3)
| Pos | Player | Team | £m | GW7 | FDR |
|---|---|---|---|---|---|
| GK | Raya | ARS | 6.1 | NFO (a) | 3 |
| DEF | **Van Hecke** | TOT | 4.9 | COV (H) | 2 |
| DEF | Thomas | COV | 4.0 | TOT (a) | 3 |
| DEF | Hall | NEW | 5.3 | AVL (H) | 3 |
| MID | Janelt | BRE | 5.0 | LIV (H) | 4 |
| MID | Mbeumo | MUN | 7.8 | LEE (a) | 3 |
| MID | Gomez | BHA | 5.0 | CRY (H) | 2 |
| MID | **Le Fée** | SUN | 5.7 | BOU (a) | 3 |
| FWD | **Haaland (C, TC)** | MCI | 15.7 | IPS (H) | 2 |
| FWD | **Barry (V)** | EVE | 5.7 | CHE (H) | 4 |
| FWD | **João Pedro** | CHE | 7.8 | EVE (a) | 3 |

**Bench:** Dubravka (GK, TOT v COV, FDR 2) → Guéhi (DEF, MCI v IPS, FDR 2) → Gabriel (DEF,
ARS at NFO, FDR 3) → **Gibbs-White** (MID, NFO v ARS, FDR 4, `d` 75% muscular). Two
defenders first, so an absence anywhere in the XI autosubs legally; Gibbs-White last
because he is the one flagged player in the fifteen.

**Final state:** £98.9m squad + **£0.8m ITB** (£99.7m team value). ARS×2, MCI×2, TOT×2,
one each of COV, NEW, BRE, MUN, BHA, SUN, EVE, CHE, NFO. Chips left: **BB, FH** (first
half, expire GW19). `free_transfers` reads 1; GW8 opens with **1 FT**.

**Branthwaite's flag has cleared.** At the lock read (11:11 UTC) he is back to `a`, news
empty, `chance_of_playing_next_round` 100 (`this_round` still 75, `news_added` still
2026-10-16 17:00). The API does not show when the flag lifted, so whether he was fit at the
moment of the sale cannot be told from here. Gibbs-White is still `d` 75%.

### Proposal vs decision

**Against the proposal as it stood at the deadline (the revised -4): matched, 5 of 5**
(transfers, captain, vice, XI, chip), bench order identical too. It was executed from the
research session ([c2276](https://acp.go.vongohren.me/?c=c2276)) on Snorre's explicit
instruction, quoted verbatim from the session transcript (it reads dictated):

> *"Definitely hit. We need you out of the back end as a horrible sale. Just go for the
> best approach. I don't have time to fix this. You can go and do the sales. You're
> approved to do the sales yourself"* (00:08 UTC)

The first attempt was blocked by the auto-mode permission classifier at 00:15 UTC; the
transfers went through at 04:10 UTC on *"So the transfers now please!"*.

**Against version A as first proposed on 2026-10-14: partly followed.** João Pedro in for
Thiago, the Triple Captain on Haaland, vice Barry and the 3-4-3 shape were all done as
written. Three things were not:

1. **The -4.** A made one free transfer and wrote down that a hit failed its own test
   (the -4 route it priced lost 1.2 before the hit). Snorre asked for the hit and a
   defender out; the session picked **Branthwaite → Van Hecke** among moves that all
   priced about **-3 net in GW7** (-3.20 for this one, -3.18 over GW7-12). The tiebreak
   was Branthwaite's new `d` 75% (leg) and removing the João Pedro v Branthwaite clash.
   This is the human's call against the model's: the model would not have paid 4.
2. **Le Fée starts, Gibbs-White is benched last.** Not a human override: Gibbs-White went
   `d` 75% (muscular) on 16 Oct, after the proposal, and Le Fée was A's first bench
   outfielder, level with him on calc (4.2 each) before the flag.
3. **Bench order** follows from 1 and 2: Dubravka, Guéhi, Gabriel, Gibbs-White, where A
   had Dubravka, Le Fée, Guéhi, Gabriel. The bank is £0.8m, not £0.2m.

What the model never priced: whether Branthwaite would have played. His flag cleared by the
lock (above), so the -4 may have sold a fit player; the post-mortem scores it on points.

---

## Accepted risks

- **João Pedro is half a point worse than Thiago this week on the calc** (and on
  RotoWire's numbers). He is bought for ownership and price, and the doc says so.
- **João Pedro v Branthwaite** in the same game, both starting. Priced at zero expected
  points and 0.65 to remove; kept.
- **The Triple Captain is a tie on the calc** with GW11 and GW15. Played now for
  certainty, not because the number says GW7 is clearly best.
- **Haaland's minutes:** subbed at 79 last week. A 60-minute afternoon in a rout is the
  realistic downside.
- **Hall starts** despite being the named first sale, on a 0.2 calc margin over Guéhi.
- **Gabriel (£7.9m) is the last bench slot.** £7.9m of value doing nothing this week; the
  money is the GW8 question (Gabriel → Calafiori frees £2.0m and buys a 52%-owned player).
- **Brighton's template is covered by Gomez only.** Groß and De Cuyper at home to the
  worst defence, both unowned: about 3.6 of field expectation between them.
- **Dubravka:** a 0-minute reserve keeper, seventh week. Only matters if Raya misses.
- **Janelt is on four yellow cards**: one more is a one-match ban
  ([Scout](http://www.fantasyfootballscout.co.uk/2026/10/12/who-is-close-to-a-ban-or-suspended-in-fpl-gameweek-7-2)).
  Not a reason to bench him; a reason the next FT plan keeps a midfielder spare.
- **Guéhi, third on the bench, is a rotation risk** after City host PSG on 14 Oct
  ([SI](https://www.si.com/soccer/man-city-predicted-lineup-vs-psg-champions-league-10-14-26)).
  It only matters if he is needed as an autosub.

---

## Armband ledger (GW1 learning #4)

| GW | Our captain | Pts (x2) | Field's captain | Pts (x2) | Swing | Cumulative |
|---|---|---|---|---|---|---|
| 1 | B.Fernandes | 2 (4) | Haaland | 2 (4) | 0 | 0 |
| 2 | B.Fernandes | 23 (46) | Haaland | 13 (26) | **+20** | +20 |
| 3 | B.Fernandes | 2 (4) | Haaland | 9 (18) | **-14** | **+6** |
| 4 | João Pedro | 12 (24) | Haaland *(MUN away, FDR 4)* | 9 (18) | **+6** | **+12** |
| 5 | Gibbs-White | 2 (4) | Haaland *(SUN home, FDR 2)* | 6 (12) | **-8** | **+4** |
| 6 | Haaland *(LIV away, FDR 4)* | 6 (12) | Haaland | 6 (12) | **0** *(same player)* | **+4** |
| 7 | **Haaland (TC, x3)** *(IPS home, FDR 2)* | 13 (26) *(x3 = 39)* | Haaland | 13 (26) | **0** *(same player; the TC's third 13 is the chip, not the ledger)* | **+4** |

If the field's captain is Haaland again, the ledger's swing is the third multiplier
alone: **+1x Haaland's points**. The ledger compares x2 against x2 by its own rule; the
lock and post-mortem should record the TC's extra multiplier in the row as a note so the
cumulative stays comparable with GW1-6.

---

## Watch flags for GW7

Rewritten at the lock to test the -4 as played. The first three flags are the deviations
from version A: the human's call scored against the model's.

- [ ] **The -4: Branthwaite → Van Hecke (deviation, Snorre's call).** Van Hecke's points
      minus Branthwaite's, minus 4. The calc had it at -3.20 in GW7 and -3.18 over GW7-12;
      run it to GW12. Branthwaite's flag had cleared by the lock: did he start, and did
      the sale cost a fit player?
- [ ] **Played XI against version A (deviation).** The played fifteen's GW7 total (after
      the -4, with autosubs) against A's XI and bench as written (Branthwaite and
      Gibbs-White starting, Le Fée first bench, no hit), same Triple Captain. One number:
      what did the revision win or lose? Start a running total "-4 against A" next to
      the GW6 ones.
- [ ] **Le Fée over Gibbs-White (deviation, forced by the `d` 75%).** Points of each.
      Did Gibbs-White play, and would he have come on as an autosub?
- [ ] **João Pedro over Thiago.** Straight comparison, GW7 and running to GW12. The calc
      had Thiago +0.5 in GW7 and level over six. Did owning the template pay, or cost?
- [ ] **The Triple Captain.** Haaland's points x3 against x2. And against the
      tie-weeks: what did he score in GW11 (FUL H), GW15 (CHE H) and GW16 (HUL H)?
- [ ] **The João Pedro v Branthwaite clash, removed by the sale.** Would it have bitten
      (a João Pedro goal that cost a Branthwaite clean sheet)? That is part of what the
      -4 bought.
- [ ] **Van Hecke v Thomas** (TOT v COV, opposite defences in one game, both starting,
      Dubravka on the bench in it too). New with the sale. Not a hedge under the rule,
      but a goal either way costs one of them the clean sheet. What did the pair return?
- [ ] **The XI on calc (adjustment #3).** Gomez and Le Fée in midfield, Hall over Guéhi,
      Gabriel then Gibbs-White last. Did the bench outscore the starters again, and did
      an autosub fire?
- [ ] **Brighton, covered by Gomez.** Groß and De Cuyper at home to Palace, unowned:
      what did they score, and what did Gomez return?
- [ ] **The template, priced at 9.9.** Sum the unowned template's actual points ×
      ownership against the calc.
- [ ] **Hall's last week before the sale.** Points and DC, against Guéhi on the bench.
- [ ] **João Pedro's price:** bought at **£7.8m** (04:10 UTC on 17 Oct). Price at the
      GW8 deadline.
- [ ] **Running totals to GW11:** B against A (+6), wildcard against the roll (+3),
      B.Fernandes against Gibbs-White (+1), Gabriel against Murillo (0). Add GW7, and
      open "-4 against A" from the second flag.

---

## Outcome

**Actual points: 78** (gross 82, **-4 hit**, net 78; bench **9**) · **GW average: 59** · **Highest score: 122**
**Overall rank: 2,467,338** (up from 3,420,647, **+953,309 places**)
**GW rank:** 450,251 · **Season total: 451**
**Most captained in the game:** Haaland (13 pts, x2 = 26), and ours too, at x3 = 39

Finalisation gate confirmed before writing, on the live `bootstrap-static` endpoint per
GW4 adjustment #6: `events[6].finished = true`, `data_checked = true`, all ten GW7
fixtures `finished`. `automatic_subs` is **empty** on `entry/5047923/event/7/picks/`,
because all eleven starters played. `entry/5047923/history/` agrees on every field:
`points: 82` (gross), `event_transfers: 2`, `event_transfers_cost: 4`, `total_points: 451`
(373 + 82 - 4), `points_on_bench: 9`, `bank: 8`, `value: 997`, `active_chip: 3xc`.
724,286 managers played the Triple Captain this week.

| Player | Min | Pts | Notes |
|---|---|---|---|
| Raya | 90 | **9** | **Clean sheet** (+4) + **3 bonus**, 2 saves. 0.90 xGC. NFO 0-1 ARS |
| **Van Hecke** | 90 | 4 | **DC 11 banked** (+2). Conceded 1 from 0.77 xGC, no clean sheet. TOT 3-1 COV |
| Thomas | 90 | 3 | **DC 10 banked** (+2), conceded 3 (-1). TOT 3-1 COV |
| Hall | 90 | 4 | **DC 10 banked** (+2). Conceded 1 from 1.57 xGC. NEW 0-1 AVL |
| Janelt | 90 | **-1** | **Red card** (-3). DC 11, missed the MID threshold by one. BRE 1-2 LIV. **Suspended until 31 Oct: misses GW8** |
| Mbeumo | 90 | **8** | **Goal from 0.65 xG** + 1 bonus. LEE 1-1 MUN. Second goal in two weeks |
| **Gomez** | 90 | **8** | **Goal from 0.01 xG** + clean sheet (+1). DC 9, missed. BHA 5-0 CRY |
| **Le Fée** | 90 | 4 | **DC 12 banked** (+2), exactly the MID threshold. BOU 2-0 SUN |
| **Haaland (C, TC)** | 90 | **13 x3 = 39** | **Two goals from 0.87 xG** + **3 bonus** (bps 71, the best in the game). 90 minutes. MCI 3-2 IPS |
| Barry (V) | 90 | 2 | Appearance only. 0.30 xG. EVE 0-2 CHE |
| **João Pedro** | 90 | 2 | Appearance only. 0.28 xG, 0.02 xA. EVE 0-2 CHE (Neto 2) |
| *Bench: Dubravka* | 0 | 0 | Seventh week without a minute |
| *Bench: Guéhi* | 90 | 1 | Conceded 2 (-1). DC 3. MCI 3-2 IPS |
| *Bench: Gabriel* | 90 | **8** | **Clean sheet** (+4) + **DC 12 banked** (+2). 0.42 xG. NFO 0-1 ARS |
| *Bench: Gibbs-White* | 0 | 0 | Did not play (`d` 75%, muscular) |
| *Sold: Branthwaite* | 90 | 1 | Started and played 90. DC 8, missed. Conceded 2 (-1). EVE 0-2 CHE |
| *Sold: Thiago* | 90 | 4 | Assist (3), yellow (-1). 0.49 xG, 0.19 xA. BRE 1-2 LIV |

**No autosub fired.** All eleven starters played, so the bench was never reached.
Gabriel's 8 sat in the last bench slot behind four starters on 3 or less, and Janelt's
red card made his slot the worst score in the XI.

XI gross **82**, -4, net **78**. **Nineteen above the average, +953,309 places**, the
best week against the average this season and the largest rank gain of the season. Haaland
was **39 of the 82**. Without the Triple Captain the week is 65 net, still +6 on the
average. The rest of the XI returned 43 from ten players: Raya's clean sheet and the two
midfield goals (Mbeumo, Gomez), three DC defenders on 3 or 4, and both forwards on 2.

### Flag outcomes

- [x] (-1) **The -4, Branthwaite → Van Hecke: NO, -1. BRANTHWAITE WAS FIT AND PLAYED 90.**
      Van Hecke 4 (DC 11, conceded 1), Branthwaite 1 (DC 8, conceded 2): +3 on the
      players, **-1 after the hit**. The calc had it at -3.20; the result was better than
      the calc and still a loss. His flag had cleared by the lock read and he started.
      The sale was made at 04:10 UTC on a `d` 75% that was gone by 11:11. Running to
      GW12: **-1**.
- [x] (-1) **Played XI against version A: -1, ALL OF IT THE HIT.** A as written (Raya;
      Branthwaite, Thomas, Hall; Janelt, Mbeumo, Gomez, Gibbs-White; Haaland TC, Barry,
      João Pedro) scores **79**: Gibbs-White did not play, so Le Fée (first bench, 4)
      comes on into the same 3-4-3, and A's bench (Dubravka, Guéhi, Gabriel) has the
      same 9 on it. The only difference left is Branthwaite 1 against Van Hecke 4, minus
      4. Played 78. Running total, new: **-4 against A: -1**.
- [x] (=) **Le Fée over Gibbs-White: LEVEL, AND IT WOULD HAVE HAPPENED ANYWAY.**
      Gibbs-White 0 minutes, Le Fée 4 (DC 12 banked). In A, Le Fée was first on the bench
      and would have autosubbed in for exactly the same 4. Benching the flag cost nothing
      and gained nothing.
- [x] (-2) **João Pedro over Thiago: NO, -2.** João Pedro 2 (0.28 xG, Neto took both
      Chelsea goals at Everton), Thiago 4 (assist, yellow, 0.49 xG). The calc had Thiago
      +0.5. **The template protection did its job without paying**: João Pedro is 72.8%
      owned, so his blank cost the field what it cost us, and owning him was level
      against the field. Running to GW12: **-2**.
- [x] (+13) **The Triple Captain: YES, +13, THE WHOLE WEEK.** Haaland 90 minutes, two
      goals from 0.87 xG, 3 bonus (bps 71): **13, x3 = 39** against x2 = 26. The calc
      was +5.9 for the chip; it returned more than double. The minutes risk did not
      show (90, not 79). The tie-weeks are still to come: GW11 (FUL H), GW15 (CHE H),
      GW16 (HUL H) get scored in their own logs.
- [x] (=) **The João Pedro v Branthwaite clash, removed: IT WOULD NOT HAVE BITTEN.**
      João Pedro blanked; Neto scored both. Branthwaite conceded 2 from 1.47 xGC with
      no clean sheet to lose. The -4 bought nothing on the clash.
- [x] (=) **Van Hecke v Thomas: BOTH BANKED DC, NEITHER KEPT A CLEAN SHEET, 7 BETWEEN
      THEM.** TOT 3-1 COV. Van Hecke 4 (DC 11, conceded 1), Thomas 3 (DC 10, conceded
      3). The goal either way cost one of them the clean sheet, as written; the DC floor
      held on both. Dubravka did not play.
- [x] (-9) **The XI on calc: THE LAST BENCH SLOT OUTSCORED SEVEN STARTERS, NO AUTOSUB.**
      Gabriel (3.5, last on the model) 8: clean sheet and DC 12 at Forest. The best legal
      XI from the same fifteen (Gabriel for Janelt, 4-3-3) scores **91 gross, +9**. Second
      week running a benched defender kept a clean sheet the XI did not: Guéhi in GW6 on
      FDR, Gabriel in GW7 on the calc. The rule changed and the result did not.
- [x] (+3) **Brighton, covered by Gomez: YES, GOMEZ BEAT BOTH TEMPLATE PICKS.** BHA 5-0
      CRY. Gomez **8** (goal, clean sheet), De Cuyper 6 (clean sheet, DC 4), Groß 5
      (assist, clean sheet, 70 minutes, yellow). **+3 against Groß**, the model's own FT
      pick, +2 against De Cuyper. The club rule's answer was the best Brighton score
      among the three.
- [x] (+1) **The template, priced at 9.9: IT RETURNED 8.5.** Ownership × points on the
      proposal's table: Calafiori 52.3% × 6 = 3.1, De Cuyper 35.3% × 6 = 2.1, Groß 39.5% ×
      5 = 2.0, Rogers 45.0% × 2 = 0.9, B.Fernandes 34.7% × 1 = 0.3, Cherki 31.8% × 0
      (did not play). **8.5 against 9.9**, about 1.4 less than priced. No unowned
      template player hauled; the week's big scores were all under 10% owned (Neto 15,
      Ayari 13, Evanilson 12, Kostoulas 12).
- [x] (+3) **Hall's last week: 4, DC 10 BANKED, +3 ON GUÉHI.** Conceded 1 from 1.57 xGC.
      Guéhi on the bench 1 (conceded 2, DC 3). Points 3, 11, 4, 0, 13, 0, **4**; DC 11,
      13, 6, 6, 10, 6, **10**. The sale case is weaker than it was a week ago, and
      Janelt's suspension now outranks it (adjustment #1).
- [x] (?) **João Pedro's price: £7.8m → £7.9m, STILL RUNNING.** Bought at 7.8, one rise
      since; sell price 7.8. GW8 deadline is 2026-10-23 17:30 UTC; the GW8 log records
      the price at it.
- [x] (-4) **The model's own FT, Gibbs-White → Groß (written down to score): IT WOULD
      HAVE SCORED 82.** Groß 5 into Gibbs-White's slot, Thiago 4 kept, Branthwaite kept,
      no hit: Raya 9, Branthwaite 1, Thomas 3, Hall 4, Janelt -1, Mbeumo 8, Gomez 8, Groß
      5, Haaland 39, Barry 2, Thiago 4. **+3 over A and +4 over what we played.** The steer
      and the template beat it on the reasoning; the model's pick beat both on points.
- [x] (?) **Running totals to GW11: B AGAINST A +6, WILDCARD AGAINST THE ROLL +31,
      B.FERNANDES AGAINST GIBBS-WHITE 0, GABRIEL AGAINST MURILLO +6, -4 AGAINST A -1.**
      *B against A:* the three players B kept over A (Gabriel, Gibbs-White, Guéhi) all
      sat on our GW7 bench, so the XI is the same either way: **0 this week, +6**.
      *Wildcard against the roll:* the written-down roll's fifteen, frozen (Raya;
      Gabriel, Calafiori, Guéhi, Hall; B.Fernandes (C), Mbeumo, Gibbs-White, Gomez,
      Semenyo; Barry; bench Dubravka, Mitchell, João Pedro, Obi), Gibbs-White out and
      Mitchell on for 0, the Triple Captain on its captain: 9 + 8 + 6 + 1 + 4 + 1×3 + 8 +
      0 + 8 + 1 + 2 = **50**, against our 78: **+28 this week, +31**. Most of it is
      Haaland, who the roll did not own. *B.Fernandes against Gibbs-White:* 1 against 0
      (did not play), **-1, running 0**. *Gabriel against Murillo:* 8 against 2, **+6,
      running +6**, though Gabriel's 8 was on our bench and counted for nothing.

---

## Learnings

### What we got right

- **The Triple Captain, now.** Played for certainty over a calc that tied GW7 with GW11
  and GW15, and the certainty paid: 90 minutes, two goals, three bonus, **+13**. Haaland
  went `d` 75% (unspecified injury) on 19 Oct, the day after. Holding the chip for a
  later tie-week would now be holding it on a flagged player.
- **The armband was the field's armband.** Same player, same score, so the ledger stays
  at **+4** and the whole TC margin is ours over the 23% who do not own him and over the
  managers who already spent the chip in GW3.
- **The Brighton answer.** The club rule asked for one of ours in BHA v CRY; Gomez scored
  8, more than Groß or De Cuyper. Our cheaper pick beat the template version.
- **The DC floor held again.** Van Hecke 11, Thomas 10, Hall 10, Le Fée 12: four of four
  starting DC-profile players banked the +2, for 15 from four slots with one clean sheet
  between them in the XI (Raya's). Gabriel on the bench made it five.
- **The template was priced and it was right to cover it.** João Pedro blanked at 72.8%
  owned, which cost us nothing against the field. Owning the two biggest template players
  turned a bad week for them into a level one for us.

### What we got wrong

- **The -4 sold a fit player.** Branthwaite's `d` 75% went up on 16 Oct; the sale was made
  at 04:10 UTC on 17 Oct, six hours before the deadline; by the 11:11 lock read the flag
  was gone and he played 90. Van Hecke beat him by 3, so the hit cost 1 instead of the
  calc's 3.2, but it was a loss the model said it would be, bought on a flag that did not
  survive the morning.
- **Gabriel last on the bench, again the wrong defender.** 3.5 on the calc at Forest; 8 on
  the day (clean sheet, DC 12). Arsenal have the best defence in the league by a distance
  (0.78 xGA a game) and Raya's clean sheet came from the same game. Two weeks, two rules
  (FDR in GW6, calc in GW7), two benched clean sheets. The third-defender gap was 0.7
  (Hall 4.2 against Gabriel 3.5), inside the model's noise, and the model's DC-first
  weighting rated Gabriel's DC90 below Hall's and Guéhi's while his team's clean-sheet
  chance was the best of the three.
- **João Pedro over Thiago, -2 on the players.** Not a mistake on its own terms (the case
  was ownership, not points, and it held level against the field), but the model's own
  pick (Gibbs-White → Groß, no hit) would have scored **82**, +4 on what we played. The
  steer was priced at half a point and cost about four.
- **Janelt, red card, DC 11.** The accepted-risks line named four yellows and a one-match
  ban; it was a straight red. -1 in the XI and a dead slot for GW8.

### Gut calibration

**Won on the chip, not on the squad.** The Triple Captain was 13 of the +19 over the
average; Haaland at x2 was another 26 the field shared. The other ten starters returned
43, about what an average week returns. The squad decisions made this week (the -4, João
Pedro, Le Fée) were -1, -2 and 0. The ones that carried it were made earlier: Haaland in
the wildcard, the TC held to a home fixture.

**Human against model, scored honestly.** Two human calls (the steer for João Pedro, the
-4 for a defender out) against the model's own FT pick. The model's pick was **+4**. The
human's reasoning (template cover, a fresh injury flag) was sound and both reasons
evaporated by kick-off: João Pedro's ownership was neutral because he blanked, and
Branthwaite's flag lifted. Running: B against A **+6** (human), -4 against A **-1**
(model). Level-ish over two weeks, with the armband doing more than any transfer.

**Rank.** +953k, back to **2.47m**, about 90k behind GW5's best (2.38m). The wildcard squad's
three weeks: 49, 78, and the week of the chip. GW8 is the first test of it without the
armband multiplier.

### Adjustments for next time

1. **Janelt is suspended for GW8** (straight red, `s` 0%, "Suspended until 31 Oct", BRE
   at Hull on 25 Oct). He is a dead slot for one week and back for BRE v NFO (GW9) on
   FPL's date. **He does not start in GW8.** He is benched, not sold, unless the one FT
   has nothing better to do: a £5.0m midfielder with DC90 13 and a ban that ends in a
   week is not a sale on its own. If he is benched, Gibbs-White (if `a`) or a defender
   takes the slot on the calc.
2. **Haaland is `d` 75% (unspecified injury, news 2026-10-19 13:00).** Fresh news, so GW6
   adjustment #1 reads it at **75%**, not lower and not higher. He is 76.7% owned: **never
   sold on this flag** (same rule). Read City's Thursday presser before the GW8 research
   run picks a captain; if he is ruled out, the armband goes on the model, and the vice
   must be a player who starts.
3. **Execute an injury-driven sale as late as the deadline allows, and re-read the flag
   first.** The -4 was executed six hours before the deadline on a 34-hour-old `d` 75%
   that cleared before the lock. Any transfer whose case is an injury flag waits for the
   club's last presser or the last FPL flag update before the deadline, and is re-checked
   immediately before it is made. If the flag has moved to `a`, the move is re-priced
   without the injury.
4. **The third-defender slot: under 1.0 calc, break the tie on clean-sheet probability.**
   GW6 and GW7 each benched the defender who then kept a clean sheet. The model's
   DC-first weighting is right for the floor and wrong for the ceiling. When the
   defenders competing for the last XI slot are within **1.0 xP**, the one with the
   highest team clean-sheet probability starts. In GW8 that is Gabriel (ARS v EVE at
   home, Arsenal 0.78 xGA a game) against Hall (at CRY) and Guéhi (at AVL).
5. **A hit is only paid when the second move wins in its own week before the -4.** The
   -4 was priced at -3.2 net and taken for a reason off the calc. It lost 1. The GW8+
   rule: no hit unless the move's own-week calc is **≥ +4** or a starter is ruled out
   (`i`, `s`, or `d` 0-25%) with no legal bench cover.
6. **Score the steer the model was overruled for.** The proposal wrote down the model's
   own pick (Gibbs-White → Groß) next to the steer, and it was the best of the three. Keep
   doing that every week, and carry a running total "model's FT against the played FT":
   **GW7: -4** (model 82, played 78).
7. **Carry the running totals to GW11:** B against A **+6**, wildcard against the roll
   **+31**, B.Fernandes against Gibbs-White **0**, Gabriel against Murillo **+6**, -4
   against A **-1**, João Pedro against Thiago **-2**, model's FT against the played FT
   **-4**.
8. **GW8 opens with 1 FT and £0.8m ITB.** The candidates, in order: Janelt's slot is
   covered by the bench (#1), so the FT goes to the squad's weakest long-term slot:
   Dubravka (0 minutes in seven) if a Bench Boost is in view, otherwise Hall or
   Gibbs-White (`d` 75%, muscular, 0 minutes in GW7) on the calc. Barry is at Arsenal in
   GW8 against Raya and Gabriel: a clash to price, not to resolve on reflex.

### Chip planning notes

- **Triple Captain: spent (GW7), Haaland v Ipswich, +13.** The tie-weeks (GW11, GW15,
  GW16) get a one-line score in their own logs, so the "play it now for certainty" call
  is judged on the whole half and not one week.
- **Bench Boost: two moves from live.** The bench returned 9 this week (Gabriel 8, Guéhi 1,
  Dubravka 0, Gibbs-White 0). Dubravka is still a 0-minute keeper in his seventh week and
  Gibbs-White is `d` 75%. A playing £4.0-4.5m keeper and a fit fourth outfielder make it a
  chip. Expires **GW19**; a double gameweek before then would be the week, if FPL
  announces one.
- **Free Hit:** held. No DGW or BGW known before GW19. The emergency cover for a week the
  squad cannot field eleven, which a Haaland absence plus Janelt's ban plus a Gibbs-White
  flag is closer to than it was.
- **Wildcard:** first half spent in GW6. The second-half wildcard opens from GW20.
