# FPL AI Assistant Context System

A Python-based system for fetching and structuring Fantasy Premier League data for AI-powered decision making.

## Overview

This system fetches comprehensive FPL data and structures it specifically for AI consumption, ensuring LLMs focus on your actual squad rather than getting lost in the vast player market data.

## Quick Start

```bash
# Fetch context for your team
python fetch_fpl_context.py --manager 4897037 --gw 6 --populate-prompt

# This creates:
# - context.json (structured data for AI)  
# - gw6_prompt.md (ready-to-use prompt)
```

## Key Features

### 🎯 **AI-Optimized Data Structure**
- **Current squad prominently featured** at the top level
- **Summary section** with key constraints and info
- **Validation warnings** for data quality issues
- **Logical hierarchy** to guide AI attention

### 🔧 **Functional Design** 
- Pure functions for data transformation
- Clear separation of concerns
- Comprehensive error handling
- Testable components

### 📊 **Rich Analysis**
- Squad analysis with expected points
- Fixture difficulty calculations  
- Pre-calculated transfer suggestions
- Club distribution tracking

## JSON Output Structure

```json
{
  "IMPORTANT_READ_FIRST": {
    "summary": {
      "gameweek": 6,
      "authentication_status": "authenticated",
      "bank_available": 0.1,
      "free_transfers": 1,
      "chips_available": ["bboost", "3xc", "wildcard", "freehit"],
      "squad_summary": { /* High-level squad info */ },
      "data_quality_warnings": [ /* Any issues */ ]
    },
    "current_squad_details": {
      "squad": [ /* Your 15 players with full details */ ],
      "starting_xi": [ /* Players with multiplier > 0 */ ],
      "bench": [ /* Players with multiplier = 0 */ ],
      "captain_id": 430,
      "vice_id": 381,
      "club_counts": { "CHE": 3, "LIV": 1, ... }
    }
  },
  "team_constraints": {
    "bank_and_transfers": { /* Budget constraints */ },
    "squad_rules": { /* Formation and club limits */ }
  },
  "detailed_data": {
    "market": { "players": [...], "teams": [...] },
    "fixtures": { /* Upcoming matches */ },
    "analysis": { 
      "fixtures_difficulty": { /* Team difficulties */ },
      "transfer_suggestions": [ /* Pre-calculated options */ ]
    }
  }
}
```

## Authentication

### Required for Full Functionality
- **FPL_COOKIE**: Your session cookie (for team data)
- **FPL_X_API_AUTH**: API authorization header (optional)

### Without Authentication
- Uses public data only
- Transfer info defaults to 1 FT
- No chip availability data
- Still provides comprehensive market analysis

## Script Usage

### Basic Usage
```bash
python fetch_fpl_context.py --manager YOUR_MANAGER_ID --gw GAMEWEEK_NUMBER
```

### With Prompt Generation
```bash
python fetch_fpl_context.py --manager 4897037 --gw 6 --populate-prompt --template custom_template.md
```

### Arguments
- `--manager`: FPL manager ID (required)
- `--gw`: Gameweek number (required)  
- `--outfile`: Output JSON file (default: context.json)
- `--populate-prompt`: Generate prompt from template
- `--template`: Custom prompt template (default: prompt_template.md)

## Data Quality Validation

The system automatically validates:

- ✅ **Authentication status**: Warns if team data unavailable
- ✅ **Squad completeness**: Ensures 15 players found
- ✅ **Fixture availability**: Checks for gameweek fixtures
- ✅ **Player catalog**: Validates market data completeness
- ✅ **Data consistency**: Cross-references player IDs

## AI Prompt Design

### Key Improvements Made
1. **Explicit data paths**: Tells AI exactly where to find current squad
2. **Validation reminders**: Prompts AI to check data quality warnings
3. **Clear constraints**: Bank, transfers, and formation rules upfront
4. **Warning system**: Prevents AI from suggesting non-owned players

### Template Variables
- `{{GW}}`: Current gameweek number
- `{{BANK}}`: Available bank funds
- `{{FT}}`: Free transfers available  
- `{{CHIPS_AVAILABLE}}`: Available chips

## Common Issues & Solutions

### ❌ "AI suggests players I don't own"
**Solution**: New structure puts current squad first. Prompt explicitly warns against this.

### ❌ "Missing transfer data"
**Solution**: Check authentication. Script falls back to sensible defaults.

### ❌ "Inconsistent player data"
**Solution**: Validation warnings highlight data quality issues upfront.

### ❌ "AI ignores constraints"
**Solution**: Constraints repeated in multiple sections for emphasis.

## File Structure

```
fpl-ai-assist/
├── fetch_fpl_context.py      # Main data fetching script
├── prompt_template.md        # AI prompt template with variables
├── context.json             # Generated structured data
├── gwX_prompt.md           # Generated ready-to-use prompt
├── fpl_context_schema.json # JSON schema validation
└── README_FPL_Context_System.md # This documentation
```

## Integration with AI Services

### For ChatGPT/Claude
1. Run the script to generate context and prompt
2. Copy `gwX_prompt.md` content as your initial message
3. Attach or paste the `context.json` content
4. AI will automatically follow the structured guidance

### For API Integration
```python
import json

# Load context
with open('context.json') as f:
    context = json.load(f)

# Access current squad
current_squad = context["IMPORTANT_READ_FIRST"]["current_squad_details"]["squad"]

# Check for warnings
warnings = context["IMPORTANT_READ_FIRST"]["summary"]["data_quality_warnings"]
```

## Development Notes

### Functional Programming Principles
- **Pure functions**: All data transformation functions are side-effect free
- **Immutable data**: Original API responses preserved, transformations create new objects
- **Composable**: Functions can be easily combined and tested
- **Predictable**: Same inputs always produce same outputs

### Error Handling Strategy
- **Graceful degradation**: Missing data doesn't crash the system
- **Clear warnings**: Users know exactly what data is incomplete
- **Sensible defaults**: System makes reasonable assumptions when data unavailable
- **Validation first**: Data quality checked before AI consumption

## Future Enhancements

- [ ] Add historical performance tracking
- [ ] Include differential/template analysis
- [ ] Add price change predictions
- [ ] Include ownership trend analysis
- [ ] Add chip timing optimization

## Contributing

When extending this system:
1. Maintain functional programming approach
2. Add comprehensive error handling
3. Update validation logic for new data
4. Test with both authenticated and unauthenticated scenarios
5. Update prompt template if new data sections added

## Support

For issues or questions:
1. Check data quality warnings in the JSON output
2. Verify authentication status
3. Ensure FPL API is accessible
4. Test with current gameweek data

---

*This system prioritizes reliability and AI-friendliness over raw data completeness. Every design decision favors clear, unambiguous guidance for LLM consumption.*

