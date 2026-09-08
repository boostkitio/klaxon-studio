"use client";

import dynamic from "next/dynamic";

// ssr:false is only valid inside a Client Component, and it's the piece that
// actually keeps this out of the server-rendered chunk graph: without it,
// webpack still hoists the shared vendor deps (motion, xstate, floating-ui,
// styled-components — all part of Sanity's overlay stack) into a chunk
// required for SSR, even though the component itself is dynamically
// imported. With ssr:false none of that is loaded until a real client
// mounts this component, which only happens in draft mode.
const VisualEditing = dynamic(() => import("next-sanity/visual-editing").then((m) => m.VisualEditing), { ssr: false });
const DisableDraftMode = dynamic(() => import("@/components/DisableDraftMode"), { ssr: false });

export default function DraftModePreview() {
  return (
    <>
      <VisualEditing />
      <DisableDraftMode />
    </>
  );
}
