"use client";

import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import type { TransferDestination } from "@/types";
import type { Locale } from "@/i18n/config";
import { formatPrice } from "@/lib/format";
import { getDestinationCopy } from "@/lib/destination-copy";
import {
  Field,
  adminInput,
  adminTextarea,
  arrayToLines,
  linesToArray,
} from "@/components/admin/Field";
import { ImageUploadField } from "@/components/admin/ImageUploadField";

const emptyDest = (): TransferDestination => ({
  id: "",
  name: "",
  slug: "",
  priceOneWay: 0,
  priceReturn: 0,
  priceExtraPerson: 10,
  duration: "30 min",
  distance: "",
  image: "",
  description: "",
});

const localeTabs: { id: Locale; label: string }[] = [
  { id: "es", label: "Español" },
  { id: "en", label: "Inglés" },
  { id: "de", label: "Alemán" },
];

type DestCopyMap = Record<string, string>;

export default function AdminTrasladosPage() {
  const [destinations, setDestinations] = useState<TransferDestination[]>([]);
  const [highlights, setHighlights] = useState<string[]>([]);
  const [highlightsEn, setHighlightsEn] = useState("");
  const [highlightsDe, setHighlightsDe] = useState("");
  const [destCopyEn, setDestCopyEn] = useState<DestCopyMap>({});
  const [destCopyDe, setDestCopyDe] = useState<DestCopyMap>({});
  const [editing, setEditing] = useState<TransferDestination | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<TransferDestination>(emptyDest());
  const [highlightsText, setHighlightsText] = useState("");
  const [copyLocale, setCopyLocale] = useState<Locale>("es");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    const [res, enRes, deRes] = await Promise.all([
      fetch("/api/transfers"),
      fetch("/api/admin/content-translations?locale=en"),
      fetch("/api/admin/content-translations?locale=de"),
    ]);
    const data = await res.json();
    const enData = enRes.ok ? await enRes.json() : {};
    const deData = deRes.ok ? await deRes.json() : {};
    setDestinations(data.destinations || []);
    setHighlights(data.highlights || []);
    setHighlightsText(arrayToLines(data.highlights || []));
    setHighlightsEn(arrayToLines(enData.transfers?.highlights || []));
    setHighlightsDe(arrayToLines(deData.transfers?.highlights || []));
    const enDest: DestCopyMap = {};
    const deDest: DestCopyMap = {};
    for (const [id, value] of Object.entries(
      (enData.transfers?.destinations || {}) as Record<
        string,
        { description?: string }
      >
    )) {
      if (value?.description) enDest[id] = value.description;
    }
    for (const [id, value] of Object.entries(
      (deData.transfers?.destinations || {}) as Record<
        string,
        { description?: string }
      >
    )) {
      if (value?.description) deDest[id] = value.description;
    }
    setDestCopyEn(enDest);
    setDestCopyDe(deDest);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function startCreate() {
    setCreating(true);
    setEditing(null);
    setForm(emptyDest());
    setCopyLocale("es");
  }

  function startEdit(d: TransferDestination) {
    setEditing(d);
    setCreating(false);
    const copy = getDestinationCopy(d, "es");
    setForm({
      ...d,
      priceExtraPerson: d.priceExtraPerson ?? 10,
      description: d.description || copy?.html || "",
    });
    setCopyLocale("es");
  }

  async function saveDestination(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    setError("");
    const res = await fetch("/api/transfers", {
      method: creating ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "No se pudo guardar el destino");
      return;
    }
    const destId = data.destination?.id || form.id;
    if (destId) {
      const enText = destCopyEn[destId] || destCopyEn._draft || "";
      const deText = destCopyDe[destId] || destCopyDe._draft || "";
      const [enSave, deSave] = await Promise.all([
        fetch("/api/admin/content-translations", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            locale: "en",
            transfers: {
              destinations: { [destId]: { description: enText } },
            },
          }),
        }),
        fetch("/api/admin/content-translations", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            locale: "de",
            transfers: {
              destinations: { [destId]: { description: deText } },
            },
          }),
        }),
      ]);
      if (!enSave.ok || !deSave.ok) {
        setError("Destino guardado en español, pero falló inglés o alemán");
        await load();
        return;
      }
    }
    setCreating(false);
    setEditing(null);
    setMessage("Traslado guardado");
    await load();
  }

  async function remove(id: string, name: string) {
    if (!confirm(`¿Eliminar traslado a ${name}?`)) return;
    await fetch(`/api/transfers?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    await load();
  }

  async function saveHighlights() {
    setMessage("");
    setError("");
    const esRes = await fetch("/api/transfers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "highlights",
        highlights: linesToArray(highlightsText),
      }),
    });
    const esData = await esRes.json().catch(() => ({}));
    const [enRes, deRes] = await Promise.all([
      fetch("/api/admin/content-translations", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale: "en",
          transfers: { highlights: linesToArray(highlightsEn) },
        }),
      }),
      fetch("/api/admin/content-translations", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale: "de",
          transfers: { highlights: linesToArray(highlightsDe) },
        }),
      }),
    ]);
    if (!esRes.ok || !enRes.ok || !deRes.ok) {
      setError(
        esData.error ||
          "No se pudieron guardar las ventajas. Revisa español, inglés y alemán."
      );
      return;
    }
    setMessage("Ventajas actualizadas. Ya se ven en la web de traslados.");
    await load();
  }

  const destId = form.id || editing?.id || "_draft";
  const textValue =
    copyLocale === "en"
      ? destCopyEn[destId] || getDestinationCopy(form, "en")?.html || ""
      : copyLocale === "de"
        ? destCopyDe[destId] || getDestinationCopy(form, "de")?.html || ""
        : form.description || "";

  function setTextValue(value: string) {
    if (copyLocale === "en") {
      setDestCopyEn((prev) => ({ ...prev, [destId]: value }));
      return;
    }
    if (copyLocale === "de") {
      setDestCopyDe((prev) => ({ ...prev, [destId]: value }));
      return;
    }
    setForm({ ...form, description: value });
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-ink">Traslados</h1>
          <p className="mt-1 text-sm text-ink-muted">
            Destinos, fotos, textos por idioma y ventajas. Los precios siguen
            aquí para calcular la reserva, pero ya no se publican en la web.
          </p>
        </div>
        <button
          type="button"
          onClick={startCreate}
          className="inline-flex items-center gap-2 rounded-md bg-ocean px-4 py-2.5 text-sm font-semibold text-white hover:bg-ocean-deep"
        >
          <Plus className="h-4 w-4" />
          Nuevo destino
        </button>
      </div>

      <div className="rounded-xl bg-sky-soft/70 px-4 py-3 text-sm text-ink">
        <p className="font-semibold">Dónde se cambian los textos EN / DE</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-ink-muted">
          <li>
            <b>Esta página:</b> texto de cada destino y ventajas del servicio
            (pestañas Español / Inglés / Alemán).
          </li>
          <li>
            <b>Ajustes:</b> título, introducción y cuerpo de la página de
            traslados, con las mismas pestañas.
          </li>
          <li>
            <b>Traducciones:</b> menú, botones y textos fijos de la interfaz.
          </li>
        </ul>
      </div>

      {message && (
        <p className="rounded-lg bg-emerald-50 px-4 py-2 text-sm text-emerald-800">
          {message}
        </p>
      )}
      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-800">
          {error}
        </p>
      )}

      {(creating || editing) && (
        <form
          onSubmit={saveDestination}
          className="grid gap-4 rounded-xl bg-white p-5 shadow-sm ring-1 ring-sand-line md:grid-cols-2 lg:grid-cols-4"
        >
          <h2 className="font-display text-xl md:col-span-2 lg:col-span-4">
            {creating ? "Nuevo destino" : `Editar: ${editing?.name}`}
          </h2>
          <Field label="Destino *">
            <input
              className={adminInput}
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </Field>
          <Field label="Precio (ida) (€)">
            <input
              type="number"
              step="0.01"
              className={adminInput}
              value={form.priceOneWay}
              onChange={(e) =>
                setForm({ ...form, priceOneWay: Number(e.target.value) })
              }
            />
          </Field>
          <Field label="Precio (ida / vuelta) (€)">
            <input
              type="number"
              step="0.01"
              className={adminInput}
              value={form.priceReturn}
              onChange={(e) =>
                setForm({ ...form, priceReturn: Number(e.target.value) })
              }
            />
          </Field>
          <Field label="Precio por persona extra (€)">
            <input
              type="number"
              step="0.01"
              className={adminInput}
              value={form.priceExtraPerson ?? 10}
              onChange={(e) =>
                setForm({
                  ...form,
                  priceExtraPerson: Number(e.target.value),
                })
              }
            />
          </Field>
          <Field label="Duración">
            <input
              className={adminInput}
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: e.target.value })}
            />
          </Field>
          <Field label="Distancia" className="md:col-span-2 lg:col-span-3">
            <input
              className={adminInput}
              value={form.distance}
              onChange={(e) => setForm({ ...form, distance: e.target.value })}
              placeholder="≈ 35 km"
            />
          </Field>
          <div className="md:col-span-2 lg:col-span-4">
            <ImageUploadField
              label="Foto del destino"
              folder="transfers"
              value={form.image || ""}
              onChange={(url) => setForm({ ...form, image: url })}
              aspectRatio={16 / 10}
              hint="Cada casilla de la web usa esta foto. Si la dejas vacía, se asigna una imagen distinta por destino."
            />
          </div>
          <div className="md:col-span-2 lg:col-span-4">
            <div className="mb-2 flex flex-wrap gap-2">
              {localeTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setCopyLocale(tab.id)}
                  className={`rounded px-3 py-1.5 text-xs font-bold ${
                    copyLocale === tab.id
                      ? "bg-ocean text-white"
                      : "bg-bg text-ink ring-1 ring-sand-line"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <Field
              label={`Texto de la ficha (${copyLocale.toUpperCase()})`}
              className="md:col-span-2 lg:col-span-4"
            >
              <textarea
                className={adminTextarea}
                rows={10}
                value={textValue}
                onChange={(e) => setTextValue(e.target.value)}
                placeholder="Texto que se ve al abrir el destino"
              />
            </Field>
          </div>
          <div className="flex gap-3 md:col-span-2 lg:col-span-4">
            <button
              type="submit"
              className="rounded-md bg-ocean px-5 py-2 text-sm font-semibold text-white hover:bg-ocean-deep"
            >
              Actualizar datos
            </button>
            <button
              type="button"
              onClick={() => {
                setCreating(false);
                setEditing(null);
              }}
              className="rounded-md border border-sand-line px-5 py-2 text-sm"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto rounded-xl bg-white shadow-sm ring-1 ring-sand-line">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="border-b border-sand-line bg-bg text-ink-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Destino</th>
              <th className="px-4 py-3 font-medium">Duración</th>
              <th className="px-4 py-3 font-medium">Distancia</th>
              <th className="px-4 py-3 font-medium">Ida</th>
              <th className="px-4 py-3 font-medium">Ida y vuelta</th>
              <th className="px-4 py-3 font-medium">Persona extra</th>
              <th className="px-4 py-3 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-ink-muted">
                  Cargando…
                </td>
              </tr>
            )}
            {!loading &&
              destinations.map((d) => (
                <tr key={d.id} className="border-b border-sand-line/70">
                  <td className="px-4 py-3">
                    <p className="font-semibold">Aeropuerto ↔ {d.name}</p>
                    <p className="text-xs text-ink-muted">{d.slug}</p>
                  </td>
                  <td className="px-4 py-3">{d.duration}</td>
                  <td className="px-4 py-3 text-ink-muted">{d.distance || "—"}</td>
                  <td className="px-4 py-3 font-semibold">
                    {formatPrice(d.priceOneWay)}
                  </td>
                  <td className="px-4 py-3 font-semibold">
                    {formatPrice(d.priceReturn)}
                  </td>
                  <td className="px-4 py-3 font-semibold">
                    {formatPrice(d.priceExtraPerson ?? 10)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(d)}
                        className="inline-flex items-center gap-1 rounded-md bg-bg px-2.5 py-1.5 text-xs font-medium text-ocean"
                      >
                        <Pencil className="h-3.5 w-3.5" /> Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(d.id, d.name)}
                        className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs text-coral"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            {!loading && destinations.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-ink-muted">
                  No hay destinos. Añade el primero.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-sand-line">
        <h2 className="font-display text-xl">Ventajas del servicio</h2>
        <p className="mt-1 text-sm text-ink-muted">
          Aparecen en la página pública de traslados, debajo de los destinos.
          Una ventaja por línea.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {localeTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setCopyLocale(tab.id)}
              className={`rounded px-3 py-1.5 text-xs font-bold ${
                copyLocale === tab.id
                  ? "bg-ocean text-white"
                  : "bg-bg text-ink ring-1 ring-sand-line"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <textarea
          className={`${adminTextarea} mt-4`}
          value={
            copyLocale === "en"
              ? highlightsEn
              : copyLocale === "de"
                ? highlightsDe
                : highlightsText
          }
          onChange={(e) => {
            if (copyLocale === "en") setHighlightsEn(e.target.value);
            else if (copyLocale === "de") setHighlightsDe(e.target.value);
            else setHighlightsText(e.target.value);
          }}
        />
        <p className="mt-2 text-xs text-ink-muted">
          Español: {highlights.length} puntos
        </p>
        <button
          type="button"
          onClick={saveHighlights}
          className="mt-3 rounded-md bg-ocean px-5 py-2 text-sm font-semibold text-white hover:bg-ocean-deep"
        >
          Guardar ventajas
        </button>
      </div>
    </div>
  );
}
