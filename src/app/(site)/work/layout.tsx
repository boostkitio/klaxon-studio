import { ogFor } from "@/lib/site";

const TITLE = "Video Production Case Studies | Klaxon Studio";

export const metadata = {
  ...ogFor(
    TITLE,
    "Selected work from Klaxon Studio: commercials, branded content, documentaries and corporate film for BMW, Aston Martin, BOSS, Dove, Shell and more.",
    "/work"
  ),
  // `absolute` fixes this segment's own title; `template` is re-declared
  // (a segment that sets its own title stops inheriting the root
  // layout's) so child case-study pages still get the " | Klaxon Studio" suffix.
  title: { absolute: TITLE, template: "%s | Klaxon Studio" },
};

export default function WorkLayout({ children }: { children: React.ReactNode }) {
  return children;
}
