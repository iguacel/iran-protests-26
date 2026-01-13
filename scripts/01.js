import { writeFile } from "node:fs/promises";
import { parse } from "csv-parse/sync";

const URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRTT_uQv7JKEk8An8zPxdgcwxRPNTuypy7XAZcavbSAqnKyHlFD1nB5yJ1Zaa9HiFXVchC9tEy4OPQv/pub?output=csv";

const MONTHS = {
  January: 1,
  February: 2,
  March: 3,
  April: 4,
  May: 5,
  June: 6,
  July: 7,
  August: 8,
  September: 9,
  October: 10,
  November: 11,
  December: 12,
};

function pad2(n) {
  return String(n).padStart(2, "0");
}

function toISODateFromParts(dayStr, monthStr, yearStr) {
  const day = Number(dayStr);
  const year = Number(yearStr);
  const month = MONTHS[String(monthStr || "").trim()];
  if (!day || !year || !month) return null;
  return `${year}-${pad2(month)}-${pad2(day)}`;
}

// Intenta normalizar "Sep 16, 2022" → "2022-09-16"
function toISODateFromDateField(dateField) {
  if (!dateField) return null;
  const s = String(dateField).trim();

  // Formato ya ISO
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;

  // "Sep 16, 2022" / "September 16, 2022"
  const m = s.match(/^([A-Za-z]+)\s+(\d{1,2}),\s*(\d{4})$/);
  if (!m) return null;

  const monthName = m[1];
  const day = Number(m[2]);
  const year = Number(m[3]);

  // Soporta abreviaturas tipo "Sep"
  const fullMonth =
    Object.keys(MONTHS).find((k) =>
      k.toLowerCase().startsWith(monthName.toLowerCase())
    ) || null;

  if (!fullMonth || !day || !year) return null;
  return `${year}-${pad2(MONTHS[fullMonth])}-${pad2(day)}`;
}

async function main() {
  const res = await fetch(URL);
  if (!res.ok) {
    throw new Error(`Fetch failed: ${res.status} ${res.statusText}`);
  }
  const csvText = await res.text();

  const rows = parse(csvText, {
    columns: true,
    skip_empty_lines: true,
    relax_quotes: true,
    relax_column_count: true,
    trim: true,
  });

  // Conteo por día
  const counts = new Map();

  for (const r of rows) {
    // Prioriza Date porque suele venir limpio
    const iso =
      toISODateFromDateField(r.Date) ??
      toISODateFromParts(r.Day, r.Month, r.Year);

    if (!iso) continue;

    counts.set(iso, (counts.get(iso) || 0) + 1);
  }

  // Orden cronológico
  const out = [...counts.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, count]) => ({ date, count }));

  const outCsv =
    "date,count\n" + out.map((d) => `${d.date},${d.count}`).join("\n") + "\n";

  await writeFile("daily_protests.csv", outCsv, "utf8");

  console.log(
    `OK: ${rows.length} filas leídas → ${out.length} días → daily_protests.csv`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
