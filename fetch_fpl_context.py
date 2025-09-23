#!/usr/bin/env python3
import os, json, argparse
from datetime import datetime, timezone
from typing import Optional
import requests

API_BASE = "https://fantasy.premierleague.com/api"

def get_json(path: str, cookie: Optional[str] = None, params=None):
    url = f"{API_BASE}/{path.lstrip('/')}"
    headers = {
        "User-Agent": "FPL-Context/1.0 (+https://fantasy.premierleague.com)",
        "Origin": "https://fantasy.premierleague.com",
        "Referer": "https://fantasy.premierleague.com/",
        "x-requested-with": "XMLHttpRequest",
    }
    if cookie:
        headers["Cookie"] = cookie
    x_api = os.getenv("FPL_X_API_AUTH")
    if x_api:
        headers["X-Api-Authorization"] = x_api
    r = requests.get(url, headers=headers, params=params, timeout=20)
    r.raise_for_status()
    return r.json()

def try_get_json(path: str, cookie: Optional[str] = None, params=None):
    try:
        return get_json(path, cookie, params)
    except Exception as e:
        return {"_error": str(e)}

def map_player(e):
    return {
        "id": e["id"],
        "web_name": e["web_name"],
        "first_name": e["first_name"],
        "second_name": e["second_name"],
        "team": e["team"],
        "now_cost": e["now_cost"],
        "element_type": e["element_type"],
        "status": e["status"],
        "chance_of_playing_next_round": e.get("chance_of_playing_next_round"),
        "ep_next": e.get("ep_next"),
        "ep_this": e.get("ep_this"),
        "minutes": e.get("minutes"),
        "form": e.get("form"),
        "ict_index": e.get("ict_index"),
        "selected_by_percent": e.get("selected_by_percent"),
        "expected_goals_per_90": e.get("expected_goals_per_90"),
        "expected_assists_per_90": e.get("expected_assists_per_90"),
    }

def build_player_lookup(players):
    """Build lookup dictionaries for players."""
    players_by_id = {p["id"]: p for p in players}
    return players_by_id

def build_team_lookup(teams):
    """Build lookup dictionaries for teams."""
    teams_by_id = {t["id"]: t for t in teams}
    return teams_by_id

def get_current_squad_analysis(context):
    """Analyze current squad from my_team.picks with proper joins."""
    try:
        my_team = context["team_state"]["my_team"]
        if "_error" in my_team:
            print("Warning: my_team data not available (authentication required)")
            return None
            
        picks = my_team["picks"]
        players = context["market"]["players"]
        teams = context["market"]["teams"]
        
        # Build lookup tables
        players_by_id = build_player_lookup(players)
        teams_by_id = build_team_lookup(teams)
        
        # Position mappings
        position_names = {1: 'GK', 2: 'DEF', 3: 'MID', 4: 'FWD'}
        
        # Analyze each pick
        squad_analysis = []
        captain_id = None
        vice_id = None
        club_counts = {}
        total_cost = 0
        
        for pick in picks:
            element_id = pick["element"]
            player = players_by_id.get(element_id)
            if not player:
                print(f"Warning: Player {element_id} not found in catalog")
                continue
                
            team = teams_by_id.get(player["team"])
            team_name = team["short_name"] if team else f"Team{player['team']}"
            position_name = position_names.get(pick["element_type"], "UNK")
            
            # Track captain/vice
            if pick["is_captain"]:
                captain_id = element_id
            if pick["is_vice_captain"]:
                vice_id = element_id
                
            # Count players per club
            club_counts[team_name] = club_counts.get(team_name, 0) + 1
            
            # Calculate total squad value
            total_cost += player["now_cost"]
            
            player_analysis = {
                "element_id": element_id,
                "position": pick["position"],
                "name": player["web_name"],
                "full_name": f"{player['first_name']} {player['second_name']}",
                "team": team_name,
                "position_type": position_name,
                "cost": player["now_cost"] / 10.0,  # Convert to millions
                "selling_price": pick["selling_price"] / 10.0,
                "is_captain": pick["is_captain"],
                "is_vice_captain": pick["is_vice_captain"],
                "multiplier": pick["multiplier"],
                "ep_next": float(player["ep_next"]) if player["ep_next"] else 0.0,
                "form": float(player["form"]) if player["form"] else 0.0,
                "status": player["status"],
                "chance_of_playing": player["chance_of_playing_next_round"],
                "minutes": player.get("minutes", 0),
                "ict_index": float(player["ict_index"]) if player["ict_index"] else 0.0
            }
            squad_analysis.append(player_analysis)
            
        # Sort by position for display
        squad_analysis.sort(key=lambda x: x["position"])
        
        return {
            "squad": squad_analysis,
            "captain_id": captain_id,
            "vice_id": vice_id,
            "club_counts": club_counts,
            "total_squad_value": total_cost / 10.0,
            "starting_xi": [p for p in squad_analysis if p["multiplier"] > 0],
            "bench": [p for p in squad_analysis if p["multiplier"] == 0]
        }
        
    except Exception as e:
        print(f"Warning: Could not analyze current squad: {e}")
        return None

def calculate_fixtures_difficulty(context, next_gw_count=6):
    """Calculate average fixtures difficulty for each team over next N gameweeks."""
    try:
        fixtures = context["fixtures"]["next6_gw"]
        teams_by_id = build_team_lookup(context["market"]["teams"])
        
        # Track difficulty per team
        team_difficulties = {}
        team_fixture_counts = {}
        
        for fixture in fixtures:
            if isinstance(fixture, dict) and "event" in fixture:
                home_team = fixture["team_h"]
                away_team = fixture["team_a"]
                
                # Home team difficulty
                if home_team not in team_difficulties:
                    team_difficulties[home_team] = 0
                    team_fixture_counts[home_team] = 0
                team_difficulties[home_team] += fixture.get("team_h_difficulty", 3)
                team_fixture_counts[home_team] += 1
                
                # Away team difficulty  
                if away_team not in team_difficulties:
                    team_difficulties[away_team] = 0
                    team_fixture_counts[away_team] = 0
                team_difficulties[away_team] += fixture.get("team_a_difficulty", 3)
                team_fixture_counts[away_team] += 1
        
        # Calculate averages
        avg_difficulties = {}
        for team_id in team_difficulties:
            if team_fixture_counts[team_id] > 0:
                avg_diff = team_difficulties[team_id] / team_fixture_counts[team_id]
                team_name = teams_by_id.get(team_id, {}).get("short_name", f"Team{team_id}")
                avg_difficulties[team_name] = {
                    "avg_difficulty": round(avg_diff, 2),
                    "fixture_count": team_fixture_counts[team_id]
                }
                
        return avg_difficulties
        
    except Exception as e:
        print(f"Warning: Could not calculate fixtures difficulty: {e}")
        return {}

def suggest_transfers(context, max_suggestions=5):
    """Suggest potential transfers based on squad analysis."""
    try:
        squad_analysis = get_current_squad_analysis(context)
        if not squad_analysis:
            return []
            
        all_players = context["market"]["players"]
        teams_by_id = build_team_lookup(context["market"]["teams"])
        
        # Get current bank and constraints
        history = context["team_state"]["history"]["current"][-1]  # Latest GW
        bank = history["bank"] / 10.0  # Convert to millions
        
        current_squad_ids = {p["element_id"] for p in squad_analysis["squad"]}
        club_counts = squad_analysis["club_counts"]
        
        suggestions = []
        
        # Find potential transfers for each position
        position_groups = {
            1: [p for p in squad_analysis["squad"] if p["position_type"] == "GK"],
            2: [p for p in squad_analysis["squad"] if p["position_type"] == "DEF"], 
            3: [p for p in squad_analysis["squad"] if p["position_type"] == "MID"],
            4: [p for p in squad_analysis["squad"] if p["position_type"] == "FWD"]
        }
        
        for pos_type, current_players in position_groups.items():
            if not current_players:
                continue
                
            # Find the weakest player in this position (lowest ep_next)
            weakest = min(current_players, key=lambda x: x["ep_next"])
            
            # Find better alternatives
            alternatives = [
                p for p in all_players 
                if p["element_type"] == pos_type 
                and p["id"] not in current_squad_ids
                and p["status"] == "a"  # Available
                and (p["now_cost"] / 10.0) <= (weakest["selling_price"] + bank)
            ]
            
            # Sort by ep_next descending
            alternatives.sort(key=lambda x: float(x["ep_next"]) if x["ep_next"] else 0, reverse=True)
            
            # Check top alternatives
            for alt in alternatives[:3]:
                alt_team = teams_by_id.get(alt["team"], {}).get("short_name", f"Team{alt['team']}")
                
                # Check club constraint (would we exceed 3 players from same club?)
                if alt_team != weakest["team"]:
                    new_club_count = club_counts.get(alt_team, 0) + 1
                    if new_club_count > 3:
                        continue
                
                cost_diff = (alt["now_cost"] / 10.0) - weakest["selling_price"]
                ep_diff = (float(alt["ep_next"]) if alt["ep_next"] else 0) - weakest["ep_next"]
                
                if ep_diff > 0.5:  # Only suggest if meaningful improvement
                    suggestions.append({
                        "out_player": weakest["name"],
                        "out_id": weakest["element_id"],
                        "in_player": alt["web_name"],
                        "in_id": alt["id"],
                        "position_type": weakest["position_type"],
                        "cost_change": cost_diff,
                        "ep_improvement": ep_diff,
                        "out_team": weakest["team"],
                        "in_team": alt_team,
                        "feasible": cost_diff <= bank
                    })
        
        # Sort by EP improvement and feasibility
        suggestions.sort(key=lambda x: (x["feasible"], x["ep_improvement"]), reverse=True)
        return suggestions[:max_suggestions]
        
    except Exception as e:
        print(f"Warning: Could not generate transfer suggestions: {e}")
        return []

def extract_prompt_variables(context):
    """Extract template variables for prompt population."""
    try:
        gw = context["meta"]["gameweek"]
        
        # Get data from history (always available)
        history = context["team_state"]["history"]["current"][-1]  # Latest GW
        bank = history["bank"] / 10.0  # Convert to millions
        
        # Try to get authenticated transfer data first
        my_team = context["team_state"]["my_team"]
        if "_error" not in my_team and "transfers" in my_team:
            # Use authenticated data - this shows actual transfers available for upcoming GW
            transfers_data = my_team["transfers"]
            free_transfers = transfers_data["limit"] - transfers_data["made"]
        else:
            # Fallback for unauthenticated: assume standard 1 FT
            # Note: history["event_transfers"] shows transfers made in that completed GW,
            # but tells us nothing about transfers available for upcoming GW
            free_transfers = 1
            print(f"Warning: Using default 1 FT assumption (authentication required for accurate transfer data)")
        
        # Try to get chip data from my_team
        chips_str = "Data unavailable (requires authentication)"
        if "_error" not in my_team and "chips" in my_team:
            chips = my_team["chips"]
            available_chips = [
                chip["name"] for chip in chips 
                if chip["status_for_entry"] == "available"
            ]
            chips_str = ", ".join(available_chips) if available_chips else "None"
        
        return {
            "GW": str(gw),
            "BANK": f"{bank:.1f}",
            "FT": str(free_transfers),
            "CHIPS_AVAILABLE": chips_str
        }
    except KeyError as e:
        print(f"Warning: Could not extract prompt variable due to missing key: {e}")
        return None

def populate_prompt_template(template_path, variables, output_path):
    """Populate prompt template with variables."""
    try:
        with open(template_path, 'r') as f:
            template_content = f.read()
        
        populated = template_content
        for var_name, var_value in variables.items():
            placeholder = f"{{{{{var_name}}}}}"
            populated = populated.replace(placeholder, var_value)
        
        with open(output_path, 'w') as f:
            f.write(populated)
        
        return True
    except Exception as e:
        print(f"Warning: Could not populate prompt template: {e}")
        return False

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--manager", type=int, required=True, help="FPL manager id (entry id)")
    ap.add_argument("--gw", type=int, required=True, help="Gameweek number (event id)")
    ap.add_argument("--outfile", default="context.json")
    ap.add_argument("--populate-prompt", action="store_true", 
                    help="Also generate populated prompt from template")
    ap.add_argument("--template", default="prompt_template.md", 
                    help="Path to prompt template (used with --populate-prompt)")
    args = ap.parse_args()

    cookie = os.getenv("FPL_COOKIE")  # optional

    boot = get_json("bootstrap-static/")
    events = boot["events"]
    teams = boot["teams"]
    elements = boot["elements"]
    element_types = boot["element_types"]

    players = [map_player(e) for e in elements]

    fixtures_this = try_get_json("fixtures/", params={"event": args.gw})
    fixtures_upcoming = try_get_json("fixtures/", params={"future": 1})
    live = try_get_json(f"event/{args.gw}/live/")
    picks = try_get_json(f"entry/{args.manager}/event/{args.gw}/picks/")
    history = try_get_json(f"entry/{args.manager}/history/")
    myteam = try_get_json(f"my-team/{args.manager}/", cookie=cookie)

    event = next((e for e in events if e["id"] == args.gw), None)
    next6_ids = [e for e in range(args.gw, min(args.gw+6, max(ev["id"] for ev in events)+1))]
    next6_fixtures = [fx for fx in fixtures_upcoming if isinstance(fx, dict) and fx.get("event") in next6_ids] if isinstance(fixtures_upcoming, list) else []

    # Enhanced context with analysis
    context = {
        "meta": {
            "generated_at_utc": datetime.now(timezone.utc).isoformat(),
            "api_base": API_BASE,
            "manager_id": args.manager,
            "gameweek": args.gw,
        },
        "event": {
            "deadline_time": event["deadline_time"] if event else None,
            "is_current": event["is_current"] if event else None,
            "is_next": event["is_next"] if event else None,
            "finished": event["finished"] if event else None,
        },
        "team_state": {
            "public_picks": picks,
            "history": history,
            "my_team": myteam,
        },
        "market": {
            "players": players,
            "teams": teams,
            "positions": element_types,
        },
        "fixtures": {
            "this_gw": fixtures_this,
            "next6_gw": next6_fixtures,
        },
        "live": live,
    }
    
    # Add enhanced analysis sections
    squad_analysis = get_current_squad_analysis(context)
    if squad_analysis:
        context["analysis"] = {
            "current_squad": squad_analysis,
            "fixtures_difficulty": calculate_fixtures_difficulty(context),
            "transfer_suggestions": suggest_transfers(context)
        }

    with open(args.outfile, "w") as f:
        json.dump(context, f, indent=2)
    print(f"Wrote {args.outfile}")
    
    # Generate populated prompt if requested
    if args.populate_prompt:
        variables = extract_prompt_variables(context)
        if variables:
            gw = variables["GW"]
            prompt_output = f"gw{gw}_prompt.md"
            
            if populate_prompt_template(args.template, variables, prompt_output):
                print(f"Generated populated prompt: {prompt_output}")
                print(f"Variables: GW={variables['GW']}, Bank=£{variables['BANK']}m, FT={variables['FT']}, Chips={variables['CHIPS_AVAILABLE']}")
            else:
                print("Failed to generate populated prompt")

if __name__ == "__main__":
    main()