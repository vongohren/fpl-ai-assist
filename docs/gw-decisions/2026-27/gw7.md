# GW7 Decision Log: JOÃO PEDRO BACK IN, TRIPLE CAPTAIN HAALAND

**Deadline:** Saturday 2026-10-17 10:00 UTC
**Fixtures:** Sat-Mon (Oct 17-19), single GW, no DGW/BGW. All ten fixtures kick off after the deadline (first: EVE v CHE, 11:30 UTC).
**Date of analysis:** 2026-10-14 (proposal, from the gameweek loop's research run)
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
| 7 | **Haaland (TC)** *(IPS home, FDR 2)* | | Haaland *(expected; confirm `most_captained` after the deadline)* | | | |

If the field's captain is Haaland again, the ledger's swing is the third multiplier
alone: **+1x Haaland's points**. The ledger compares x2 against x2 by its own rule; the
lock and post-mortem should record the TC's extra multiplier in the row as a note so the
cumulative stays comparable with GW1-6.

---

## Watch flags for GW7

- [ ] **João Pedro over Thiago.** Straight comparison, GW7 and running to GW12. The calc
      had Thiago +0.5 in GW7 and level over six. Did owning the template pay, or cost?
- [ ] **The Triple Captain.** Haaland's points x3 against x2. And against the
      tie-weeks: what did he score in GW11 (FUL H), GW15 (CHE H) and GW16 (HUL H)?
- [ ] **João Pedro v Branthwaite.** Did the clash bite (a João Pedro goal with a
      Branthwaite clean sheet lost), and what did the pair return together?
- [ ] **Gibbs-White v Raya** (NFO v ARS), carried from GW6's B. Points of each, and
      whether one cost the other.
- [ ] **The XI on calc (adjustment #3).** Gomez over Le Fée, Hall over Guéhi, Gabriel
      last. Did the bench outscore the starters again, and did an autosub fire?
- [ ] **Brighton, covered by Gomez.** Groß and De Cuyper at home to Palace, unowned:
      what did they score, and what did Gomez return?
- [ ] **The template, priced at 9.9.** Sum the unowned template's actual points ×
      ownership against the calc.
- [ ] **Hall's last week before the sale.** Points and DC, against Guéhi on the bench.
- [ ] **João Pedro's price** at the time the move was made, and at the GW8 deadline.
- [ ] **Running totals to GW11:** B against A (+6), wildcard against the roll (+3),
      B.Fernandes against Gibbs-White (+1), Gabriel against Murillo (0). Add GW7.

---

## Outcome

*To be filled in after GW7 finalises. Respect the finalisation gate from GW1:*
*`events[6].finished = true`, `data_checked = true`, and `automatic_subs` populated.*
*Per GW4 adjustment #6, check the live `bootstrap-static` endpoint, not `get_fixtures.is_finished`.*

**Actual points:**
**Overall rank:**
**GW rank:**
**Season total:**
**Most captained in the game:**

| Player | Min | Pts | Notes |
|---|---|---|---|
| Raya | | | |
| Branthwaite | | | |
| Thomas | | | |
| Hall | | | |
| Janelt | | | |
| Mbeumo | | | |
| Gomez | | | |
| Gibbs-White | | | |
| Haaland (C, TC) | | | |
| Barry (V) | | | |
| João Pedro | | | |
| *Bench: Dubravka* | | | |
| *Bench: Le Fée* | | | |
| *Bench: Guéhi* | | | |
| *Bench: Gabriel* | | | |

### Flag outcomes

- [ ] João Pedro over Thiago:
- [ ] The Triple Captain:
- [ ] João Pedro v Branthwaite:
- [ ] Gibbs-White v Raya:
- [ ] The XI on calc:
- [ ] Brighton, covered by Gomez:
- [ ] The template, priced at 9.9:
- [ ] Hall's last week:
- [ ] João Pedro's price:
- [ ] Running totals to GW11:

---

## Learnings

### What we got right

### What we got wrong

### Gut calibration

### Adjustments for next time

### Chip planning notes
