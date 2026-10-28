# GW9 Decision Log: SILVA FOR HALL, JOÃO PEDRO BENCHED NOT SOLD, HAALAND AT HOME TO BRIGHTON

**Deadline:** Saturday 2026-10-31 11:00 UTC (12:00 Oslo)
**Fixtures:** Sat-Mon (Oct 31-Nov 2), single GW, no DGW/BGW. First game CHE v MUN, Saturday 12:30 UTC, 90 minutes after the deadline (Mbeumo plays in it). Last game NEW v EVE, Monday 20:00 UTC (Barry).
**Date of analysis:** 2026-10-28 (proposal, from the gameweek loop's research run, T-72h)
**Proposal page:** https://artifacts.go.vongohren.me/life/fpl-gw9-proposal

---

## Pre-GW Context

### Squad state (pre-transfer)
- **Budget:** £1.3m ITB, **1 free transfer** (live `budget.free_transfers`, as GW8 adjustment #8 expected)
- **Squad value:** £98.5m (sell value £98.2m) + £1.3m ITB
- **Chips:** BB, FH available and playable, first-half set, **both expire GW19**. Wildcard spent GW6, Triple Captain spent GW7
- **Rank:** 1,573,483 after GW8, season total 514
- **Auth:** `get_my_squad` authenticated, `is_stale: false`

### Season so far
| GW | Pts | Avg | Bench | Rank |
|---|---|---|---|---|
| 1 | 46 | 50 | 5 | 5,572,584 |
| 2 | **93** | 81 | 0 | 3,345,863 |
| 3 | 52 net (56 gross, -4) | 51 | 0 | 3,504,624 |
| 4 | **75** | 69 | 3 | 3,200,152 |
| 5 | 58 | 48 | 8 | 2,376,841 |
| 6 | 49 (WC) | 58 | 11 | 3,420,647 |
| 7 | **78 net** (82 gross, -4, TC) | 59 | 9 | 2,467,338 |
| 8 | **63** | 45 | 2 | **1,573,483** |

### Prior-decision context: the GW8 constraints

[GW8](gw8.md) left eight adjustments and a chip note. Read as constraints:

1. **"João Pedro is `d` 75%... never sold on this flag unless the club rules him out for
   weeks... if he is ruled out, he is benched, not sold, and the FT stays on #3."** *Applied
   half, overtaken half.* The flag moved to **`i` 0%, "Thigh injury - Unknown return date"**
   (news 24 Oct 16:30), and on 27 Oct Xabi Alonso said he is **"out for a few weeks"**
   ([The False 9](https://thefalse9.com/2026/10/joao-pedro-injury-return-date.html)). That is
   the "ruled out for weeks" exception, so a sale is allowed. It is not chosen: the model
   prices every João Pedro sale below the move it does pick (see The transfer), so he is
   **benched, not sold**, as the second half of #1 says. **"The FT stays on #3" is
   overridden**, see #3.
2. **"Thomas is `d` 75%... read at 75%... benched only if the club rules him out."**
   *Applied.* Still `d` 75% ("Unspecified injury", 24 Oct 17:00), no news since that rules
   him out. He **starts**, with Murillo first on the bench. The numbers agree (The XI below).
3. **"The GW9 FT goes to midfield: Gibbs-White → Tavernier, re-priced first... it is the
   default unless something in the squad is ruled out."** *Re-priced, and overridden on the
   rule's own condition.* Something is ruled out (João Pedro, `i`), which makes this a
   **necessary-change week**, and in a necessary-change week the model picks. Gibbs-White →
   Tavernier is now **+0.86 in GW9 and +3.4 over GW9-14**; Hall → Silva is **+1.14 and +5.7**.
   2.3 apart over six, outside the 1.5 tie band, so the price tiebreak never fires (both
   buys are rising anyway). Tavernier is written down as the alternative to score.
4. **"When a player's injury flag clears to `a` before the deadline, the sale is priced like
   any other move."** *Applied.* Gibbs-White is `a` 100 and priced like any other sale (third
   on the list, above).
5. **"Janelt is back for GW9 (BRE v NFO, against Murillo)... price it with the hedging rule,
   and do not start both on reflex."** *Applied, and resolved by #2.* With Thomas starting,
   Murillo is on the bench, so the Janelt v Murillo pair is not in the XI. Janelt v
   Gibbs-White (same game, a DC midfielder against an attacking one) is priced in the
   hedging check and kept.
6. **"Keep the clean-sheet tiebreak (GW7 #4)."** *Applied.* Thomas against Murillo for the
   last defender slot is 0.46 apart on the calc (under 1.0), and Coventry at home to
   Sunderland is the higher clean-sheet chance (27% against 21%): Thomas starts.
7. **Running totals.** *Carried to the watch flags:* B against A **+21**, wildcard against
   the roll **+53**, B.Fernandes against Gibbs-White **+2**, Gabriel against Murillo **+22**,
   -4 against A **+6**, João Pedro against Thiago **-7**, model's FT against the played FT
   **-4**, and to GW13: Guéhi → Murillo **+1**, Murillo against Calafiori **0**.
8. **"GW9 opens with 1 FT and £1.3m ITB... Record Calafiori's and Murillo's prices at it."**
   *1 FT and £1.3m confirmed.* At research time: **Calafiori £6.0m** (`d` 75% hip, -274.7k
   net, falling), **Murillo £5.5m** (flat). The deadline prices go in at the lock.

**Chip note:** *"Bench Boost: still two moves from live."* Now three: Dubravka (0 minutes in
eight), João Pedro (`i`) and a fourth outfielder. *"Free Hit: emergency cover if João Pedro's
knee and Thomas's flag turn into absences alongside another."* João Pedro is out, Thomas is
75%, and the squad still fields a legal eleven with Murillo and Gomez to spare: not needed.

---

## Flags & Key Signals

### Squad health

Live `bootstrap-static`, read 2026-10-28 11:10 UTC.

| Player | Flag | News | Read |
|---|---|---|---|
| **João Pedro** | `i` 0% | "Thigh injury - Unknown return date" (24 Oct 16:30) | GW8 called it a knee; the flag says thigh. Alonso on 27 Oct: "out for a few weeks", no date ([The False 9](https://thefalse9.com/2026/10/joao-pedro-injury-return-date.html)). The international break falls after GW10 (GW11 deadline 21 Nov), so GW11 is the earliest plausible return. The calc reads him at 0 for GW9-10 and 60% of his minutes share after, the page's default for `i` |
| **Thomas** | `d` 75% | "Unspecified injury - 75% chance of playing" (24 Oct 17:00) | Off at 59' v Fulham with a lower-leg issue (ice below the left knee). Lampard on 25 Oct: "hoping it's not too bad"; not ruled out of Sunderland, no update since ([dave.sport](https://dave.sport/news/bobby-thomas-injury-coventry-update/)). Read at 75% (GW8 #2) |

Everyone else `a`. Dubravka has played 0 minutes in eight. Janelt's ban is served. Gibbs-White's
GW8 flag is gone and he played 90.

### Team quality, underlying (8 games)

Team xG for and against per game from the live API, and the factors (shrunk 50% to the
league mean) that the calculation uses.

| Team | xGF/g | xGA/g | Att factor | Def factor | |
|---|---|---|---|---|---|
| ARS | 1.74 | **0.77** | 1.095 | **0.768** | Best defence. Raya, Gabriel (at LIV) |
| LIV | 1.52 | 1.19 | 1.021 | 0.913 | |
| BOU | 1.82 | 1.16 | 1.122 | 0.903 | **Silva (in).** Third-best defence, third-best attack |
| LEE | 1.34 | 1.32 | 0.958 | 0.957 | BOU's opponent |
| NFO | 1.76 | **1.11** | 1.100 | **0.884** | Murillo, Gibbs-White. Second-best defence |
| BRE | 1.73 | 1.46 | 1.093 | 1.007 | Janelt |
| COV | 0.96 | 1.47 | 0.828 | 1.009 | Thomas. Worst attack in the league |
| SUN | 1.43 | 1.83 | 0.990 | 1.136 | Le Fée |
| TOT | 1.03 | 1.22 | 0.852 | 0.924 | Van Hecke, Dubravka |
| CRY | 1.38 | 1.94 | 0.970 | 1.174 | |
| CHE | 1.31 | 1.42 | 0.946 | 0.991 | João Pedro (out) |
| MUN | 1.65 | 1.50 | 1.063 | 1.019 | Mbeumo |
| MCI | **2.12** | 1.37 | **1.223** | 0.976 | Haaland. Best attack |
| BHA | 2.07 | 1.42 | 1.209 | 0.991 | Gomez. Second-best attack, mid-table defence |
| NEW | 1.14 | 1.72 | 0.889 | 1.097 | Hall (out) |
| EVE | 1.24 | 1.42 | 0.922 | 0.991 | Barry |

### Fixture runs, GW9-14

| Team | GW9 | GW10 | GW11 | GW12 | GW13 | GW14 | Ours |
|---|---|---|---|---|---|---|---|
| ARS | LIV (a) 4 | HUL (H) 2 | NEW (a) 3 | MCI (H) 4 | BRE (a) 3 | TOT (a) 3 | Raya, Gabriel |
| COV | SUN (H) 3 | EVE (a) 3 | CRY (H) 2 | LEE (a) 3 | IPS (H) 2 | MUN (a) 4 | Thomas |
| NFO | BRE (a) 3 | MCI (H) 4 | BOU (a) 3 | CHE (H) 4 | HUL (a) 2 | BHA (H) 3 | Murillo, Gibbs-White |
| TOT | CRY (H) 2 | LEE (a) 3 | IPS (H) 2 | SUN (a) 3 | FUL (H) 2 | ARS (H) 4 | Van Hecke, Dubravka |
| **BOU** | **LEE (H) 3** | **IPS (a) 2** | NFO (H) 3 | FUL (a) 3 | BHA (H) 3 | **HUL (H) 2** | **Silva (in)** |
| MUN | CHE (a) 4 | AVL (H) 3 | LIV (a) 4 | BRE (H) 3 | NEW (a) 3 | COV (H) 2 | Mbeumo |
| SUN | COV (a) 2 | CHE (H) 4 | AVL (a) 3 | TOT (H) 2 | LIV (a) 4 | NEW (a) 3 | Le Fée |
| BHA | MCI (a) 5 | BRE (H) 3 | HUL (a) 2 | NEW (H) 3 | BOU (a) 3 | NFO (a) 3 | Gomez |
| MCI | BHA (H) 3 | NFO (a) 3 | FUL (H) 2 | ARS (a) 5 | LEE (H) 3 | BRE (a) 3 | Haaland |
| CHE | MUN (H) 4 | SUN (a) 3 | LEE (H) 3 | NFO (a) 3 | CRY (H) 2 | LIV (H) 4 | João Pedro |
| EVE | NEW (a) 3 | COV (H) 2 | BRE (a) 3 | LIV (H) 4 | AVL (a) 3 | FUL (H) 2 | Barry |
| NEW | EVE (H) 3 | FUL (a) 3 | ARS (H) 4 | BHA (a) 4 | MUN (H) 4 | SUN (H) 3 | **Hall (out)** |
| BRE | NFO (H) 3 | BHA (a) 4 | EVE (H) 3 | MUN (a) 4 | ARS (H) 4 | MCI (H) 4 | Janelt |

No DGW or BGW anywhere in GW9-19 on the current fixture list. International break between GW10
(deadline 6 Nov) and GW11 (21 Nov). Newcastle's run after GW10 is the worst of any defence we
own: ARS, BHA, MUN, three FDR 4s in a row.

### Squad prices

Read 2026-10-28 11:10 UTC: bought and sell from `get_my_squad`, the rest from `bootstrap-static`.
Rising or falling = net transfers past 2% of owners and at least 10k, else this round's price
change.

| Player | Bought | Now | Sell | Round Δ | Net transfers (of owners) | Read |
|---|---|---|---|---|---|---|
| Raya | 6.0 | 6.2 | 6.1 | **+0.1** | +47.8k (+0.9%) | **rising** |
| Thomas | 4.0 | 4.0 | 4.0 | 0 | **-34.0k (-3.3%)** | **falling** |
| Gabriel | 8.0 | 7.9 | 7.9 | 0 | **+150.2k (+5.9%)** | **rising** |
| Murillo | 5.5 | 5.5 | 5.5 | 0 | -3.1k (-1.3%) | flat |
| Van Hecke | 4.9 | 4.9 | 4.9 | 0 | **+78.9k (+9.0%)** | **rising** |
| Mbeumo | 8.0 | 7.9 | 7.9 | 0 | -23.9k (-1.0%) | flat |
| Le Fée | 5.7 | 5.7 | 5.7 | 0 | -4.8k (-1.5%) | flat |
| Gomez | 5.0 | 5.0 | 5.0 | 0 | +5.4k (+1.2%) | flat |
| Haaland | 15.6 | 15.8 | 15.7 | **+0.1** | +76.6k (+0.9%) | **rising** |
| João Pedro | 7.8 | 7.8 | 7.8 | **-0.1** | **-877.3k (-12.0%)** | **falling** |
| Barry | 5.6 | 5.6 | 5.6 | **-0.1** | **-43.1k (-5.3%)** | **falling** |
| Dubravka | 4.0 | 4.0 | 4.0 | 0 | -21.0k (-1.2%) | flat |
| **Hall** *(out)* | 5.1 | 5.3 | 5.2 | 0 | +2.6k (+0.1%) | flat |
| Gibbs-White | 8.0 | 7.9 | 7.9 | 0 | **-46.7k (-3.5%)** | **falling** |
| Janelt | 5.0 | 5.0 | 5.0 | 0 | **-13.4k (-7.1%)** | **falling** |
| ***Silva*** *(in)* | | 5.0 | | 0 | **+23.9k (+21.3%)** | **rising** |

**Rising:** Raya, Gabriel, Van Hecke, Haaland (and Silva, the buy). **Falling:** João Pedro (the
round's biggest seller in the game), Barry, Gibbs-White, Janelt, Thomas. **Sell value £98.2m
against £98.5m value**, plus £1.3m in the bank.

**Which case this week is: a necessary change.** João Pedro started GW8's XI and is now `i`.
So the model picks and price is only a tiebreak. It picks Hall → Silva (flat out, rising in).
Two price consequences are accepted, not chased:

- **João Pedro will lose value while he sits.** £7.8m sell now, -877k net: a further £0.1-0.2m
  before he is back is likely. That costs bank, not points: the GW10 budget for his slot is
  still £1.5m + £7.6m or so.
- **Gibbs-White is falling and was last week's named sale.** In a value-move week he would "go
  before the drop". This week the model's FT beats his sale by 2.3 over six, and a second move
  is a -4 that adjustment GW7 #5 forbids (+0.86 own-week). He is the GW10 front-runner with
  João Pedro's slot.

### Community (source: Brave via `get_community_trends` for transfers only, **WebSearch** for the rest)

Brave answered **429** again: the transfers angle came back partial (ten names, three queries),
captaincy and differentials came back **empty**. Both were re-run through `WebSearch` (The
False 9, Fantasy Football Scout, RotoWire, Fantasy Football Hub, Fantasy Football Fix,
fpl.page). Every claim below was checked against the API.

- **Captaincy: Haaland, by consensus.** [Scout](https://www.fantasyfootballscout.co.uk/2026/10/26/fpl-gameweek-9-early-scout-picks)
  calls him "the default Gameweek 9 captain" after goals in seven straight matches;
  [RotoWire](https://www.rotowire.com/soccer/article/fpl-gameweek-9-rankings-best-players-captain-picks-gw9-143855)
  ranks him first at 6.79, Palmer next at 5.93; [The False 9](https://thefalse9.com/2026/10/fpl-gw9-captain-picks.html)
  names N.Jackson (Villa v Fulham) as the alternative and calls Gabriel at Anfield "a punt, and a
  hard one". *Cross-check: Haaland £15.8m, 78.2% owned, 9 goals, `a`. Jackson £6.8m, 12.1%,
  547 minutes in 8 games, 3.35 calc in GW9: not a captain on our numbers.*
- **Transfers:** João Pedro is the most-sold player in the game ([The False 9](https://thefalse9.com/2026/10/fpl-gameweek-9-transfers-joao-pedro-sold-jackson-bought.html),
  578k on Tuesday alone); Jackson, Tavernier, Isak and Evanilson are the buys
  ([RotoWire](https://www.rotowire.com/soccer/article/fpl-gameweek-9-transfers-buy-hold-sell-gw9-144068)
  also says sell Saka, out until after the break, and Szoboszlai). [Fantasy Football Fix](https://www.fantasyfootballfix.com/blog-index/joao-pedro-injury-best-fpl-replacements-gw9/)
  ranks the replacements Jackson, Evanilson (best value), Calvert-Lewin, Barry (budget, we own
  him) and advises against Thiago. *Cross-check: João Pedro -877k net this round and -£0.1;
  Tavernier +597k, +£0.2 this round; Jackson +816k; Evanilson +269k. Agrees.* **We go
  against the crowd here:** the field sells João Pedro, we bench him. His GW9-10 points are 0
  either way; what the crowd buys with the FT is a forward, and our calc ranks every forward
  buy below Silva.
- **Differentials:** **Silva is on two lists.** [The False 9](https://thefalse9.com/2026/10/fpl-gameweek-9-differentials-doku-tonali-fresh-six.html)
  names him (0.9% owned, all 720 minutes) with Doku, Manzambi, Tonali, Muharemović and Rudoni;
  [fpl.page](https://fpl.page/article/fpl-gw9-best-players-to-buy-2627) is buying him "ahead of
  Leeds home"; RotoWire projects him at 5.02 (Hill 5.05, **Van Hecke 5.03**). Scout's GW8 notes:
  DC for the sixth time in eight ([Scout](https://www.fantasyfootballscout.co.uk/2026/10/25/fpl-notes-tavernier-goal-more-silva-defcon-why-bruno-wasnt-used)).
  [FFHub](https://www.fantasyfootballhub.co.uk/articles/fantasy-premier-league-ultimate-guide-fpl-tips)
  adds Kudus, Evanilson and Belloumi. *Cross-check: Silva £5.0m, 1.0%, 720/720, DC 6 of 8 (API
  history). Muharemović (LEE, £5.1m) is in our search at +3.5 over six out of Hall, below
  Silva; he plays Silva in GW9. Porro, fpl.page's top defender, is injured.*
- **Hot topics:** price rises and falls, Free Hit use, injury updates, wildcard timing, chip
  planning.

---

## Analysis

### Method: the GW6 model, unchanged

The calculation the proposal page shows (`scripts/gw-loop/proposal-page.mjs`), run over every
player in the game from a scratch copy so the options are priced on exactly the page's numbers:

```
xPts per fixture = P(start) × [ 2 + (xG90 × goal_value + xA90 × 3) × attack_mult
                 + P(CS) × cs_value − 0.5 × λ_against (GK/DEF) + 2 × P(DC threshold)
                 + saves (GK) + bonus ]
xG90, xA90  shrunk halfway to the positional mean
team xGF/xGA from underlying xG, shrunk halfway to the league mean
P(start)    = minutes share × FPL flag; João Pedro 0 for GW9-10 (`i`), Thomas 0.75 × his share
```

Each option is scored as the best legal XI and captain of its fifteen, re-picked every week,
summed over GW9-14. Every new player passed the minutes gate (GW4 adjustment #2: 300+
minutes, `a` or `d`) before form, xGI or DC were looked at, and the hedging rule flags any buy
that plays our own players in GW9.

### The transfer: Hall → Silva, free

Exhaustive search over every single free transfer (every owned player against every eligible
player in the same position, budget £1.3m + sell, club limit checked):

| Move | GW9 | GW9-14 | Bank | GW9 hedge | Price | Note |
|---|---|---|---|---|---|---|
| **Hall → Silva (BOU)** | **+1.14** | **+5.7** | £1.5m | none | rising | **The proposal.** Best over six, second-best in GW9 |
| Hall → Hill (BOU) | +1.04 | +5.1 | £1.0m | none | rising | Silva's partner, £0.5m dearer |
| Thomas → Silva | +1.27 | +4.2 | £0.3m | none | rising | Best in GW9; Thomas outscores Hall over six (24.6 against 21.3) and sells for £1.2m less |
| João Pedro → Thiago (BRE) | +0.72 | +4.0 | £1.3m | **v Murillo, Gibbs-White** | flat | Best João Pedro sale. Fails the hedging rule (BRE v NFO) |
| Gibbs-White → Tavernier (BOU) | +0.86 | +3.4 | £2.8m | none | rising | GW8 #3's default. Written down to score |
| João Pedro → Evanilson (BOU) | +0.48 | +2.5 | £2.9m | none | rising | Best clean João Pedro sale |
| João Pedro → N.Jackson (AVL) | 0.00 | 0.0 | £2.3m | none | rising | Most-bought forward (+816k). Never makes our XI on the calc |
| Hall → Calafiori (ARS) | -0.28 | -0.4 | £0.5m | none | falling | Template (51.6%, 46 of the top 50). `d` 75% hip, falling |

*(GW9-14 deltas are re-picked best XIs against the roll: 326.7 against 321.0.)*

| | Hall (out) | Silva (in) |
|---|---|---|
| Club | NEW | BOU |
| Price | £5.3m (sell 5.2, flat) | £5.0m (rising, +21.3% of owners this round) |
| Minutes / starts | 719 / 8 | **720 / 8** |
| Points | 40 | 29 |
| Points by week | 3, 11, 4, 0, 13, 0, 4, 5 | 2, 4, 1, 3, 3, 0, **8, 8** |
| DC by week (threshold 10) | 11, 13, 6, 6, 10, 6, 10, 8 (**4 of 8**) | 13, 10, 8, 10, 15, 5, 12, 11 (**6 of 8**) |
| Clean sheets | 2 | 2 (the last two) |
| Team xGA a game | 1.72 | **1.16** (third-best) |
| GW9 | EVE (H) 4.01 | **LEE (H) 5.15** |
| GW9-14 calc | 21.3 | **29.2** |
| Owned | 20.5% | 1.0% |

Hall has more points (40 to 29), most of them in two weeks (11 and 13) on an xGI90 of 0.15.
What he does not have is a floor or a run: DC 4 of 8, a defence conceding 1.72 xG a game, and
after Everton three FDR 4s in a row (ARS, BHA, MUN). Silva plays every minute, has banked the
DC +2 in 6 of 8 and kept clean sheets in the last two, and Bournemouth's next six are the
kindest a defence we could buy has (LEE, IPS, NFO, FUL, BHA, HUL). The model likes the same
thing it liked in Murillo: the floor. GW8's lesson is that a floor is a rate (Murillo's DC 4),
so the case is 6 of 8, not "always".

**Why Hall and not Thomas.** Thomas → Silva is the best GW9 move (+1.27, Thomas is 75%), but
over six Thomas is the better player to keep (24.6 against 21.3) and Hall sells for £5.2m
against Thomas's £4.0m: Hall out leaves £1.5m for João Pedro's slot, Thomas out leaves £0.3m.

**Why not João Pedro.** He is ruled out for weeks, so selling is allowed (GW8 #1). On the calc
his slot is worth less to fix than Hall's, because the bench already covers it: Gibbs-White and
Janelt come into a 4-4-2 at 3.9-4.1. The one sale that beats Silva in GW9 alone, Thiago, plays
against Murillo and Gibbs-White (BRE v NFO) and fails the hedging rule. A 65%-owned player
coming back after the break is the one we would most regret having sold at £7.6m and bought
back at £7.8m+. Re-run in GW10 with his news.

**Why not Tavernier (GW8 #3).** He is the community's buy (+597k this round, 19.2% owned, 5 goals
in 8) and rising, and his move is good: +3.4. Silva's is better by 2.3 over six, and the
necessary-change rule says the model picks. Writing it down as the line to score: if
Tavernier outscores Silva by more than the 2.3 the calc gave Silva, GW8's lesson ("the
midfielder was the week") has a second data point.

### The template, priced (GW6 adjustment #2)

Players owned by 30%+, or fielded by 60%+ of the overall top 50 in GW8, that we will not own:

| Player | Club | £ | Owned | Top 50 fielded | GW9 | calc | owned × calc |
|---|---|---|---|---|---|---|---|
| Rogers | CHE | 8.0 | 50.1% | 84% | MUN (H) | 4.36 | 2.18 |
| Groß | BHA | 6.2 | 46.3% | 80% | MCI (a) | 3.89 | 1.80 |
| Calafiori | ARS | 6.0 | 51.6% | 92% | LIV (a) | 2.43 *(`d` 75%)* | 1.25 |
| De Cuyper | BHA | 5.3 | 42.6% | 56% | MCI (a) | 2.94 | 1.25 |
| Palmer | CHE | 9.8 | 27.4% | 64% | MUN (H) | 4.03 | 1.10 |
| Konsa | ARS | 4.7 | 20.2% | 86% | LIV (a) | 2.61 | 0.53 |
| | | | | | | **sum** | **8.1** |

Haaland (78.2%, 50 of 50) is ours. **By club:** the top 50 fields two or more Arsenal and
Chelsea players; Arsenal are at Anfield and Chelsea host United without João Pedro, so it does
not fire. Rogers and Palmer play Mbeumo; Groß and De Cuyper play Haaland, the side we are long
on.

### The captaincy, from scratch

| Candidate | GW9 | Attacking calc (per start) | Total calc (per start) | P(start) | Owned |
|---|---|---|---|---|---|
| **Haaland** | MCI v BHA | **2.85** | **5.53** | 0.98 | 78.2% |
| Barry | EVE at NEW | 2.26 | 4.86 | 0.95 | 7.3% |
| Mbeumo | MUN at CHE | 1.86 | 4.59 | 1.00 | 21.5% |
| Janelt | BRE v NFO | 0.89 | 4.67 | 0.88 | 1.7% |
| Gibbs-White | NFO at BRE | 1.69 | 4.42 | 0.88 | 11.9% |
| Le Fée | SUN at COV | 1.50 | 4.22 | 0.95 | 2.8% |

**Captain Haaland: 5.44 against 4.60 for the next-best (Barry), 0.84 clear.** Over GW6 #5's 0.5
line, so this is the model's pick and not a tiebreak, and it is the field's pick too: 37 of the
top 50 captained him in GW8 and he was `most_captained`. Brighton have the second-best attack in
the league and a mid-table defence (1.42 xGA); City create the most. At 78.2% owned and
captained by most of the field, his effective ownership is well above 100%: not captaining him
is the one big loss on the board, again.

**Vice: Mbeumo.** Barry is better per start (4.86 against 4.59) but starts less often (0.95
against 1.00), so as a vice they are level (4.60 against 4.59). Mbeumo has not missed a minute
in eight games. With Haaland `a` 100 the vice is worth about 0.01 either way.

### The XI: 4-4-2, and the bench

Raya; **Silva**, Van Hecke, Gabriel, Thomas; Mbeumo, Janelt, Le Fée, Gibbs-White;
**Haaland (C)**, Barry.

| Pos | Player | GW9 | calc | CS | Why there |
|---|---|---|---|---|---|
| GK | Raya | LIV (a) | 3.65 | 29% | Best defence, hardest fixture of the run |
| DEF | **Silva** | LEE (H) | 5.15 | **32%** | The buy. Best defender on the calc this week |
| DEF | Van Hecke | CRY (H) | 4.62 | 31% | Clean sheet at Chelsea; Palace create 1.38 xG a game, the defence that concedes most (1.94) is theirs |
| DEF | Gabriel | LIV (a) | 4.31 | 29% | 17 last week. Arsenal's 0.77 xGA travels |
| DEF | Thomas | SUN (H) | 3.57 *(5.07 per start)* | 27% | GW8 #2 and #6, see below |
| MID | Mbeumo **(V)** | CHE (a) | 4.59 | | 720 of 720 minutes |
| MID | Janelt | NFO (H) | 4.08 | | Back from the ban. DC 12+ in 5 of 7 |
| MID | Le Fée | COV (a) | 4.02 | | Coventry have the worst attack and concede 1.47 |
| MID | Gibbs-White | BRE (a) | 3.87 | | 0.76 xG last week for 2 points |
| FWD | **Haaland (C)** | BHA (H) | 5.44 | | |
| FWD | Barry | NEW (a) | 4.60 | | Newcastle concede 1.72 xG a game. Hall's sale removes the Barry v Hall clash |

**Thomas over Murillo.** On the page's calc Murillo is 0.46 ahead (4.03 against 3.57), all of it
Thomas's 75% flag: per start Thomas is **5.07** (DC90 11.7, Coventry at home, 27% clean sheet)
and Murillo 4.03 (21%, at Brentford). With Murillo **first on the bench**, a Thomas no-show
autosubs Murillo in, so the slot is worth 3.57 + 0.30 × 4.03 = **4.76** against Murillo's 4.03.
GW8 #2 says the same thing in words ("benched only if the club rules him out") and #6 breaks a
sub-1.0 gap on clean-sheet odds, which Thomas wins. The page will show the proposed XI 0.46
below its own best XI; this paragraph is why.

**Bench: Dubravka → Murillo → Gomez → João Pedro.** Ordered on minutes certainty and cover:
Murillo `a` (719 of 720 minutes) covers Thomas first and makes every autosub legal (a defender
for a defender, or into 5-3-2 / 5-4-1); Gomez `a` (700 minutes) second; João Pedro `i` last.

**Friday branch:** if Coventry rule Thomas out at their presser, swap him for Murillo in the XI
(Gomez second on the bench). Nothing else changes.

### Hedging check

| GW | Clash | Price |
|---|---|---|
| 9 | **Janelt v Gibbs-White** (BRE v NFO) | Benching Janelt for Gomez costs **0.36**. Kept: Janelt's points are DC (xG90 0.08), not goals, and do not come out of Gibbs-White's |
| 9 | **Thomas v Le Fée** (COV v SUN) | Benching Le Fée for Gomez costs **0.29**. Kept: Coventry have the worst attack in the league (0.96 xG a game), Le Fée's side is the one Thomas's clean sheet is against, and Thomas's points are DC-led |
| 9 | Murillo (bench) v Janelt | Only if Thomas misses. Priced into the 4.76 |
| 9 | Gomez (bench) v Haaland (BHA at MCI) | We own no City defender; attacker against attacker |
| 9 | ~~Barry v Hall~~ (NEW v EVE) | **Removed by the sale** |
| 11 | Silva v Murillo, Gibbs-White (BOU v NFO) | Priced in the six-week number. A GW11 call |
| 13 | Silva v Gomez (BOU v BHA) | Same |
| 10 | Murillo v Haaland (NFO v MCI) | Carried from GW8 |

### Chips

- **Bench Boost: hold.** Bench this week is Dubravka (0 minutes in eight), Murillo, Gomez and an
  injured João Pedro. No DGW is known before GW19.
- **Free Hit: hold.** The squad fields a legal eleven with two outfielders to spare. No DGW or BGW
  in sight.

---

## Proposal

### Do this in the app

1. **Transfer: Hall → Silva** (BOU, DEF, £5.0m; 1 FT, no hit). Silva is rising (+21% of his
   owners this round): do it early, not at the deadline. Bank £1.3m → **£1.5m**.
2. **Formation 4-4-2:** Raya; Silva, Van Hecke, Gabriel, Thomas; Mbeumo, Janelt, Le Fée,
   Gibbs-White; Haaland, Barry.
3. **Captain: Haaland. Vice: Mbeumo.**
4. **Bench order:** Dubravka, Murillo, Gomez, João Pedro.
5. **No chip.**
6. **Friday (Coventry presser):** if Thomas is **ruled out**, swap him for Murillo. If he is only
   "a doubt", leave it: Murillo is first on the bench.

### Transfers

| OUT | £ (sell) | IN | £ |
|---|---|---|---|
| Hall (NEW, DEF) | 5.2 | **Silva** (BOU, DEF) | 5.0 |

Cost: **0 (1 FT)**. Bank £1.3m → **£1.5m**.

### Projected XI (4-4-2)

| Pos | Player | Team | £m | GW9 | calc |
|---|---|---|---|---|---|
| GK | Raya | ARS | 6.2 | LIV (a) | 3.65 |
| DEF | **Silva** | BOU | 5.0 | LEE (H) | 5.15 |
| DEF | Van Hecke | TOT | 4.9 | CRY (H) | 4.62 |
| DEF | Gabriel | ARS | 7.9 | LIV (a) | 4.31 |
| DEF | Thomas | COV | 4.0 | SUN (H) | 3.57 |
| MID | Mbeumo **(V)** | MUN | 7.9 | CHE (a) | 4.59 |
| MID | Janelt | BRE | 5.0 | NFO (H) | 4.08 |
| MID | Le Fée | SUN | 5.7 | COV (a) | 4.02 |
| MID | Gibbs-White | NFO | 7.9 | BRE (a) | 3.87 |
| FWD | **Haaland (C)** | MCI | 15.8 | BHA (H) | 5.44 |
| FWD | Barry | EVE | 5.6 | NEW (a) | 4.60 |

**Calculated XI: 47.9 before the armband, 53.4 with it** (the model's own best XI of this
fifteen, Murillo for Thomas: 53.8; the roll: 52.7).

**Bench:** Dubravka (GK) → Murillo (DEF, `a`) → Gomez (MID, `a`) → João Pedro (FWD, `i`).

**Projected state after:** £98.2m squad, £1.5m ITB. ARS×2, TOT×2, NFO×2, one each of BOU, COV,
BRE, MUN, BHA, SUN, MCI, EVE, CHE. Chips left: BB, FH (first half, expire GW19). GW10 opens
with **1 FT**.

### Zero-transfer alternative

Roll the FT (2 FTs in GW10), keep Hall. The model's XI is then Raya; Van Hecke, Gabriel,
Murillo, Hall; Mbeumo, Janelt, Le Fée, Gibbs-White; Haaland (C), Barry; same captain and vice.

**Expected cost: 1.1 in GW9 (52.7 against 53.8 on the model's best XIs) and 5.7 over GW9-14**
(321.0 against 326.7, re-picked weekly). Two FTs in GW10 would let João Pedro's slot and
Gibbs-White be fixed together after the next news, which is the case for rolling; against it,
Silva is rising now, and Hall's run turns bad after Everton.

### Chip strategy
**No chip.** BB and FH remain, both expiring **GW19**.

---

## Accepted risks

- **João Pedro sits on the bench injured, and falling.** A dead bench slot for two to four weeks
  and £0.1-0.3m of sell value. Selling him is allowed and was priced; it loses to Silva.
- **Thomas starts on a 75% flag.** Murillo covers a no-show; he does not cover Thomas going off
  early again (59' v Fulham).
- **Silva has 29 points**, two clean sheets, both in the last two weeks, and is 1.0% owned. He is
  bought for a DC rate (6 of 8) and Bournemouth's fixtures, not for his returns.
- **Tavernier, the most-bought midfielder in the game, stays unowned** at 19.2% and rising.
  Gibbs-White, falling, stays.
- **Raya and Gabriel at Anfield**, FDR 4: the hardest fixture for the two Arsenal players in the
  six-week run.
- **Two same-game pairs in the XI:** Janelt v Gibbs-White (BRE v NFO) and Thomas v Le Fée (COV v
  SUN). Priced at 0.36 and 0.29 to remove; kept.
- **The unowned template sums to 8.1**, led by Rogers (2.18) against Mbeumo.
- **Silva's price may rise before the move** (+23.9k on 112k owners): a rise to £5.1m still
  leaves £1.4m.

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
| 8 | Haaland *(AVL away, FDR 3; `d` 75% cleared 20 Oct, "100%" at Thursday's presser)* | 8 (16) | Haaland *(`most_captained`)* | 8 (16) | **0** *(same player)* | **+4** |
| 9 | Haaland *(BHA home, FDR 3)*, proposed | | Haaland *(expected: 37 of the top 50 in GW8)* | | | |

If Haaland does not play, the armband passes to Mbeumo and the field's to whoever their vices
are; the lock should record the captain who actually carried the multiplier.

---

## Watch flags for GW9

- [ ] **Hall → Silva (the model's FT).** Silva's points minus Hall's, GW9 and running to GW14. The
      calc had +1.1 in GW9 and +5.7 over six. Did Silva bank DC, and did Hall return against
      Everton (and against Barry)?
- [ ] **Gibbs-White → Tavernier, GW8's default that the model overruled.** Tavernier's points
      against Silva's, and Gibbs-White's in our XI. Start a running total "Silva against
      Tavernier". Also Tavernier's price at the deadline (£6.4m at research, rising).
- [ ] **João Pedro benched, not sold.** Zero by construction. Price at the deadline (£7.8m,
      sell £7.8m at research) and the news at the GW10 research run.
- [ ] **Thomas over Murillo (GW8 #2 and #6).** Did Thomas start, how long did he play, and the
      points of each. Did the autosub fire?
- [ ] **The armband on Haaland v Brighton.** His points against Barry's and Mbeumo's (0.84 and
      0.85 behind on the calc).
- [ ] **Janelt v Gibbs-White (BRE v NFO).** What did the two return together?
- [ ] **Thomas v Le Fée (COV v SUN).** Same question, and did a Le Fée return cost Thomas a clean
      sheet?
- [ ] **The template, priced at 8.1.** Sum the unowned template's actual points × ownership.
- [ ] **Calafiori's and Murillo's prices at the deadline** (GW8 #8): £6.0m and £5.5m at research.
- [ ] **Running totals to GW11:** B against A (+21), wildcard against the roll (+53),
      B.Fernandes against Gibbs-White (+2), Gabriel against Murillo (+22), -4 against A (+6),
      João Pedro against Thiago (-7), model's FT against the played FT (-4); to GW13: Guéhi →
      Murillo (+1), Murillo against Calafiori (0). Add GW9.

---

## Outcome

*To be filled in after GW9 finalises. Respect the finalisation gate from GW1:*
*`events[8].finished = true`, `data_checked = true`, and `automatic_subs` populated.*
*Per GW4 adjustment #6, check the live `bootstrap-static` endpoint, not `get_fixtures.is_finished`.*

**Actual points:**
**Overall rank:**
**GW rank:**
**Season total:**
**Most captained in the game:**

| Player | Min | Pts | Notes |
|---|---|---|---|
| Raya | | | |
| Silva | | | |
| Van Hecke | | | |
| Gabriel | | | |
| Thomas | | | |
| Mbeumo (V) | | | |
| Janelt | | | |
| Le Fée | | | |
| Gibbs-White | | | |
| Haaland (C) | | | |
| Barry | | | |
| *Bench: Dubravka* | | | |
| *Bench: Murillo* | | | |
| *Bench: Gomez* | | | |
| *Bench: João Pedro* | | | |
| *Sold: Hall* | | | |

### Flag outcomes

- [ ] Hall → Silva:
- [ ] Gibbs-White → Tavernier:
- [ ] João Pedro benched, not sold:
- [ ] Thomas over Murillo:
- [ ] The armband on Haaland v Brighton:
- [ ] Janelt v Gibbs-White:
- [ ] Thomas v Le Fée:
- [ ] The template, priced at 8.1:
- [ ] Calafiori's and Murillo's prices:
- [ ] Running totals to GW11:

---

## Learnings

### What we got right

### What we got wrong

### Gut calibration

### Adjustments for next time

### Chip planning notes
