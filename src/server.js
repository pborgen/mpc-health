import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

export async function startServer() {
  const server = new Server(
    {
      name: "mpc-health",
      version: "0.1.0",
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  server.tool(
    "list_sources",
    "List available health/fitness data sources.",
    {},
    async () => {
      return {
        sources: [
          { id: "apple_health", name: "Apple Health (export)" },
          { id: "strava", name: "Strava" },
          { id: "fitbit", name: "Fitbit" },
          { id: "garmin", name: "Garmin" },
          { id: "google_fit", name: "Google Fit" },
        ],
      };
    }
  );

  server.tool(
    "get_workouts",
    "Get workouts within a date range (stub).",
    {
      start_date: z.string().describe("ISO date, e.g. 2026-02-01"),
      end_date: z.string().describe("ISO date, e.g. 2026-02-19"),
      source: z.string().optional().describe("Optional source id"),
    },
    async ({ start_date, end_date, source }) => {
      return {
        message: "Stub response. Wire a real data source connector.",
        params: { start_date, end_date, source },
        workouts: [],
      };
    }
  );

  const transport = new StdioServerTransport();
  await server.connect(transport);
}
