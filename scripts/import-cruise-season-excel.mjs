/**
 * Merge Port Authority dossier Excel into src/data/cruises.json
 *
 *   node scripts/import-cruise-season-excel.mjs "/Users/guti/Downloads/TEMPORADA CRUCEROS 2026-2027.xlsx"
 */
import ExcelJS from "exceljs";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outFile = path.join(root, "src", "data", "cruises.json");

function pad(n) {
  return String(n).padStart(2, "0");
}

function excelDay(value) {
  if (!value) return "";
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return `${value.getUTCFullYear()}-${pad(value.getUTCMonth() + 1)}-${pad(value.getUTCDate())}`;
  }
  const text = String(value.text || value.result || value || "");
  const m = text.match(/^(\d{4}-\d{2}-\d{2})/);
  return m ? m[1] : "";
}

function excelTime(value) {
  if (!value) return "";
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return `${pad(value.getUTCHours())}:${pad(value.getUTCMinutes())}`;
  }
  const text = String(value.text || value.result || value || "");
  const m = text.match(/(\d{1,2}):(\d{2})/);
  return m ? `${pad(Number(m[1]))}:${m[2]}` : "";
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function normalizeName(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function uniqueId(calls, base) {
  let id = base;
  let n = 2;
  while (calls.some((c) => c.id === id)) id = `${base}-${n++}`;
  return id;
}

async function main() {
  const excelPath =
    process.argv[2] ||
    path.join(process.env.HOME || "", "Downloads", "TEMPORADA CRUCEROS 2026-2027.xlsx");
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(excelPath);
  const ws = wb.worksheets[0];
  if (!ws) throw new Error("El Excel no tiene hojas");

  const incoming = [];
  ws.eachRow((row, index) => {
    if (index === 1) return;
    const date = excelDay(row.getCell(1).value);
    const company = String(row.getCell(5).value || "").trim();
    const shipCode = String(row.getCell(6).value || "").trim().toUpperCase();
    const shipName = String(row.getCell(7).value || "").trim();
    if (!date || !company || !shipName) return;
    incoming.push({
      date,
      company,
      shipCode,
      shipName,
      arrivalTime: excelTime(row.getCell(9).value) || "08:00",
      departureTime: excelTime(row.getCell(10).value) || "18:00",
    });
  });

  const current = JSON.parse(await readFile(outFile, "utf8"));
  const calls = Array.isArray(current.calls) ? [...current.calls] : [];
  let updated = 0;
  let added = 0;

  for (const row of incoming) {
    const byCode = calls.find(
      (c) =>
        c.date === row.date &&
        String(c.shipCode || "").toUpperCase() === row.shipCode
    );
    const byName = calls.find(
      (c) =>
        c.date === row.date &&
        normalizeName(c.shipName) === normalizeName(row.shipName)
    );
    const match = byCode || byName;
    if (match) {
      match.company = row.company;
      match.shipCode = row.shipCode || match.shipCode;
      match.shipName = row.shipName;
      match.arrivalTime = row.arrivalTime;
      match.departureTime = row.departureTime;
      match.published = match.published !== false;
      match.season = match.season || "2026-2027";
      updated += 1;
      continue;
    }
    const id = uniqueId(
      calls,
      slugify(`${row.date}-${row.shipName}-${row.shipCode || "ship"}`)
    );
    calls.push({
      id,
      date: row.date,
      port: current.port || "Puerto de Los Mármoles, Lanzarote",
      company: row.company,
      shipCode: row.shipCode,
      shipName: row.shipName,
      arrivalTime: row.arrivalTime,
      departureTime: row.departureTime,
      season: "2026-2027",
      published: true,
      notes: "",
    });
    added += 1;
  }

  calls.sort((a, b) => {
    const d = a.date.localeCompare(b.date);
    return d || String(a.arrivalTime).localeCompare(String(b.arrivalTime));
  });

  const next = {
    ...current,
    season: "2026-2027",
    source: path.basename(excelPath),
    updatedAt: new Date().toISOString().slice(0, 10),
    calls,
  };
  await writeFile(outFile, JSON.stringify(next, null, 2) + "\n", "utf8");
  console.log(
    `Excel ${incoming.length} filas · actualizadas ${updated} · nuevas ${added} · total ${calls.length}`
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
