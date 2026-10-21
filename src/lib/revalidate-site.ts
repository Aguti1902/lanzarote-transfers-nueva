import { revalidatePath } from "next/cache";

/** Invalida el HTML público para que los cambios del panel se vean al instante. */
export function revalidateSite() {
  try {
    revalidatePath("/", "layout");
  } catch {
    // Fuera de un request de Next (scripts).
  }
}
