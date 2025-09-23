# FPL → ChatGPT Starter Kit (updated)

This mini‑kit helps you collect Fantasy Premier League context and hand it to ChatGPT in a compact, structured way each Gameweek.

## What you get
- `fetch_fpl_context.py` — Pulls key endpoints from the (public) FPL API and writes a `context.json` for a given `manager_id` and `gameweek`.
- `fpl_context_schema.json` — JSON schema describing the structure of `context.json` so you can validate or extend it.
- `prompt_template.md` — A concise prompt you can paste into ChatGPT together with your `context.json` contents for week‑to‑week decisions.

## Quickstart
```bash
python3 -m venv .venv && source .venv/bin/activate
pip install requests pandas python-dateutil
```

Run it:
```bash
python fetch_fpl_context.py --manager 4897037 --gw 3
cat context.json  # then paste into ChatGPT alongside prompt_template.md
```

## Auth notes (supports both)
Some authenticated endpoints may require either your browser **Cookie** header _or_ a site-issued header such as **`X-Api-Authorization`**.  
This tool supports both:

```bash
# Option A: cookie-based
export FPL_COOKIE='<paste entire Cookie header>'

# Option B: header-based
export FPL_X_API_AUTH='<paste X-Api-Authorization header value>'
```
If both are set, both will be sent.

## Scheduling ideas
- cron on a small VPS (e.g., pull daily + an hour before the deadline)
- GitHub Actions on a private repo (store secrets if you use auth)
- A tiny FastAPI service that returns `context.json` on demand