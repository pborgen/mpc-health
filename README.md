# mpc-health

MCP server for health & fitness data. (Prototype)

## Goals
- Connect to common fitness data sources (Apple Health export, Strava, Fitbit, Garmin)
- Expose normalized schemas + tools via MCP
- Keep credentials local; avoid sending raw data unless explicitly requested

## MCP Server
This repo now includes a minimal MCP server scaffold using stdio.

### Install
```bash
npm install
```

### Run (stdio MCP)
```bash
npm run dev
```

### Tools (currently stubbed)
- `list_sources()`
- `get_workouts(start_date, end_date, source?)`

## Status
- MCP server scaffold is wired.
- Next: add a real data source connector (Apple Health export, Strava, etc.).
