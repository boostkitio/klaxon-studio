/** Single source of truth for the published starting points: rendered on
 * /pricing, marked up there as Offers, and quoted on the service pages, so
 * the three can never drift apart. */
export const pricingTiers = [
  {
    label: "Starting point",
    price: "£4,500",
    items: ["Single shoot day", "One location", "Small crew", "One edited 1-2 minute film", "Social cutdowns, versioned for your channels"],
  },
  {
    label: "Crew & kit only",
    price: "£2,000",
    items: ["Single shoot day", "Van-load of equipment", "Raw footage handed over at the end of the day"],
  },
];
