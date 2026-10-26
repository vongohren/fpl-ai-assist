# GW8 Decision Log: MURILLO FOR GUÉHI, HAALAND'S FLAG CLEARS AND THE ARMBAND STAYS

**Deadline:** Friday 2026-10-23 17:30 UTC (19:30 Oslo)
**Fixtures:** Fri-Sun (Oct 23-25), single GW, no DGW/BGW. First game IPS v NFO, Friday 19:00 UTC, 90 minutes after the deadline (Murillo and Gibbs-White play in it).
**Date of analysis:** 2026-10-20 (proposal, from the gameweek loop's research run, T-71h)
**Proposal page:** https://artifacts.go.vongohren.me/life/fpl-gw8-proposal

---

## Pre-GW Context

### Squad state (pre-transfer)
- **Budget:** £0.8m ITB, **1 free transfer** (live `budget.free_transfers`, as GW7 adjustment #8 expected)
- **Squad value:** £98.9m (+£0.8m ITB)
- **Chips:** BB, FH available and playable, first-half set, **both expire GW19**. Wildcard spent GW6, Triple Captain spent GW7
- **Rank:** 2,467,338 after GW7
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
| 7 | **78 net** (82 gross, -4, TC) | 59 | 9 | **2,467,338** |

### Prior-decision context: the GW7 constraints

[GW7](gw7.md) left eight adjustments and a chip note. Read as constraints:

1. **"Janelt is suspended for GW8... He does not start in GW8. He is benched, not sold, unless
   the one FT has nothing better to do."** *Applied. Janelt is `s` 0% ("Suspended until 31
   Oct") and sits last on the bench. The FT has something better to do (below), so he stays
   for BRE v NFO in GW9.*
2. **"Haaland is `d` 75%... read it at 75%, not lower and not higher... never sold on this
   flag... Read City's Thursday presser before the GW8 research run picks a captain; if he is
   ruled out, the armband goes on the model, and the vice must be a player who starts."**
   *Applied, and overtaken by the API during this run: the flag **cleared to `a` 100% at about
   18:30 UTC on 20 Oct** (read at 18:15 as `d` 75%, at 18:31 as `a` 100%, news text gone),
   after he was left on the bench against AEK Athens. By GW6 adjustment #1 the API's number is
   the number, so he is read at 100%. The presser is Thursday 22 Oct, after this run, so the
   checklist still carries the Thursday branch: ruled out → captain Mbeumo, vice João Pedro.
   Not sold. The vice (Mbeumo) starts and is `a`. The 75% case is kept below in case the flag
   comes back.*
3. **"Execute an injury-driven sale as late as the deadline allows, and re-read the flag
   first."** *Applied by not making one. The proposed transfer is not injury-driven: Guéhi is
   `a`. Gibbs-White (`d` 75%, muscular) → Tavernier priced level with the proposal over six
   weeks (+4.5 against +4.4) but is exactly the kind of sale #3 warns about: Scout already
   reads him as fit for GW8 (see Community), and he plays after the deadline.*
4. **"The third-defender slot: under 1.0 calc, break the tie on clean-sheet probability...
   In GW8 that is Gabriel."** *Applied. Gabriel starts (ARS v EVE, clean-sheet chance 38%,
   the best in the squad). For the last defender slot Van Hecke (3.9, CS 22%) and Hall (3.6,
   CS 18%) are within 1.0, and Van Hecke has the higher clean-sheet chance: he starts.*
5. **"No hit unless the move's own-week calc is ≥ +4 or a starter is ruled out with no legal
   bench cover."** *Applied. The best two-move combination in the game (Guéhi → Murillo plus
   Gibbs-White → Rogers) is worth **+1.6 in GW8 before the hit**. Janelt is ruled out but the
   bench covers him legally (Hall, Gibbs-White). No hit.*
6. **"Score the steer the model was overruled for... carry 'model's FT against the played
   FT'."** *Applied. There is no steer this week and the proposal IS the model's FT. The
   template alternative it beat (Guéhi → Calafiori) is written down so the post-mortem can
   score it.*
7. **Running totals to GW11.** *Carried: B against A **+6**, wildcard against the roll
   **+31**, B.Fernandes against Gibbs-White **0**, Gabriel against Murillo **+6**, -4 against
   A **-1**, João Pedro against Thiago **-2**, model's FT against the played FT **-4**. The
   Gabriel against Murillo line changes meaning this week: we would own both.*
8. **"The FT goes to the squad's weakest long-term slot: Dubravka if a Bench Boost is in
   view, otherwise Hall or Gibbs-White on the calc. Barry is at Arsenal in GW8 against Raya
   and Gabriel: a clash to price."** *Applied, with the slot moved one place. No Bench Boost
   is in view (no DGW known before GW19), so not Dubravka. On the calc the weakest long-term
   defender is **Guéhi** (19.8 over GW8-13) rather than Hall (21.0): the same move out of Hall
   is worth 0.2 less over six and leaves £0.8m less in the bank. Gibbs-White is covered by #3.
   Barry's clash is priced in the hedging check and kept.*

**Chip note:** *"Bench Boost: two moves from live."* Still two: Dubravka (0 minutes in seven)
and a fit fourth outfielder. *"Free Hit: the emergency cover for a week the squad cannot
field eleven."* It can field eleven this week, even if Haaland misses.

---

## Flags & Key Signals

### Squad health

Live `bootstrap-static`, read 2026-10-20 18:15 UTC.

| Player | Flag | News | Read |
|---|---|---|---|
| **Janelt** | `s` 0% | "Suspended until 31 Oct" (17 Oct) | Out for GW8, back for GW9. *Correction to GW7's log: a second yellow (90+2'), not a straight red* ([RotoWire](https://www.rotowire.com/soccer/headlines/vitaly-janelt-news-sees-red-after-double-booking)); same one-match ban |
| **Haaland** | ~~`d` 75%~~ **`a` 100% since ~18:30 UTC 20 Oct** | "Unspecified injury" (19 Oct 13:00), cleared | Left-foot knock in the last minutes v Ipswich. Maresca on 19 Oct: *"He can be available. We'll see... we have some doubts after Sunday's game"* ([Sports Mole](https://www.sportsmole.co.uk/football/man-city/injury-news/news/is-haaland-injured-maresca-delivers-big-update-on-man-city-goal-machine_607237.html)). Then **on the bench v AEK Athens on 20 Oct**, Samba leading the line ([City Xtra](https://cityxtra.co.uk/match-coverage/confirmed-line-ups-manchester-city-vs-aek-athens-uefa-champions-league)): rested, not ruled out. Whether he came on was not known when this was written. Read at 100%, the API's number (#2) |
| **Gibbs-White** | `d` 75% | "Muscular injury" (16 Oct) | Did not play in GW7, as a precaution. His manager: *"I expect him being back for the Ipswich"* game ([Yahoo](https://sports.yahoo.com/articles/glasner-hopeful-gibbs-white-return-083124223.html)); Scout: should be fit, "keep" ([Scout](https://www.fantasyfootballscout.co.uk/2026/10/20/tavernier-bruno-isak-wissa-buy-keep-or-sell-in-gameweek-8)) |

Everyone else `a`. Dubravka has played 0 minutes in seven. City also lost Semenyo long-term
and had Kovačić, O'Reilly and Nunes go off against Ipswich (same Sports Mole piece): Guéhi's
side is the most injury-hit defence we own.

### Team quality, underlying (7 games)

Team xG for and against per game from the live API, and the factors (shrunk 50% to the
league mean) that the calculation uses. GW8 opponents in brackets.

| Team | xGF/g | xGA/g | Att factor | Def factor | |
|---|---|---|---|---|---|
| ARS | 1.71 | **0.79** | 1.067 | **0.768** | Best defence by a distance. Raya, Gabriel (v EVE) |
| EVE | 1.32 | 1.34 | 0.938 | 0.951 | Barry. Sixth-worst attack in the league |
| COV | 1.03 | 1.60 | 0.840 | 1.039 | Thomas (v FUL) |
| FUL | 1.57 | 1.49 | 1.022 | 1.002 | |
| NFO | 1.68 | 1.20 | 1.057 | 0.905 | **Murillo (in)**, Gibbs-White. Fourth-best defence |
| IPS | 1.54 | 2.01 | 1.009 | 1.178 | NFO's opponent. Second-worst defence |
| CHE | 1.43 | 1.51 | 0.973 | 1.010 | João Pedro (v TOT) |
| TOT | 1.07 | 1.33 | 0.856 | 0.948 | Van Hecke, Dubravka. Third-worst attack |
| MUN | 1.71 | 1.40 | 1.068 | 0.973 | Mbeumo (v BOU) |
| BOU | 1.77 | **1.16** | 1.088 | 0.891 | Second-best defence: a harder fixture than FDR 3 says |
| SUN | 1.52 | 1.99 | 1.003 | 1.170 | Le Fée (v LEE) |
| LEE | 1.43 | 1.39 | 0.973 | 0.967 | |
| AVL | 1.21 | 1.59 | 0.901 | 1.034 | Haaland's opponent. Villa concede, and barely create |
| MCI | **2.20** | 1.48 | **1.229** | 0.999 | Best attack in the league. Haaland (Guéhi out) |
| LIV | 1.57 | 1.17 | 1.020 | 0.895 | Gomez's opponent |
| BHA | 2.18 | 1.45 | 1.223 | 0.988 | Gomez |
| CRY | 1.35 | **2.09** | 0.947 | 1.203 | Worst defence, but Hall defends against their attack (1.35 xG a game) |
| NEW | 1.16 | 1.74 | 0.886 | 1.086 | Hall |
| HUL | 0.98 | 1.49 | 0.824 | 1.003 | Janelt's opponent (he is banned) |
| BRE | 1.74 | 1.45 | 1.076 | 0.988 | Janelt |

### Fixture runs, GW8-13

| Team | GW8 | GW9 | GW10 | GW11 | GW12 | GW13 | Ours |
|---|---|---|---|---|---|---|---|
| COV | FUL (H) 2 | SUN (H) 3 | EVE (a) 3 | CRY (H) 2 | LEE (a) 3 | IPS (H) 2 | Thomas |
| TOT | CHE (a) 4 | CRY (H) 2 | LEE (a) 3 | IPS (H) 2 | SUN (a) 3 | FUL (H) 2 | Van Hecke, Dubravka |
| **NFO** | **IPS (a) 2** | BRE (a) 3 | MCI (H) 4 | BOU (a) 3 | CHE (H) 4 | HUL (a) 2 | **Murillo (in)**, Gibbs-White |
| SUN | LEE (H) 3 | COV (a) 2 | CHE (H) 4 | AVL (a) 3 | TOT (H) 2 | LIV (a) 4 | Le Fée |
| MCI | AVL (a) 3 | BHA (H) 3 | NFO (a) 3 | FUL (H) 2 | ARS (a) 5 | LEE (H) 3 | Haaland *(Guéhi sold)* |
| CHE | TOT (H) 2 | MUN (H) 4 | SUN (a) 3 | LEE (H) 3 | NFO (a) 3 | CRY (H) 2 | João Pedro |
| ARS | EVE (H) 3 | LIV (a) 4 | HUL (H) 2 | NEW (a) 3 | MCI (H) 4 | BRE (a) 3 | Raya, Gabriel |
| MUN | BOU (H) 3 | CHE (a) 4 | AVL (H) 3 | LIV (a) 4 | BRE (H) 3 | NEW (a) 3 | Mbeumo |
| BHA | LIV (a) 4 | MCI (a) 5 | BRE (H) 3 | HUL (a) 2 | NEW (H) 3 | BOU (a) 3 | Gomez |
| NEW | CRY (a) 3 | EVE (H) 3 | FUL (a) 3 | ARS (H) 4 | BHA (a) 4 | MUN (H) 4 | Hall |
| BRE | HUL (a) 2 | NFO (H) 3 | BHA (a) 4 | EVE (H) 3 | MUN (a) 4 | ARS (H) 4 | Janelt |
| EVE | ARS (a) 5 | NEW (a) 3 | COV (H) 2 | BRE (a) 3 | LIV (H) 4 | AVL (a) 3 | Barry |

No DGW or BGW anywhere in GW8-19 on the current fixture list, and no unscheduled fixtures.

### Squad prices

*Added after the run, from the price rule merged in #62 (it landed at 20:07 UTC, after this
proposal and after the transfer was executed at 19:44). Read 2026-10-20 ~20:30 UTC: bought and
sell from `get_my_squad` / the `save_team` response, the rest from `bootstrap-static`. Rising
or falling = net transfers past 2% of owners and at least 10k, else this round's price change.*

| Player | Bought | Now | Sell | Round Δ | Net transfers (of owners) | Read |
|---|---|---|---|---|---|---|
| Raya | 6.0 | 6.1 | 6.0 | 0 | +45.7k (+0.9%) | flat |
| Thomas | 4.0 | 4.0 | 4.0 | 0 | +11.6k (+1.1%) | flat |
| Gabriel | 8.0 | 7.9 | 7.9 | 0 | -9.9k (-0.4%) | flat |
| **Murillo** *(in)* | 5.5 | 5.5 | 5.5 | 0 | +2.4k (+1.0%) | flat |
| Van Hecke | 4.9 | 4.9 | 4.9 | 0 | -6.2k (-0.8%) | flat |
| Mbeumo | 8.0 | 7.8 | 7.8 | 0 | **+95.6k (+4.2%)** | **rising** |
| Le Fée | 5.7 | 5.7 | 5.7 | 0 | -4.3k (-1.3%) | flat |
| Gomez | 5.0 | 5.0 | 5.0 | 0 | **+26.3k (+6.2%)** | **rising** |
| Haaland | 15.6 | 15.7 | 15.6 | 0 | +54.4k (+0.6%) | flat |
| João Pedro | 7.8 | 7.9 | 7.8 | **+0.1** | +67.8k (+0.8%) | **rising** |
| Barry | 5.6 | 5.7 | 5.6 | 0 | **-37.1k (-4.0%)** | **falling** |
| Dubravka | 4.0 | 4.0 | 4.0 | 0 | -10.8k (-0.6%) | flat |
| Hall | 5.1 | 5.3 | 5.2 | 0 | +11.7k (+0.5%) | flat |
| Gibbs-White | 8.0 | 7.9 | 7.9 | **-0.1** | **-91.5k (-7.2%)** | **falling** |
| Janelt | 5.0 | 5.0 | 5.0 | 0 | **-33.3k (-13.6%)** | **falling** |
| *Guéhi (sold)* | 6.0 | 6.0 | 6.0 | 0 | -16.9k (-0.9%) | flat |

**Rising:** Mbeumo, Gomez, João Pedro. **Falling:** Gibbs-White (already -£0.1 this round),
Barry, Janelt. **Sell value £97.9m against £98.4m value**, plus £1.3m in the bank.

**Which case this week is: a value move, not a necessary change.** One starter was: Janelt
(`s`, in the XI as saved after GW7). On the letter that makes a change necessary, but GW7 #1
resolves it with the bench, not a transfer, and the FT does not touch his slot. Nobody else
qualifies (Haaland was `d` 75%, then `a`), no
slot had three 0-minute weeks (Dubravka is the reserve keeper, not a slot we field), and GW7's
adjustments named no sale (Hall was "a candidate on the calc", Janelt "benched, not sold").
So the price rule applies to the FT:

- **Guéhi → Murillo passes the rule:** both flat. Nothing falling was bought.
- **But the tiebreak points the other way in GW8.** Calafiori is **rising** (+£0.1 this
  round, +65.8k) and was within 0.5 calc of Murillo in GW8 (4.37 against 4.45; +0.81 against
  +0.89 on the squad). Read on the gameweek alone, "the rising one wins" picks Calafiori. Read
  on the six-week number the run ranked on, they are not close (+1.9 against +4.4 over
  GW8-13, 2.5 apart), and Calafiori also adds a GW8 clash with Barry. This log reads the
  tiebreak on the six-week number, and Murillo stays, but the rule should say which horizon
  "within 0.5 calc" means. The Calafiori line in the watch flags now also scores the price:
  his value at the GW9 deadline against Murillo's.
- **Gibbs-White, the faller who is a sale candidate.** The rule says he goes before the drop.
  This week that would be a **second transfer, so a -4** (the FT went to Murillo). GW7
  adjustment #5 forbids it: Gibbs-White → Tavernier is +0.65 in GW8, nowhere near +4. What
  waiting costs is price, not points: Gibbs-White sells at £7.9m now and probably £7.8m by
  GW9; Tavernier (£6.2m, **+152.7k, +14.9%**, the week's biggest riser among our candidates)
  may be £6.3-6.4m. Even then £1.3m + £7.8m covers him with £2.5m+ to spare. **Conclusion:
  no change now.** Gibbs-White is the front-runner for the GW9 FT, and the GW9 run should
  re-read his flag first (GW7 adjustment #3) and buy before Tavernier's next rise if the
  move still prices.
- **Barry (falling) and Janelt (falling, banned)** are not sale candidates this week. Barry's
  drop is a £0.1 risk on a £5.6m sell. Janelt is back in GW9.

### Community (source: Brave via `get_community_trends` for transfers only, **WebSearch** for the rest)

Brave answered **429** again: the transfers angle came back partial (ten names, two queries),
captaincy and differentials came back **empty**. Both were re-run through `WebSearch`
(RotoWire, The False 9, Fantasy Football Scout, AllAboutFPL, Fantasy Football Hub). Every
claim below was checked against the API.

- **Captaincy: Haaland or João Pedro.** [RotoWire](https://www.rotowire.com/soccer/article/fpl-gameweek-8-rankings-best-players-captain-picks-gw8-142338)
  ranks Haaland first at **6.34**, then B.Fernandes 6.31, **Mbeumo 6.21**, Saka 5.86; João
  Pedro is its second forward at 5.95. [The False 9](https://thefalse9.com/2026/10/fpl-gameweek-8-captain-picks-joao-pedro-haaland.html)
  (17 Oct, before the knock) picks **João Pedro** at home to Spurs (FDR 2) over Haaland at
  Villa (FDR 3), with Cunha (6.7% owned) as the differential. *Cross-check: fixtures and FDR
  agree. João Pedro now has 47 points (the article's 45 is a week old), £7.9m, 72.8% owned;
  Cunha £7.9m, 6.7%, 37 points, but 503 of 630 minutes and 3.1 calc.*
- **Transfers (Brave):** Donnarumma, Saka, Palmer, **Tavernier**, Cherki, Janelt (sell),
  Isak, Wissa, Schade, Rayan. [Scout's buy/keep/sell](https://www.fantasyfootballscout.co.uk/2026/10/20/tavernier-bruno-isak-wissa-buy-keep-or-sell-in-gameweek-8)
  (20 Oct): **buy Tavernier** (4 goals in 7, started every game), **sell B.Fernandes** (five
  blanks running), sell Wissa, Isak "buy if needed", Neto "keep, don't rush", **Gibbs-White
  should be fit, keep**. *Cross-check: Tavernier £6.2m, 9.2% owned, 574 minutes, 42 points,
  4 goals; B.Fernandes 33 points, form 1.0. Both agree.*
- **Differentials:** [The False 9](https://thefalse9.com/2026/10/fpl-gameweek-8-differentials-neto-low-ownership-picks.html)
  leads with **Neto** (15 points in GW7, 1.6% owned) and names Iwobi, Ajer, Lewis-Potter,
  Brobbey; [AllAboutFPL](https://allaboutfpl.com/2026/10/fpl-gw8-ultimate-guide-tips-captaincy-differentials-more/)
  adds Manzambi and Evanilson. *Cross-check: Neto 2.4% owned now, 504 minutes (6 starts),
  3.4 calc v Spurs; Manzambi is `d` 75%. **Neto plays Van Hecke** (CHE v TOT): hedged. Ajer
  (BRE at Hull, 4.3 calc, 630 minutes, clean) is the one name that passes both gates; it is
  a defender move worth +0.7, below Murillo's +0.9.*
- **Hot topics:** wildcard timing, rotation, price changes, injury updates.

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
P(start)    = minutes share × FPL flag; Haaland 0.98 (flag cleared to 100%, adjustment #2);
              João Pedro 0.95 (avail 1.15 × his 0.83 minutes share, the GW7 reading:
              the share counts the GW5 game he missed injured; 90 minutes in GW7)
```

Each option is scored as the best legal XI and captain of its fifteen, re-picked every week,
summed over GW8-13. Every new player passed the minutes gate (GW4 adjustment #2) before form,
xGI or DC were looked at. **New this week: the hedging rule is in the search**, so a move that
puts a player against our own defence or attack in GW8 is flagged by the search, not by hand.

### The transfer: Guéhi → Murillo, free

Exhaustive search over every single free transfer (every owned player against every `a`/`d`
player in the same position with 300+ minutes, budget and club limit checked):

| Move | GW8 | GW8-13 | Bank | GW8 hedge | Note |
|---|---|---|---|---|---|
| **Guéhi → Murillo** | **+0.89** | **+4.4** | £1.3m | none | **The proposal.** Best in GW8 and best clean move over six |
| Hall → Murillo | +0.89 | +4.2 | £0.5m | none | Same move out of the named sale: 0.2 and £0.8m worse |
| Gibbs-White → Rogers | +0.85 | +3.8 | £0.7m | **v Van Hecke, Dubravka** | Template (48%, top 50 90%) |
| Guéhi → Calafiori | +0.81 | +1.9 | £0.8m | **v Barry** | Template (53.8%, top 50 96%). Written down to score |
| Gibbs-White → Tavernier | +0.65 | +4.5 | £2.5m | none | Scout's buy. Injury-driven sale (adjustment #3) |
| Guéhi → Silva (BOU) | +0.81 | +6.0 | £1.8m | **v Mbeumo** | Best over six, hedged in GW8 |
| Gibbs-White → Stach | +0.81 | +3.3 | £2.7m | none | 2.3% owned |

*(GW8-13 deltas are re-picked best XIs against the roll: 323.3 against 318.9.)*

| | Guéhi (out) | Murillo (in) |
|---|---|---|
| Club | MCI | NFO |
| Price | £6.0m (sell 6.0, 33.5k out this round) | £5.5m |
| Minutes / starts | 630 / 7 | **629 / 7** |
| Points | 37 | 27 |
| Points by week | 10, 2, 8, 6, 4, 6, **1** | 4, 1, 8, 6, 4, 2, **2** |
| DC by week (threshold 10) | 4, 5, 9, 7, 4, 4, 3 (**0 of 7** banked) | 14, 6, 10, 12, 11, 10, 9 (**5 of 7**) |
| Clean sheets | 3 | 1 |
| Team xGA a game | 1.48 (City, with Kovačić, O'Reilly, Nunes knocks) | **1.20** (4th best) |
| GW8 | AVL (a) 3.4 | **IPS (a) 4.45** |
| GW8-13 calc | 19.8 | **27.0** |
| Owned | 17.8% | 2.1% |

Guéhi has more points (37 to 27) on three clean sheets, and none of them came from DC: he
has not reached 10 defensive actions once in seven games and his DC is falling (4, 4, 3).
City's defence is now mid-table on underlying numbers and short of bodies. Murillo has
banked the +2 in five of seven, plays every minute, and his next fixture is the
second-worst defence in the league. What the model likes is the floor: Murillo's
2 + 2 DC is four points before anything happens. **RotoWire agrees from a different model:** No. 8 defender
for GW8 at 4.77, against Guéhi 41st at 3.85 ([RotoWire](https://www.rotowire.com/soccer/article/fpl-gameweek-8-rankings-best-players-captain-picks-gw8-142338));
Scout notes no defender beats his 10 DC points this season ([Scout](https://www.fantasyfootballscout.co.uk/2026/10/19/fpl-notes-gibbs-white-injury-latest-two-solid-defences)).

**Why not Calafiori (the template defender).** He is the biggest unowned template line this
week (53.8% owned, 48 of the top 50) and RotoWire's top defender at 5.46. On the calc he is
level in GW8 (4.37 against 4.45) and **2.5 behind over six** (Arsenal go to Liverpool,
Newcastle and host City inside the window). He also plays against Barry, the clash we
already carry with Raya and Gabriel, so a third Arsenal defender makes the same game decide
four of our slots. GW7's lesson (#6): the model's FT beat the template steer by 4. If you
overrule the model this week, this is the move: Guéhi → Calafiori, same price, bank stays £0.8m.

### The template, priced (GW6 adjustment #2)

Players owned by 30%+, or fielded by 60%+ of the overall top 50 in GW7, that we will not own:

| Player | Club | £ | Owned | Top 50 fielded | GW8 | calc | owned × calc |
|---|---|---|---|---|---|---|---|
| Calafiori | ARS | 6.0 | 53.8% | 96% | EVE (H) | 4.37 | 2.35 |
| Rogers | CHE | 8.0 | 48.0% | 90% | TOT (H) | 4.42 | 2.12 |
| Groß | BHA | 6.2 | 45.3% | 96% | LIV (a) | 3.85 | 1.74 |
| De Cuyper | BHA | 5.3 | 41.0% | 94% | LIV (a) | 3.17 | 1.30 |
| Palmer | CHE | 9.7 | 26.4% | 70% | TOT (H) | 4.07 | 1.08 |
| Konsa | ARS | 4.6 | 17.8% | 64% | EVE (H) | 2.99 | 0.53 |
| | | | | | | **sum** | **9.1** |

The two players every top-50 team owns (Haaland 76.7%, João Pedro 72.8%, 50 of 50) are both
ours. **By club** (the top 50 fields two or more, at home, against a bottom-half defence): it
does not fire. Arsenal and Chelsea are the template clubs at home, but Everton (1.34 xGA) and
Spurs (1.33) are both top-half defences. We own two Arsenal and one Chelsea anyway.

### The captaincy, from scratch

| Candidate | GW8 | Attacking calc (per start) | Total calc (per start) | P(start) | Owned |
|---|---|---|---|---|---|
| **Haaland** | MCI at AVL | **2.58** | **5.22** | 0.98 | 76.7% |
| Mbeumo | MUN v BOU | 2.16 | 4.95 | 1.00 | 20.3% |
| João Pedro | CHE v TOT | 2.17 | 4.76 | 0.95 | 72.8% |
| Le Fée | SUN v LEE | 1.83 | 4.58 | 0.97 | 2.9% |
| Barry | EVE at ARS | 1.65 | 4.17 | 0.94 | 8.4% |

At his cleared flag Haaland is **5.13** on the page's calc, Mbeumo 4.95: Haaland by 0.18.
This section was first written at 75%, where the page's calc showed him at 3.85, below
Mbeumo. That is the right number for him as a player and the wrong one for him as a
captain: if he does not play, the armband passes to the vice. The armband's value is

```
P(plays) × Haaland per start + (1 − P(plays)) × vice
```

| P(Haaland plays) | C Haaland, V Mbeumo | C Haaland, V João Pedro | C Mbeumo |
|---|---|---|---|
| 0.50 | 5.03 | 4.82 | 4.95 |
| 0.75 | 5.07 | 4.97 | 4.95 |
| 0.90 | 5.10 | 5.06 | 4.95 |
| **0.98 (now)** | **5.12** | 5.11 | 4.95 |

**Captain Haaland, vice Mbeumo.** Because the vice is Mbeumo, the armband on Haaland is worth
at least Mbeumo's number whether Haaland plays or misses the game outright; the only case it
loses is Haaland starting and coming off early. The margin is 0.1-0.2: a tie, so GW6
adjustment #5 decides it (under
0.5 apart and we own the field's captain: captain him). He is the field's captain by a
distance (50 of the top 50 captained him in GW7; RotoWire's No. 1). Villa concede 1.59 xG a
game and City create the most in the league. Not captaining him when he plays and scores is
the one big loss on the board this week.

The knock is still the risk even with the flag gone: a blow to the foot on 18 Oct, rested
for AEK on 20 Oct, and Maresca's "we'll see" from the day before. What the proposal does
about it is the vice and the bench, not the armband: Mbeumo starts, is `a`, and
has the best fixture-level number in the squad after Haaland; Hall is first on the bench so a
Haaland absence autosubs into a legal 5-3-2.

**Vice: Mbeumo, not João Pedro.** Mbeumo 4.95 against João Pedro 4.76 per start (4.52 at
his 0.95). If Haaland drops out after the deadline, the field's armbands go to a thousand
different vices and the model's vice is the right one. **If he is ruled out before the
deadline (the Thursday branch), two rules disagree:** GW6 #5 would hand the armband to João
Pedro (the field will mostly move to him, and the gap is 0.43, under 0.5), while GW7 #2, newer
and written for exactly this case, says "the armband goes on the model". The checklist
follows GW7 #2: **Mbeumo captain, João Pedro vice.** The post-mortem scores the branch if it
is taken.

**Bournemouth are a harder fixture than the FDR 3 says** (1.16 xGA, second-best defence):
the model already has it, which is why Mbeumo's per-start number is 4.95 and not higher.

### The XI: 4-3-3, and the bench

Raya; Thomas, Gabriel, **Murillo**, Van Hecke; Mbeumo, Le Fée, Gomez; **Haaland (C)**,
João Pedro, Barry.

| Pos | Player | GW8 | calc | CS | Why there |
|---|---|---|---|---|---|
| GK | Raya | EVE (H) | 4.08 | 38% | Best defence in the league, at home |
| DEF | Thomas | FUL (H) | 4.78 | 24% | DC90 12.3, banked 5 of 7 (22 in GW6) |
| DEF | Gabriel | EVE (H) | 4.69 | **38%** | Adjustment #4: the highest clean-sheet chance in the squad |
| DEF | **Murillo** | IPS (a) | 4.45 | 22% | DC 5 of 7, v the second-worst defence |
| DEF | Van Hecke | CHE (a) | 3.90 | 22% | Last slot over Hall (3.56, CS 18%) on #4. DC 11 last week |
| MID | Mbeumo | BOU (H) | 4.95 | | Vice. Best in the squad per start after Haaland |
| MID | Le Fée | LEE (H) | 4.42 | | DC 12 banked in GW7; Leeds 1.39 xGA |
| MID | Gomez | LIV (a) | 3.71 | | 8 last week. The weakest starter, see below |
| FWD | **Haaland (C)** | AVL (a) | 5.13 | | Flag cleared 20 Oct; 5.22 per start |
| FWD | João Pedro | TOT (H) | 4.52 | | Template, 50 of 50 top-50 teams |
| FWD | Barry | ARS (a) | 3.92 | | Clash priced below |

**Bench: Dubravka → Hall → Gibbs-White → Janelt.** Ordered on minutes certainty: Hall `a`,
629 minutes, 89-90 in every game; Gibbs-White `d` 75% and 0 minutes in GW7; Janelt banned. Hall
first also makes every autosub legal: a defender, Haaland or Barry missing all fall into a
4-3-3 or 5-3-2 with him.

**Gomez is the weakest starter (3.71), and Gibbs-White would beat him if fit.** At a clean
flag Gibbs-White is 4.62 per start, about 3.97 on his minutes share, +0.26 on Gomez. At 75%
he is 2.97. If FPL lifts his flag to `a` before the deadline, swapping him for Gomez is worth
a quarter of a point; it is not on the checklist, because NFO play 90 minutes after the
deadline and a muscular flag that lifts on Friday is what adjustment #3 was written about.

### Hedging check

| GW | Clash | Price |
|---|---|---|
| 8 | **Barry v Raya and Gabriel** (EVE at ARS) | Carried, as adjustment #8 asked: priced, not reflexively resolved. Benching Barry for Hall (5-3-2) costs **0.36** calc. Kept: Arsenal's 38% clean sheet against Everton's 1.32 xG a game is the side we are long on, and Barry is a 3.9 |
| 8 | **João Pedro v Van Hecke** (CHE v TOT), plus Dubravka | Benching Van Hecke for Hall costs **0.34**. Kept for the same reason as GW7: it takes upside, not expected points. Dubravka does not play |
| 8 | Murillo and Gibbs-White both NFO at IPS | Same side, not a hedge: correlated upside |
| 9 | Murillo v Janelt (NFO at BRE) | A GW9 call; Janelt back from his ban that week |
| 10 | Murillo v Haaland (NFO v MCI) | Priced in the six-week number already. A GW10 call |
| 12 | Murillo v João Pedro (NFO v CHE) | Same |

Guéhi → Murillo adds no GW8 clash. Calafiori would have added one (v Barry), Rogers and Neto
two (v Van Hecke, Dubravka), Silva one (v Mbeumo).

### Chips

- **Bench Boost: hold.** Bench this week is Dubravka (0 minutes), Hall, a 75% Gibbs-White and
  a banned Janelt. No DGW is known before GW19. The cheapest fix is still a playing reserve
  keeper: Kinsky (TOT, £4.5m, 630 minutes) is Dubravka's own club's starter; Leno, Petrović
  and Rushworth are £4.5m too. One FT, a week when nothing else needs it.
- **Free Hit: hold.** We can field eleven even without Haaland. No DGW or BGW in sight.

---

## Proposal

### Do this in the app

1. **Transfer: Guéhi → Murillo** (NFO, £5.5m; 1 FT, no hit). Not injury-driven, so any time
   before **Friday 19:30 Oslo** (17:30 UTC). Bank £0.8m → **£1.3m**.
2. **Formation 4-3-3:** Raya; Thomas, Gabriel, Murillo, Van Hecke; Mbeumo, Le Fée, Gomez;
   Haaland, João Pedro, Barry.
3. **Captain: Haaland. Vice: Mbeumo.**
4. **Bench order:** Dubravka, Hall, Gibbs-White, Janelt.
5. **No chip.**
6. **Thursday presser (City, 22 Oct):** if Haaland is **ruled out**, bench him (Hall into the
   XI, 5-3-2), **captain Mbeumo, vice João Pedro**. If he is only "a doubt", leave it as it is:
   the vice covers him.

### Transfers

| OUT | £ (sell) | IN | £ |
|---|---|---|---|
| Guéhi (MCI, DEF) | 6.0 | **Murillo** (NFO, DEF) | 5.5 |

Cost: **0 (1 FT)**. Bank £0.8m → **£1.3m**.

### Projected XI (4-3-3)

| Pos | Player | Team | £m | GW8 | calc |
|---|---|---|---|---|---|
| GK | Raya | ARS | 6.1 | EVE (H) | 4.08 |
| DEF | Thomas | COV | 4.0 | FUL (H) | 4.78 |
| DEF | Gabriel | ARS | 7.9 | EVE (H) | 4.69 |
| DEF | **Murillo** | NFO | 5.5 | IPS (a) | 4.45 |
| DEF | Van Hecke | TOT | 4.9 | CHE (a) | 3.90 |
| MID | Mbeumo **(V)** | MUN | 7.8 | BOU (H) | 4.95 |
| MID | Le Fée | SUN | 5.7 | LEE (H) | 4.42 |
| MID | Gomez | BHA | 5.0 | LIV (a) | 3.71 |
| FWD | **Haaland (C)** | MCI | 15.7 | AVL (a) | 5.13 |
| FWD | João Pedro | CHE | 7.9 | TOT (H) | 4.52 |
| FWD | Barry | EVE | 5.7 | ARS (a) | 3.92 |

**Calculated XI: 48.6 before the armband, 53.7 with it** (the roll: 52.8).

**Bench:** Dubravka (GK) → Hall (DEF, `a`) → Gibbs-White (MID, `d` 75%) → Janelt (MID, banned).

**Projected state after:** £98.4m squad, £1.3m ITB. ARS×2, TOT×2, NFO×2, one each of COV,
NEW, BRE, MUN, BHA, SUN, MCI, EVE, CHE. Chips left: BB, FH (first half, expire GW19).
GW9 opens with **1 FT**.

### Zero-transfer alternative

Roll the FT (2 FTs in GW9), keep Guéhi. Same XI with **Hall in Murillo's slot** (Raya;
Thomas, Gabriel, Van Hecke, Hall), same captain and vice, bench Dubravka, Guéhi,
Gibbs-White, Janelt.

**Expected cost: 0.9 in GW8 (52.8 against 53.7) and 4.4 over GW8-13** on the calc
(322.5 against 326.9), Haaland captained both ways. Two FTs in GW9 buy flexibility for Janelt's return and a Bench Boost
keeper, but nothing in the squad is broken enough to need two at once. Over six weeks the page reads **+5.9** (325.2 against
319.3) because it scores one fixed best XI on the six-week sums; the +4.4 above re-picks the
XI every week.

### Chip strategy
**No chip.** BB and FH remain, both expiring **GW19**. Bench Boost waits for a playing reserve
keeper; Free Hit is the emergency.

---

## Decision

**One free transfer, no hit. Captain Haaland. The proposal, exactly as written.**

| OUT | £ (sell) | IN | £ | |
|---|---|---|---|---|
| Guéhi (MCI, DEF) | 6.0 | **Murillo** (NFO, DEF) | 5.5 | free transfer |

Stamped 2026-10-20 19:44:08 UTC in `entry/5047923/transfers/` (`element_out_cost` 60,
`element_in_cost` 55), three days before the deadline. Confirmed after the deadline on the
public `entry/5047923/event/8/picks/` and on `get_my_squad` (authenticated, not stale):
`active_chip: null`, Haaland `multiplier: 2`, Mbeumo `is_vice_captain`, `event_transfers: 1`,
`event_transfers_cost: 0`, `bank: 13` (£1.3m). Every id matches the lock snapshot.

**Captain: Haaland** (MCI at AVL, FDR 3). **Vice: Mbeumo** (MUN v BOU, FDR 3). **Chip: none.**

### Starting XI (4-3-3)
| Pos | Player | Team | £m | GW8 | FDR |
|---|---|---|---|---|---|
| GK | Raya | ARS | 6.1 | EVE (H) | 3 |
| DEF | Thomas | COV | 4.0 | FUL (H) | 2 |
| DEF | Gabriel | ARS | 7.9 | EVE (H) | 3 |
| DEF | **Murillo** | NFO | 5.5 | IPS (a) | 2 |
| DEF | Van Hecke | TOT | 4.9 | CHE (a) | 4 |
| MID | Mbeumo **(V)** | MUN | 7.9 | BOU (H) | 3 |
| MID | Le Fée | SUN | 5.7 | LEE (H) | 3 |
| MID | Gomez | BHA | 5.0 | LIV (a) | 4 |
| FWD | **Haaland (C)** | MCI | 15.7 | AVL (a) | 3 |
| FWD | João Pedro | CHE | 7.9 | TOT (H) | 2 |
| FWD | Barry | EVE | 5.7 | ARS (a) | 5 |

**Bench:** Dubravka (GK, TOT at CHE, FDR 4) → Hall (DEF, NEW at CRY, FDR 3) → Gibbs-White
(MID, NFO at IPS, FDR 2) → Janelt (MID, BRE at HUL, `s`, suspended until 31 Oct).

**Final state:** £98.5m squad (sell value £98.0m) + **£1.3m ITB** (£99.8m team value; the
proposal's £98.4m moved with Mbeumo's rise to £7.9m). ARS×2, TOT×2, NFO×2, one each of COV,
NEW, BRE, MUN, BHA, SUN, MCI, EVE, CHE. Chips left: **BB, FH** (first half, expire GW19).
`free_transfers` reads 1; GW9 opens with **1 FT**.

**Flags at the lock read (18:10 UTC):** Haaland `a` 100 since the evening of 20 Oct, and
Maresca called him fully fit on Thursday 22 Oct
([beIN](https://www.beinsports.com/en-us/soccer/premier-league/articles/enzo-maresca-breathes-easier-erling-haaland-is-100-fit-to-face-aston-villa-2026-10-22)).
The news watch read him ten times between 20 Oct and 16:46 UTC on deadline day, `a` 100 every
time, and changed nothing. **Gibbs-White's `d` 75% has cleared** to `a` 100 as well. Janelt
is the only flagged player in the fifteen.

### Proposal vs decision

**Matched, 5 of 5** (transfers, captain, vice, XI, chip), bench order identical too. Nothing
was overridden. It was executed from the research session
([c3154](https://acp.go.vongohren.me/?c=c3154)) on Snorre's explicit instruction, quoted
verbatim from the session transcript:

> *"FPL GW8 proposal feedback - Murillo (IN): agree"* (19:43:03 UTC, the proposal page's
> feedback form)
>
> *"Just execute transfer and team layout"* (19:43:49 UTC)

The transfer went through 19 seconds later. He then asked for the news to be watched "many
times around that time to adjust", which became the Thursday and Friday news-watch jobs.

**The Thursday branch was not taken**, because its condition never arose: Haaland was not
ruled out. **The zero-transfer alternative** (roll, Guéhi kept, Hall in Murillo's slot) was
not played; it is written down above and the first watch flag prices it.

One thing the decision did not see: the price rule (#62) merged at 20:07 UTC, 23 minutes after
the transfer. The Squad prices section above applies it after the fact and keeps Murillo.

---

## Accepted risks

- **The captain carried a 75% flag until the evening of 20 Oct.** A foot knock, rested for
  AEK, and Maresca's "we'll see". The flag is clear now; it can come back before Friday. The vice (Mbeumo) and Hall first on the bench are the cover; the Thursday
  branch moves the armband if he is ruled out.
- **Two same-game clashes in the XI:** Barry v Raya and Gabriel (EVE at ARS) and João Pedro v
  Van Hecke (CHE v TOT). Priced at 0.36 and 0.34 to remove; kept.
- **Murillo's points are low** (27, form 2.0, one clean sheet in seven). He is bought for a DC
  floor (5 of 7 banked) and a defence that is fourth-best on xGA, not for his returns so far.
  He also costs us the cleaner GW10 option: NFO host City (Murillo v Haaland).
- **We sell 37 points for 27.** Guéhi's clean sheets are real; the case against him is DC 0 of
  7, a falling DC line and a City defence carrying injuries.
- **Calafiori, the biggest unowned template line (2.35), stays unowned.** The unowned template
  sums to 9.1 this week.
- **Murillo and Gibbs-White play 90 minutes after the deadline:** no lineup before we lock.
- **Gomez starts on 3.71 at Anfield,** the weakest XI slot, because the man who would beat him
  is flagged.
- **The bench is thin:** Dubravka (0 minutes), Hall, a 75% Gibbs-White and a banned Janelt.
  If Haaland and a midfielder both miss, the second autosub is Gibbs-White.
- **Dubravka:** a 0-minute reserve keeper, eighth week. Only matters if Raya misses.
- **Guéhi's price** may drop before the move (33.5k out); a drop costs £0.1m of the £1.3m bank.

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

Locked with Haaland carrying the x2 (public picks, `multiplier: 2`). If he does not play, the
armband passes to Mbeumo by autosub; the post-mortem records whoever actually carried it. If
the field's captain is Haaland again, this is a zero-swing week by construction.

---

## Watch flags for GW8

Re-read at the lock. The decision matched the proposal 5 of 5, so there is no deviation to add
a flag for, and every flag below already tests what was played. Two were settled before the
first kickoff and are marked so; the post-mortem only fills in the rest.

- [ ] **Guéhi → Murillo (the model's FT, played).** Murillo's points minus Guéhi's, GW8 and running to
      GW13. The calc had it at +0.9 in GW8 and +4.4 over six. Did Murillo bank DC, and did
      Guéhi keep a clean sheet at Villa?
- [ ] **Calafiori, the template defender we did not buy.** His points against Murillo's (the
      overruled-template line, the mirror of GW7's). Start a running total "Murillo against
      Calafiori". Also his price at the GW9 deadline against Murillo's: he was the rising one
      (see Squad prices).
- [ ] **The armband on a just-cleared Haaland.** Did he start, how long did he play, and what
      did the armband return against Mbeumo's points (0.18 behind on the calc)?
- [x] **The Thursday branch.** Was Haaland ruled out, and was the branch taken? *Settled at
      the lock: not ruled out (`a` 100, Maresca "100% fit" on 22 Oct), branch not taken, ten
      news reads changed nothing. The post-mortem only adds whether he started.*
- [ ] **Barry v Raya and Gabriel (EVE at ARS).** What did the three return together, and did
      a Barry goal cost the clean sheet?
- [ ] **João Pedro v Van Hecke (CHE v TOT).** Same question.
- [ ] **Van Hecke over Hall (adjustment #4, clean-sheet tiebreak).** Points of each. Third week
      of testing a last-defender rule: did the bench outscore the starter again?
- [ ] **Gomez over Gibbs-White.** Did Gibbs-White's flag clear and did he play? Points of each.
      *His flag had cleared to `a` 100 by the lock, so he sat third on the bench fit; he is
      also the GW9 FT front-runner (Squad prices), so his GW8 points feed that call.*
- [ ] **Janelt's banned week.** Zero by construction; does the bench (Hall, Gibbs-White)
      fire an autosub, and did leaving him unsold cost anything against the best midfield
      move (Gibbs-White → Tavernier, Tavernier's points)?
- [ ] **The template, priced at 9.1.** Sum the unowned template's actual points × ownership.
- [x] **João Pedro's price:** £7.9m at research time (bought 7.8). Price at the GW8 deadline.
      *Settled at the lock: **£7.9m** (sell £7.8m), no change this round. Calafiori £6.0m,
      Murillo £5.5m, Gibbs-White £7.9m (no second drop), Tavernier £6.2m.*
- [ ] **Running totals to GW11:** B against A (+6), wildcard against the roll (+31),
      B.Fernandes against Gibbs-White (0), Gabriel against Murillo (+6), -4 against A (-1),
      João Pedro against Thiago (-2), model's FT against the played FT (-4). Add GW8.

---

## Outcome

**Actual points: 63** (gross 63, no hit, net 63; bench **2**) · **GW average: 45** · **Highest score: 120**
**Overall rank: 1,573,483** (up from 2,467,338, **+893,855 places**)
**GW rank:** 826,307 · **Season total: 514**
**Most captained in the game:** Haaland (8 pts, x2 = 16), and ours

Finalisation gate confirmed before writing, on the live `bootstrap-static` endpoint per
GW4 adjustment #6: `events[7].finished = true`, `data_checked = true`, all ten GW8
fixtures `finished`. `automatic_subs` on `entry/5047923/event/8/picks/` holds **one**:
Hall (449) in for João Pedro (165). `entry/5047923/history/` agrees on every field:
`points: 63`, `event_transfers: 1`, `event_transfers_cost: 0`, `total_points: 514`
(451 + 63), `points_on_bench: 2`, `bank: 13`, `value: 998`, `active_chip: null`.

| Player | Min | Pts | Notes |
|---|---|---|---|
| Raya | 90 | 7 | **Clean sheet** (+4), 3 saves (+1). 0.63 xGC. ARS 2-0 EVE |
| Thomas | 59 | 1 | Off at 59', appearance only. DC 4. COV 0-1 FUL. **Flagged `d` 75% (unspecified injury) on 24 Oct, after the game** |
| **Gabriel** | 90 | **17** | **Goal from 0.54 xG** + **clean sheet** + **DC 14 banked** (+2) + **3 bonus** (bps 44). ARS 2-0 EVE |
| **Murillo** | 90 | 1 | **DC 4, missed** (the floor he was bought for). Yellow (-1), conceded 1 from 0.46 xGC. 0.19 xG. IPS 1-1 NFO |
| Van Hecke | 90 | 7 | **Clean sheet** + 1 bonus. DC 8, missed by two. CHE 0-2 TOT |
| Mbeumo (V) | 90 | 2 | Appearance only. 0.26 xG. DC 3. MUN 0-3 BOU |
| Le Fée | 78 | 3 | Clean sheet (+1). DC 3. 0.10 xG, 0.17 xA. SUN 0-0 LEE |
| Gomez | 90 | 2 | Appearance only. DC 7, missed. 0.13 xG, 0.22 xA. LIV 2-0 BHA |
| **Haaland (C)** | 90 | **8 x2 = 16** | **Goal from 0.40 xG** + 2 bonus (bps 35). Started and played 90 on the cleared flag. AVL 2-1 MCI |
| João Pedro | 0 | 0 | **Did not play.** Knee injury in Friday's training ("some liquid", Alonso), ruled out of CHE v TOT ([SI](https://www.si.com/soccer/why-joao-pedro-not-playing-chelsea-vs-tottenham-10-24-26)). FPL flag `d` 75% added 24 Oct 16:30 UTC, after the deadline. **Autosubbed out** |
| Barry | 90 | 2 | Appearance only. 0.38 xG. ARS 2-0 EVE |
| *Bench: Dubravka* | 0 | 0 | Eighth week without a minute |
| *Bench: Hall* | 90 | **5** | **Autosub in for João Pedro** (4-3-3 → 5-3-2). Clean sheet from 1.59 xGC, DC 8 missed, yellow (-1). CRY 0-2 NEW |
| *Bench: Gibbs-White* | 90 | 2 | Flag cleared, played 90. **0.76 xG, 0.17 xA**, no return. DC 6. IPS 1-1 NFO |
| *Bench: Janelt* | 0 | 0 | Suspended (second yellow in GW7). Back for GW9 |
| *Sold: Guéhi* | 45 | 0 | 45 minutes, yellow (-1), conceded 1. DC 4. AVL 2-1 MCI |

**One autosub fired:** Hall (first outfield bench) for João Pedro, into a legal 5-3-2. The
bench order did its job: João Pedro's injury was in Friday training and his flag only went
up on Saturday afternoon, after the deadline, so nothing could have been done at the lock.
Bench left: Gibbs-White 2 (and Dubravka, Janelt 0).

XI **63**, no hit. **Eighteen above the average, +893,855 places**, the second week running
of a gain near a million. Gabriel and Haaland were **33 of the 63**; the other nine played
slots returned 30. Five starters scored 2 or less (Murillo 1, Thomas 1, Mbeumo 2, Gomez 2,
Barry 2). The best legal XI from the fifteen (Gibbs-White for Murillo or Thomas, 4-4-2)
scores **64**, +1: the first week since the wildcard that the XI was close to its own best.

### Flag outcomes

- [x] (+1) **Guéhi → Murillo: RIGHT ANSWER, WRONG MECHANISM, +1.** Murillo 1 (DC 4,
      missed; yellow; conceded 1 at Ipswich), Guéhi 0 (45 minutes, yellow, conceded 1,
      Villa 2-1 City). The calc had +0.9; the result was +1, but not on the DC floor the
      move was bought for: Murillo's lowest DC of the season (4, after 14, 6, 10, 12, 11,
      10, 9) and Guéhi's own 0 made the margin. Played 63 against the written-down roll
      (Hall in Murillo's slot, Guéhi on the bench, same autosub) **62**. Running to GW13:
      **+1**.
- [x] (=) **Calafiori, the template defender we did not buy: LEVEL, 1 AGAINST 1.** Calafiori
      22 minutes and off with a hip injury (`d` 75% since 24 Oct), 1 point. In Murillo's
      slot he would have scored the same 63. **Price:** Calafiori £6.0m, flat this round
      but **-172k net** and flagged, so the "rising" read of the lock has flipped to
      falling; Murillo £5.5m, flat. Running total, new: **Murillo against Calafiori: 0**.
      The price at the GW9 deadline (31 Oct 11:00 UTC) goes in the GW9 log.
- [x] (+6) **The armband on a just-cleared Haaland: YES, +6. STARTED, 90 MINUTES, A GOAL.**
      8 (goal from 0.40 xG, 2 bonus), x2 = 16. Mbeumo, the alternative 0.18 behind on the
      calc, scored 2 in MUN 0-3 BOU. Captain Mbeumo would have returned 4 + 8 = 12 from the
      pair against our 16 + 2 = **18**. The knock did not show.
- [x] (=) **The Thursday branch: NOT TAKEN, AND HAALAND STARTED AND PLAYED 90.** Settled at
      the lock; the outcome adds that the condition never came close.
- [x] (=) **Barry v Raya and Gabriel: NO, BARRY BLANKED AND ARSENAL KEPT THE CLEAN SHEET, 26
      FROM THE THREE.** ARS 2-0 EVE. Raya 7, Gabriel 17, Barry 2 (0.38 xG). The side we
      are long on won, as the hedging check argued. Benching Barry for Hall would have
      changed nothing: with Hall starting, Barry is the first bench outfielder and comes on
      for João Pedro into the same slot.
- [x] (=) **João Pedro v Van Hecke: IT DID NOT BITE, JOÃO PEDRO DID NOT PLAY.** Knee in
      training, ruled out. CHE 0-2 TOT: Van Hecke a clean sheet and 7. Dubravka on the
      bench again.
- [x] (=) **Van Hecke over Hall (adjustment #4): RIGHT ANSWER, NO EFFECT, BOTH PLAYED.** Van
      Hecke 7 (clean sheet, 1 bonus, DC 8), Hall 5 (clean sheet from 1.59 xGC, DC 8, yellow):
      the starter beat the bench man by 2, but João Pedro's absence brought Hall on, so both
      counted. Swap them and the total is the same. Third week of a last-defender rule and
      the first where the bench did **not** outscore the starting defender. Gabriel, started
      on the same rule, scored 17.
- [x] (=) **Gomez over Gibbs-White: LEVEL, 2 AND 2.** Gibbs-White's flag cleared, he played
      90 and carried the best underlying number in our fifteen (0.76 xG, 0.17 xA) for 2.
      Gomez 2 at Anfield (DC 7, 0.35 xGI). The quarter-point swap was worth nothing.
- [x] (-7) **Janelt's banned week: THE BAN COST 0, THE MIDFIELD MOVE WOULD HAVE WON 7.**
      Janelt sat last on the bench and was never reached; the one autosub was Hall for João
      Pedro. Against the best midfield move: Gibbs-White → Tavernier (no Murillo, Guéhi
      kept, Hall in Murillo's slot, Tavernier for Gomez in the XI) scores **70**: Tavernier
      **10** (goal from 0.72 xG, clean sheet, 2 bonus, 86 minutes at Old Trafford), Guéhi 0
      off the bench for João Pedro. **-7 against what we played.** The calc had Tavernier
      +0.65 in GW8 against Murillo's +0.89, and +4.5 against +4.4 over six. Tavernier is now
      £6.3m (+£0.1, **+400k net**, the round's biggest riser).
- [x] (+5) **The template, priced at 9.1: IT RETURNED 3.7.** Ownership × points on the
      proposal's table: Konsa 17.8% × 14 = 2.5, Calafiori 53.8% × 1 = 0.5, Rogers 48.0% ×
      1 = 0.5, De Cuyper 41.0% × 1 = 0.4, Groß 45.3% × 0 = 0, Palmer 26.4% × -1 = -0.3.
      **3.7 against 9.1**, 5.4 less than priced. Four of the six blanked; the one haul was
      the least-owned line (Konsa, goal and clean sheet).
- [x] (=) **João Pedro's price: £7.9m AT THE DEADLINE, UNCHANGED.** Settled at the lock. Now
      `d` 75% (knee, "tests") with **-231k net** this round: a drop is likely before GW9.
      Sell price £7.8m.
- [x] (?) **Running totals to GW11: B AGAINST A +21, WILDCARD AGAINST THE ROLL +53,
      B.FERNANDES AGAINST GIBBS-WHITE +2, GABRIEL AGAINST MURILLO +22, -4 AGAINST A +6,
      JOÃO PEDRO AGAINST THIAGO -7, MODEL'S FT AGAINST THE PLAYED FT -4.**
      *B against A:* A frozen at GW6 already owns Murillo and has Ajer in Guéhi's slot, so
      it makes no GW8 move; the only XI difference is **Gabriel 17 against Ajer 2** (Hall
      autosubs in both). B.Fernandes (0 minutes) against Gibbs-White (bench) does not reach
      either XI. **+15 this week, +21.** *Wildcard against the roll:* the written-down
      roll's fifteen, frozen (Raya; Gabriel, Calafiori, Guéhi, Hall; B.Fernandes (C),
      Mbeumo (V), Gibbs-White, Gomez, Semenyo; Barry; bench Dubravka, Mitchell, João Pedro,
      Obi). B.Fernandes and Semenyo did not play: Mitchell on for 1 (5-4-1), João Pedro and
      Obi 0 minutes, so ten men; the armband passes to Mbeumo. 7 + 17 + 1 + 0 + 5 + 1 + 2×2
      + 2 + 2 + 0 + 2 = **41**, against our 63: **+22 this week, +53**. *B.Fernandes
      against Gibbs-White:* 0 (did not play) against 2, **+2, running +2**. *Gabriel against
      Murillo:* 17 against 1, **+16, running +22**; we now own both, so the line is
      Gabriel's case, not a choice. *-4 against A:* Van Hecke 7 against Branthwaite 0 (did
      not play), **+7, running +6**: the hit is now paid back. *João Pedro against Thiago:*
      0 against 5 (assist), **-5, running -7**. *Model's FT against the played FT:* the
      model's FT was played, **0, running -4**.

---

## Learnings

### What we got right

- **The armband.** Haaland on a flag that cleared 72 hours before the deadline, read at the
  API's 100% (GW6 #1, GW7 #2): 90 minutes, a goal, 16. The vice and the Thursday branch were
  cover that was never needed. Same player as the field, so the ledger holds at **+4**.
- **The clean-sheet tiebreak (GW7 #4).** It started Gabriel (17: goal, clean sheet, DC 14,
  3 bonus) and Van Hecke over Hall (7 against 5). After two weeks of benched clean sheets,
  this week the rule put the right two in, and the bench returned 2.
- **The bench order.** Hall first on minutes certainty meant João Pedro's training injury,
  invisible at the deadline, cost 0 instead of 5: the autosub fell into a legal 5-3-2.
- **The hedges priced and kept.** Barry against Arsenal and João Pedro against Spurs both
  went our way (Arsenal 2-0, Spurs clean sheet). Taking the side we are long on was right
  twice, and neither clash cost a point.
- **No hit, no injury sale.** GW7 #3 and #5 held: Gibbs-White kept on a `d` 75% that
  cleared, and no -4 chased a +1.6 combination.

### What we got wrong

- **The FT went to the defender, and the midfielder was the week.** Murillo 1 against
  Tavernier 10; the alternative scores 70 against 63. The calc had them level over six
  (+4.4 against +4.5) and Murillo +0.24 in GW8; the tiebreak that decided it was GW7 #3
  (do not sell on an injury flag), applied to a flag that FPL lifted before the deadline.
  Tavernier rose £0.1 and is still rising.
- **Murillo's DC floor did not show up in the first week.** DC 4, his lowest in eight
  games, and a yellow: 1 point on a move sold on "four points before anything happens".
  One week does not break a 5-of-7 rate, but the floor is a rate, not a floor.
- **Five starters on 2 or less.** Mbeumo 2 at home to Bournemouth (the second-best defence,
  which the model flagged and still ranked him our vice), Gomez 2 at Anfield, Barry 2 at
  Arsenal, Thomas 1 off at 59', Murillo 1. The XI was near its own optimum (64); the
  fifteen is the limit, not the order.

### Gut calibration

**A week won by two players and the field's misses.** Gabriel and Haaland were 33 of 63;
the rest of the XI scored about what an average week's nine slots score. The margin over
the average (+18) came as much from the unowned template blanking (3.7 against 9.1 priced)
as from our returns. That is variance in our favour, the mirror of GW6.

**Model against human: no disagreement to score this week.** The proposal was played 5 of
5. Murillo beat Guéhi and the roll by 1, as the calc said (+0.9); the miss was the option
the calc rated level, Tavernier, which the model ranked a quarter-point lower in GW8 and
the injury rule ruled out. Running "model's FT against the played FT" stays **-4**.

**Rank.** 1.57m, the best of the season, ~800k above GW5's 2.38m. Two weeks, +1.85m. The
wildcard squad has now beaten its written-down roll by +53 over three weeks.

### Adjustments for next time

1. **João Pedro is `d` 75% (knee, "liquid", tests pending; news 24 Oct 16:30).** Fresh news:
   read at **75%** (GW6 #1). He is 71.3% owned and template: **never sold on this flag**
   unless the club rules him out for weeks. Read Chelsea's presser before the GW9 research
   run picks the XI. He plays MUN at home in GW9. If he starts the GW9 XI, Hall (or a fit
   defender) is first on the bench again; if he is ruled out, he is benched, not sold, and
   the FT stays on #3.
2. **Thomas is `d` 75% (unspecified, off at 59' v Fulham, news 24 Oct 17:00).** Same read:
   75%. He is a £4.0m DC defender with SUN at home: benched only if the club rules him out.
3. **The GW9 FT goes to midfield: Gibbs-White → Tavernier, re-priced first.** The case GW8
   rejected on GW7 #3 is gone (Gibbs-White is `a` 100 and played 90), so the sale is now a
   value move on a faller (-£0.1, -31k net) into a riser (Tavernier £6.3m, +400k). Bank
   £1.3m + sell £7.8m covers him with £2.8m to spare. Run it against the field on the calc;
   it is the default unless something in the squad is ruled out.
4. **GW7 #3 was written for a flag that is live at the lock, not one that cleared.** When a
   player's injury flag clears to `a` before the deadline, the sale is priced like any other
   move; the rule does not keep blocking it. The GW8 run held Gibbs-White → Tavernier back
   on a `d` 75% that cleared the same evening.
5. **Janelt is back for GW9 (BRE v NFO, against Murillo).** That is a same-game pair on
   opposite sides: price it with the hedging rule, and do not start both on reflex.
6. **Keep the clean-sheet tiebreak (GW7 #4).** First week it was tested with a clear result
   (Gabriel 17, Van Hecke 7 against Hall 5). Under 1.0 xP, the defender with the higher team
   clean-sheet chance starts.
7. **Carry the running totals to GW11:** B against A **+21**, wildcard against the roll
   **+53**, B.Fernandes against Gibbs-White **+2**, Gabriel against Murillo **+22**, -4
   against A **+6**, João Pedro against Thiago **-7**, model's FT against the played FT
   **-4**, and to GW13: Guéhi → Murillo **+1**, Murillo against Calafiori **0**.
8. **GW9 opens with 1 FT and £1.3m ITB**, deadline **Saturday 31 Oct 11:00 UTC**. Record
   Calafiori's and Murillo's prices at it (the GW8 price flag).

### Chip planning notes

- **Bench Boost: still two moves from live.** The bench returned 2 + the autosub's 5. Dubravka
  is in his eighth week without a minute; Kinsky (TOT, £4.4m, now -£0.1) kept a clean sheet
  and scored 9 at Chelsea. A playing £4.0-4.5m keeper is the first fix when an FT is spare.
  Expires **GW19**; a DGW before then would be the week.
- **Free Hit: held.** No DGW or BGW known before GW19. Emergency cover if João Pedro's knee
  and Thomas's flag turn into absences alongside another.
- **Triple Captain: spent (GW7, +13).** Tie-week scores: GW11 (FUL H), GW15 (CHE H), GW16
  (HUL H) in their own logs.
- **Wildcard:** first half spent in GW6 (+53 against the roll over three weeks). The
  second-half wildcard opens from GW20.
