# mpc-health

MCP server for health & fitness data. (Prototype)

## Goals
- Connect to common fitness data sources (Apple Health export, Strava, Fitbit, Garmin)
- Expose normalized schemas + tools via MCP
- Keep credentials local; avoid sending raw data unless explicitly requested

## Planned MCP tools (draft)
- `list_sources()`
- `connect_source(source, credentials)`
- `get_workouts(start_date, end_date, source?)`
- `get_metrics(start_date, end_date, metrics, source?)`
- `get_activity_summary(period)`

## Status
- Scaffold only. Next step: add a minimal MCP server implementation and one data source.
