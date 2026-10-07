/** Search-facing titles. The on-page title ("Corporate Video") is a design
 * headline; on its own it leaves out the words people search with
 * ("corporate video production london"), so every service gets a full title
 * here. A slug missing from the map falls back to "X | Klaxon Studio". */
export const SEO_TITLES: Record<string, string> = {
  // Production
  ideation: "Video Ideation & Creative Development | Klaxon Studio",
  "production-management": "Video Production Management London | Klaxon Studio",
  directing: "Video Directing Services | Klaxon Studio London",
  filming: "Video Filming Services | Klaxon Studio London",
  "podcast-recording": "Podcast Recording Services London | Klaxon Studio",
  editing: "Video Editing Services | Klaxon Studio London",
  "colour-grading": "Colour Grading Services London | Klaxon Studio",
  "sound-design": "Sound Design Services | Klaxon Studio London",
  "delivery-versioning": "Video Delivery & Versioning | Klaxon Studio London",
  "white-labelling": "White Label Video Production UK | Klaxon Studio",
  "uk-production-services": "UK Production Services & Film Fixers | Klaxon Studio",
  "film-crew-hire": "Film Crew Hire London & UK | Klaxon Studio",

  // Content types
  "branded-content": "Branded Content Production London | Klaxon Studio",
  "corporate-video": "Corporate Video Production London | Klaxon Studio",
  "b2b-video": "B2B Video Production London | Klaxon Studio",
  documentary: "Documentary Production Company London | Klaxon Studio",
  product: "Product Video Production | Klaxon Studio London",
  sport: "Sports Video Production Company London | Klaxon Studio",
  "health-sector": "Healthcare Video Production | Klaxon Studio London",
  podcast: "Podcast Production Company | Klaxon Studio London",
  "social-content": "Social Media Video Production London | Klaxon Studio",
  "explainer-video": "Explainer Video Production London | Klaxon Studio",
  automotive: "Automotive Video Production & Car Filming | Klaxon Studio",
};

/** Search-facing descriptions. svc.desc is a one-line strapline written for
 * the service tiles; as a search snippet it names neither the service nor the
 * place. These restate what each page's "What's included" list already
 * offers, so they make no claim the page does not. Keep them under 160
 * characters. */
export const SEO_DESCRIPTIONS: Record<string, string> = {
  // Production
  ideation:
    "Video concept development, creative direction, scripting and storyboarding from Klaxon Studio, a video production company in Bermondsey, London.",
  "production-management":
    "Scheduling, budgeting, crewing, location scouting, permits and logistics. Video production management from Klaxon Studio in London.",
  directing:
    "Commercial, documentary and interview directors for hire in London. Creative, on-set and talent direction from Klaxon Studio.",
  filming:
    "Cinematography, camera crews, lighting and sound recording in London and across the UK, from single interviews to multi-camera productions.",
  "podcast-recording":
    "Podcast recording in London, in the studio or on location. Multi-guest recording, audio editing, sound mixing, music and sound design.",
  editing:
    "Video editing and post production in London: editing, colour grading, sound design, motion graphics, VFX, versioning and delivery.",
  "colour-grading":
    "Colour grading for film and video in London: LUT development, HDR, broadcast delivery and multi-format versioning from Klaxon Studio.",
  "sound-design":
    "Sound design and audio post production in London: dialogue editing, Foley, music supervision, mixing and broadcast audio delivery.",
  "delivery-versioning":
    "Multi-format versioning, broadcast delivery, social optimisation, subtitling, captioning and quality control for finished films.",
  "white-labelling":
    "White label video production for UK agencies: an outsourced production partner for overflow, retainers and on-site embedding, under your brand.",
  "uk-production-services":
    "UK production services for international shoots: local crew, fixers, location scouting and permits, equipment, casting and production management.",
  "film-crew-hire":
    "Film crew hire in London and across the UK: DoPs, camera operators, sound, lighting and grip, plus multi-camera and production crews.",

  // Content types
  "branded-content":
    "Branded content and brand film production in London for automotive, FMCG, financial services, sport, hospitality, technology and charity brands.",
  "corporate-video":
    "Corporate video production in London: internal communications, leadership messaging, culture and recruitment films, investor relations and training.",
  "b2b-video":
    "B2B video production in London: explainer videos, case studies and testimonials, thought leadership, sales enablement and event coverage.",
  documentary:
    "Documentary production in London and across the UK: brand documentaries, short films, observational and biographical films for broadcast and streaming.",
  product:
    "Product video production in London: launch films, e-commerce video, 360 and detail shots, lifestyle filming and social cutdowns.",
  sport:
    "Sports video production in London: athlete profiles, brand and sponsorship content, event and match coverage, broadcast production and social content.",
  "health-sector":
    "Healthcare video production in the UK: patient education, training and CPD, pharmaceutical and public health campaign films from a London studio.",
  podcast:
    "Podcast production company in London: brand podcasts, interview series, panel formats, and narrative and internal podcasts, produced as full series.",
  "social-content":
    "Social media video production in London: short-form video, Reels and TikTok content, campaign and always-on content, and paid social assets.",
  "explainer-video":
    "Explainer video production in London: animated and live action explainers, motion graphics, and product, SaaS and financial services videos.",
  automotive:
    "Automotive video production in London: car reviews, vehicle launch films, car-to-car filming, manufacturer and press drive content, and track filming.",
};

/** Search-facing page headings. The design headline ("B2B Video") is how the
 * service is labelled on tiles and in the nav; as an H1, as link text and as
 * the Service name in structured data it drops the word people search with
 * ("b2b video production"). serviceHeading() feeds all three, so the page,
 * the links into it and its markup name the service the same way. A slug
 * missing from the map keeps its design headline. */
export const SEO_HEADINGS: Record<string, string> = {
  // Production
  ideation: "Video Ideation & Creative",
  "production-management": "Video Production Management",
  directing: "Video Directing",
  filming: "Video Filming",
  editing: "Video Editing & Post Production",
  "white-labelling": "White Label Video Production",

  // Content types
  "branded-content": "Branded Content Production",
  "corporate-video": "Corporate Video Production",
  "b2b-video": "B2B Video Production",
  documentary: "Documentary Production",
  product: "Product Video Production",
  sport: "Sports Video Production",
  "health-sector": "Healthcare Video Production",
  podcast: "Podcast Production",
  "social-content": "Social Media Video Production",
  "explainer-video": "Explainer Video Production",
  automotive: "Automotive Video Production",
};

export const serviceHeading = (svc: { slug: string; title: string }) =>
  SEO_HEADINGS[svc.slug] ?? svc.title;

/** The plain statement that opens each page's body copy: what the service
 * is, where it is offered and what it covers. svc.lead is a brand line and
 * says none of that. Everything named here is already on the page, in its
 * "What's included" list, body copy or FAQs, so these make no new claim. */
export const SEO_INTROS: Record<string, string> = {
  // Production
  ideation:
    "Klaxon Studio develops the ideas behind a film from its studio in Bermondsey, London: video concept development, creative direction, scripting and storyboarding.",
  "production-management":
    "Klaxon Studio provides video production management in London and across the UK: scheduling, budgeting, crewing, location scouting, permits, logistics and talent coordination.",
  directing:
    "Klaxon Studio provides directors for commercial, documentary, interview and brand film projects in London and across the UK, covering creative, on-set and talent direction.",
  filming:
    "Klaxon Studio films in London and across the UK, with directors of photography, camera crews, lighting and sound recording for anything from a single interview to a multi-camera production.",
  "podcast-recording":
    "Klaxon Studio records podcasts in London, in professional studios or on location with a portable kit. We handle multi-guest and remote recording, audio editing, sound mixing, music and sound design.",
  editing:
    "Klaxon Studio offers video editing and post production in London: editing, colour grading, sound design, music supervision, motion graphics, VFX, versioning and delivery, on our own shoots or on footage you supply.",
  "colour-grading":
    "Klaxon Studio provides colour grading for film and video in London, including LUT development, HDR, broadcast delivery and multi-format versioning.",
  "sound-design":
    "Klaxon Studio provides sound design and audio post production in London: dialogue editing, Foley, music supervision, sound mixing and delivery to broadcast audio specifications.",
  "delivery-versioning":
    "Klaxon Studio handles video delivery and versioning from its London studio: multi-format versions, broadcast delivery, social optimisation, subtitling and captioning, quality control and archiving.",
  "white-labelling":
    "Klaxon Studio is a white label video production partner for UK agencies, consultancies and studios, covering overflow work, multi-project retainers and on-site embedding, delivered under your brand.",
  "uk-production-services":
    "Klaxon Studio provides UK production services and film fixers for international productions shooting in Britain: local crew, location scouting and permits, equipment sourcing, casting and production management, from a base in London.",
  "film-crew-hire":
    "Klaxon Studio supplies film crew for hire in London and across the UK: directors of photography, camera operators, sound, lighting and grip, from a single operator to a full multi-camera unit.",

  // Content types
  "branded-content":
    "Klaxon Studio is a branded content production company in Bermondsey, London, making brand films and content marketing video for automotive, FMCG, financial services, sport, hospitality, technology and charity brands.",
  "corporate-video":
    "Klaxon Studio is a corporate video production company in Bermondsey, London. We make internal communications films, leadership messaging, culture and recruitment films, investor relations video, and training and onboarding content.",
  "b2b-video":
    "Klaxon Studio produces B2B video from its studio in Bermondsey, London: explainer films, case studies and testimonials, thought leadership, sales enablement content, and event and conference coverage.",
  documentary:
    "Klaxon Studio is a documentary production company in Bermondsey, London, making brand documentaries, short films, and observational, biographical and archival documentaries for brands, broadcasters and streaming.",
  product:
    "Klaxon Studio produces product video in London: launch films, e-commerce video, 360 degree and detail shots, lifestyle and in-context filming, and social cutdowns.",
  sport:
    "Klaxon Studio is a sports video production company in Bermondsey, London, producing athlete profiles, brand and sponsorship content, event and match coverage, broadcast production and social content.",
  "health-sector":
    "Klaxon Studio produces healthcare video in the UK from its London studio: patient education films, training and CPD content, pharmaceutical and public health campaign films, and corporate communications.",
  podcast:
    "Klaxon Studio is a podcast production company in Bermondsey, London, producing brand podcasts, interview series, panel formats, and narrative, documentary and internal podcasts, from concept to distribution-ready delivery.",
  "social-content":
    "Klaxon Studio produces social media video in London: short-form films, Reels and TikTok content, campaign and always-on content, and paid social assets, each made for the platform it runs on.",
  "explainer-video":
    "Klaxon Studio produces explainer videos in London: animated, motion graphics and live action explainers for products, SaaS and technology, financial services and healthcare, from script to final delivery.",
  automotive:
    "Klaxon Studio is an automotive video production company in Bermondsey, London, filming car reviews, vehicle launch films, car-to-car sequences, manufacturer and press drive content, and closed-road and track shoots.",
};
