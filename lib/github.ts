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
    { key: "last", label: "Past year", year: "last" },
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
