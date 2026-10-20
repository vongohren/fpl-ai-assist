# GW8 Decision Log: MURILLO FOR GUÉHI, THE ARMBAND STAYS ON A 75% HAALAND

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
   *Applied, with one thing the run cannot do: the presser is Thursday 22 Oct, after this run
   (Tuesday 20 Oct). So the captaincy below is argued at 75%, and the checklist carries the
   Thursday branch: ruled out → captain Mbeumo, vice João Pedro. Not sold. The vice (Mbeumo)
   starts and is `a`.*
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
| **Haaland** | `d` 75% | "Unspecified injury" (19 Oct 13:00) | Left-foot knock in the last minutes v Ipswich. Maresca on 19 Oct: *"He can be available. We'll see... we have some doubts after Sunday's game"* ([Sports Mole](https://www.sportsmole.co.uk/football/man-city/injury-news/news/is-haaland-injured-maresca-delivers-big-update-on-man-city-goal-machine_607237.html)). Then **on the bench v AEK Athens on 20 Oct**, Samba leading the line ([City Xtra](https://cityxtra.co.uk/match-coverage/confirmed-line-ups-manchester-city-vs-aek-athens-uefa-champions-league)): rested, not ruled out. Whether he came on was not known when this was written. Read at 75% (#2) |
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
P(start)    = minutes share × FPL flag; Haaland 0.74 (0.98 × 75%, adjustment #2);
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
| **Haaland** | MCI at AVL | **2.58** | **5.22** | 0.74 | 76.7% |
| Mbeumo | MUN v BOU | 2.16 | 4.95 | 1.00 | 20.3% |
| João Pedro | CHE v TOT | 2.17 | 4.76 | 0.95 | 72.8% |
| Le Fée | SUN v LEE | 1.83 | 4.58 | 0.97 | 2.9% |
| Barry | EVE at ARS | 1.65 | 4.17 | 0.94 | 8.4% |

The page's calc multiplies Haaland by his 75% and shows him at **3.85**, below Mbeumo. That
is the right number for him as a player, and the wrong number for him as a captain: if he
does not play, the armband passes to the vice. The armband's value is

```
P(plays) × Haaland per start + (1 − P(plays)) × vice
```

| P(Haaland plays) | C Haaland, V Mbeumo | C Haaland, V João Pedro | C Mbeumo |
|---|---|---|---|
| 0.50 | 5.03 | 4.82 | 4.95 |
| **0.75** | **5.07** | 4.97 | 4.95 |
| 0.90 | 5.10 | 5.06 | 4.95 |
| 1.00 | 5.12 | 5.12 | 4.95 |

**Captain Haaland, vice Mbeumo.** Because the vice is Mbeumo, the armband on Haaland is worth
at least Mbeumo's number whether Haaland plays or misses the game outright; the only case it
loses is Haaland starting and coming off early. The margin is 0.1-0.2: a tie, so GW6
adjustment #5 decides it (under
0.5 apart and we own the field's captain: captain him). He is the field's captain by a
distance (50 of the top 50 captained him in GW7; RotoWire's No. 1). Villa concede 1.59 xG a
game and City create the most in the league. Not captaining him when he plays and scores is
the one big loss on the board this week.

The 75% is the risk and the doc does not hide it: a knock to the foot, a Champions League
game on 20 Oct (AEK) between the injury and Villa, and Maresca's "we'll see". What the
proposal does about it is the vice and the bench, not the armband: Mbeumo starts, is `a`, and
has the best fixture-level number in the squad after Haaland; Hall is first on the bench so a
Haaland absence autosubs into a legal 5-3-2.

**Vice: Mbeumo, not João Pedro.** Mbeumo 4.95 against João Pedro 4.76 per start (4.52 at
his 0.95). If Haaland is ruled out before the deadline (the Thursday branch), the field will
mostly move to João Pedro, and the gap (0.43) is under 0.5, so adjustment #5 would hand him
the armband. That is the checklist's Thursday branch. If Haaland drops out after the deadline,
the field's armbands go to a thousand different vices and the model's vice is the right one.

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
| FWD | **Haaland (C)** | AVL (a) | 3.85 | | 0.74 P(start); 5.22 per start |
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
| FWD | **Haaland (C)** | MCI | 15.7 | AVL (a) | 3.85 |
| FWD | João Pedro | CHE | 7.9 | TOT (H) | 4.52 |
| FWD | Barry | EVE | 5.7 | ARS (a) | 3.92 |

**Calculated XI: 47.3 before the armband; 51.1 with the armband on the page's 75% Haaland;
52.3 with the vice backstop counted** (5.07, above).

**Bench:** Dubravka (GK) → Hall (DEF, `a`) → Gibbs-White (MID, `d` 75%) → Janelt (MID, banned).

**Projected state after:** £98.4m squad, £1.3m ITB. ARS×2, TOT×2, NFO×2, one each of COV,
NEW, BRE, MUN, BHA, SUN, MCI, EVE, CHE. Chips left: BB, FH (first half, expire GW19).
GW9 opens with **1 FT**.

### Zero-transfer alternative

Roll the FT (2 FTs in GW9), keep Guéhi. Same XI with **Hall in Murillo's slot** (Raya;
Thomas, Gabriel, Van Hecke, Hall), same captain and vice, bench Dubravka, Guéhi,
Gibbs-White, Janelt.

**Expected cost: 0.9 in GW8 and 4.4 over GW8-13** on the calc, like for like (Haaland
captained both ways). Two FTs in GW9 buy flexibility for Janelt's return and a Bench Boost
keeper, but nothing in the squad is broken enough to need two at once. **The page shows the
roll 0.2 ahead (51.3 against 51.1) because its "keep" side picks its own captain (Mbeumo)
while the proposal's armband is on Haaland at 75%.** With the same captain on both sides the
transfer is +0.9. Over six weeks the page reads **+5.9** (321.3 against 315.4) because it
scores one fixed best XI on the six-week sums; the +4.4 above re-picks the XI every week.

### Chip strategy
**No chip.** BB and FH remain, both expiring **GW19**. Bench Boost waits for a playing reserve
keeper; Free Hit is the emergency.

---

## Decision

*Written by the lock phase from what was actually done.*

---

## Accepted risks

- **The captain is 75%.** A foot knock, a Champions League game in between, and Maresca's
  "we'll see". The vice (Mbeumo) and Hall first on the bench are the cover; the Thursday
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
| 8 | Haaland *(AVL away, FDR 3, `d` 75%)*, proposed | | Haaland *(expected)* | | | |

If Haaland does not play, the armband passes to Mbeumo and the field's to whoever their vices
are; the lock should record the captain who actually carried the multiplier.

---

## Watch flags for GW8

- [ ] **Guéhi → Murillo (the model's FT).** Murillo's points minus Guéhi's, GW8 and running to
      GW13. The calc had it at +0.9 in GW8 and +4.4 over six. Did Murillo bank DC, and did
      Guéhi keep a clean sheet at Villa?
- [ ] **Calafiori, the template defender we did not buy.** His points against Murillo's (the
      overruled-template line, the mirror of GW7's). Start a running total "Murillo against
      Calafiori".
- [ ] **The armband on a 75% Haaland.** Did he start, how long did he play, and what did the
      armband return against Mbeumo's points (the model's pick without the backstop)?
- [ ] **The Thursday branch.** Was Haaland ruled out, and was the branch taken?
- [ ] **Barry v Raya and Gabriel (EVE at ARS).** What did the three return together, and did
      a Barry goal cost the clean sheet?
- [ ] **João Pedro v Van Hecke (CHE v TOT).** Same question.
- [ ] **Van Hecke over Hall (adjustment #4, clean-sheet tiebreak).** Points of each. Third week
      of testing a last-defender rule: did the bench outscore the starter again?
- [ ] **Gomez over Gibbs-White.** Did Gibbs-White's flag clear and did he play? Points of each.
- [ ] **Janelt's banned week.** Zero by construction; does the bench (Hall, Gibbs-White)
      fire an autosub, and did leaving him unsold cost anything against the best midfield
      move (Gibbs-White → Tavernier, Tavernier's points)?
- [ ] **The template, priced at 9.1.** Sum the unowned template's actual points × ownership.
- [ ] **João Pedro's price:** £7.9m at research time (bought 7.8). Price at the GW8 deadline.
- [ ] **Running totals to GW11:** B against A (+6), wildcard against the roll (+31),
      B.Fernandes against Gibbs-White (0), Gabriel against Murillo (+6), -4 against A (-1),
      João Pedro against Thiago (-2), model's FT against the played FT (-4). Add GW8.

---

## Outcome

*To be filled in after GW8 finalises. Respect the finalisation gate from GW1:*
*`events[7].finished = true`, `data_checked = true`, and `automatic_subs` populated.*
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
| Gabriel | | | |
| Murillo | | | |
| Van Hecke | | | |
| Mbeumo (V) | | | |
| Le Fée | | | |
| Gomez | | | |
| Haaland (C) | | | |
| João Pedro | | | |
| Barry | | | |
| *Bench: Dubravka* | | | |
| *Bench: Hall* | | | |
| *Bench: Gibbs-White* | | | |
| *Bench: Janelt* | | | |
| *Sold: Guéhi* | | | |

### Flag outcomes

- [ ] Guéhi → Murillo:
- [ ] Calafiori, the template defender we did not buy:
- [ ] The armband on a 75% Haaland:
- [ ] The Thursday branch:
- [ ] Barry v Raya and Gabriel:
- [ ] João Pedro v Van Hecke:
- [ ] Van Hecke over Hall:
- [ ] Gomez over Gibbs-White:
- [ ] Janelt's banned week:
- [ ] The template, priced at 9.1:
- [ ] João Pedro's price:
- [ ] Running totals to GW11:

---

## Learnings

### What we got right

### What we got wrong

### Gut calibration

### Adjustments for next time

### Chip planning notes
