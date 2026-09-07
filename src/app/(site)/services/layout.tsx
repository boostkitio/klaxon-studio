import { ogFor } from "@/lib/site";

const TITLE = "Video Production Services | Klaxon Studio London";

export const metadata = {
  ...ogFor(
    TITLE,
    "From ideation and production management through filming, editing, grading and delivery: the full-service video production capabilities of Klaxon Studio, London.",
    "/services"
  ),
  // `absolute` fixes this segment's own title; `template` is re-declared
  // (a segment that sets its own title stops inheriting the root
  // layout's) so child service pages still get the " | Klaxon Studio" suffix.
  title: { absolute: TITLE, template: "%s | Klaxon Studio" },
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
