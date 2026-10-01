export interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface Contributions {
  total: number;
  days: ContributionDay[];
}

export interface ContributionPeriod {
  /** "last" for the rolling past year, otherwise a calendar year. */
  key: string;
  label: string;
  data: Contributions;
}

/**
 * GitHub contributions for the rolling past year ("last") or a calendar year,
 * refreshed at most once a day. Null if unavailable.
 */
export async function getContributions(
  username: string,
  year: "last" | number = "last",
): Promise<Contributions | null> {
  try {
    const res = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(username)}?y=${year}`,
      { next: { revalidate: 86_400 } },
    );
    if (!res.ok) return null;

    const data = (await res.json()) as {
      total?: Record<string, number>;
      contributions?: ContributionDay[];
    };
    if (!data.contributions?.length) return null;

    // The total is keyed by "lastYear" or by the year itself.
    const total = Object.values(data.total ?? {})[0] ?? 0;
    return { total, days: data.contributions };
  } catch {
    return null;
  }
}

/** The past year plus the three calendar years before this one. */
export async function getContributionHistory(username: string): Promise<ContributionPeriod[]> {
  const thisYear = new Date().getFullYear();
  const periods: { key: string; label: string; year: "last" | number }[] = [
    { key: "last", label: "Recent", year: "last" },
    ...[1, 2, 3].map((back) => ({
      key: String(thisYear - back),
      label: String(thisYear - back),
      year: thisYear - back,
    })),
  ];

  const results = await Promise.all(periods.map((p) => getContributions(username, p.year)));
  return periods.flatMap((p, i) => {
    const data = results[i];
    return data ? [{ key: p.key, label: p.label, data }] : [];
  });
}

/**
 * A contribution period packed small for sending to the browser: days are
 * consecutive, so only the first date is kept, with the levels as a string of
 * digits and the counts as a plain array (about 1/10 of the size as JSON).
 */
export interface PackedPeriod {
  key: string;
  label: string;
  total: number;
  start: string;
  levels: string;
  counts: number[];
}

const DAY_MS = 86_400_000;

export function packPeriod({ key, label, data }: ContributionPeriod): PackedPeriod {
  return {
    key,
    label,
    total: data.total,
    start: data.days[0]?.date ?? "",
    levels: data.days.map((d) => d.level).join(""),
    counts: data.days.map((d) => d.count),
  };
}

export function unpackDays({ start, levels, counts }: PackedPeriod): ContributionDay[] {
  const first = Date.parse(`${start}T00:00:00Z`);
  return counts.map((count, i) => ({
    date: new Date(first + i * DAY_MS).toISOString().slice(0, 10),
    count,
    level: Number(levels[i]) as ContributionDay["level"],
  }));
}
