import { ogFor } from "@/lib/site";

const TITLE = "About Klaxon Studio | Video Production Company London";

export const metadata = {
  ...ogFor(
    TITLE,
    "Meet the four founders behind Klaxon Studio, a London video production company built on two decades of broadcast, commercial and branded content experience.",
    "/about"
  ),
  title: { absolute: TITLE },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
