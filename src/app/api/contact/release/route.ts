// Release a held enquiry to Klaxon Studio (link in Matt's held notice, or the
// Held enquiries page's Release button). GET shows a confirmation page and
// never sends; POST delivers.
import { handleRelease } from "@/lib/contactEnquiry";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  return handleRelease(request, false);
}

export async function POST(request: Request) {
  return handleRelease(request, true);
}
