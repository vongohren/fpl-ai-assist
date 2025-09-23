#!/usr/bin/env python3
"""
Populate FPL prompt template with data from context.json
"""
import json
import argparse
from pathlib import Path


def extract_data_from_context(context_data):
    """Extract template variables from context data."""
    
    # Get gameweek from meta
    gw = context_data["meta"]["gameweek"]
    
    # Get team state data
    my_team = context_data["team_state"]["my_team"]
    
    # Bank is in tenths of millions (1 = 0.1m)
    bank = my_team["transfers"]["bank"] / 10.0
    
    # Free transfers = limit - made
    free_transfers = my_team["transfers"]["limit"] - my_team["transfers"]["made"]
    
    # Get available chips
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


def populate_template(template_content, variables):
    """Replace template variables with actual values."""
    populated = template_content
    
    for var_name, var_value in variables.items():
        placeholder = f"{{{{{var_name}}}}}"
        populated = populated.replace(placeholder, var_value)
    
    return populated


def main():
    parser = argparse.ArgumentParser(description="Populate FPL prompt template with context data")
    parser.add_argument("--context", default="context.json", help="Path to context.json file")
    parser.add_argument("--template", default="prompt_template.md", help="Path to prompt template file")
    parser.add_argument("--output", help="Output file path (default: gw{N}_prompt.md)")
    args = parser.parse_args()
    
    # Load context data
    with open(args.context, 'r') as f:
        context_data = json.load(f)
    
    # Extract variables
    variables = extract_data_from_context(context_data)
    
    # Load template
    with open(args.template, 'r') as f:
        template_content = f.read()
    
    # Populate template
    populated_content = populate_template(template_content, variables)
    
    # Determine output filename
    if args.output:
        output_path = args.output
    else:
        gw = variables["GW"]
        output_path = f"gw{gw}_prompt.md"
    
    # Write populated template
    with open(output_path, 'w') as f:
        f.write(populated_content)
    
    print(f"Populated prompt written to {output_path}")
    print(f"Variables used:")
    for var_name, var_value in variables.items():
        print(f"  {var_name}: {var_value}")


if __name__ == "__main__":
    main()

