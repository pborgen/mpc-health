const STRAVA_BASE = "https://www.strava.com/api/v3";

export async function loadStravaWorkouts({ accessToken, startDate, endDate }) {
  if (!accessToken) {
    return { workouts: [], warning: "STRAVA_ACCESS_TOKEN not set" };
  }

  const after = Math.floor(new Date(startDate).getTime() / 1000);
  const before = Math.floor(new Date(endDate).getTime() / 1000);
  const url = new URL(`${STRAVA_BASE}/athlete/activities`);
  url.searchParams.set("after", String(after));
  url.searchParams.set("before", String(before));
  url.searchParams.set("per_page", "50");

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    return { workouts: [], warning: `Strava API error: ${res.status}` };
  }

  const items = await res.json();
  return {
    workouts: items.map((a) => ({
      id: `strava_${a.id}`,
      source: "strava",
      activityType: a.type,
      start: a.start_date,
      end: a.start_date, // Strava doesn’t return end; use start + elapsed
      durationSeconds: a.elapsed_time,
      distanceMeters: a.distance,
      calories: a.kilojoules ? a.kilojoules * 0.239006 : null,
      name: a.name,
    })),
  };
}
