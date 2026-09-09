import { NextResponse } from "next/server";
import { getBookings } from "@/lib/bookings";
import {
  createInvoiceForBooking,
  getInvoiceById,
  getInvoices,
  invoiceAmountForBooking,
  invoiceStats,
} from "@/lib/invoices";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET(request: Request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (id) {
    const invoice = await getInvoiceById(id);
    if (!invoice) {
      return NextResponse.json({ error: "No encontrada" }, { status: 404 });
    }
    return NextResponse.json({ invoice });
  }
  const invoices = await getInvoices();
  return NextResponse.json({ invoices, stats: invoiceStats(invoices) });
}

export async function POST(request: Request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  try {
    const body = await request.json();
    const bookingId = String(body.bookingId || "");
    if (!bookingId) {
      return NextResponse.json({ error: "bookingId requerido" }, { status: 400 });
    }
    const bookings = await getBookings();
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) {
      return NextResponse.json({ error: "Reserva no encontrada" }, { status: 404 });
    }
    if (invoiceAmountForBooking(booking) <= 0) {
      return NextResponse.json(
        {
          error:
            "No se emite factura por efectivo. Solo se factura el cobro con tarjeta (en depósitos, únicamente el 20%).",
        },
        { status: 400 }
      );
    }
    const invoice = await createInvoiceForBooking(booking, body.notes);
    return NextResponse.json({ invoice }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "No se pudo emitir la factura" },
      { status: 500 }
    );
  }
}
