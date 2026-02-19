import fs from "node:fs/promises";
import path from "node:path";
import { XMLParser } from "fast-xml-parser";

function normalizePath(p) {
  if (!p) return null;
  return p.startsWith("~") ? path.join(process.env.HOME || "", p.slice(1)) : p;
}

export async function loadAppleHealthWorkouts({ exportPath }) {
  const p = normalizePath(exportPath);
  if (!p) return { workouts: [], warning: "APPLE_HEALTH_EXPORT_PATH not set" };
  if (p.endsWith(".zip")) {
    return { workouts: [], warning: "ZIP export not supported yet. Please point to export.xml or the export directory." };
  }

  let xmlPath = p;
  const stat = await fs.stat(p).catch(() => null);
  if (!stat) return { workouts: [], warning: `Path not found: ${p}` };
  if (stat.isDirectory()) {
    xmlPath = path.join(p, "export.xml");
  }

  const xml = await fs.readFile(xmlPath, "utf8");
  const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "" });
  const data = parser.parse(xml);
  const workouts = data?.HealthData?.Workout;
  if (!workouts) return { workouts: [], warning: "No workouts found in export" };

  const list = Array.isArray(workouts) ? workouts : [workouts];
  return {
    workouts: list.map((w, idx) => ({
      id: w.uuid || `apple_health_${idx}`,
      source: "apple_health",
      activityType: w.workoutActivityType,
      start: w.startDate,
      end: w.endDate,
      durationMinutes: w.duration ? Number(w.duration) : null,
      durationUnit: w.durationUnit || null,
      totalEnergy: w.totalEnergyBurned ? Number(w.totalEnergyBurned) : null,
      totalEnergyUnit: w.totalEnergyBurnedUnit || null,
      totalDistance: w.totalDistance ? Number(w.totalDistance) : null,
      totalDistanceUnit: w.totalDistanceUnit || null,
    })),
  };
}
