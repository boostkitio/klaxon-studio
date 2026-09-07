// Extracted verbatim from the original design-tool source
// (Klaxon Studio Website.dc.html) — real client/production copy.
// British English preserved; curly quotes normalised to straight.

export interface Project {
  id: string;
  href: string;
  client: string;
  sector: string;
  title: string;
  cat: string[];
  ar: string;
  video: string;
  vimeo: string;
  vimeoHash?: string;
  vimeoAr: string;
  vimeoNativeAr?: number;
  vimeoThumb?: string;
  /** Vimeo publish timestamp (ISO 8601). Sourced from the Vimeo oEmbed API and
   * required by Google for VideoObject rich results. */
  uploadDate?: string;
  /** Runtime as an ISO 8601 duration, e.g. "PT2M18S". Also from Vimeo oEmbed. */
  duration?: string;
  lead: string;
  body: string[];
}

export interface HomeService {
  num: string;
  title: string;
  desc: string;
  img: string;
  href: string;
}

export interface Faq {
  q: string;
  a: string;
}

export interface ServiceDetail {
  slug: string;
  href: string;
  num: string;
  title: string;
  desc: string;
  img: string;
  /** CSS object-position for the tile thumbnail — overrides the default
   * center crop when the subject sits off-centre in the source frame. */
  imgPosition?: string;
  lead: string;
  body: string[];
  includes: string[];
  faqs: Faq[];
}

export interface Founder {
  id: string;
  name: string;
  role: string;
  bio: string[];
  img: string;
  /** CSS object-position Y for the mobile stacked card (aspect 4/3 closed)
   * and for the open panel on the desktop 4-up row (see about/page.tsx —
   * that panel is a ~0.7/1 overlay, not a grid track, and happens to need a
   * very similar crop to the mobile card). Source portraits frame each
   * founder's head at a different height, so a single shared crop gives
   * inconsistent headroom. Overrides "20%" default. */
  imgPositionY?: string;
  /** CSS object-position Y for a closed column in the desktop 4-up row
   * (fixed at 25% of the row width, aspect 0.625/1 — those 4 columns never
   * resize, see about/page.tsx). The desktop box crops far less of the
   * source than the mobile card does, so it needs its own (much more
   * extreme) Y value to land the head at the same relative headroom —
   * reusing imgPositionY undercrops it. */
  imgPositionYDesktop?: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  source: string;
}

export interface ContactRow {
  label: string;
  value: string;
  href: string;
  target: string;
}

export interface FooterLink {
  label: string;
  href: string;
  target?: string;
}

export interface FooterCol {
  title: string;
  links: FooterLink[];
}

export interface LondonData {
  lead: string;
  body: string[];
  includes: string[];
  faqs: Faq[];
}

export interface FaqSection {
  heading: string;
  qas: Faq[];
}

export interface FaqsData {
  lead: string;
  intro: string;
  sections: FaqSection[];
}

export interface SustainabilityPillar {
  num: string;
  title: string;
  points: string[];
}

export interface SustainabilityData {
  lead: string;
  body: string[];
  aims: string[];
  pillars: SustainabilityPillar[];
  approved: string;
  reviewed: string;
}

export interface GlossaryTerm {
  t: string;
  d: string;
}

export interface TermsSection {
  heading: string;
  items: string[];
}

export interface TermsData {
  updated: string;
  sections: TermsSection[];
}

export interface PricingBand {
  key: string;
  num: string;
  name: string;
  price: string;
  tag: string;
  includes: string[];
  idealFor: string;
}

export interface NavItem {
  label: string;
  href: string;
}

// ── Navigation ──

export const navItems: NavItem[] = [
  { label: "Work", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Pricing", href: "/pricing" },
];

export const moreLinks: NavItem[] = [
  { label: "London", href: "/london" },
  { label: "Contact", href: "/contact" },
  { label: "FAQs", href: "/faqs" },
  { label: "Sustainability", href: "/sustainability" },
  { label: "Glossary", href: "/glossary" },
];

// Legal pages are deliberately kept out of `moreLinks` and the footer's
// content columns. Sitting them alongside London/FAQs/Glossary gave them
// the same internal link prominence as commercial pages, which is part of
// why Google was picking Privacy Policy as a brand-query sitelink over
// Work. They render in the de-emphasised footer base bar instead.
export const legalLinks: NavItem[] = [
  { label: "T&C's", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy-policy" },
];

// ── Work / case studies (27 projects) ──

export const filterNames: string[] = ["All", "Corporate", "Branded", "Social", "Documentary", "Sport", "Automotive"];

export const workAll: Project[] = [
      { id: "boss-brand-promo", href: "/work/boss-brand-promo", client: "BOSS", sector: "Fashion", title: "Brand promo", cat: ["Branded", "Social"], ar: "3 / 4", video: "https://stream.mux.com/302UbMIkwPH502t3w6LTTS6XOzH02024rutfQioEwNxaBCU/highest.mp4", vimeo: "988531174", vimeoAr: "16 / 9", uploadDate: "2024-07-22T14:12:11Z", duration: "PT1M30S",
        lead: "Social teaser and full feature for a HUGE fashion brand.",
        body: ["Klaxon produced a series of three brand promo films for Boss\u2019 new launch of their equestrian brand with brand ambassador, Harry Charles, all shot in one location in Surrey, UK.", "The brief for these brand promo films was pretty in depth, however Boss relied on us to come up with a creative shooting style particularly for the teaser film and the interviews in the main film.", "For the teaser, the brief was to create a really moody, mysterious film to capture the audience\u2019s attention and to create noise over what was about to be launched. The campaign\u2019s narrative was, \u2018Be Your Own Boss\u2019, so with the announcement we were asked to deliver a film that told the story of how Harry was indeed his own boss.", "The idea being that we would hear from Harry and his Dad (also a gold medal winning Olympian), about how much drive and determination it takes to be a Boss \u2013 the sleepless nights, pressure and stress that comes with competing at the highest level."] },
      { id: "goodwood", href: "/work/goodwood", client: "Goodwood Festival of Speed", sector: "Automotive", title: "Lifestyle film", cat: ["Automotive"], ar: "16 / 9", video: "https://stream.mux.com/874Mk3rOWrK024Mpg6x5xnK43Ojuv02r9YzVIZmCID7BU/highest.mp4", vimeo: "988530867", vimeoAr: "16 / 9", uploadDate: "2024-07-22T14:11:28Z", duration: "PT6M25S",
        lead: "Lifestyle film for an exotic supercar.",
        body: ["A lot of fun was had on this lifestyle film! The Italian hills outside of Bologna, and a big purple Lamborghini, what else could you want?!", "Working in such intense heat was a struggle, we had to ensure the crew had regular breaks and a substantial amount of suncream! But we were loving it; the in-car cameras however, were not. We were hindered with cameras overheating, not ideal when we only had the car for two days. But our contributors were patient and so were the crew. We decided to shoot the in-car stuff in sections, to give the cameras a break from the scorching sun! What Divas!", "The scenery was divine, and so was the car, so we were spoiled for shots. It was hard to leave a lot of them on the cutting room floor!"] },
      { id: "historic-england-bruce-grove", href: "/work/historic-england-bruce-grove", client: "Historic England", sector: "Heritage", title: "Bruce Grove short doc", cat: ["Documentary", "Social"], ar: "1 / 1", video: "", vimeo: "1208377115", vimeoHash: "7ce7cef536", vimeoAr: "16 / 9", uploadDate: "2026-07-09T06:34:34Z", duration: "PT9M1S", vimeoThumb: "https://i.vimeocdn.com/video/2177689621-20527acb4b141c6876f720174263c98844370251daa810d21ba0f8b3730ac8c1-d_960x540?region=us",
        lead: "Films produced for Public sector bodies.",
        body: ["In late 2025, we won a public sector tender to become one of 8 approved suppliers from around the country for Historic England. We are incredibly proud of this achievement and of the work we produce for them.", "Our first commission was a film about Bruce Grove Toilets. Yep, a toilet block!", "Actually, it was a lovely little Victorian toilet block which has a huge and very important social history, it has since been given a new lease of life as a community cafe.", "Here's an excerpt from our creative treatment:", "\u201cOur style will avoid anything that's overly formal and instead embrace humour and curiosity. The on-screen delivery will be warm, playful, and informed, guiding viewers through the site's history, social context, and architectural significance with energy and authority.\u201d", "We nailed it."] },
      { id: "commonwealth-games", href: "/work/commonwealth-games", client: "Commonwealth Games", sector: "Sport", title: "Sports profile VT", cat: ["Sport"], ar: "16 / 9", video: "https://stream.mux.com/GNhcNZhucIklk5w00cHgLHnP1YjsqlQ6FVYYhqAwsjcI/highest.mp4", vimeo: "988534829", vimeoAr: "16 / 9", uploadDate: "2024-07-22T14:22:00Z", duration: "PT3M0S",
        lead: "Sports profile VT for use across global broadcasters.",
        body: ["A sports profile VT about Louise Sugden, a paralympic power-lifter. Louise tells us an awe-inspiring story, and her hopes for the Birmingham Commonwealth Games.", "The agency wanted a very fast turnaround with this project. Our self-shooting PD shot for around four hours at Louise\u2019s gym, and then spent one day editing the following day. However, despite the lack of finesse time, the results are great and a number of broadcasters have taken the film.", "There were a few challenges with this shoot, the location was small and the exterior was unusable so our filmmaker made use of what they could; and did a fantastic job! Louise was a natural, she welcomed us open armed and was incredibly helpful with the entire shoot.", "We kept our kit light on this job just because of the time restraints. We took four lights, two microphones and one camera! However, you\u2019d think we had more!!"] },
      { id: "jack-stein-inside-the-box", href: "/work/jack-stein-inside-the-box", client: "Jack Stein: Inside the Box", sector: "Food", title: "Food docu-series", cat: ["Documentary"], ar: "1 / 1", video: "https://stream.mux.com/ekAatUZ1Ne3c9EYRNyEVyED9mZLHgQ4HgpidWhC2BAQ/highest.mp4", vimeo: "988531291", vimeoAr: "16 / 9", uploadDate: "2024-07-22T14:12:32Z", duration: "PT1M0S",
        lead: "A tongue-in-cheek food docu-series.",
        body: ["TV Series for the Food Network UK, where we travelled across the globe, taking British food with us for different cultures to try, with varying degrees of success!", "We had an absolutely amazing time filming this one! Over the course of around 6 months we travelled across the globe to 10 different cities to get the locals opinion on some classic British dishes. Each episode Jack teamed up with a local chef who helped him put a twist on his British dish. We also spent a week out in a lovely Cornwall countryside cottage to create the opening cooking segments for the dishes he took around the world.", "This production was handled through our good friends \u2018The Projucers\u2019 down in Australia who requested our help in the filming of the series."] },
      { id: "fei-sports-feature", href: "/work/fei-sports-feature", client: "FEI / Sunset + Vine", sector: "Sport", title: "Sports feature", cat: ["Documentary", "Sport"], ar: "16 / 9", video: "https://stream.mux.com/3ibGzWgwDlJsEPeGMrTZhbx1tcdWjGpafZ4AIzEo8Uw/highest.mp4", vimeo: "988530705", vimeoAr: "16 / 9", uploadDate: "2024-07-22T14:11:02Z", duration: "PT7M27S",
        lead: "Captivating sports features for a governing body.",
        body: ["A series of sports features created for Sunset + Vine. These features are typically part of a 30 minute broadcast programme. The sports feature is often produced with a single shooting producer/director.", "These small 6-8 minute features are part of a series commissioned by the FEI (equestrian governing body). They are to show all sides of the equestrian world in feature form.", "The Ride series has undergone a few changes in the last few years, and is now a series of beautifully-shot films that focus on the lifestyle and culture of equestrianism rather than purely sport-focused.", "There are 10x 30minute programmes commissioned per year, that go out to 50+ broadcasters as well as digital formats and are reached by 400m households!"] },
      { id: "peugeot-multi-camera", href: "/work/peugeot-multi-camera", client: "Peugeot", sector: "Automotive", title: "Multi-camera tennis challenge", cat: ["Branded", "Sport"], ar: "16 / 9", video: "https://stream.mux.com/Cbn4PS6Km4ejUNw6o02y01WHUDMEstYiV00g00tuIAPL3B00/highest.mp4", vimeo: "1003234232", vimeoHash: "bf316591c9", vimeoAr: "16 / 9", uploadDate: "2024-08-27T10:58:48Z", duration: "PT2M30S",
        lead: "Hilarious multi-camera brand film.",
        body: ["As part of Peugeot's sponsorship of the ATP Tennis Masters Championship they commissioned a short series of films, shot in multi camera format, to promote their affiliation with the Tour.", "Shot at the Royal Albert Hall where, after weeks of training, celebrities Helen Skelton and Anton du Beke, with their doubles partners, went head to head for bragging rights to win the Peugeot Tennis Challenge Trophy.", "As this was an ongoing live event the challenge was ensuring that we had the coverage we needed with the cameras, unlike most shoots where we have full control and can stop / start as we like, for this we couldn't.", "Careful planning of camera positions and lensing during pre-production coupled with some smart camera choreography on the day, ensured that we took every shot that we needed.", "As expected Anton provided great entertainment to the crowd in this 'exhibition' match, all of which was brilliantly captured by our team in what was a greatly received film."] },
      { id: "travis-mathew-ambassador-documentary", href: "/work/travis-mathew-ambassador-documentary", client: "Travis Mathew", sector: "Apparel", title: "Ambassador documentary", cat: ["Branded", "Sport"], ar: "16 / 9", video: "", vimeo: "1208364200", vimeoHash: "a0715c635d", vimeoAr: "16 / 9", uploadDate: "2026-07-09T05:41:52Z", duration: "PT10M26S", vimeoThumb: "https://i.vimeocdn.com/video/2177670842-5bb64a967838efe355b96b44f1a689d80e51087787ee0a66f79e322a7dc65da6-d_960x540?region=us",
        lead: "Creating great video content, despite massive footage challenges.",
        body: ["This was a tricky project, not least because we didn't have the rights to use broadcast tour footage in the film - however, we managed to make it work! Just. We filmed 5 interviews with Josh and the main contributors plus a tonne of b-roll over 3 days.", "The main challenge was the lack of footage to support the interviews when talking of early life, or the experiences on tour. That's where the creative problem-solving started. We shot b-roll sequences specifically to carry those moments, effectively building coverage from scratch where none existed.", "We also delved deep into social archives and approached close friends and family for photos of Josh to use and help drive the edit. With 4 x 10 minute episodes to deliver this was invaluable.", "So, despite the challenges on this project, it came out very well."] },
      { id: "bmw-creative-car-review", href: "/work/bmw-creative-car-review", client: "BMW", sector: "Automotive", title: "Creative car reviews", cat: ["Branded", "Automotive"], ar: "16 / 9", video: "https://stream.mux.com/Fw028ShcEJsNWI7EyzPHlan6Meryw401ZaTLYl0100RyNME/highest.mp4", vimeo: "312000081", vimeoAr: "16 / 9", uploadDate: "2019-01-17T18:11:58Z", duration: "PT2M18S",
        lead: "Premium car reviews for one of the world's largest media outlets.",
        body: ["This creative car review was a fun one, including a day shooting at the UK's fastest race circuit and a night shoot in central London for Telegraph Media Group.", "Jodie Kidd hosted these two films that we made for BMW showcasing the i3 and i8 models. More than just the usual 'car review', we wanted to produce films more high end than the norm to reflect the brand we were promoting.", "The night shoot within the city lights of Central London with the i3 was still a challenge with traffic despite the early hours, the city never sleeps!", "There was no such problem with the i8 shoot as we had Thruxton race circuit all to ourselves to capture the shots of the i8 being put through its paces.", "The final day of shooting was far less high octane, capturing awesome beauty shots of the i8 in an infinity white studio back in London."] },
      { id: "aston-martin", href: "/work/aston-martin", client: "Aston Martin", sector: "Automotive", title: "V12 Vantage launch", cat: ["Automotive"], ar: "3 / 4", video: "https://stream.mux.com/35R023901blr00LZ01OxgY00emQunUd12MgaeUDOCfKkoBdE/highest.mp4", vimeo: "988536270", vimeoAr: "16 / 9", uploadDate: "2024-07-22T14:25:52Z", duration: "PT5M8S",
        lead: "Stunning car launch for an iconic brand.",
        body: ["Official global launch video for the new Aston Martin, showcasing the style and finesse of the new V12 Vantage. Truly, a British icon.", "This film was shot in one day at a studio in West London, it took a total 15hrs!", "Part of the brief from the Creative Agency was to execute a contro-zoom which is a method where the camera tracks towards the subject whilst also zooming out at simultaneously. The budget for this film wasn't enormous so we reverted to our FX9 package. We also needed a lens that gave a cinematic look, whilst able to zoom and be affordable; we chose Canon's CN7 for that purpose. The rest of the film was shot on Arri's Ultra Prime Lenses, as we felt these gave the correct look for this production.", "Our role in this production was to provide the camera crew, as well as pre-production meetings about the general look and feel of the piece. We were asked if there was anything we could introduce that would help make the film stand out. Our suggestion was to use lens prisms in front of the lens to create abstract reflects in the foreground, you will be able to notice them in a few of the shots.", "Overall, we feel the production does this icon justice."] },
      { id: "salesforce", href: "/work/salesforce", client: "Salesforce / Smyle Creative", sector: "Technology", title: "Customer testimonial", cat: ["Corporate"], ar: "16 / 9", video: "https://stream.mux.com/kgbHPetOQ2LQoJLDRXAHSn31iA4012Vr91dPbulaELTs/highest.mp4", vimeo: "988531570", vimeoAr: "16 / 9", uploadDate: "2024-07-22T14:13:15Z", duration: "PT2M35S",
        lead: "Customer testimonial video shot in the Netherlands.",
        body: ["We produced this customer testimonial for Salesforce. What better way to pitch to prospective clients than to hear from previous happy customers?!", "We were hired as crew on this job and travelled to The Netherlands for this customer testimonial film. On the surface it was a simple shoot, but it used some complex equipment and had a larger crew. This piece was shot on Arri Amira and Alexa Mini, which just gives that edge over the other cameras \u2013 it remains one of our favourite cameras to use. We paired the Arri\u2019s with their own Master Prime lenses. By doing this we ensured that the image was the best possible considering the budget.", "We even got to take home some chocolate!"] },
      { id: "shell", href: "/work/shell", client: "Shell / The Telegraph", sector: "Energy", title: "Branded content", cat: ["Branded", "Automotive"], ar: "16 / 9", video: "https://stream.mux.com/Om2sTVFts00HTqCvRPFyfcwtXVyS8YGWnBBYWVYrC5Zk/highest.mp4", vimeo: "988531350", vimeoAr: "16 / 9", uploadDate: "2024-07-22T14:12:40Z", duration: "PT1M38S",
        lead: "Branded content film for one of the world\u2019s giants.",
        body: ["Part of a series of films created for Shell by The Telegraph. We travelled to see a handmade sports car.", "We shot this film all the way back in 2015, but we\u2019re still immensely proud of it. It still stands the test of time, even though the car is looking very dated now! We travelled to a Norfolk shed, where we stayed for 2 days shooting the general happenings around the factory. Our contribs were very accommodating which made it all worth it. The edit \u2013 done by The Telegraph Media Group \u2013 is brilliant, and really pulls out a lot of the visuals with the use of sound design."] },
      { id: "nested", href: "/work/nested", client: "Nested", sector: "Property", title: "Social media campaign", cat: ["Corporate"], ar: "3 / 4", video: "https://stream.mux.com/YxwZU01pBBOcZkT4qzsXoDiK7jJGwmmIpoUyvN7DdhWs/highest.mp4", vimeo: "988532031", vimeoAr: "16 / 9", uploadDate: "2024-07-22T14:14:28Z", duration: "PT50S",
        lead: "Quality social media campaign for the modern estate agency.",
        body: ["A social media campaign for the in-trend estate agent brand. Bitesize stories from real customers and consumer advice from the experts at Nested.", "Our aim with the social media campaign was to create really personable videos, in which the agent would come across as easy-going, knowledgable and convincing.", "Working directly with Nested\u2019s marketing team during the creative process, we came up with the best way to portray Nested on camera. The agents talking directly to camera helped create that intimate feel. We chose to film each agent in a homely setting, for the same reason. Having the agents walk around their local areas helped engage the local audience, which was ultimately Nested\u2019s goal.", "This shoot was conducted over six days across six different London boroughs, so it\u2019s needless to say, our crew definitely got their steps in! We kept the kit relatively light on this shoot for that reason, all b-roll was shot handheld on prime lenses; and the only lighting required was that for each PTC.", "Six locations. Six agents. Forty-six different videos."] },
      { id: "scott-brash", href: "/work/scott-brash", client: "Scott Brash", sector: "Sport", title: "Training app videos", cat: ["Sport"], ar: "16 / 9", video: "https://stream.mux.com/1nrQjJ2c8hNnAhpX01UJIL3s023eDOQMT1ENqcSLCMVvA/highest.mp4", vimeo: "988531826", vimeoAr: "16 / 9", uploadDate: "2024-07-22T14:13:52Z", duration: "PT3M4S",
        lead: "Training app videos for one of the world\u2019s greatest horsemen.",
        body: ["Back to shooting after lockdown and we had this mammoth project to tackle!", "During the lockdown in the UK, Scott wanted to release an equestrian training app. For this, he needed a lot of video content. Around 70 app videos in total, we would shoot around 4/5 per day, so it was a lengthy project. But it was a pleasure working with such a determined client.", "We were incredibly lucky with weather conditions for the three weeks of filming, meaning we could rattle through the videos with relative ease, despite a few tantrums from the horses!", "The majority of the instructional videos were shot with four cameras, and were around an hour or so of recording. The size of the data was immense, but we managed it carefully and the project was signed off within six weeks."] },
      { id: "rize", href: "/work/rize", client: "Rize", sector: "Consumer", title: "Stock-footage edit", cat: ["Corporate", "Social"], ar: "16 / 9", video: "https://stream.mux.com/NbNjw1chFxLn00YPjnR7QOlEgPq8yhRoMHbJswfONINw/highest.mp4", vimeo: "988531633", vimeoAr: "16 / 9", uploadDate: "2024-07-22T14:13:24Z", duration: "PT1M48S",
        lead: "Impactful edit using only stock imagery.",
        body: ["Impactful video about a climate change fund from Rize ETF. Created solely using stock video gathered from various sources.", "This film is a perfect example for creative storytelling in the digital realm, proving that engaging content doesn\u2019t require tangible product footage. The execution involved deep asset sourcing over four days, recording with a professional voice actor for the narration, and six days piecing it all together in post-production. Through exciting editing and extensive sound design, we finished with an immersive piece that effectively describes a narrative about climate change and motivates viewers toward investment action.", "This method is brilliant for health-tech clients who often deal with complex, invisible, or purely digital products (like software or diagnostics) that don\u2019t have exciting visual footage."] },
      { id: "badminton-horse-trials", href: "/work/badminton-horse-trials", client: "Badminton Horse Trials", sector: "Sport", title: "Anniversary promo", cat: ["Sport"], ar: "16 / 9", video: "", vimeo: "1208364202", vimeoHash: "f2b6cd4a85", vimeoAr: "16 / 9", uploadDate: "2026-07-09T05:41:52Z", duration: "PT1M43S", vimeoThumb: "https://i.vimeocdn.com/video/2177670527-4b00ee8b7972f902df36ec0de403d5de0fadd465e8bfd3e73398e19331eacbe4-d_960x540?region=us",
        lead: "75 years of Badminton Horse Trials.",
        body: ["A promotional film marking 75 years of the Badminton Horse Trials, one of the sport's great fixtures."] },
      { id: "mahou-beer-promos", href: "/work/mahou-beer-promos", client: "Mahou", sector: "Drinks", title: "Beer promos", cat: ["Branded"], ar: "16 / 9", video: "https://stream.mux.com/qlCs1JxItVxZ8Q9QB6sLp6a6auDOnvzY02fFV1hYWg8w/highest.mp4", vimeo: "325920534", vimeoHash: "c7917b056b", vimeoAr: "16 / 9", uploadDate: "2019-03-22T13:30:25Z", duration: "PT2M27S",
        lead: "Branded content for luxury beer brand, Mahou.",
        body: ["A campaign series of films for the legendary Madrid beer brand \u2018Mahou\u2019. Beer and tapas, pairings with acclaimed chef Mark Sargent.", "This series of films was part of the campaign to launch Mahou beer into the UK market.", "Madrid is synonymous with great food, predominantly the superb tapas that you can find throughout the city. What better way to introduce UK consumers to Mahou than through tapas dishes that pair perfectly with Mahou beer!", "Working with Mahou and the Telegraph Commercial Video team we conceptualised and created the video campaign that was to be filmed over 4 days in 4 different locations.", "We wanted the tone of the films to reflect the Madrid tapas culture, celebrating the social aspects of sharing food, and of course, enjoying a beer with friends.", "With each film only 2 minutes in length we had to think creatively to pack in all of the information that Mahou wanted to get across alongside the food content.", "The campaign was greatly received by the client and viewers, almost as well as the leftover tapas was received by the crew."] },
      { id: "yorkshire-tea-branded-content", href: "/work/yorkshire-tea-branded-content", client: "Yorkshire Tea", sector: "Food", title: "Branded content", cat: ["Branded"], ar: "16 / 9", video: "https://stream.mux.com/53XIXwNcaqPIE6mYoVsaWeyVxh1SObZetWgS019H8Lgc/highest.mp4", vimeo: "312003484", vimeoAr: "16 / 9", uploadDate: "2019-01-17T18:37:40Z", duration: "PT2M34S",
        lead: "Branded content for Britain\u2019s favourite tea, Yorkshire Tea.",
        body: ["Having run a competition to find \u2018Britain\u2019s Best Garden\u2019, this branded content campaign for Yorkshire Tea culminated in this film showcasing the winning garden.", "After seeing the undulations of the garden on the recce we knew a jib would be perfect to show the space in all its glory. Alongside our main camera we captured some beautiful visuals which were actually made even better by the weather, the rain adding to the atmosphere.", "Despite the weather we shot everything that we wanted to capture to create a charming film about a humble(ish) English garden. Best viewed with a cup of tea.", "We are proud to have contributed to this project that went on to win \u2018Best Branded Content Campaign\u2019 at the Campaign awards."] },
      { id: "dove-emotive-storytelling", href: "/work/dove-emotive-storytelling", client: "Dove", sector: "Consumer", title: "Emotive brand story", cat: ["Branded", "Sport"], ar: "16 / 9", video: "https://stream.mux.com/CKgesVaeT7IwZM01ZKSCCUhLZZVyBkl8O25MgMBEhZ1w/highest.mp4", vimeo: "312001005", vimeoAr: "16 / 9", uploadDate: "2019-01-17T18:18:41Z", duration: "PT2M41S",
        lead: "Emotive storytelling using stock for skincare giant, Dove.",
        body: ["Klaxon Studio worked with Dove to produce a film for their \u2018Act of Care\u2019 campaign where Rugby legend Scott Fardy reflected on the 2011 tsunami and the impact it had on the fishing town of Kamaishi, Japan.", "This one is a favourite of Matt and James. Whilst no filming took place specifically for this project we crafted the narrative arc of Scott Fardy\u2019s emotive story and then whiled away many, many hours sourcing archive footage of Scott and also the Tsunami that hit Kamaishi.", "This film that we produced was one in a series that Dove commissioned for their \u2018Men\u2019s Act of Care\u2019 series. We flew to Dublin to interview Scott about his experiences in Japan when the Tsunami struck Kamaishi and how he helped in the aftermath. From that we built the narrative structure of the film, sourcing the relevant supporting archive and contributors to help tell the story.", "Having spent over a month on this project conceptualising, researching, planning, interviewing and editing there was a strange twist of fate 3 years later when Matt actually ended up in Kamaishi for a different project. It was humbling both to see the remarkable rebuilding that had taken place in Kamaishi after the Tsunami and also to speak to the locals about what they had gone through. An amazing experience."] },
      { id: "nfu-sponsored-content", href: "/work/nfu-sponsored-content", client: "NFU Mutual", sector: "Finance", title: "Sponsored content", cat: ["Branded"], ar: "16 / 9", video: "https://stream.mux.com/wffdb4jMCb1pLsBPz2Q8fWtRN00fOen1mPNfNNlxAb9o/highest.mp4", vimeo: "445542784", vimeoAr: "16 / 9", uploadDate: "2020-08-07T09:00:44Z", duration: "PT2M11S",
        lead: "Slick branded campaign for NFU Mutual.",
        body: ["Over two days we shot two sponsored content films for NFU Mutual, one at a Gin distillery in the Wye Valley and the other at a beautiful Dairy farm in Lincolnshire.", "Sometimes you get particularly lucky with the subject of your shoots, this one was of those!", "The aim of the films was to highlight the relationships shared between \u2018The Rural\u2019, \u2018The Town\u2019 and \u2018The City\u2019 and to position NFU Mutual as a modern insurance provider that can adapt to the UK\u2019s ever changing \u2018consumer culture\u2019 and lifestyles.", "The films were a documentary portrait of the featured producers. The best hook to keep people watching content is to see someone talking passionately about a subject they love. This was certainly the case with the two producers that we featured and it was great to be able to work with them to showcase their business and their produce.", "Perks of the job, yes we tried some Chase Gin (after the shoot of course) and yes we tried some Lincolnshire Poacher Cheese, both were delicious!"] },
      { id: "shell-corporate", href: "/work/shell-corporate", client: "Shell", sector: "Energy", title: "Corporate film", cat: ["Corporate"], ar: "16 / 9", video: "https://stream.mux.com/wErbQeg01rRjZImtMfiiNnKZYkhZBb02ttYtGuVxDhvDY/highest.mp4", vimeo: "429320412", vimeoAr: "16 / 9", uploadDate: "2020-06-15T12:17:13Z", duration: "PT2M35S",
        lead: "A corporate film for a massive corporate giant.",
        body: ["A trip to Hamburg to see Shell\u2019s cutting-edge fuel technology lab.", "With Shell being a leading corporate player in their industry, they are constantly developing new fuel technologies. The film that we produced was to showcase one of their new consumer products, Shell V-Power Nitro+ diesel.", "The challenge with a lot of subject matters that are niche and technical in nature, is to make it understandable and engaging to the casual viewer.", "So our concept was that of a \u2018visual essay\u2019. No talking heads taking up valuable screen time, instead a well curated voice-over underpinned by cinematic shots that visually show the processes and concepts that are being explained in an easily digestible way.", "The voice over was created from an interview we conducted with a fuel scientist from Shell on location. It was vital to ensure that we curated the questions in a way that we could then create the narrative voice over for the film seamlessly, which we achieved.", "We were really happy with the end result, who knew fuel science could be so interesting!"] },
      { id: "subaru-branded-content", href: "/work/subaru-branded-content", client: "Subaru", sector: "Automotive", title: "Branded content", cat: ["Branded", "Automotive"], ar: "16 / 9", video: "https://stream.mux.com/vrkXtWubY92aQenx3eAoRjhC1UxeTNOfGa9SzBavMwM/highest.mp4", vimeo: "312002577", vimeoAr: "16 / 9", uploadDate: "2019-01-17T18:30:57Z", duration: "PT2M21S",
        lead: "Branded content films in the shadow of Snowdonia.",
        body: ["Subaru was the client for this project, commissioning two car reviews for their new models of the Forester and Levorg.", "November in Snowdonia isn\u2019t for the faint hearted, but we pulled off the shooting in 3 days despite the weather doing its best to stop us!", "Both cars fall in different sectors, one being a 4x4 and the other being a Sports Tourer. So, with just three consecutive days available to shoot a film for both cars, the challenge was that of ensuring efficient use of time, to find a location that would suit and enable us to show the strengths of both vehicles without having to make time consuming location moves.", "After lots of researching on Google Maps and then two days of physical recces, we decided upon shooting in Snowdonia.", "We found a spectacular disused slate mine as the location to shoot the Forester. Subaru were keen to heavily feature their \u2018x-mode\u2019 system which is utilised in challenging off-road, low grip environments and the slate mine was the perfect place to show this.", "For the Levorg, we really wanted to show its capabilities as a Sports Tourer, focusing on the ride and handling of the car. The twisting mountain roads of Snowdonia was perfect for this, not to mention the stunning scenery that it also provides as a backdrop.", "Add former Stig Ben Collins as the host and you have the perfect person to put the cars through their paces."] },
      { id: "cavalor", href: "/work/cavalor", client: "Cavalor", sector: "Equine", title: "Promotional video", cat: ["Corporate", "Sport"], ar: "16 / 9", video: "https://stream.mux.com/IbVQ6a9K9d2bZ5V4eId6lmJgXgJf9YdX3bMV2qgJllY/highest.mp4", vimeo: "988536100", vimeoAr: "16 / 9", uploadDate: "2024-07-22T14:25:25Z", duration: "PT4M24S",
        lead: "Emotive promotional video to capture everyone\u2019s hearts.",
        body: ["Emotive promotional video with horsemen and women telling stories about why they love the equestrian world.", "Cavalor wanted to produce a promotional video that was more about the beauty of the film and stories than their own brand. We were only happy to oblige. We had a crew of only three, a director and two camera people, but we managed to produce some cracking results!", "This piece was shot in two days across two countries. It was logistically quite a challenge. The budget was limited, so the only way to meet the client\u2019s needs was to shoot in a limited timeframe, this would help to reduce the crew costs. We managed to squeeze five different contributors in three different locations across two countries. We put a fair amount of miles on the hire van to say the least! We carefully planned the shoot days down to the minute so that the crew weren\u2019t overworked and still managed to achieve the quality films we strive for."] },
      { id: "aesme-instructional-video", href: "/work/aesme-instructional-video", client: "Aesme", sector: "Consumer", title: "Instructional video", cat: ["Branded"], ar: "1 / 1", video: "https://stream.mux.com/CFr8mlhQQYKOOkAm02sxCMz5AG01783yovYR502dD5pnpg/highest.mp4", vimeo: "988531951", vimeoAr: "16 / 9", uploadDate: "2024-07-22T14:14:13Z", duration: "PT1M22S",
        lead: "Beautifully crafted instructional videos.",
        body: ["This series of instructional videos were made to be informative and easy to understand. Aesme wanted the films to be wide reaching so accommodating a large audience was vital.", "Aesme have very clear definitions for what they want from video content. They came to us after separating from another production company who they felt didn\u2019t meet their expectations. Having been through the process before, they were careful to get it right this time. We were provided with storyboards that we made sure we followed as best we could.", "We shot the instructional videos with two cameras in the Aesme floristry studio in West London, unfortunately this location was right underneath the railway and Shepherd\u2019s Bush station. With a tight budget, there was no option but to film in this location. The crew and contributors had to be patient and wait for trains at every shoot. Our soundman was vigilant and we glad for it, as you don\u2019t hear the trains at all!"] },
      { id: "telegraph-lullingstone-castle", href: "/work/telegraph-lullingstone-castle", client: "The Telegraph", sector: "Media", title: "Lullingstone Castle film", cat: ["Social"], ar: "16 / 9", video: "", vimeo: "1127525470", vimeoHash: "387659f32f", vimeoAr: "16 / 9", uploadDate: "2025-10-15T09:46:01Z", duration: "PT3M29S", vimeoNativeAr: 0.75, vimeoThumb: "https://i.vimeocdn.com/video/2070282340-9580c0c0479537a059f2680a925e6a0be9fc03b8a1d9fd0ed2b4a26dc028c2dd-d_960x540?region=us",
        lead: "A plant hunter, a kidnapping, and the garden that saved a castle.",
        body: ["We spent a day at Lullingstone Castle with Tom Hart Dyke, 20th heir to the estate, for The Telegraph. He turned out to have quite a story.", "Tom is a plant hunter and travelled the world looking for rare species he could bring back to the UK.", "While he was looking for a rare orchid in Colombia, he, along with 3 others, got kidnapped and taken deep into the jungle - where he was held captive for 9 months and threatened at gunpoint daily. His friends were killed off, some accidentally. Tom was assumed dead by those closest to him and a memorial was held for Tom in the UK.", "When he was told one day had 5 hours to live, Tom passed his time by drawing up and designing a \"world garden\" in his diary.", "He and one other eventually escaped by speedboat and stumbled across two rangers who radioed the consulate; who in turn thought it was all a hoax as Tom had \"died\" ages ago.", "Eventually after much negotiation, they sent someone to rescue him.", "When back at Lullingstone Castle, Tom put the world garden into action. It's fascinating and has an amazing array of really peculiar plants! In fact, the garden has saved Lullingstone from the depths of financial ruin!", "Filmed in a day at Lullingstone by Shooting Producer/Director, Charlie."] },
      { id: "barclays-social-advice", href: "/work/barclays-social-advice", client: "Barclays", sector: "Finance", title: "Social advice content", cat: ["Corporate", "Social"], ar: "1 / 1", video: "", vimeo: "1208420545", vimeoHash: "7dd07a857c", vimeoAr: "16 / 9", uploadDate: "2026-07-09T09:03:37Z", duration: "PT2M11S", vimeoThumb: "https://i.vimeocdn.com/video/2177739816-f98c153c0568f48cca470d0b7c4565d1b86dc4da24acf76d38045846ffafe2f3-d_960x540?region=us",
        lead: "A massive retained client over three series.",
        body: ["We have been asked back consistently to film these financial advice films for Barclays. The creative agency, Rapp (part of the Omnicom group) handle all of the creative before we get involved. We direct, shoot and edit these films ready for use across youtube, website, social and embedded into emails.", "This is the film before handoff, Rapp applied the motion graphics in post.", "We've filmed 3 series of these films, usually shot on one day in one location with 2 cameras and although it looks subtle, there is a helluva lot of lighting, especially for 6 flights of stairs!"] },
      { id: "uniteq-brand-launch", href: "/work/uniteq-brand-launch", client: "Uniteq", sector: "Fashion", title: "Brand launch", cat: ["Social"], ar: "3 / 4", video: "", vimeo: "1208380461", vimeoHash: "ee5536a47e", vimeoAr: "9 / 16", uploadDate: "2026-07-09T06:45:43Z", duration: "PT35S", vimeoThumb: "https://i.vimeocdn.com/video/2177691023-a113fb55e1dc3372d83a70b39a962333066bc10de00da21c96d8932ccb49f767-d_960x540?region=us",
        lead: "Social media launch for new clothing brand.",
        body: ["Uniteq came to us with a brief to launch their new clothing brand on social media. Twelve vertical clips and a hero film - all shot in a single day on location in Surrey, in mid-December!", "The creative direction was deliberately unglamorous. This was an \u2018atypical\u2019 fashion promo film. We wanted the brand to feel authentic and gritty, so we leaned into handheld camera work and gave the models room to move. Our mantra for this was \u2018less polish, more edge\u2019."] },
];

// ── Home-page service teasers ──

export const homeServices: HomeService[] = [
  { num: "01", title: "Corporate Video", desc: "Films that get it right for boardrooms, stakeholders, and externally. Every time.", img: "uploads/vlcsnap-2025-12-01-10h35m19s188-b999ec69.webp", href: "/services/corporate-video" },
  { num: "02", title: "Branded Content", desc: "Sponsored content and UGC that builds brands.", img: "uploads/vlcsnap-2024-06-10-15h38m45s397-40806154.webp", href: "/services/branded-content" },
  { num: "03", title: "Social Content", desc: "Social-first thinking from the very first conversation.", img: "uploads/Channel 4 x Boots Great British Summer crop.webp", href: "/services/social-content" },
  { num: "04", title: "B2B Video", desc: "Complex products, specialist audiences, high-stakes communications, done properly.", img: "uploads/vlcsnap-2022-07-13-14h33m09s835-a351d372.webp", href: "/services/b2b-video" },
];

// ── Production services (12) ──

export const svcOrder: string[] = ["production-management", "directing", "filming", "editing", "ideation", "podcast-recording", "colour-grading", "sound-design", "delivery-versioning", "white-labelling", "uk-production-services", "film-crew-hire"];

export const services: ServiceDetail[] = [
      { img: "uploads/IMG_2697 2.webp", slug: "ideation", href: "/services/ideation", num: "01", title: "Ideation & Creative", desc: "Where great ideas are born, shaped and built into something real.",
        lead: "Every great film starts with a great idea. But great ideas don't just happen, they're built.",
        body: [
          "At Klaxon, ideation isn't a box-ticking exercise or a slide deck full of buzzwords. It's where we do some of our best work. We get under the skin of your brand, your audience and your objectives, then we start asking the questions that lead somewhere interesting.",
          "We work collaboratively, bringing your team's knowledge together with our creative instincts to develop concepts that are original, purposeful and actually executable. No ideas that look good in a meeting room but fall apart on a shoot day.",
          "From the first spark of an idea through to a fully realised creative concept, we shape the direction of your project with clarity and confidence. That means developing the narrative, defining the visual language, writing scripts that sound like humans talking, and building storyboards that give everyone a clear picture of where we're heading.",
          "We know the creative process can feel uncertain, especially when you're trying to translate a business objective into something that moves people. That's what we're here for. We've navigated enough briefs, stakeholder sign-offs and creative curveballs to know how to keep the process focused without losing the spark that makes content worth watching.",
          "Good ideas, well executed, change how people feel about a brand. Let's find yours.",
        ],
        includes: ["Ideation", "Video Concept Development", "Creative Direction", "Scripting", "Storyboarding"],
        faqs: [
          { q: "How long does the creative development process take?", a: "It depends on the complexity of the project, but typically we'd expect concept development to take one to three weeks. This includes initial briefing, internal ideation, and the presentation of fully developed creative ideas for your feedback. For larger or more complex productions, we build in more time to ensure the concept is properly stress-tested before we move into production." },
          { q: "What if we already have an idea, can you develop it further rather than start from scratch?", a: "Absolutely. Many of our best projects start with a client's initial idea that we then help shape, refine and build out into a fully realised concept. We're as comfortable developing someone else's spark as we are generating our own." },
          { q: "Do you provide scripts and storyboards as part of the creative process?", a: "Yes, scripting is a standard part of our concept development process, we won't move into production without a clear, signed-off script. Storyboarding depends on the nature of the project; for more complex or visually ambitious productions it's an invaluable tool, but for simpler shoots it's not always necessary. We'll always recommend the level of pre-production detail that's right for your specific project." },
        ] },
      { img: "uploads/Levorg&Forester Wales-80.webp", slug: "production-management", href: "/services/production-management", num: "02", title: "Production Management", desc: "Every detail handled, so your production runs exactly as it should.",
        lead: "The best shoot days don't happen by accident. They happen because someone thought of everything before the cameras rolled.",
        body: [
          "Production management is the backbone of every project we deliver, and while it might not carry the glamour of a great idea or a stunning shot, without it, neither of those things would make it to screen.",
          "At Klaxon, we take the operational complexity of a production completely off your plate. From the moment a concept is greenlit, we're building the framework that makes it happen: locking locations, sourcing and scheduling talent, crewing up, managing budgets, arranging permits and making sure every moving part is in the right place at the right time.",
          "We're meticulous planners, but we're also realists. Productions rarely go exactly to plan, and when something shifts (and something always shifts), our job is to solve it quickly and quietly, so your shoot day stays on track and on budget.",
          "We work closely with clients throughout the pre-production process, keeping communication clear and making sure there are no surprises. You'll always know where things stand. And on shoot days, you can focus on what matters, the creative, while we handle everything else.",
          "It's not the most glamorous part of filmmaking. But done well, it's what separates a smooth, successful production from a stressful one. We've been doing this long enough to know the difference.",
        ],
        includes: ["Scheduling", "Location Scouting", "Budgeting", "Crewing", "Permits & Logistics", "Talent Coordination", "Pre-Production Services London"],
        faqs: [
          { q: "What does production management actually cover?", a: "Everything that needs to happen before filming begins and everything that needs to be coordinated on shoot days. That includes budgeting, scheduling, location scouting, permits, crewing, talent management, equipment sourcing and logistics. Essentially, if it needs to be organised for a production to happen, it falls under production management." },
          { q: "How do you handle unexpected changes on shoot days?", a: "Calmly and quickly. Productions rarely go entirely to plan - locations change, talent drops out, weather intervenes. Our production managers are experienced problem solvers who anticipate issues before they arise and resolve them without drama when they do. Keeping clients informed throughout is a core part of how we work." },
          { q: "Can you manage productions outside London?", a: "Yes. We manage productions across the UK and internationally. Our network of trusted crew, suppliers and location contacts extends well beyond London, and we're comfortable coordinating complex logistics in locations we haven't worked in before." },
        ] },
      { img: "uploads/33032478-0a8d-45bf-8722-1b0ad18f27e6 2.webp", slug: "directing", href: "/services/directing", num: "03", title: "Directing", desc: "Calm, creative direction that gets the best out of every subject and situation.",
        lead: "A great director doesn't just capture what's in front of the camera. They know exactly what needs to be felt on the other side of it.",
        body: [
          "Direction is where creative vision becomes reality, and it's one of the most nuanced skills in the entire production process. It's the ability to hold the big picture in mind while staying completely present in the moment. To know when a performance needs pushing, when a shot needs rethinking, and when what's happening spontaneously is better than anything in the plan.",
          "At Klaxon, our directors bring a calm, focused energy to set, because a relaxed crew is a creative crew, and a relaxed subject is a compelling one. Whether we're working with seasoned on-screen talent or a CEO doing their first piece to camera, we know how to draw out the best in people. We create the kind of environment where good things happen naturally, rather than having to be forced.",
          "We're fluent across formats, brand films, documentaries, interviews, product content, live events, and we adapt our approach to suit the tone and objectives of each project. Some films call for a strong, structured vision. Others need a lighter touch and a willingness to follow the story where it leads. We know the difference, and we know when to switch.",
          "The goal is always the same: footage that gives the edit everything it needs to make something genuinely great.",
        ],
        includes: ["Creative Direction", "Commercial Video Director", "On-Set Direction", "Talent Direction", "Interview Direction", "Documentary Direction", "Director for Hire London"],
        faqs: [
          { q: "How do you approach directing at Klaxon?", a: "All directing at Klaxon is handled in-house by our own team. This means the creative vision stays consistent from concept through to delivery, and the person directing your project has been involved in shaping it from the start. Our directors bring experience across a wide range of formats and tones, so whatever your project calls for, we have the capability to deliver it ourselves." },
          { q: "Can you direct people who've never been on camera before?", a: "This is one of our specialities. We've directed everyone from nervous first-timers to senior executives who are convinced they're terrible on camera - and in almost every case, the results surprise them. The key is creating the right environment and taking the time to put people at ease before filming begins." },
          { q: "Do clients have input into the creative direction on set?", a: "Yes, and we actively encourage it. Having the right client representative on set - someone with the authority to make decisions - makes for better films. We work collaboratively throughout the shoot and welcome input, while also being clear when we think something isn't serving the film." },
        ] },
      { img: "uploads/LevorgForester-Wales-102-1-scaled-655fed34.webp", slug: "filming", href: "/services/filming", num: "04", title: "Filming", desc: "Cinema-grade camera work, from short interviews to large-scale productions.",
        lead: "Beautiful images don't just look good, they make people feel something. That's the standard we hold ourselves to on every shoot.",
        body: [
          "Filming is where the preparation, the planning and the creative vision all collide with reality. It's fast, it's demanding, and it requires a level of technical expertise and instinctive decision-making that only comes from doing it, a lot. Our camera teams have shot everything from intimate documentary portraits to large-scale commercial productions, and they bring the same obsessive attention to image-making to every single project.",
          "We work with professional cinema and broadcast-grade kit, but equipment is only ever a means to an end. What matters is the eye behind the lens, the ability to read a location, work with available light, frame a shot that serves the story and move with the moment when things don't go to plan. That's where experience counts.",
          "Our Directors of Photography work in close collaboration with the director from pre-production through to the shoot, so that by the time we're on set, the visual language of the film is already established. Every shot has a purpose. Every setup is considered. And when something unexpected happens, a change in light, a spontaneous moment, a better option than the one on the shot list, we're ready to take it.",
          "The result is footage that gives post-production exactly what it needs to do its best work",
        ],
        includes: ["DoP", "Cinematography Services", "Camera Crew Hire London", "Sound Recording", "Lighting", "Film Crew London", "Multi-Camera Production"],
        faqs: [
          { q: "What camera and equipment do you work with?", a: "We shoot on Sony FX series cinema cameras, which deliver exceptional image quality across a wide range of production environments. For specialist requirements such as additional camera bodies, lenses, lighting and grip, we have established relationships with trusted rental houses and can scale our kit package to suit the demands of any project." },
          { q: "Can you film in low-light or challenging environments?", a: "Yes. Our camera teams are experienced across a wide range of filming conditions, from controlled studio environments to outdoor locations, live events, industrial settings and everything in between. We always carry the lighting and grip equipment necessary to handle whatever the location throws at us." },
          { q: "Do you provide a Director of Photography or just camera operators?", a: "Both, depending on what the project requires. For larger productions where the visual language of the film needs to be carefully established and maintained, we'd recommend a dedicated DoP. For smaller productions, an experienced camera operator can fulfil both roles effectively. We'll advise on what's right for your project and budget." },
        ] },
      { img: "uploads/IMG_3067.webp", slug: "podcast-recording", href: "/services/podcast-recording", num: "05", title: "Podcast Recording", desc: "Broadcast-quality audio, wherever you need to record.",
        lead: "Podcasts have never been more popular. But there's a significant gap between a podcast that exists and one that people actually come back to.",
        body: [
          "The barrier to entry might be low, but the bar for quality, real quality, is higher than most people realise. Audiences are discerning. They notice when the audio isn't quite right, when the conversation feels stilted, or when the production lacks the polish that keeps them engaged. Getting those things right takes more than a decent microphone and a quiet room.",
          "At Klaxon, we bring full production expertise to podcast recording, creating an environment where hosts and guests feel comfortable, conversations flow naturally, and the technical side is completely taken care of. Whether you're launching a brand new show or looking to elevate an existing one, we handle everything from studio setup and sound recording through to editing, mixing and final delivery.",
          "We understand that great podcast content lives or dies on the quality of the conversation. So we keep the process relaxed and straightforward, no complicated setups, no distracting technical fuss, just a professional recording environment that lets the dialogue do its job.",
          "We work with brands, broadcasters and independent creators across a range of formats, from interview-led series to panel discussions and narrative productions. Whatever the format, the goal is the same: audio that sounds exceptional and content that keeps your audience listening.",
        ],
        includes: ["Podcast Recording Studio London", "Location Recording", "Audio Editing", "Sound Mixing", "Music & Sound Design", "Multi-Guest Recording", "Podcast Production Services UK"],
        faqs: [
          { q: "Do you have a dedicated podcast recording studio in London?", a: "We don't have a fixed studio space, but that's by design. We work with a range of professional studio facilities when a fixed environment is the right call, and we also operate an industry-leading Rode portable podcast kit that delivers broadcast-quality audio wherever we set up. Either way, we bring the same standard of sound to every recording, the setup just depends on what works best for your project." },
          { q: "Can you record guests who are joining remotely?", a: "Yes. We use Riverside, the industry-standard platform for remote podcast recording, which captures each participant's audio locally at broadcast quality regardless of their internet connection. Remote guests integrate seamlessly into the recording, there's no compromise on audio quality compared to an in-person session." },
          { q: "Do you help with podcast editing and post-production as well as recording?", a: "Absolutely, we handle the full process from recording through to a distribution-ready master. That includes editing, sound mixing, music, intro and outro production, and delivery in the formats required by your chosen platforms." },
          { q: "Can our podcast be filmed as well as recorded?", a: "Absolutely - video podcasts have grown significantly in popularity and it's something we'd always encourage considering. Having a video version opens up a whole additional content channel: the full episode for YouTube, clipped highlights for social, and behind-the-scenes material that gives your audience a more personal connection with the show. We handle the video and audio production together in a single setup, so there's no additional complexity on your end." },
          { q: "We're launching a new podcast from scratch. Can you help with the format and concept as well as the recording?", a: "Yes. We can work with you from the very beginning of the podcast development process, helping to establish the format, editorial approach, episode structure and creative concept before a single word is recorded. Getting this right from the start makes everything that follows significantly easier." },
        ] },
      { img: "uploads/IMG_8106-6a253099.webp", slug: "editing", href: "/services/editing", num: "06", title: "Editing", desc: "Where everything comes together and great content is made.",
        lead: "This is where everything comes together. And where the difference between good content and great content is made.",
        body: [
          "Editing is far more than assembling the best shots in the right order. It's a creative discipline in its own right, one that shapes the emotional arc of a film, controls its pace and rhythm, and determines whether an audience stays with it to the end or switches off after thirty seconds. A great edit can elevate average footage. A poor one can squander the best material in the world.",
          "At Klaxon, our editors are involved from early in the production process, not just handed a hard drive and left to get on with it. That continuity matters. When your editor understands the creative intent behind every shot, every interview, every sequence, the decisions they make in the cut are informed by the whole picture, not just what's in front of them.",
          "We work meticulously through every element that makes a film feel finished: selecting the moments that carry genuine emotion, building pace that serves the story, choosing music that enhances rather than overwhelms, and sweating the small details that most viewers will never consciously notice but would immediately feel if they were missing.",
          "From a tight social cut to a long-form documentary, we approach every edit with the same care and the same question: what does this film need to be as good as it can possibly be?",
        ],
        includes: ["Video Editing Services London", "Colour Grading", "Sound Design", "Music Supervision", "Motion Graphics", "VFX", "Post Production London", "Versioning & Delivery"],
        faqs: [
          { q: "How long does video editing typically take?", a: "It varies depending on the length and complexity of the project. A short social cut might be turned around in a day or two. A long-form documentary or corporate film with multiple contributors could take several weeks. We always agree a realistic post-production timeline upfront and build in rounds of client feedback." },
          { q: "How many rounds of revisions are included?", a: "Our standard process includes three rounds of client revisions, which is sufficient for the vast majority of projects. We use Frame.io for all client feedback, it lets you leave time-coded comments directly on the video, which makes the amends process fast, clear and straightforward for everyone. Additional revision rounds can be accommodated where needed, we'd agree the terms of these at the project outset." },
          { q: "Do your editors work with footage shot by other production companies?", a: "Yes. If you have existing footage that needs editing, whether shot by us, another company, or in-house, our editors can work with it. We'd want to review the material first to make sure we have everything needed to deliver the edit you're looking for." },
          { q: "What editing software do you use?", a: "We work in Adobe Premiere Pro, the industry-standard editing platform used across broadcast, commercial and digital production. All project files are delivered in Premiere Pro format, and we're happy to share sequences or project files directly if your team needs to make changes downstream." },
        ] },
      { img: "uploads/pexels-jakubzerdzicki-30229850.webp", slug: "colour-grading", href: "/services/colour-grading", num: "07", title: "Colour Grading", desc: "Where the visual identity of your film comes to life.",
        lead: "Colour is one of the most powerful tools in a filmmaker's arsenal. It sets mood, creates atmosphere and tells the audience how to feel, often without them ever realising it.",
        body: [
          "Colour grading is the final visual layer that transforms raw footage into a finished film. It's the difference between images that look captured and images that look crafted. Done well, it's almost invisible, audiences don't notice the grade, they just feel it. Done poorly, it's the first thing that undermines an otherwise strong piece of content.",
          "At Klaxon, we treat grading as an integral part of the creative process rather than a technical afterthought. Our colourists work closely with the director and editor to understand the visual intent of each project, ensuring that the grade serves the story rather than just tidying up the footage. Whether that means a clean, natural look that keeps the focus on the subject, a rich cinematic palette that adds depth and drama, or something more stylised that reinforces a brand's identity, we have the skill and the tools to get it right.",
          "We grade across all formats and delivery requirements, broadcast, digital, social, and we understand that different platforms have different demands. A film that looks stunning on a cinema screen needs to work just as hard on a phone. We make sure it does.",
          "Colour grading is where a film stops looking like a film and starts looking like your film.",
        ],
        includes: ["Colour Grading Services London", "Video Colour Grading UK", "LUT Development", "Broadcast Delivery", "HDR", "Post Production Colour London", "Multi-Format Versioning"],
        faqs: [
          { q: "At what point in the post-production process does colour grading happen?", a: "Colour grading is the final stage of the picture post-production process, it happens after the edit has been locked and approved. We don't grade until the edit is signed off, as any changes to the cut after grading would require rework." },
          { q: "Can you match the grade across multiple videos in a series?", a: "Yes. Consistency across a content series is something we take seriously. We create and retain LUTs and reference grades for ongoing projects, ensuring every new piece of content in a series matches the established visual identity." },
          { q: "Do you grade for specific platforms - broadcast, social, digital?", a: "Yes, and this is an important distinction. Different platforms have different colour space and technical requirements. We ensure every graded master is correctly specified for its intended delivery format, whether that's broadcast, online or social media." },
        ] },
      { img: "uploads/IMG_2087-rotated.webp", imgPosition: "center 96%", slug: "sound-design", href: "/services/sound-design", num: "08", title: "Sound Design", desc: "Audio that immerses, moves and translates across every platform.",
        lead: "Close your eyes during a great film and it still works. That's not an accident, it's sound design.",
        body: [
          "Audio is the most underestimated element of video production. Audiences will tolerate imperfect visuals far longer than they'll tolerate imperfect sound. Yet for many productions, sound is treated as an afterthought, something to be fixed in post rather than crafted with intention. The results speak for themselves, and not in a good way.",
          "At Klaxon, we believe sound deserves the same creative attention as every other element of a film. From the ambient texture of an environment to the precise placement of an effect, from the emotional weight of a music choice to the clarity and warmth of a voice, every sonic decision shapes how an audience experiences your content, whether they're conscious of it or not.",
          "Our sound designers work across the full post-production process, collaborating closely with editors and colourists to ensure the audio and visual elements of a film feel completely unified. We build soundscapes that immerse, scores that move, and mixes that translate faithfully across every platform and playback environment, from cinema speakers to laptop audio to a phone speaker in someone's pocket.",
          "Because that's the reality of modern content. It needs to work everywhere. And it needs to feel intentional everywhere too.",
          "Great sound design doesn't call attention to itself. It just makes everything feel more real, more alive, and more impossible to ignore.",
        ],
        includes: ["Sound Design for Video", "Dialogue Editing", "Music Supervision", "Foley", "Film Sound Mixing Services", "Audio Post Production London", "Broadcast Audio Delivery"],
        faqs: [
          { q: "What's the difference between sound design and sound mixing?", a: "Sound mixing is the process of balancing and blending the audio elements of a film - dialogue, music, effects, to create the final mix. Sound design is the more creative process of actually building and crafting those audio elements in the first place - creating atmospheres, designing effects, and shaping the sonic world of the film. We offer both as part of our post-production services." },
          { q: "Can you help source and clear music for my video?", a: "Yes. We have access to a range of professional music libraries, giving us a broad catalogue of licensable tracks across every genre and mood. We'll find the right music for your project and handle the licensing as part of the process, meaning no clearance headaches on your end" },
          { q: "Do you deliver to broadcast audio specifications?", a: "Yes. We deliver to the relevant broadcast standards - including R128 for European broadcast and ATSC A/85 for US - as well as platform-specific requirements for digital and social delivery." },
        ] },
      { img: "uploads/pexels-dlxmedia-hu-215591835-11911058.webp", slug: "delivery-versioning", href: "/services/delivery-versioning", num: "09", title: "Delivery & Versioning", desc: "Every format, every platform, always on time.",
        lead: "You've invested in making something great. The last thing you want is for it to fall apart at the final hurdle.",
        body: [
          "Delivery is where productions either finish cleanly or unravel in a frustrating tangle of wrong formats, failed specs and last-minute amends. It's the least glamorous part of the process, but it's the part that determines whether your content actually reaches your audience in the way it was intended to be seen.",
          "At Klaxon, we treat delivery with the same rigour we bring to every other stage of production. That means understanding your requirements from the outset, not scrambling to interpret a technical spec at the eleventh hour, and building versioning and delivery into the production workflow rather than bolting it on at the end.",
          "Modern content rarely lives in one place. A brand film might need a cinema cut, a broadcast master, a sixty-second social edit, a fifteen-second bumper and a square-format version for Instagram, all from the same source material, all to different technical specifications, all needed at the same time. We've done this enough times to manage it without the chaos.",
          "We handle the full range of delivery formats and platform requirements, broadcast, digital, social, out-of-home, and we make sure every version is correctly specified, properly QC'd and delivered on time. No corners cut, no formats missed, no last-minute panics.",
          "Your content deserves to land perfectly. We make sure it does.",
        ],
        includes: ["Multi-Format Video Versioning", "Broadcast Video Delivery UK", "Digital & Social Optimisation", "Quality Control", "Subtitling & Captioning", "Video Post Production London", "Archive & Asset Management"],
        faqs: [
          { q: "What video formats do you deliver in?", a: "We deliver across all standard broadcast, digital and social formats, including H.264, H.265, ProRes, MXF and DNxHD among others. We also deliver to platform-specific specifications for YouTube, Instagram, TikTok and broadcast networks where required." },
          { q: "Can you create multiple versions of a film from the same source material?", a: "Yes - this is exactly what our versioning service is designed for. From a single master edit, we can produce broadcast cuts, social formats (square, vertical, horizontal), duration variants (60s, 30s, 15s, 6s), subtitled versions, and language variants. We manage the entire process from a single source to avoid inconsistency across versions." },
          { q: "Do you provide secure archive and asset management?", a: "Yes. We retain project files and master assets for an agreed period following delivery, and we can arrange longer-term archiving for clients who require it. We'd always recommend clients maintain their own copies of final deliverables." },
        ] },
      { img: "uploads/IMG_2693 2.webp", slug: "white-labelling", href: "/services/white-labelling", num: "10", title: "White Labelling", desc: "Brilliant production, delivered under your banner.",
        lead: "Sometimes the best creative partnership is the one your client never needs to know about.",
        body: [
          "White labelling is a pragmatic and increasingly common arrangement in the production industry, and one we're very comfortable with. Whether you're an agency that needs a trusted production partner behind the scenes, a consultancy that wants to offer video as part of a broader service, or a studio that's at capacity and needs overflow support, we can slot seamlessly into your workflow and deliver to your standards, under your banner.",
          "At Klaxon, we understand that when you bring us in as a white label partner, your reputation is on the line as much as ours. We take that seriously. The same quality of work, the same attention to detail and the same level of client service that we'd deliver under our own name is exactly what we bring to every white label engagement, because a job that reflects badly on you reflects badly on us too.",
          "We're experienced in working discreetly within existing client relationships, adapting to established processes and communicating in ways that support rather than complicate the agency-client dynamic. We know when to be visible and when to stay in the background, and we're flexible enough to operate in whatever way works best for your business.",
          "If you need a production partner you can rely on absolutely, one that delivers brilliant work and never makes you look anything other than completely in control, we should talk.",
        ],
        includes: ["White Label Video Production UK", "Agency Production Partner", "Outsource Video Production UK", "On-Site Embedding", "Multi-Project Retainers", "Overflow & Surge Capacity"],
        faqs: [
          { q: "How do you handle confidentiality in white label arrangements?", a: "Discreetly and professionally. We're accustomed to operating in the background and have no interest in being visible in arrangements where confidentiality matters. We're happy to sign NDAs and work within whatever communication protocols your client relationship requires." },
          { q: "Can you scale up quickly to handle multiple projects at once?", a: "Yes. One of the key advantages of working with us as a white label partner is access to our wider network of trusted crew and post-production resource. We're not limited by a fixed in-house headcount and can scale our capacity to match your pipeline." },
          { q: "Do you work on a project-by-project basis or offer retainer arrangements?", a: "Both. We're happy to work on individual projects as needed, or to agree retainer arrangements for agencies with an ongoing requirement for production support. Retainer arrangements can offer useful benefits in terms of resource planning and prioritisation." },
        ] },
      { img: "uploads/IMG_7933-a31cdb8b.webp", imgPosition: "25% center", slug: "uk-production-services", href: "/services/uk-production-services", num: "11", title: "UK Production Services", desc: "Local crew, local knowledge, seamless delivery for international productions.",
        lead: "Filming in the UK? We'll make sure you hit the ground running.",
        body: [
          "Bringing a production into an unfamiliar country is a logistical challenge even before a camera rolls. Navigating local regulations, sourcing the right crew, finding locations, managing permits, it all takes local knowledge, established relationships and the kind of on-the-ground expertise that can only come from years of working in the market. That's exactly what we offer.",
          "At Klaxon, we provide experienced UK crew and comprehensive fixer services for international production companies looking to shoot in Britain. Whether you're arriving with a full creative team and simply need local crew to support, or you need us to take care of the entire production infrastructure from the ground up, we have the experience and the network to deliver.",
          "We work across London and the wider UK, with access to a deep roster of trusted professionals, Directors of Photography, camera operators, sound recordists, gaffers, grips, production managers and more. Every crew member we provide is thoroughly vetted, highly experienced and used to working at pace on international productions.",
          "Beyond the crew, we can assist with location scouting and securing, permit applications, equipment sourcing and logistics, local casting and talent, and all the practical coordination that makes a foreign shoot run smoothly. Think of us as your production home base, the team that makes an unfamiliar place feel like familiar territory.",
          "You bring the vision. We'll bring everything else.",
        ],
        includes: ["UK Production Services", "Film Crew Hire UK", "Fixer Services", "Location Scouting & Permitting", "Equipment Sourcing", "Camera Crew Hire London", "Local Production Management", "Casting & Talent"],
        faqs: [
          { q: "Which areas of the UK do you cover?", a: "We work across the whole of the UK - from London and the South East through to Scotland, Wales and Northern Ireland. We have an established network of crew and suppliers across the country, so we're not limited to any particular region." },
          { q: "Can you assist with filming permits and location access in the UK?", a: "Yes. Navigating permit applications, location agreements, local authority permissions and access negotiations is a core part of our UK production services. The UK has specific requirements that can catch out international productions - we know how to handle them efficiently." },
          { q: "How much lead time do you need to assemble a crew?", a: "Lead time really depends on the scale and complexity of the project. For straightforward productions we can often assemble a crew within days, while larger or more technically demanding shoots benefit from more planning time. Whatever your timeline, get in touch and we'll let you know what's achievable, we're used to working at pace when the situation demands it." },
          { q: "Do you assist with equipment hire as well as crew?", a: "Yes. We can source and manage all equipment requirements for an inbound production - cameras, lighting, grip, sound and specialist kit - through our established relationships with UK equipment rental houses." },
        ] },
      { img: "uploads/E9AF444E-5DA4-42D0-9B43-014D5C85AD2B-ea41897c.webp", slug: "film-crew-hire", href: "/services/film-crew-hire", num: "12", title: "Film Crew Hire", desc: "Vetted, experienced crew assembled fast, anywhere in the UK.",
        lead: "Need a film crew you can trust. We'll put the right people on the day, wherever the day is.",
        body: [
          "A production is only ever as good as the people running it. The best camera in the world is useless in the wrong hands, and a brilliant brief falls apart without a crew that knows how to deliver it under pressure. When you hire a film crew, you're not just booking a set of skills, you're trusting a group of people to turn up, work well together and make your shoot run smoothly. That's exactly what we provide.",
          "At Klaxon, we offer professional film crew hire across the UK, from single operators through to fully resourced multi-camera units. Whether you need a Director of Photography and a camera assistant for a one-day interview shoot in London, or a complete crew of camera, sound, lighting, grip and production personnel for a national campaign, we assemble the right team for the job. Every crew member on our books is thoroughly vetted, properly insured and chosen for their experience as much as their kit.",
          "We've spent years building a deep network of trusted freelance professionals across the country, so we're never scrambling to fill a role. We know who's good, who's reliable and who works well under the specific demands of your production. That means we can crew up quickly when timelines are tight, and we can match the people to the project rather than simply filling slots.",
          "Hiring crew through us also takes the administrative weight off your shoulders. We handle the bookings, the rates, the call sheets and the coordination, so you have a single point of contact rather than a dozen separate conversations. And because we produce video ourselves, we understand exactly what a shoot needs to succeed, not just on paper, but on the day.",
          "Tell us the brief, the dates and the location. We'll bring the crew that delivers.",
        ],
        includes: ["Film Crew Hire UK", "Film Crew Hire London", "Camera Crew Hire", "Freelance Film Crew", "DoP & Camera Operators", "Sound, Lighting & Grip", "Multi-Camera Crews", "Production Crew Hire"],
        faqs: [
          { q: "What areas of the UK does your film crew hire cover?", a: "We provide film crews across the whole of the UK. London and the South East are our home turf, but we regularly crew productions in the Midlands, the North, Scotland, Wales and Northern Ireland through our national network of trusted freelance professionals. Wherever you're filming, we can put a local or travelling crew on the ground." },
          { q: "Can I hire a full crew, or just individual roles?", a: "Both. You can hire a single Director of Photography or sound recordist to slot into your existing team, or you can hire a complete crew built from the ground up - camera, sound, lighting, grip, hair and makeup, production support and more. We scale the team to exactly what the production needs." },
          { q: "How quickly can you assemble a film crew?", a: "For straightforward shoots we can often crew up within a day or two, sometimes faster when it's urgent. Larger or more technically demanding productions benefit from more lead time, but our network is deep enough that we rarely struggle to find the right people at short notice. Get in touch with your dates and we'll tell you what's achievable." },
          { q: "Is equipment included when I hire a crew?", a: "It can be. Many of our crew own and operate their own kit, and we can also source any additional equipment you need - cameras, lighting, grip and specialist gear - through our established relationships with UK rental houses. Just let us know whether you need crew only or crew plus equipment and we'll quote accordingly." },
          { q: "Are your crew insured and vetted?", a: "Yes. Every crew member we provide is experienced, professionally insured and personally vetted by us. We don't put anyone on a shoot we wouldn't trust on our own productions." },
        ] },
];

// ── Content types (11) ──

export const contentTypes: ServiceDetail[] = [
      { slug: "branded-content", href: "/services/branded-content", num: "01", title: "Branded Content", desc: "Stories that move people and build lasting connections with your brand.", img: "uploads/vlcsnap-2024-06-10-15h38m45s397-40806154.webp",
        lead: "The best branded content doesn't feel like an advert. It feels like something worth watching, and that's exactly the point.",
        body: [
          "Audiences are savvier than ever. They scroll past interruptions, skip pre-rolls and tune out anything that feels like it's selling to them. But give them something genuinely compelling, a story that entertains, moves or surprises them, and they'll watch every second and share it without being asked. That's the power of branded content done right.",
          "At Klaxon, we've been making branded content long enough to know what separates the films people remember from the ones they forget before they've finished watching. It comes down to one thing: putting the story first. Your brand's role is to enable the narrative, not dominate it. When that balance is right, the connection an audience makes with your brand is deeper and more lasting than any traditional advertising can achieve.",
          "We work with brands across a wide range of sectors to develop and produce content that is ambitious, authentic and built around a genuine creative idea. From the initial concept through to final delivery, we keep the focus on making something that your audience will actually want to engage with, because content they choose to watch will always outperform content they're forced to sit through.",
          "Branded content isn't a compromise between creativity and commercial objectives. In the right hands, it's where the two things become the same thing.",
        ],
        includes: ["Branded Content Production London", "Brand Film Production UK", "Content Marketing Video", "Automotive", "FMCG", "Financial Services", "Sport & Lifestyle", "Hospitality", "Technology", "Charity & Not-for-Profit"],
        faqs: [
          { q: "What makes branded content different from a traditional advertisement?", a: "Traditional advertising puts the brand message at the centre. Branded content puts the story at the centre, with the brand playing an enabling role rather than a dominant one. The goal is to create something an audience genuinely wants to watch, content they'd seek out even if there were no brand attached, because the depth of engagement that creates is far more valuable than the passive exposure of a traditional ad." },
          { q: "How do you measure the success of branded content?", a: "Success metrics vary depending on the objectives of the campaign. They might include views and completion rates, engagement (shares, comments, saves), brand sentiment shifts, direct traffic or conversion data. We work with clients at the outset to agree what success looks like and ensure the content is built to deliver against those specific measures." },
          { q: "Do you handle distribution as well as production?", a: "Production is our core focus, but we can point clients in the right direction when it comes to distribution and activation. We have a network of trusted partners we're happy to recommend for clients who need end-to-end support beyond the production itself" },
        ] },
      { slug: "corporate-video", href: "/services/corporate-video", num: "02", title: "Corporate Video", desc: "Professional, purposeful films that say as much about you as your message does.", img: "uploads/vlcsnap-2025-12-01-10h35m19s188-b999ec69.webp", imgPosition: "78% 35%",
        lead: "Corporate video has a reputation problem. Too often it's stiff, forgettable and made to satisfy an internal brief rather than engage an actual human being. We do it differently.",
        body: [
          "The truth is, corporate video is one of the most powerful communication tools a business has, when it's made with genuine craft and a clear sense of purpose. Whether you're communicating a strategic vision to your workforce, onboarding new employees, explaining a complex proposition to potential clients or showcasing your culture to the talent market, the quality of the film you put out says as much about your organisation as the message it contains.",
          "At Klaxon, we bring the same creative rigour to corporate work as we do to any other production. That means taking the time to understand your organisation, your audience and what you actually need the film to do, before we touch a camera. A corporate video that looks great but doesn't land with its intended audience isn't a success. We keep that front of mind throughout.",
          "We work closely with internal stakeholders to make the production process as smooth as possible, and we know how to get the best out of people who aren't professional on-screen talent. Clear communication, careful direction and a relaxed environment on set make an enormous difference to the end result.",
          "The goal is simple: a film your organisation is proud of, that does exactly what it needs to do.",
        ],
        includes: ["Corporate Video Production London", "Internal Communications Video", "Corporate Film Production UK", "Leadership Messaging", "Culture & Recruitment Films", "Investor Relations", "Training & Onboarding"],
        faqs: [
          { q: "How much does corporate video production cost in London?", a: "Corporate video costs vary significantly depending on the complexity of the production, the number of shoot days, the locations involved and the level of post-production required. As a rough guide, a professionally produced corporate film typically starts from around £5,000 to £8,000 for a straightforward single-day shoot, rising to £20,000 to £50,000 or more for larger, more complex productions. We provide detailed, transparent quotes for every project." },
          { q: "How long does a corporate video take to produce?", a: "From initial briefing to final delivery, timelines vary depending on the complexity of the project (as always). A straightforward single-shoot corporate film will move faster than a multi-location production with several contributors. As a rough guide, four to eight weeks covers most projects comfortably, accounting for concept development, pre-production, filming and post-production. Fast turnaround timelines can be accommodated where necessary, though we'd always recommend building in sufficient time to do the project justice." },
          { q: "Can you work with non-professional on-screen talent such as employees, executives, spokespeople?", a: "Yes, and we're particularly good at it. Getting natural, confident performances from people who don't normally appear on camera is a real skill, and it's one we've developed over many years of corporate production. The right preparation and a relaxed environment on set make an enormous difference." },
          { q: "Do you produce corporate videos for international use?", a: "Yes. We regularly produce corporate content for organisations with international audiences, including versioning for different markets, multilingual subtitling, and delivery in formats suitable for global distribution." },
        ] },
      { slug: "b2b-video", href: "/services/b2b-video", num: "03", title: "B2B Video", desc: "Content that builds trust, opens doors and works hard at every stage of the funnel.", img: "uploads/vlcsnap-2022-07-13-14h33m09s835-a351d372.webp",
        lead: "B2B buying decisions are rarely made on impulse. They're made by people who need to trust you before they'll commit, and video is one of the most effective ways to build that trust.",
        body: [
          "The B2B landscape is crowded. Every competitor is making similar claims, targeting similar audiences and showing up in the same channels. In that environment, the businesses that cut through are the ones that communicate with clarity, credibility and a degree of personality that makes them feel like a genuinely attractive proposition to work with. Video does all of that better than any other medium.",
          "At Klaxon, we understand the specific demands of B2B content. The audiences are sophisticated, the sales cycles are long, and the stakes around getting the messaging right are high. We work closely with you to understand not just what you do, but why it matters to the people you're trying to reach, and then we build content that speaks to them directly, in language that resonates and visuals that reflect the quality of your offer.",
          "From prospect-facing explainer films and case study content to thought leadership pieces and event coverage, we create video that works hard at every stage of the funnel. Content that opens doors, builds confidence and gives your sales and marketing teams something they're genuinely proud to put in front of clients.",
          "Because in B2B, how you show up matters. Video is your chance to show up brilliantly.",
        ],
        includes: ["B2B Video Production London", "Explainer Video Production", "B2B Marketing Video", "Case Studies & Testimonials", "Thought Leadership", "Sales Enablement", "Event & Conference Coverage"],
        faqs: [
          { q: "What types of video work best at different stages of the B2B sales funnel?", a: "At the awareness stage, brand films and thought leadership content work well to establish credibility. At the consideration stage, explainer videos, product demos and case studies help prospects understand specifically what you offer. At the decision stage, testimonial and case study content that demonstrates proven results is particularly effective. We can help you map content to your specific funnel and prioritise where video will have the most impact." },
          { q: "How do we ensure the video lands with a sophisticated B2B audience?", a: "By starting with a clear, honest understanding of what that audience actually cares about - not what your internal stakeholders want to say, but what your prospects and clients need to hear. The best B2B video is built around genuine audience insight, not internal messaging priorities. That's a distinction we push hard on during briefing." },
          { q: "Can video help us with account-based marketing?", a: "Absolutely. Highly targeted, personalised video content is one of the most effective tools in an ABM programme. Whether it's bespoke films for specific target accounts or a suite of content tailored to particular sectors or buyer types, we can help you build a video strategy that supports your ABM objectives." },
        ] },
      { slug: "documentary", href: "/services/documentary", num: "04", title: "Documentary", desc: "Real stories, told with depth, craft and the space they deserve.", img: "uploads/vlcsnap-2022-08-11-14h35m07s966-b6cd9118.webp", imgPosition: "78% 35%",
        lead: "Some stories are too rich, too complex and too important to be told in sixty seconds. Documentary is where you give them the space they deserve.",
        body: [
          "Documentary filmmaking is at the heart of what we do at Klaxon, and it's where we feel most at home. There's a particular kind of skill involved in finding the truth of a story, earning the trust of the people at the centre of it, and shaping the material into something that holds an audience from beginning to end. It's a discipline that rewards patience, curiosity and a genuine commitment to the craft.",
          "We work across a broad spectrum of documentary formats, from short-form brand documentaries that tell a compelling human story in five to ten minutes, to longer productions for broadcasters, institutions and independent commissioners. Whatever the length or the subject, our approach is the same: get close to the story, listen carefully, and let the material lead.",
          "That means taking the time to properly research and develop each project before filming begins, building the kind of relationships with contributors that allow real moments to surface on camera, and bringing the same rigour to the edit that we bring to everything else. A documentary lives or dies in the cutting room, and we know how to shape complex, layered material into something coherent, moving and impossible to look away from.",
          "If you have a story worth telling, we'd love to hear it.",
        ],
        includes: ["Documentary Video Production UK", "Brand Documentary London", "Short Film Production UK", "Observational Documentary", "Biographical Film", "Broadcast & Streaming", "Archival Documentary"],
        faqs: [
          { q: "How do you develop a documentary concept from an initial idea?", a: "We start with a period of research and development - exploring the story, identifying the key contributors, and establishing whether the material has the depth and access required to sustain a documentary. This development phase is essential and often shapes the final form of the film significantly. We work collaboratively with clients throughout and won't commit to a full production until we're confident the story is there." },
          { q: "How do you approach gaining access and building trust with contributors?", a: "Carefully and honestly. Contributors need to understand what they're agreeing to, how the material will be used, and that they can trust the people filming them. We take time to build those relationships before filming begins, and we maintain them throughout the process. The quality of what appears on screen is directly proportional to the quality of the trust we've established." },
          { q: "What's the typical length for a brand documentary?", a: "Brand documentaries typically run between five and fifteen minutes, though the right length is always determined by the story rather than a pre-set format. We'd rather make a tight, compelling eight-minute film than pad a story to twenty minutes for the sake of it. For broadcaster or streaming contexts, we'd work to whatever format specifications apply." },
        ] },
      { slug: "product", href: "/services/product", num: "05", title: "Product", desc: "Your product, looking extraordinary. Because in a crowded market, extraordinary sells.", img: "uploads/vlcsnap-2024-06-10-16h08m14s922-527136a3.webp", imgPosition: "68% 55%",
        lead: "A great product video doesn't just show what something does. It makes people want to own it.",
        body: [
          "There's a deceptively fine line between a product film that converts and one that simply informs. The difference lies in how the product is presented, the way it's lit, the way it moves, the angles chosen to reveal its best qualities, and the narrative built around it that connects its features to the desires of the person watching. Get those things right and a product video becomes one of the hardest-working assets in your entire marketing toolkit.",
          "At Klaxon, we've shot products across a huge range of categories, from automotive and consumer electronics to food and drink, luxury goods and lifestyle brands. Each brings its own visual language, its own set of technical challenges, and its own audience expectations. We understand what great looks like across all of them, and we know how to get there.",
          "We work closely with your creative and marketing teams to ensure the film reflects your brand identity as precisely as it showcases the product itself. Because product content isn't just about the object in front of the lens, it's about the world your brand inhabits and the story it tells about the people who choose it.",
          "Whether it's a hero launch film, an e-commerce asset or a suite of social content, we make your product look extraordinary. Because in a crowded market, extraordinary is what sells.",
        ],
        includes: ["Product Video Production London", "Product Launch Video", "E-Commerce Video Production", "360 Degree & Detail Shots", "Lifestyle & In-Context Filming", "Social Cutdowns", "Product Film Production UK"],
        faqs: [
          { q: "Do you handle the styling and art direction for product shoots?", a: "Yes. For product shoots, art direction - the way products are styled, the surfaces and props used, the overall visual world of the shoot - is as important as the cinematography itself. We either handle this in-house or bring in specialist stylists depending on the nature of the product and the scale of the production." },
          { q: "Can you produce both hero films and cutdown social assets from the same shoot?", a: "Absolutely, and we'd always recommend planning for this from the outset. Capturing the additional material needed for social cutdowns while you already have everything set up is significantly more cost-effective than returning for a separate shoot. We factor this into the production plan from day one." },
          { q: "Do you have studio space for product filming?", a: "We work with a range of studio spaces in London and can recommend facilities suited to your specific product and production requirements. We'll advise on the best option based on the scale of your shoot and the visual style you're aiming for." },
        ] },
      { slug: "sport", href: "/services/sport", num: "06", title: "Sport", desc: "Fast, raw and emotionally charged. Content that captures what makes sport worth watching.", img: "uploads/vlcsnap-2024-06-11-15h53m44s510-b8acf4f5.webp", imgPosition: "84% 30%",
        lead: "Sport is raw, unpredictable and emotionally charged. Capturing it properly demands filmmakers who can keep up, technically, creatively and physically.",
        body: [
          "There's a reason sport produces some of the most compelling content in the world. The drama is real, the emotions are genuine, and the moments are unrepeatable. But that same spontaneity makes it one of the most demanding environments to film in. The margins are tight, the action is fast, and you rarely get a second chance at the shot that defines the story. Experience matters enormously here.",
          "At Klaxon, we've worked with some of the biggest names in sport, from global governing bodies and elite clubs to individual athletes and grassroots organisations. We understand the rhythms of a sporting environment, we know how to work within the access and accreditation constraints that come with it, and we have the technical capability to capture the pace, the power and the emotion that makes sport worth watching.",
          "But great sports content is about more than the action. It's about the people, the dedication, the sacrifice, the personality that exists behind the performance. We're as comfortable building a long-form athlete documentary as we are shooting a high-octane brand campaign or delivering live event coverage for broadcast.",
          "Whatever the sport, whatever the format, we bring a genuine passion for what we're filming. And that shows in everything we make.",
        ],
        includes: ["Sports Video Production London", "Sports Content Agency UK", "Athlete Profile Video", "Brand & Sponsorship Content", "Event & Match Coverage", "Sports Broadcast Production", "Social & Campaign Content"],
        faqs: [
          { q: "Can you film at professional sporting events and venues?", a: "Yes. We're experienced in working with the access, accreditation and operational constraints that come with professional sporting environments. We know how to navigate the protocols involved and work effectively within them and we have established relationships with a number of governing bodies, clubs and event organisers." },
          { q: "Do you produce event coverage as well as pre-produced content?", a: "Yes. Alongside pre-produced athlete profiles, brand campaigns and documentary content, we cover live sporting events - capturing the action, the atmosphere and the moments that make great sports content. We're comfortable working in fast-paced event environments where you rarely get a second chance at the shot." },
          { q: "Can you work with amateur and grassroots sport as well as elite level?", a: "Absolutely. Some of the most compelling sports content we've produced has been at grassroots level, where the emotional stories are often more accessible and the production logistics more straightforward. The same standards of craft apply regardless of the level." },
        ] },
      { slug: "health-sector", href: "/services/health-sector", num: "07", title: "Health Sector", desc: "Sensitive, accurate and compelling content for complex healthcare communications.", img: "uploads/vlcsnap-2024-06-13-15h25m53s540-79506618.webp", imgPosition: "88% 58%",
        lead: "Healthcare is one of the most important communication challenges there is. The stakes are real, the audiences are diverse, and the need to get the message right is absolute.",
        body: [
          "Video has transformed the way health organisations communicate, with patients, with professionals, with policymakers and with the public. Done well, it simplifies complex information, builds trust in sensitive situations, and reaches people in ways that written content simply cannot. Done poorly, it risks undermining the very credibility it was meant to establish. At Klaxon, we understand the particular responsibilities that come with working in the health sector. We're experienced in navigating the compliance considerations, the ethical sensitivities and the approval processes that are part and parcel of producing content in this space. We work collaboratively with clinical, marketing and communications teams to ensure that every film is not only compelling to watch but accurate, appropriate and fully signed off.",
          "We bring the same creative ambition to health sector work as we do to any other production, because patients and professionals deserve content that respects their intelligence and holds their attention. Whether we're producing patient education films, internal training content, corporate communications for a pharmaceutical brand or public health campaigns, we approach each project with the care and rigour the subject matter demands.",
          "Healthcare audiences are not a captive market. They have to choose to engage. We make content worth choosing.",
        ],
        includes: ["Healthcare Video Production UK", "Patient Education Video", "Medical Video Production London", "Training & CPD", "Pharmaceutical Video Production", "Public Health Campaigns", "Corporate & Investor Relations"],
        faqs: [
          { q: "How do you handle compliance and approval requirements in healthcare video production?", a: "We build compliance into the production process from the very beginning, not as an afterthought. That means working with your regulatory and medical affairs teams during scripting and concept development, building sufficient review time into the production schedule, and ensuring all claims and references are properly evidenced and signed off by your compliance team before filming begins. We're experienced in the approval processes common to pharmaceutical, medical device and NHS organisations." },
          { q: "Can you produce patient-facing content in multiple languages?", a: "Yes. We regularly produce multilingual versioning, including on-screen translation, subtitling and voiceover in multiple languages, for organisations serving diverse patient populations." },
          { q: "Do you work with NHS organisations as well as private healthcare and pharmaceutical companies?", a: "Yes. We work across the full spectrum of the health sector, from NHS trusts and public health bodies through to pharmaceutical companies, medical device manufacturers and private healthcare providers." },
        ] },
      { slug: "podcast", href: "/services/podcast", num: "08", title: "Podcast", desc: "Strategy, production and delivery for shows built to find and keep an audience.", img: "uploads/pexels-abdellahbnz-33923596.webp",
        lead: "Podcast has become one of the most powerful content formats of our time. The question isn't whether your brand should have one, it's whether yours is good enough to deserve an audience.",
        body: [
          "The podcast landscape is vast and it's competitive. Millions of shows are vying for the same ears, and listeners have neither the time nor the patience for content that doesn't immediately earn their attention. The brands and organisations that are winning in this space aren't just publishing episodes, they're creating genuinely compelling audio experiences that people actively seek out and recommend to others.",
          "At Klaxon, we help brands develop and produce podcasts that are built to perform. That starts long before a microphone is switched on, with a clear editorial strategy, a format that suits both the subject matter and the audience, and a strong enough creative concept to sustain a series rather than just a one-off. Good intentions and interesting topics aren't enough. The craft has to be there too.",
          "We work with brands, institutions and broadcasters across a range of podcast formats, from interview-led series and panel discussions to narrative productions and documentary podcasts.",
          "We handle everything from concept development and guest research through to recording, editing, sound design and distribution-ready delivery.",
          "Because a podcast that finds its audience is one of the most cost-effective, high-impact content investments a brand can make. We help you make one worth finding.",
        ],
        includes: ["Podcast Production Company London", "Brand Podcast Production UK", "Interview Series", "Panel & Discussion Formats", "Narrative & Documentary Podcasts", "Internal Podcasts", "Podcast Series Production"],
        faqs: [
          { q: "How many episodes do we need to commit to before launching a podcast?", a: "We'd typically recommend launching with a minimum of three to five episodes already produced - giving new listeners enough content to get a genuine sense of the show before you've committed to an ongoing schedule. For series-based formats, we'd plan a full series of six to ten episodes at the outset, which also gives you the best chance of being featured or promoted by podcast platforms." },
          { q: "How do we grow a podcast audience?", a: "Distribution and promotion are as important as the content itself. That means getting your show onto all major platforms (Spotify, Apple Podcasts, Amazon Music), optimising your show notes and episode titles for search, repurposing audio content into social clips, and integrating the podcast into your wider content and marketing strategy. We advise on all of this as part of the production process." },
          { q: "What makes a branded podcast different from a marketing podcast?", a: "A branded podcast puts audience value first - it's content people choose to listen to because it's genuinely useful, entertaining or illuminating, not because it's selling something. A marketing podcast, in the pejorative sense, is essentially an extended advertisement. The former builds lasting audience relationships; the latter rarely survives beyond a few episodes. We only make the former." },
        ] },
      { slug: "social-content", href: "/services/social-content", num: "09", title: "Social Content", desc: "Platform-native video built to stop the scroll and keep your brand in the conversation.", img: "uploads/Channel 4 x Boots Great British Summer crop.webp",
        lead: "Social media has raised the bar for video content in ways that even broadcast television hasn't. Three seconds to grab attention. No second chances.",
        body: [
          "The social landscape is unforgiving. Audiences are scrolling fast, algorithms are ruthless and the competition for attention has never been more intense. In that environment, content that is merely competent gets ignored. Content that is genuinely arresting, surprising or emotionally immediate gets watched, shared and remembered. The gap between the two isn't luck, it's craft.",
          "At Klaxon, we create social video content that is built for the platform it lives on from the very first frame. That means understanding the specific demands of each channel, the formats, the behaviours, the culture, and developing content that feels native rather than repurposed. A brand film cut down to sixty seconds for Instagram is not a social strategy. Original content conceived for social from the ground up is.",
          "We work with brands to develop social content that is creatively ambitious without losing sight of the commercial objectives behind it. Whether that's a series of short-form films, a campaign launch, reactive content that taps into cultural moments, or an always-on content programme that keeps your brand present and relevant, we bring the same production values and creative thinking to social as we do to any other format.",
          "Because your audience doesn't lower their standards just because they're on their phone. Neither do we.",
        ],
        includes: ["Social Media Video Production London", "Short-Form Video Production", "Reels & TikTok Content", "Campaign Content", "Always-On Programming", "Paid Social Assets", "Instagram Video Production", "Social Video Content Agency UK"],
        faqs: [
          { q: "Should we be producing different content for each social platform?", a: "Ideally, yes, and the difference goes beyond just changing the aspect ratio. Each platform has its own content culture, audience behaviour and algorithm logic. Content that feels native on TikTok will feel out of place on LinkedIn. We help brands understand the specific demands of each platform and develop content strategies that are genuinely tailored rather than just reformatted." },
          { q: "How do we balance quality with the volume of content social media demands?", a: "This is one of the central challenges of social content strategy. The answer usually involves a tiered approach - investing in a smaller number of high-production hero pieces alongside a higher volume of lighter, more reactive content that can be produced more efficiently. We help brands find the right balance for their specific objectives and resources." },
          { q: "How quickly can you turn around social content?", a: "For reactive or time-sensitive content, we can turn around simple social cuts very quickly, sometimes within 24 to 48 hours of a shoot. For planned campaign content, we'd build a production and delivery schedule that fits your publishing calendar. We're experienced at working to tight social deadlines without compromising on quality." },
        ] },
      { slug: "explainer-video", href: "/services/explainer-video", num: "10", title: "Explainer Video", desc: "Complex ideas, made simple. Clear communication is a competitive advantage.", img: "uploads/A5E57E6A-967C-479D-8994-F7C78C351630-2-93ad9c3b.webp",
        lead: "Complex ideas, simply told. That's the art of a great explainer video - and it's harder than it looks.",
        body: [
          "Explainer videos have become one of the most widely used formats in marketing and communications. The reason is simple: nothing cuts through complexity faster than a well-crafted film that takes a difficult concept and makes it immediately clear. Whether you're explaining a product, a service, a process or a proposition, the right explainer video can do in sixty seconds what a brochure, a webpage or a sales presentation can't do in ten minutes.",
          "At Klaxon Studio, we produce explainer videos for brands, technology companies, financial services organisations, healthcare businesses and anyone else whose offer needs a little unpacking. We start with the same question on every project: what's the single most important thing the audience needs to understand? Everything else follows from there.",
          "That discipline, the ability to distil, simplify and communicate with clarity, is what separates explainer videos that actually work from the ones that add more confusion than they remove. It requires strong scriptwriting, clean visual thinking and the creative confidence to leave things out.",
          "We produce explainer videos across a range of formats; live action, animation, motion graphics, or hybrid approaches that combine elements of all three. We'll recommend the format that best serves the content and the audience, not the one that happens to be easiest to produce.",
          "Clear communication is a competitive advantage. A great explainer video is one of the most cost-effective ways to achieve it.",
        ],
        includes: ["Explainer Video Production London", "Animated Explainer Videos", "Motion Graphics", "Live Action Explainer Videos", "Product Explainer Videos", "SaaS & Technology Explainer Videos", "Financial Services Video"],
        faqs: [
          { q: "How long should an explainer video be?", a: "The honest answer is: as long as it needs to be, and no longer. Most explainer videos perform best between sixty seconds and two minutes. Beyond two minutes, drop-off rates increase significantly unless the content is exceptionally compelling. We always challenge clients to be ruthless about what stays in - if it doesn't serve the core message, it shouldn't be there." },
          { q: "Which works better, animation or live action?", a: "It depends entirely on what you're trying to explain and who you're explaining it to. Animation is excellent for abstract concepts, processes and products that don't physically exist or can't easily be filmed. Live action is often stronger for building trust and human connection, particularly in B2B or professional services contexts. A hybrid approach, combining live action with animated elements, often gives you the best of both. We'll recommend the right approach for your brief." },
          { q: "Can you help with the script as well as the production?", a: "Yes, in fact, the script is where we'd always start. A great explainer video is built on a great script. We work with you to develop messaging that is clear, accurate and engaging before we touch any visual elements. Getting the words right first makes everything that follows significantly more straightforward." },
          { q: "How much does an explainer video cost?", a: "Costs vary depending on the format, length and complexity. A straightforward animated explainer typically starts from around £3,000 to £5,000. A fully produced live action explainer with multiple locations and on-screen talent would be more. We provide detailed quotes for every project and will always recommend the most cost-effective approach to achieve your objectives." },
        ] },
      { slug: "automotive", href: "/services/automotive", num: "11", title: "Automotive", desc: "Car reviews, launch films and manufacturer content built by people who know cars.", img: "uploads/vlcsnap-2022-07-09-13h14m40s020-ff1d4201.webp", imgPosition: "67% 60%",
        lead: "Automotive content lives or dies on craft. Get the camera work, the locations and the pace right, and a car review or launch film becomes something people genuinely want to watch.",
        body: [
          "Cars are one of the most demanding things to film well. The angles that make a vehicle look fast standing still, the choreography of a car-to-car shoot at speed, the light that makes paintwork sing, none of it happens by accident. It takes riggers who know how to mount a camera safely at 70mph, drivers who can hold a precise line for take after take, and an edit that understands rhythm as much as it understands horsepower.",
          "At Klaxon, automotive is where a lot of our team cut their teeth, and it shows. We've shot everything from official manufacturer launch films and multi-day international press drives to fast-turnaround car reviews and social-first content for dealerships and aftermarket brands. We know the specific demands of automotive production: closed-road logistics, tracking vehicles, low-loaders, drone-to-ground handoffs, and the insurance and safety planning that has to sit behind all of it.",
          "We work with manufacturers, dealership groups, motoring publications and automotive brands to produce content that respects what makes a car genuinely interesting, not just a spec sheet read aloud over b-roll. Whether that's a car-to-car chase sequence, a static studio reveal, or a presenter-led review shot on location, we bring the same technical rigour and the same eye for what makes a vehicle worth watching.",
          "If it has an engine, a badge and a story worth telling, we want to film it.",
        ],
        includes: ["Automotive Video Production London", "Car Review Production UK", "Car-to-Car Filming", "Vehicle Launch Films", "Manufacturer & Press Drive Content", "Dealership & Aftermarket Video", "Closed-Road & Track Filming"],
        faqs: [
          { q: "Do you have experience with car-to-car filming and closed-road shoots?", a: "Yes, extensively. Car-to-car filming requires specialist rigging, experienced precision drivers and careful safety planning, and we've built up real expertise in this over many productions. We handle the logistics of closed-road access, tracking vehicles and camera cars, and we work with accredited rigging and safety teams throughout." },
          { q: "Can you produce content for an official manufacturer launch?", a: "Yes. We've worked on official launch films and press drive content for major manufacturers, which comes with its own set of demands, brand guidelines, embargo dates, technical accuracy on specifications, and a level of visual polish that has to match the manufacturer's own marketing. We're comfortable operating within those constraints." },
          { q: "What's the difference between a car review and a launch film?", a: "A car review is typically presenter-led and editorial in tone, walking an audience through the driving experience, the design and the specification, often for a publication or platform's own channel. A launch film is a more controlled, brand-owned piece introducing a new model, usually with tighter creative direction from the manufacturer. We produce both, and the approach to camera work, pacing and tone differs accordingly." },
          { q: "Do you film at race circuits and motorsport events?", a: "Yes. We've filmed at circuits including Goodwood and other motorsport venues, covering everything from track day content to event coverage. We understand circuit access requirements, marshalling and the safety protocols that come with filming live motorsport." },
        ] },
];

// ── Founders ──

export const founders: Founder[] = [
      { id: "kx-f-charlie", name: "Charlie", role: "Co-Founder · Producer / Director", img: "uploads/founder_charlie.webp", imgPositionY: "9%", imgPositionYDesktop: "0%", bio: [
        "Charlie has been behind the camera since 2009. In that time he's shot TV commercials, cinematic sport, and pretty much everything in between. He's filmed in 23 countries in a single year, survived 48°C desert heat with no water on the border of Saudi Arabia, nearly stepped on a landmine in Croatia, and somehow still considers a highlight to be shooting at an industrial estate in Slough.",
        "These days Charlie is a filmmaker in the truest sense of the word. He takes the brief, shapes the creative and plans all things pre-production before moving onto the shoot as a DP and makes sure the finished film does exactly what it's supposed to. Start to finish, the whole thing.",
        "Outside of work he's a devoted Arsenal fan who plays football three days a week. It's unclear whether this is a passion or a coping mechanism. He owes his entire career to a teacher at school who pointed him towards the media industry. Mr Hawxwell has a lot to answer for.",
      ] },
      { id: "kx-f-jake", name: "Jake", role: "Co-Founder · Director of Photography", img: "uploads/founder_jake.webp", imgPositionY: "18%", imgPositionYDesktop: "76%", bio: [
        "Jake has been professionally pointing cameras at things since 2009. Originally from Dirranbandi, a town of 400 people in the middle of the Australian bush, he moved to London for two years about ten years ago. He's still here.",
        "Before co-founding Klaxon, Jake spent over a decade as a freelance DP, getting paid to carry expensive cameras to places most people only see on TV. National Geographic, Discovery, ITV, Food Network. Chopper rides through the New Zealand wilderness, dog sledding in Iceland, street food markets in Bangkok.",
        "At Klaxon, Jake is the workhorse. He takes the long shoots, the far-flung locations, and somehow keeps every piece of kit in perfect working order when he gets back. That's a lot of air miles and a lot of questionable hotels.",
        "Outside of work you'll find him sipping a flat white in Victoria Park or cycling the canals with Pops, the world's most well-travelled studio dog.",
      ] },
      { id: "kx-f-matt", name: "Matt", role: "Co-Founder · Director", img: "uploads/founder_matt.webp", imgPositionY: "25%", imgPositionYDesktop: "100%", bio: [
        "Matt has been shooting and directing across the world for over a decade. He's filmed in food markets in Hanoi, the restricted nuclear zone in Fukushima, and convinced celebrities to play tennis at the Royal Albert Hall. Starting out as a Camera Operator, he made the natural move into directing, producing and creative development, giving him an overview of the entire production process that very few people in the industry can match.",
        "At Klaxon, Matt works alongside Charlie on pitches and creative strategy. He has an exceptional ability to cut through the waffle, get straight to the point, and make sure every project delivers what the client actually needs. On shoots, Matt puts the creative to good use and directs crew, talent and clients(!) to ensure the final rushes meet the idea.",
        "Outside of work Matt is a devoted Arsenal fan, an F1 obsessive, a BigJet TV evangelist (yes it is cool, apparently), and a man who describes himself as a runner despite all available evidence suggesting otherwise. He also holds extremely strong opinions on the correct way to make a cup of tea. Non-negotiable. The rest of the office is always wrong and he will not be taking questions.",
      ] },
      { id: "kx-f-james", name: "James", role: "Co-Founder · Post-Production Lead", img: "uploads/founder_james.webp", imgPositionY: "21%", imgPositionYDesktop: "100%", bio: [
        "James is the man in the dark room. Originally from a post-production background, he has worked across TV, online campaigns, branded content and commercials and has spent the best part of his career making other people's footage look considerably better than it has any right to.",
        "At Klaxon, James is the backbone of every project. Post-production, workflow, tech, podcast production. If it happens after the shoot, it goes through James. The others would be completely lost without him, though you'll rarely hear them admit it.",
        "Outside of work James can be found sipping a cold pint in a beer garden, cooking ambitious dishes at home, or going for a hike to justify the previous two. He is also a Chelsea fan, which means he endures a level of daily mockery from Charlie and Matt that would break a lesser man. He takes it with dignity. His revenge is coming. Someday.",
      ] },
];

// ── Sectors ──

export const sectors: string[] = ["Finance", "Automotive", "Broadcast", "Heritage", "Food & Drink", "Sport", "Health", "Charity", "Consumer", "B2B"];

// ── Clients (logo strip) ──

export const testimonials: Testimonial[] = [
      { quote: "Worked with Jake, Charlie and team on a couple of shoots - both creative and talking heads. Seriously dedicated and enterprising guys, who dovetailed perfectly with our creative team.", name: "Benedict Buckland", role: "CEO, Alan Agency", source: "Google review" },
      { quote: "I have worked and employed Klaxon on a number of occasions for various shoots and edits, I cannot fault the team.", name: "Ryan Gudge", role: "Producer, The Telegraph", source: "Google review" },
      { quote: "I've worked with Charlie, Jake and the team at Klaxon Studio for a number of years. A truly fantastic team who we love to collaborate with. They're attentive, creative and a true joy to work with.", name: "Charlotte Birch", role: "Senior Production Manager, Sunset + Vine", source: "Google review" },
      { quote: "We've worked with Klaxon for a number of years as our trusted video production outfit. Charlie and his incredibly professional team consistently provide an output of work at the highest quality.", name: "Ben Wackett", role: "Head of Marketing, Enso Sports Club", source: "Google review" },
      { quote: "Working with Klaxon could not have been a more seamless process. They delivered an intuitive and creative pitch, and produced exactly what was needed. I'd happily recommend them if you need a slick and friendly studio to handle everything from start to finish!", name: "Cherie Bridges", role: "Senior Producer, Historic England", source: "Google review" },
      { quote: "I've worked with Klaxon over the years and all of the team. They have been involved in many projects either running them for me or alongside as an integrated production. These are my go to London Based Video Production Company as they actually care about what they produce and have the passion which shows in their content.", name: "Andy Mackenzie", role: "Head of Digital Video, The Telegraph", source: "Google review" },
];

// ── Contact ──

export const contactRows: ContactRow[] = [
      { label: "Email", value: "hello@klaxon.studio", href: "mailto:hello@klaxon.studio", target: "_self" },
      { label: "Phone", value: "+44 (0) 208 0580 669", href: "tel:+442080580669", target: "_self" },
      { label: "Studio", value: "Unit 408, Cocoa Studios, The Biscuit Factory, 100 Drummond Road, London SE16 4FA", href: "https://maps.google.com/?cid=14804452344662294871", target: "_blank" },
      { label: "Social", value: "@klaxonstudiouk", href: "https://instagram.com/klaxonstudiouk", target: "_blank" },
];

// ── Footer ──

export const footerCols: FooterCol[] = [
  { title: "Studio", links: [
    { label: "Work", href: "/work" },
    { label: "Services", href: "/services" },
    { label: "About", href: "/about" },
    { label: "London", href: "/london" },
    { label: "Pricing", href: "/pricing" },
    { label: "Contact", href: "/contact" },
  ] },
  { title: "Resources", links: [
    { label: "FAQs", href: "/faqs" },
    { label: "Glossary", href: "/glossary" },
    { label: "Sustainability", href: "/sustainability" },
  ] },
  { title: "Services", links: [
    { label: "Ideation & Creative", href: "/services/ideation" },
    { label: "Filming", href: "/services/filming" },
    { label: "Editing", href: "/services/editing" },
    { label: "Podcast Recording", href: "/services/podcast-recording" },
    { label: "Production Management", href: "/services/production-management" },
    { label: "UK Production Services", href: "/services/uk-production-services" },
  ] },
  { title: "Connect", links: [
    { label: "Email", href: "mailto:hello@klaxon.studio" },
    { label: "Instagram", href: "https://instagram.com/klaxonstudiouk", target: "_blank" },
    { label: "LinkedIn", href: "https://www.linkedin.com/company/klaxon-studio", target: "_blank" },
  ] },
];

// ── London page ──

export const londonData: LondonData = {
  "lead": "London's a competitive market. We know, because we've been making videos here for years.",
  "body": [
    "As a video production company based in London, Klaxon Studio works with brands, agencies and organisations across the City - from established names in the city centre, through to ambitious companies in east London's creative corridor and beyond.",
    "We know the locations, we know the logistics, and we know what it takes to produce exceptional content in one of the world's most demanding production environments. London presents both enormous opportunity and genuine complexity for video production.",
    "The access requirements, location permits, traffic logistics and sheer density of the city mean that productions here require a level of local knowledge and operational precision that you can only develop through experience. We've spent years building that experience - and the network of trusted London-based crew, suppliers and location contacts that comes with it.",
    "We produce the full range of video content for London clients, from brand films, corporate videos and social content through to documentaries, product films and broadcast productions.",
    "London also means access to an extraordinary range of filming locations such as iconic architecture, world-class studios, diverse neighbourhoods and some of the most visually distinctive urban environments on the planet. We know how to make the city work for your production, not against it.",
    "If you're looking for a video production company in London that combines genuine creative quality with the operational expertise to deliver the city, we should talk."
  ],
  "includes": [
    "Video Production Company London",
    "Brand Film Production London",
    "Corporate Video Production London",
    "Branded Content Agency London",
    "Social Media Video Production London",
    "Documentary Filmmakers London",
    "Film Crew London",
    "Post Production London"
  ],
  "faqs": [
    {
      "q": "Where in London are you based?",
      "a": "We're based in Bermondsey, South London and work across the whole city and the wider South East. We're equally comfortable filming in the City, the West End, east London, south London and anywhere else a project takes us. For productions outside London, we have crew and contacts across the UK."
    },
    {
      "q": "Do you work with London-based businesses exclusively?",
      "a": "Not at all. While a significant part of our work is with London clients, we produce content for organisations across the UK and internationally. London is our home base, but our work takes us well beyond it on a regular basis."
    },
    {
      "q": "What types of London businesses do you typically work with?",
      "a": "We work across a very wide range of sectors including financial and professional services, technology, consumer brands, hospitality, sport, healthcare, charity and more. What our clients have in common isn't sector but ambition - they want to make video content that is genuinely good, not just adequate. That's who we're built for."
    },
    {
      "q": "Can you help with filming permits for London locations?",
      "a": "Yes. London has specific permitting requirements - the Royal Parks, TfL-managed locations, the City of London and many private locations all have their own processes. Navigating these efficiently is something we do regularly and are well practised at. We handle the permit process as part of our production management service."
    }
  ]
};

// ── FAQs page ──

export const faqsData: FaqsData = {
  "lead": "Got a question? We've probably been asked it before!",
  "intro": "Video production can feel like unfamiliar territory if you haven't commissioned it before and even experienced clients sometimes want a straight answer to a straightforward question. Here are the ones we get asked most often.",
  "sections": [
    {
      "heading": "Getting started",
      "qas": [
        {
          "q": "How do I commission a video with Klaxon Studio?",
          "a": "The simplest starting point is a conversation. Get in touch with a rough outline of what you're looking for, even if it's just a problem that needs solving rather than a fully formed brief, and we'll set up a call to talk it through. From there we'll develop a proposal covering creative approach, production plan and budget. We don't need everything figured out upfront; some of our best projects have started with very little more than an idea."
        },
        {
          "q": "What information do I need to get a quote?",
          "a": "The more context you can give us the better, but you don't need to have everything worked out. Helpful things to know upfront include: what the video is for, who the audience is, where it will be used, any sense of budget, and when you need it delivered. If you're not sure about some of those things yet, that's fine, we can help you work through them as part of the briefing process."
        },
        {
          "q": "How do we know if video is the right solution for what we're trying to achieve?",
          "a": "It usually is, but the format, length and approach matter enormously. A well-made sixty-second film and a poorly conceived ten-minute production can have completely opposite effects on an audience. That's why we always start with the objective rather than the output. If video is the right tool for what you're trying to achieve, we'll tell you. If a different approach would serve you better, we'll tell you that too."
        },
        {
          "q": "Do you work with clients who have never commissioned video before?",
          "a": "Yes, and we enjoy it. First-time commissioners often bring a freshness to the briefing process that's genuinely valuable; they ask the questions that more experienced clients sometimes stop asking. We take the time to explain each stage of the process clearly and make sure you always know what's happening and why."
        }
      ]
    },
    {
      "heading": "Working with us",
      "qas": [
        {
          "q": "What size of businesses do you work with?",
          "a": "We work with organisations of all sizes, from ambitious startups and growing SMEs through to global corporates, broadcasters and household name brands. The common thread isn't size but ambition: our clients want to make video content that is genuinely good, and they understand the value of investing in getting it right."
        },
        {
          "q": "How involved do we need to be in the production process?",
          "a": "As involved as you want to be. Some clients prefer to hand over a brief and trust us to run with it, checking in at key approval stages. Others want to be closely involved throughout. We're comfortable working either way. We'll agree a communication and approval process at the start of the project that works for your team."
        },
        {
          "q": "Do you sign NDAs?",
          "a": "Yes. We're happy to sign non-disclosure agreements before discussions begin if you're sharing commercially sensitive information as part of the briefing process. Just let us know and we'll sort it before the first call."
        },
        {
          "q": "Can we see examples of your previous work before we commit?",
          "a": "Yes, our showreel and case studies are on the website, and we're happy to share more specific examples relevant to your sector or project type on request. If you'd like to see work we've produced for clients in a similar space to yours, just ask."
        }
      ]
    },
    {
      "heading": "Production",
      "qas": [
        {
          "q": "How long does it take to make a video?",
          "a": "It depends on the complexity of the project. A straightforward single-shoot film can move from brief to delivery in two to three weeks. A more complex production involving multiple locations, contributors or a significant post-production workload would typically take six to ten weeks. We'll always give you a realistic timeline upfront and flag early if anything looks like it might affect delivery."
        },
        {
          "q": "Do you handle everything in-house or do you use freelancers?",
          "a": "Both. We have a core in-house team that leads and oversees every project, supplemented by a trusted network of experienced freelance crew and specialists where the project demands it. Every person we bring onto a production, whether staff or freelance, is someone we know, have worked with before, and trust to deliver to our standards."
        },
        {
          "q": "Can you film anywhere in the UK?",
          "a": "Yes. We're based in London but regularly travel across the UK. We have crew contacts in most major cities and are comfortable coordinating productions anywhere in the country and internationally when required."
        },
        {
          "q": "Do you travel outside the UK?",
          "a": "Yes. While the majority of our work is UK-based, we have extensive experience filming internationally and are completely comfortable taking productions abroad. We've worked across a wide range of international locations and understand the requirements to coordinate a production outside of the UK - the logistics, the local considerations, and the planning required to make it run smoothly. If your project takes us overseas, we're ready for it."
        },
        {
          "q": "What happens if something goes wrong on a shoot day?",
          "a": "We plan thoroughly precisely so that the chances of something going wrong are minimised. But productions are unpredictable, and when things shift (and they sometimes do) our job is to solve the problem quickly and quietly without it becoming your problem. We'll always keep you informed and, where necessary, agree on the best way forward together."
        }
      ]
    },
    {
      "heading": "Budget and pricing",
      "qas": [
        {
          "q": "How much does a video cost?",
          "a": "The honest answer is that it varies enormously depending on what you're making. A simple interview-based film shot in a single location is a very different proposition to a multi-day commercial production with locations, talent and extensive post-production. As a rough guide, professionally produced video content from Klaxon typically starts from around £3,000 to £5,000 for straightforward projects, rising significantly for more complex productions. We provide detailed, transparent quotes for every project - get in touch and we'll give you an honest picture of what your project is likely to cost."
        },
        {
          "q": "Do you work with fixed budgets?",
          "a": "Yes. If you have a fixed budget, tell us what it is and we'll tell you honestly what we can deliver within it. We'd always rather have that conversation upfront than propose something that doesn't fit and waste everyone's time. Working to a defined budget often produces more creative solutions anyway."
        },
        {
          "q": "Do you require a deposit?",
          "a": "Yes. We typically require a deposit at the point of project confirmation, with the balance due on delivery. Full payment terms are set out in our Terms of Engagement, which we'll share as part of the project agreement."
        }
      ]
    },
    {
      "heading": "After delivery",
      "qas": [
        {
          "q": "What format will we receive the finished video in?",
          "a": "We deliver in whatever format or formats your project requires - broadcast masters, digital files, social-optimised versions and everything in between. We'll agree delivery specifications at the start of the project so there are no surprises at the end."
        },
        {
          "q": "Do you retain the project files after delivery?",
          "a": "We retain project files and master assets for an agreed period following delivery. If you think you might need to make changes or create additional versions in the future, it's worth discussing archiving arrangements at the outset. We'd always recommend clients keep their own copies of all final deliverables."
        },
        {
          "q": "Can we come back to you for additional versions or edits after the project is closed?",
          "a": "Yes. We're happy to produce additional versions, cutdowns or edits from existing projects. Depending on how much time has passed and what's required, we'd agree a cost for any additional work before proceeding."
        }
      ]
    }
  ]
};

// ── Sustainability page ──

export const susData: SustainabilityData = {
  "lead": "We make great content. We try not to cost the earth doing it.",
  "body": [
    "Klaxon Studio recognises its responsibility to protect the environment, and we aim to go beyond the minimum legal requirements across the UK. That means embedding sustainable practice into our business strategy and our day-to-day operations, including every aspect of our filming and production work, not treating it as a box to tick.",
    "Environmental awareness is the shared responsibility of every employee, freelancer and contractor we work with. Everyone on a Klaxon shoot is expected to consider the impact of their actions and contribute to the aims below."
  ],
  "aims": [
    "Complying with all applicable environmental laws, regulations and industry best practice.",
    "Continuously monitoring and improving our environmental performance.",
    "Reducing our environmental impact across the business, with particular attention to production activities.",
    "Encouraging and supporting our staff in adopting more sustainable working habits."
  ],
  "pillars": [
    {
      "num": "01",
      "title": "Paper use",
      "points": [
        "Minimise paper use across all operations and on set.",
        "Use recycled and recyclable paper wherever possible.",
        "Promote digital call sheets, scripts and production notes over printed ones.",
        "Reuse and recycle any paper we do use."
      ]
    },
    {
      "num": "02",
      "title": "Energy & water",
      "points": [
        "Reduce energy and water consumption in the office and on location.",
        "Use energy-efficient lighting, including LED, and avoid unnecessary generator use.",
        "Turn off lights, kit and electrical equipment when not in use.",
        "Source renewable energy where it's available."
      ]
    },
    {
      "num": "03",
      "title": "Office & set supplies",
      "points": [
        "Hire, borrow or repurpose equipment and materials before buying new.",
        "Prioritise low-impact, recyclable supplies.",
        "Avoid single-use plastics on set, including catering and water bottles.",
        "Reuse set dressing, props and costumes when possible."
      ]
    },
    {
      "num": "04",
      "title": "Filming & production",
      "points": [
        "Plan shoots with environmental impact in mind, limiting unnecessary travel, kit or location use.",
        "Use local crew, suppliers and locations wherever possible.",
        "Provide digital call sheets and production documents.",
        "Partner with vendors and venues that demonstrate sustainable practice."
      ]
    },
    {
      "num": "05",
      "title": "Transportation",
      "points": [
        "Encourage public transport, cycling or walking where practical.",
        "Promote remote collaboration tools to reduce unnecessary travel.",
        "Encourage car-sharing and low-emission vehicles for cast and crew.",
        "Offset carbon emissions where significant travel is unavoidable."
      ]
    },
    {
      "num": "06",
      "title": "Monitoring & improvement",
      "points": [
        "Regularly review and update our environmental practices and targets.",
        "Keep full compliance with all applicable regulations.",
        "Collect feedback from staff and production partners to find new areas for improvement."
      ]
    },
    {
      "num": "07",
      "title": "Culture & communication",
      "points": [
        "Review and update this policy at least once a year, or after significant operational change.",
        "Involve the team in developing and implementing the policy.",
        "Treat sustainability as part of good filmmaking practice, not a constraint on it."
      ]
    }
  ],
  "approved": "Approved by Matt Hill, Director",
  "reviewed": "Last reviewed 31 May 2025 · Next review 31 May 2026"
};

// ── Glossary page ──

export const glossaryData: GlossaryTerm[] = [
  {
    "t": "DoP (Director of Photography)",
    "d": "The person responsible for the look of a film: camera, lighting and framing. Also known as the cinematographer."
  },
  {
    "t": "Cinematography",
    "d": "The craft of lighting and capturing images on camera in a way that serves the story."
  },
  {
    "t": "Pre-Production",
    "d": "All the planning before a shoot, scheduling, casting, location scouting, permits and logistics."
  },
  {
    "t": "Production",
    "d": "The filming itself, when the crew, talent and equipment come together on set or location."
  },
  {
    "t": "Post-Production",
    "d": "Everything after the shoot, editing, colour grading, sound, graphics and final delivery."
  },
  {
    "t": "Colour Grading",
    "d": "The final picture stage, where the colour and tone of every shot is balanced and styled for a consistent, cinematic look."
  },
  {
    "t": "Sound Design",
    "d": "Creating and assembling the non-musical sounds in a film, from atmospheres to effects, so a scene feels real."
  },
  {
    "t": "Sound Mixing",
    "d": "Balancing and blending all the audio elements, dialogue, music and effects, into a clean final soundtrack."
  },
  {
    "t": "Dialogue Editing",
    "d": "Cleaning and shaping recorded speech so every line is clear and consistent."
  },
  {
    "t": "Foley",
    "d": "Everyday sound effects such as footsteps and handled props, recorded in sync to picture to make a scene feel tangible."
  },
  {
    "t": "Music Supervision",
    "d": "Sourcing, licensing and placing the right music for a film."
  },
  {
    "t": "Motion Graphics",
    "d": "Animated text, graphics and design elements used to explain ideas or brand a film."
  },
  {
    "t": "VFX (Visual Effects)",
    "d": "Imagery created or enhanced digitally that could not be captured in camera."
  },
  {
    "t": "Storyboarding",
    "d": "Sketching a film shot by shot before the shoot to plan the visuals."
  },
  {
    "t": "Scripting",
    "d": "Writing the words and structure that underpin a film."
  },
  {
    "t": "Location Scouting",
    "d": "Finding and assessing places to film against the creative and practical needs of a production."
  },
  {
    "t": "Permits",
    "d": "The official permissions required to film in many public and private locations."
  },
  {
    "t": "Multi-Camera Production",
    "d": "Filming with several cameras at once, used for events, interviews and live coverage."
  },
  {
    "t": "HDR (High Dynamic Range)",
    "d": "A delivery format with a wider range of brightness and colour for richer, more lifelike images."
  },
  {
    "t": "Versioning & Delivery",
    "d": "Producing a film in the different formats, lengths and aspect ratios each platform requires."
  },
  {
    "t": "Subtitling & Captioning",
    "d": "Adding on-screen text of the spoken audio for accessibility and silent viewing."
  },
  {
    "t": "Showreel",
    "d": "A short, edited sampler of a studio's best work."
  }
];

// ── Terms of Engagement ──

export const termsData: TermsData = {
  updated: "Updated 2025",
  sections: [
        { heading: "1. Definitions & Interpretations", items: [
          "1.1 The words 'Klaxon Studio' 'we' 'us' 'our' and 'ours' refer to Klaxon Studio Ltd, a UK registered Limited Private Company.",
          "1.2 The words 'client' or 'customer' refers to the party who commissioned and/or funded the work and/or any person or organisation acting on their behalf.",
          "1.3 The words 'deliverables' and 'master copy' refers to any work specified on the quote under 'deliverables' which is accepted by the client.",
          "1.4 The word 'services' refers to the scope of work to be supplied by Klaxon Studio to the customer as set out in the quote.",
          "1.5 The word 'order' refers to the customer's signed acceptance of the quote from Klaxon Studio.",
          "1.6 'Production start date' constitutes the very first day of work on a project.",
          "1.7 These terms and conditions apply to video production and/or creative services and/or animation and/or motion graphics and/or photography and/or audio recordings and/or post-production services and/or any other services, creative or otherwise, supplied by Klaxon Studio.",
          "1.8 Any words following the terms 'including', 'include', 'in particular', 'for example' or any similar expression, shall be construed as illustrative and shall not limit the sense of the words, description, definition, phrase or term preceding those terms.",
          "1.9 Any reference to 'in writing' or 'written' includes email.",
        ] },
        { heading: "2. Basis of Contract", items: [
          "2.1 It is the customer's responsibility to ensure that the quote is thoroughly read and understood before signing off the quote.",
          "2.2 By signing the quote / confirming in writing, the client is confirming it as an order.",
          "2.3 Any quote given is only valid for a period of 30 days from its date of issue.",
          "2.4 By signing Klaxon Studios' quote and/or confirming it in writing as an order, the customer automatically accepts these Terms and Conditions which forms the contract between Klaxon Studio and the customer.",
          "2.5 Once the quote is confirmed as an order, any amendments to the scope of work, however small, will be subject to a fee of an agreed amount prior to work taking place.",
          "2.6 Any samples, drawings, storyboards, photos or descriptive matter issued by Klaxon Studio are issued or published for the sole purpose of giving an approximate idea of the services described in them. They shall not form part of the Contract or have any contractual force.",
          "2.7 Klaxon Studio shall supply the services to the customer in accordance with the order. Klaxon Studio cannot be held liable for any errors after the customer has confirmed in writing that the deliverables are accurate and correct and should be posted, published or broadcast. Amendments to the order can be requested via email to us, such requests only being valid once acknowledged by Klaxon Studio in writing.",
          "2.8 Having agreed a fee, Klaxon Studio keep accurate and transparent information of costs relating to the client's project. If after scoping the project during pre-production stage it is apparent the scope of work has either greatly expanded or reduced beyond what was originally agreed, Klaxon Studio shall alert the client that we may be forced to commit more or less resources than budgeted, and come to a mutually satisfactory arrangement.",
        ] },
        { heading: "3. Production", items: [
          "3.1 Klaxon Studios' rates are based on a 10 hour working day (including breaks). These hours will never be split over one day or multiple days, nor will half day rates be issued.",
          "3.2 Working days that exceed 10 hours will incur overtime costs. This will be charged per hour at 1.5 x the hourly rate of all crew on site at their respective rates.",
          "3.3 If filming locations are being organised by the client, it is the client's responsibility to ensure that all Klaxon Studio production crew and supporting personnel have clear access to all locations required throughout the day. Delays to production as a result of inadequate access or facilities will be the responsibility of the client and may incur additional charges.",
          "3.4 When filming on location, such as the client's office, or at any venue arranged by the client, adequate insurance cover should be in place as verified by the client themselves.",
          "3.5 Klaxon Studio takes health & safety matters seriously and we reserve the right in all instances to remove any of our personnel and/or equipment from a location if we deem it to be unsafe or if our crew are subjected to abusive or aggressive behaviour. In such circumstances, the client will be fully liable for any costs incurred or subsequently arising as a result. Klaxon Studio will observe the site safety rules at all times and will liaise with the appropriate responsible person(s) named by the client.",
          "3.6 Klaxon Studio reserves the right to assign or sub-contract all or any part of its obligations to the client.",
        ] },
        { heading: "4. Delivery", items: [
          "4.1 Deliverables shall be fulfilled by Klaxon Studio in accordance with the deliverables stated in the order only.",
          "4.2 Klaxon Studio reserves the right to amend the Specification if necessary to comply with any applicable law or regulatory requirement, or if the amendment will not materially affect the nature or quality of the services. We shall notify the customer in any such event.",
          "4.3 Klaxon Studio reserves the right to refuse to use, publish, broadcast or otherwise any content or information which it considers (in its absolute discretion) to be obscene or unsuitable.",
          "4.4 From time to time Klaxon Studio may need to engage third party suppliers for specialist services outside of our offering including studio space, specialist kit, presenters, actors and voice over artists, etc. Many third party services require client approval in writing and this must be received by us before any engagement of these services takes place. Failure to comply with this process may cause a delay of final deliverables which is entirely at the risk of the client and is not the liability of Klaxon Studio.",
          "4.5 Klaxon Studio shall produce a rough cut of the edit for the client to view as well as provide the means for them to view it e.g. an URL link. Three rounds of amends to the edit are covered within the quote as standard. Extra amendments may incur extra fees at an agreed daily rate.",
          "4.6 Klaxon Studio shall produce one master copy of each agreed deliverable for the client to own in perpetuity. Should the client require further copies an additional charge may apply.",
          "4.7 All video files and assets produced by Klaxon Studio on the client's behalf will be stored until project completion at which time all assets will be archived for 6 months. After 6 months all project files and associated assets are automatically deleted. It's the client's responsibility to contact Klaxon Studio if they wish to extend the storage duration within the 6 month time frame. Extended storage will incur a fee.",
          "4.8 Please note that unless paid for, all assets are owned and stored at Klaxon Studio and are not transferable to the client without further agreement. All Deliverable assets will be sent at the time of project completion, further copies may incur a charge.",
        ] },
        { heading: "5. Payment & Late Payment Fees", items: [
          "5.1 Clients must pay 50% of the agreed fee as per order upfront (non-refundable) before work commences. (Klaxon Studio reserves the right to change the payment structure as it sees fit on a quote by quote basis).",
          "5.2 Klaxon Studio payment terms are strictly 30 days from the date of invoice.",
          "5.3 From time to time there may be the need to receive immediate payment for services. Such occasions will be agreed before commencement of the project by both the client and Klaxon Studio.",
          "5.4 We reserve the right to charge further interest and late payment fees as set out under the Late Payment of Commercial Debts (Interest) Act, 1998 if we are not paid according to our payment terms. An additional administration fee of £100 will be applied for each invoice that is late in being paid by the customer. Information is readily available at www.legislation.gov.uk.",
          "5.6 Klaxon Studio reserves the right to withhold delivery and/or any granting or continuation of usage licence of any current work if accounts are not current or overdue invoices are not paid in full. All grants of any licence to use our copyright material under this agreement are conditional upon receipt of payment in full which shall be inclusive of any and all outstanding additional costs, taxes, expenses, and fees, charges or the costs of administration of changes.",
          "5.7 Any invoice queries must be raised within 7 days of receipt.",
        ] },
        { heading: "6. Cancellations", items: [
          "6.1 Either party may terminate the order in writing no later than 14 days prior to the Production start date, without penalty.",
          "6.2 For orders where a 50% non-refundable deposit has been paid by the customer the following terms apply:",
          "In the case that the customer terminates the order 14 days or less prior to the Production start date the following charges (inclusive of the 50% non refundable deposit) will be payable to Klaxon Studio by the customer.",
          "i. Giving notice of cancellation less than 14 days and up to 48 hours before the Production start date will incur a fee payable by the client to cover all costs sustained by Klaxon Studio up to the point of cancellation.",
          "ii. Giving notice of cancellation 48 hours or less before the Production start date will incur a fee payable by the client to cover one hundred percent of the order total.",
          "6.3 In the case that no deposit was paid up front by the customer the following applies:",
          "If the customer terminates the order 14 days or less prior to the Production start date the following charges will be payable to Klaxon Studio",
          "i. Giving notice of cancellation less than 14 days before the Production start date will incur a fee payable by the client to cover all costs sustained by Klaxon Studio up to the point of cancellation.",
          "ii. Giving notice of cancellation less than 7 days before the Production start date will incur a fee payable by the client to cover fifty percent of the order total.",
          "iii. Giving notice of cancellation 48 hours or less before the Production start date will incur a fee payable by the client to cover one hundred percent of the order total.",
          "6.4 Klaxon Studio reserve the right to cancel or terminate a contract or agreed project if:",
          "i. The customer or organisation becomes insolvent or subject to bankruptcy proceedings.",
          "ii. The reputation of Klaxon Studio and anyone connected with Klaxon Studio could be damaged.",
          "6.5 The client may terminate the contract at any time by written notice of termination, and on settlement of account. When the client terminates the contract, they will remain liable to pay in full for all work previously undertaken and in progress by Klaxon Studio unless any other written agreement is reached in advance. This includes any creative and/or pre-production activity prior to filming. The cost of pre-production will have been agreed as part of the quote and is non-negotiable.",
        ] },
        { heading: "7. Copyright and Licensing", items: [
          "7.1 Klaxon Studio asserts its full rights as the copyright owner of all material that has been captured, processed and/or produced by us, whether or not such material forms part of a finished project. The copyright of all produced material is solely owned by Klaxon Studio and is protected under UK law.",
          "i. For productions commissioned to Klaxon Studio, Klaxon Studio assigns joint copyright/ownership and in perpetuity usage license for all platforms and territories for any final deliverables produced only.",
          "ii. Unless otherwise agreed in writing, Klaxon Studio will retain full copyright/ownership of all RAW assets created and produced for a project commissioned by the client.",
          "iii. If the client requires full copyright and ownership of material, please contact Klaxon Studio to discuss arrangements and terms in writing.",
          "7.2 Electronic project files (for editing, motion graphics and other associated audio and visual works) remain the property of Klaxon Studio and are not supplied to the client as standard. However, at the discretion of Klaxon Studio, files can be supplied for an additional fee equal to 20% of the project's full invoice value ex VAT (plus the cost of a hard drive and postage), unless agreed otherwise in writing or via email.",
          "7.3 Rushes (all RAW filmed footage) are not supplied to the client as standard. Rushes/video files can be supplied for an additional fee equal to 30% of the project's full invoice value ex VAT (plus the cost of a hard drive and postage), unless agreed otherwise in writing or via email.",
          "7.4 Where the client provides material to Klaxon Studio for inclusion in any project, including but not limited to logos, images, trademarks, video footage and audio, the relevant permission must be obtained in advance from the original copyright holder by the client. By accepting these Terms and Conditions, the client hereby indemnifies Klaxon Studio against any possible claims, disputes, expenses or similar that may arise from breaching any copyright laws or pre-existing Terms and Conditions attributed to the material.",
          "7.5 We reserve the rights to use any footage and related files from any client-commissioned project in our showreels and for other promotional purposes.",
          "7.6 Klaxon Studio assigns to the client a licence to use the signed off master copy in perpetuity in its complete delivered form only. We do not give permission for any material to be altered, edited or used as part of another production unless this is expressly agreed in writing with Klaxon Studio.",
        ] },
        { heading: "8. Intellectual Property", items: [
          "8.1 If the client rejects a concept, or proposal, all material must be returned intact to Klaxon Studio. The client may not use rejected material in whole or part, either in its original form or adapted/amended for future projects.",
          "8.2 When pitching for projects, but not being formally hired by a customer, 8.1 still applies.",
        ] },
        { heading: "9. Insurance", items: [
          "9.1 Klaxon Studio carries public liability insurance cover of ten million pounds. A copy of our insurance certificate can be provided on receipt of a request to our offices.",
          "9.2 Extended or upgraded specific project insurance cover can be provided if required upon request, provided this is agreed at the time of booking and included in the production brief. Any amendments required to insurance cover after confirming the quote as an order may incur additional charges.",
        ] },
        { heading: "10. Force Majeure", items: [
          "10.1 Klaxon Studio Ltd shall not be in breach of the agreement with the client or liable for any failure to fulfil its obligations to the client if such failure results from events, circumstances or causes beyond its reasonable control. This includes, but is not limited to, acts of terrorism, government acts, labour strikes, inclement weather and public health emergencies.",
          "10.2 In the event of inclement weather which in our opinion would pose a risk to health & safety of our personnel or equipment or has the potential to prevent successful video or audio capture, we reserve the right to change the date or time of filming to a more suitable date or time.",
          "10.3 In the event of filming being delayed or aborted due to the client's failure to adhere to the agreed dates, times, access, facilities, organisation or any other matter specified in the production brief, we reserve the right to reschedule the affected days and to charge for any additional costs which arise. No refund or credit will be given in respect of costs associated with the delayed or aborted original filming day(s).",
        ] },
  ],
};

// ── Blog posts (12) ──

export const pricingBands: PricingBand[] = [
      { key: "single", num: "01", name: "Single day shoot & edit", price: "£4,500", tag: "",
        includes: ["1 day shoot, one location, interviews and b-roll", "A small crew (DoP + sound)", "1 × 1–2 minute film", "Social cutdowns, versioned for your channels"],
        idealFor: "Interview-led brand content, talking-heads series, product films and simple case studies." },
      { key: "director", num: "02", name: "Director-led shoot & edit", price: "£9,500", tag: "Most briefs land here",
        includes: ["Two shoot days, multicam, across locations or setups", "Director-led, with a fuller crew", "A treatment and shot plan before we roll", "1 × 1.5–3 minute film + a family of social cutdowns"],
        idealFor: "Recruitment films, multi-stakeholder case studies, event-led content and founder stories." },
      { key: "full", num: "03", name: "Full production", price: "£18,000", tag: "",
        includes: ["Creative development and full pre-production", "Concept, treatment, scripting and storyboards", "Location scouting, casting and shoot logistics", "1 × 2–4 minute film + social cutdowns"],
        idealFor: "Corporate films, brand films and campaign content with more moving parts." },
];

export const pricingFaqItems: Faq[] = [
      { q: "Why does video production cost what it does?", a: "Because you're paying for skilled professionals - directors, camera operators, sound recordists, editors, colourists - along with professional equipment and more working time than people expect. A two-minute film might represent two or three weeks of work by the time everything is done properly." },
      { q: "Can you work within a fixed budget?", a: "Yes. If you come to us with a budget, we'll tell you honestly what's achievable within it. Sometimes that means scaling the brief, sometimes the budget fits exactly. Either way, you'll know upfront." },
      { q: "Do you charge for the initial conversation?", a: "No. We're happy to discuss your project, sense-check your budget, and give you a realistic picture of what's involved, before you've committed to anything." },
      { q: "What's included as standard?", a: "Every quote covers up to three rounds of edit amends, a master copy of each deliverable, and six months of asset archiving. Our rates are based on a ten-hour shooting day." },
      { q: "How and when do we pay?", a: "We ask for 50% upfront before work begins, with the balance due on delivery. Quotes are valid for 30 days, and once accepted, any change to the scope is agreed and re-priced before we proceed." },
];

export const servicesFaqItems: Faq[] = [
      { q: "Do you handle full production end to end, or can we bring you in for just one part?", a: "Both. Some clients want us from the first idea through to final delivery. Others already have an agency handling creative and just need a crew, an editor, or a colourist. We're built to slot in wherever the gap is, not just to run whole productions." },
      { q: "What types of video do you produce?", a: "Branded content, corporate video, B2B, documentary, sport, product, and automotive, alongside podcast production and social content. The format changes depending on what the story needs to do, but the production standard stays the same across all of them." },
      { q: "Do you only work in London, or can you film further afield?", a: "We're based in Bermondsey, London, and most of our work is London and UK-wide, but we also handle international productions when the brief calls for it, bringing in trusted local crew where needed." },
      { q: "How much does a video production project cost?", a: "It depends entirely on scope, format, and how much of the process you need us for. Full pricing detail is on our [pricing page](/pricing), but as a general guide, costs vary from a few thousand pounds for a straightforward film through to significantly more for multi-day branded content or documentary work." },
      { q: "How long does a typical production take?", a: "Timelines vary by format and complexity. A short social or product film can go from brief to delivery in a couple of weeks. Larger branded content or documentary projects, involving more planning, filming days, and post-production, typically run over several weeks to a few months." },
      { q: "Can you work with our existing creative or marketing agency?", a: "Yes, regularly. A lot of our work involves executing another agency's creative direction, we handle the production side (directing, filming, editing) while they own the concept and client relationship." },
];
