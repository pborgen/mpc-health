import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { loadAppleHealthWorkouts } from "./sources/appleHealth.js";
import { loadStravaWorkouts } from "./sources/strava.js";

export async function startServer() {
  const server = new Server(
    {
      name: "mpc-health",
      version: "0.2.0",
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
          { id: "apple_health", name: "Apple Health (export)", status: process.env.APPLE_HEALTH_EXPORT_PATH ? "configured" : "needs_config" },
          { id: "strava", name: "Strava", status: process.env.STRAVA_ACCESS_TOKEN ? "configured" : "needs_config" },
        ],
      };
    }
  );

  server.tool(
    "get_workouts",
    "Get workouts within a date range.",
    {
      start_date: z.string().describe("ISO date, e.g. 2026-02-01"),
      end_date: z.string().describe("ISO date, e.g. 2026-02-19"),
      source: z.enum(["apple_health", "strava"]).optional().describe("Optional source id"),
    },
    async ({ start_date, end_date, source }) => {
      const results = [];
      const warnings = [];

      if (!source || source === "apple_health") {
        const res = await loadAppleHealthWorkouts({
          exportPath: process.env.APPLE_HEALTH_EXPORT_PATH,
        });
        if (res.warning) warnings.push(res.warning);
        results.push(...res.workouts);
      }

      if (!source || source === "strava") {
        const res = await loadStravaWorkouts({
          accessToken: process.env.STRAVA_ACCESS_TOKEN,
          startDate: start_date,
          endDate: end_date,
        });
        if (res.warning) warnings.push(res.warning);
        results.push(...res.workouts);
      }

      return {
        params: { start_date, end_date, source },
        warnings,
        workouts: results,
      };
    }
  );

  const transport = new StdioServerTransport();
  await server.connect(transport);
}
