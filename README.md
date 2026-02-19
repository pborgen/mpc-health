# mpc-health

MCP server for health & fitness data. (Prototype)

## Goals
- Connect to common fitness data sources (Apple Health export, Strava, Fitbit, Garmin)
- Expose normalized schemas + tools via MCP
- Keep credentials local; avoid sending raw data unless explicitly requested

## MCP Server
Minimal MCP server scaffold using stdio, with two sources wired:
- Apple Health export (local file)
- Strava (API)

### Install
```bash
npm install
```

### Configure
Set env vars:

```bash
# Apple Health export directory or export.xml path
export APPLE_HEALTH_EXPORT_PATH=~/Downloads/apple-health-export

# Strava API token
export STRAVA_ACCESS_TOKEN=... 
```

### Run (stdio MCP)
```bash
npm run dev
```

### Tools
- `list_sources()`
- `get_workouts(start_date, end_date, source?)`

## Notes
- Apple Health ZIP exports are not supported yet — point to `export.xml` or its directory.
- Strava uses the `/athlete/activities` endpoint (50 results max per call).
