// Run with: node --test solicitation.test.ts   (Node 24 strips the types)
// Uses only node:test so it runs anywhere a site copies the filter.
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
    BLOCKED_DOMAINS,
    KNOWN_PITCHERS,
    PITCH_PHRASES,
    SOLICITATION_FILTER_VERSION,
    botShapeReasons,
    checkSolicitation,
    countLinks,
    isOwnerTest,
    isRandomLetterString,
    type SolicitationInput,
    // @ts-expect-error Node's strip-types runner imports the TypeScript file directly.
} from "./solicitation.ts";

const SPARKYBEN = { names: ["SparkyBen", "Sparky Ben"], domains: ["sparkyben.co.uk"] };

const ELLIOTT_MESSAGE = "Hi, I can show you roughly how many of Sparkyben's phone enquiries come from your marketing without you being able to see which ad or page sent them. Want me to send it over? Thanks, Elliott";

function withTempDomains<T>(domains: string[], run: () => T): T {
    const before = [...BLOCKED_DOMAINS];
    BLOCKED_DOMAINS.push(...domains);
    try {
        return run();
    } finally {
        BLOCKED_DOMAINS.length = 0;
        BLOCKED_DOMAINS.push(...before);
    }
}

describe("v1 behaviour is unchanged", () => {
    it("blocks the Anjali Singh pitch from the email and the message", () => {
        const result = checkSolicitation({
            email: "AnjaliSingh.WebDigital@Gmail.com",
            name: "Anjali Singh",
            subject: "Room Booking",
            message: "Hello, I just got a chance to check your website and noticed a few issues with your SEO and google ranking.",
        });
        assert.equal(result.blocked, true);
        for (const reason of [
            "email:anjalisingh.webdigital@gmail.com",
            "phrase:seo",
            "phrase:check your website",
            "phrase:got a chance to check your website",
            "phrase:google ranking",
        ]) assert.ok(result.reasons.includes(reason), reason);
        assert.equal(result.reasons.some((reason) => reason.startsWith("domain:")), false);
    });

    it("blocks a listed mailbox even when the message is innocuous", () => {
        assert.deepEqual(checkSolicitation({
            email: "anjalisingh.webdigital@gmail.com",
            message: "Hello, I would like to book a room for two nights.",
        }), { blocked: true, reasons: ["email:anjalisingh.webdigital@gmail.com"] });
    });

    it("blocks a listed sending domain and ignores free-mail domains", () => {
        withTempDomains(["pitch.example", "gmail.com"], () => {
            assert.deepEqual(checkSolicitation({
                email: "seller@pitch.example",
                message: "Hello, we would like to book a wedding.",
            }), { blocked: true, reasons: ["domain:pitch.example"] });
            assert.equal(checkSolicitation({
                email: "guest@gmail.com",
                message: "We would like to book the mansion for our wedding in June.",
            }).blocked, false);
            assert.equal(checkSolicitation({
                email: "guest@gmail.com.",
                message: "Table for afternoon tea, please.",
            }).blocked, false);
        });
    });

    it("blocks two distinct phrases and counts a repeated phrase once", () => {
        assert.deepEqual(checkSolicitation({
            email: "seller@example.com",
            message: "We offer SEO and web design services for hotels.",
        }), { blocked: true, reasons: ["word:seo", "phrase:seo", "phrase:web design services"] });
        // v2.1: "seo" is also a hold word, so it now holds on its own.
        assert.deepEqual(checkSolicitation({ email: "seller@example.com", message: "SEO SEO SEO" }), { blocked: true, reasons: ["word:seo", "phrase:seo"] });
    });

    it("uses a low triage score only when a phrase also matched", () => {
        const onePhrase = {
            email: "guest@example.com",
            message: "The gardens look perfect for our wedding in September, about 90 guests. My cousin works in digital marketing.",
        };
        assert.equal(checkSolicitation(onePhrase).blocked, false);
        assert.equal(checkSolicitation({ ...onePhrase, score: 4 }).blocked, false);
        assert.deepEqual(checkSolicitation({ ...onePhrase, score: 3 }), {
            blocked: true,
            reasons: ["phrase:digital marketing", "low-score:3"],
        });
        assert.equal(checkSolicitation({ email: "guest@example.com", message: "Book a room for Friday night.", score: 1 }).blocked, false);
        assert.equal(checkSolicitation({ ...onePhrase, score: Number.NaN }).blocked, false);
    });

    it("matches case-insensitively and never inside other words", () => {
        assert.equal(checkSolicitation({ email: "guest@example.com", message: "We are travelling from Seoul." }).blocked, false);
        assert.equal(checkSolicitation({ email: "s@example.com", subject: "Digital Marketing", message: "Can we send a guest post?" }).blocked, true);
    });

    it("keeps the v1 phrases first and in order, so the lists diff cleanly", () => {
        assert.deepEqual(PITCH_PHRASES.slice(0, 3), ["seo", "search engine optimisation", "search engine optimization"]);
        assert.equal(PITCH_PHRASES[17], "lead generation services");
        assert.equal(SOLICITATION_FILTER_VERSION, "2.7.2");
    });
});

describe("v2 holds pitches", () => {
    it("holds Elliott's exact message from his real address", () => {
        const result = checkSolicitation({
            name: "Elliott Lee",
            email: "elliott@ringful.pro",
            message: ELLIOTT_MESSAGE,
            business: SPARKYBEN,
        });
        assert.equal(result.blocked, true);
        for (const reason of [
            "domain:ringful.pro",
            "phrase:phone enquiries",
            "phrase:your marketing",
            "phrase:i can show you",
            "phrase:which ad or page",
            "phrase:want me to send it over",
            "tld:pro",
            "third-person:sparkyben's",
        ]) assert.ok(result.reasons.includes(reason), reason);
    });

    it("holds Elliott's message on its phrases alone, from free mail, with no business context", () => {
        const result = checkSolicitation({ name: "Elliott Lee", email: "matt@boostkit.io", message: ELLIOTT_MESSAGE });
        assert.equal(result.blocked, true);
        assert.equal(result.reasons.some((reason) => reason.startsWith("domain:")), false);
        assert.equal(checkSolicitation({ email: "elliott.lee@gmail.com", message: ELLIOTT_MESSAGE }).blocked, true);
    });

    const pitches: Array<[string, SolicitationInput]> = [
        ["call tracking", { email: "sam@callmetrics.co", message: "Do you use call tracking? Most electricians have no idea which calls come from Google." }],
        ["AI receptionist", { email: "jo@answerly.ai", message: "Our AI receptionist answers missed calls 24/7 so you never lose a job." }],
        ["review generation", { email: "kate@reviewboost.com", message: "We help you get more reviews on Google. We work with businesses like yours across Kent." }],
        ["website question", { email: "dan@gmail.com", message: "Quick question about your website - I noticed it loads slowly on mobile. Can I show you a 2 minute video?" }],
        ["growth promise", { email: "lee@leadflow.agency", message: "We can increase your bookings by 30% in 60 days. Free audit included." }],
        ["meeting ask", { email: "ana@outlook.com", message: "I noticed your business on Google Maps. Could we book a call with you this week? It's a 15-minute call." }],
        ["partnership", { email: "max@brandco.media", message: "Partnership opportunity for The Bewl Water team: we'd love to collaborate on content." }],
        ["one phrase plus business TLD", { email: "ella@growthlab.marketing", message: "Hi, quick one: I can show you how competitors are winning." }],
        ["one phrase plus third person", {
            email: "rob@example.com",
            message: "Looked at SparkyBen's Google profile. Want me to send it over?",
            business: SPARKYBEN,
        }],
        ["SEO with curly apostrophe and dashes", { email: "x@example.com", message: "We’re a digital marketing team—let’s jump on a call." }],
    ];

    for (const [label, input] of pitches) {
        it(`holds: ${label}`, () => {
            const result = checkSolicitation(input);
            assert.equal(result.blocked, true, `${label}: ${JSON.stringify(result.reasons)}`);
        });
    }
});

describe("v2 lets real customers through", () => {
    const customers: Array<[string, SolicitationInput]> = [
        ["rewire quote", { name: "Sarah Jones", email: "sarah.jones@gmail.com", message: "Can you quote for rewiring, my phone is 07700 900123, which day suits?" }],
        ["EV charger from Facebook ad", { name: "Mark", email: "mark@btinternet.com", message: "Do you do EV charger installs? Saw your ad on Facebook" }],
        ["EICR for landlord", { name: "Priya", email: "priya@lettingsco.co.uk", message: "I need an EICR for a 2 bed flat in TN1. Tenant is in, so please call me to arrange access." }],
        ["missed call back", { name: "Dave", email: "dave@hotmail.co.uk", message: "Sorry I missed your call earlier. Please ring me back about the fuse box, my number is 07700 900456." }],
        ["mentions the business by name", {
            name: "Linda",
            email: "linda@yahoo.co.uk",
            message: "My neighbour recommended SparkyBen's work. Could you fit outside lights? Happy to send photos.",
            business: SPARKYBEN,
        }],
        ["wedding venue", { name: "Tom & Amy", email: "amy@icloud.com", message: "We'd love to book a viewing for our wedding next August, about 120 guests. What dates do you have?" }],
        ["corporate event from a .io company", { name: "Helen", email: "helen@acmeapps.io", message: "We're planning a team away day for 40 people in March. Could you send a proposal and availability?" }],
        ["spa booking", { name: "Grace", email: "grace@outlook.com", message: "Can I book a couples massage and afternoon tea for Saturday? It's a birthday surprise." }],
        ["spa gift voucher", { name: "Jo", email: "jo@sky.com", message: "Do you sell gift vouchers for the spa day? I saw your marketing email about the winter offer." }],
        ["plumber leak", { name: "Ken", email: "ken@aol.com", message: "Leak under the kitchen sink, water everywhere. Can someone come out today? Postcode TN2 3AB." }],
        ["staff member of the business", {
            name: "Ben",
            email: "ben@sparkyben.co.uk",
            message: "Test from Ben: SparkyBen's form is working, I can show you tomorrow.",
            business: SPARKYBEN,
        }],
        ["electrician with a .pro email asking for work", { name: "Ali", email: "ali@sparks.pro", message: "Can you quote for a consumer unit change at my house in Tonbridge?" }],
        ["test payload", { name: "Matt", email: "matt@boostkit.io", message: "Test. Ignore." }],
    ];

    for (const [label, input] of customers) {
        it(`passes: ${label}`, () => {
            const result = checkSolicitation(input);
            assert.equal(result.blocked, false, `${label}: ${JSON.stringify(result.reasons)}`);
        });
    }
});

describe("v2.1 hold words (Matt, 7 Nov 2026)", () => {
    it("is version 2.7.2", () => assert.equal(SOLICITATION_FILTER_VERSION, "2.7.2"));

    for (const [word, message] of [
        ["seo", "Can we chat about SEO?"],
        ["keyword", "We track your keywords every week."],
        ["ranking", "Your rankings could be better."],
        ["meta", "We run Meta ads for local trades."],
        ["ppc", "Is PPC something you'd look at?"],
        ["website", "I love your web site, can I help?"],
        ["website", "We build websites for electricians."],
        ["backlink", "We can get you quality backlinks."],
        ["google ad", "Are your Google Ads working?"],
        ["google ad", "Your google  ad spend could go further."],
        ["lead generation", "We do lead generation for trades."],
        ["domain authority", "We will boost your Domain Authority to 40."],
        ["guest post", "Can we send you a guest post?"],
    ] as const) {
        it(`holds a message containing "${word}" on its own`, () => {
            const result = checkSolicitation({ email: "someone@gmail.com", message });
            assert.equal(result.blocked, true);
            assert.ok(result.reasons.includes(`word:${word}`), result.reasons.join(","));
        });
    }

    it("holds a genuine enquiry that mentions the website, by design (Matt releases it)", () => {
        assert.equal(checkSolicitation({ email: "jo@gmail.com", message: "Found you on your website, can you quote for a rewire?" }).blocked, true);
    });

    it("matches whole words only", () => {
        for (const message of [
            "We are travelling from Seoul.",
            "Can you fit a metal garage door?",
            "My metabolism appointment is at 3.",
            "The keyboard on the alarm panel is broken.",
            "We need a new metaphorical start.",
            "Lead pipes in the kitchen need replacing.",
            "Is there a guest room for the wedding party?",
        ]) assert.equal(checkSolicitation({ email: "guest@gmail.com", message }).blocked, false, message);
    });
});

describe("v2.3 softer filter (holdWords: false)", () => {
    it("lets a genuine SEO enquiry through on a marketing agency's own site", () => {
        assert.equal(checkSolicitation({ email: "owner@plumbco.co.uk", message: "We need help with our SEO and Google Ads, can you quote?", holdWords: false }).blocked, false);
    });

    it("still holds a clear pitch: two phrases, or a blocked sender", () => {
        assert.equal(checkSolicitation({ email: "x@example.com", message: "I can show you how many calls come from your marketing. Want me to send it over?", holdWords: false }).blocked, true);
        assert.equal(checkSolicitation({ email: "elliott@ringful.pro", message: "Hello", holdWords: false }).blocked, true);
    });

    it("defaults to the full filter", () => {
        assert.equal(checkSolicitation({ email: "owner@plumbco.co.uk", message: "We need help with our SEO." }).blocked, true);
    });
});

describe("v2.4 known pitchers (Matt, 15 Nov 2026)", () => {
    const OBSIDIAN = "pitcher:obsidian media";
    // The pitch held on aplgasandheating.co.uk on 15 Nov 2026 only because it said "Meta".
    const REAL_PITCH = "Hello mate, not a job enquiry sorry!! We're a marketing agency here in Kent. One boiler company we work with did £250k in 3 months off £6k on Meta. 5 min call + I promise you'll see how we did it. WhatsApp us on 07852741459";

    it("holds anything from their domain, whatever it says", () => {
        const result = checkSolicitation({ name: "Ethan", email: "Team@ObsidianMedia.site", message: "Hello, can you give me a ring?" });
        assert.equal(result.blocked, true);
        for (const reason of ["email:team@obsidianmedia.site", "domain:obsidianmedia.site", OBSIDIAN]) assert.ok(result.reasons.includes(reason), reason);
        assert.equal(checkSolicitation({ email: "ethan@obsidianmedia.site", message: "Hello" }).blocked, true);
    });

    it("holds the real pitch from a free-mail address, on the WhatsApp number alone", () => {
        assert.deepEqual(checkSolicitation({ name: "Ethan", email: "ethan.sales@gmail.com", message: REAL_PITCH, holdWords: false }), { blocked: true, reasons: [OBSIDIAN] });
        assert.ok(checkSolicitation({ name: "Ethan", email: "ethan.sales@gmail.com", message: REAL_PITCH }).reasons.includes(OBSIDIAN));
    });

    for (const message of [
        "Give us a call on 07852741459",
        "Give us a call on 07852 741459.",
        "Give us a call on 07852-741-459",
        "Give us a call on 078 5274 1459",
        "WhatsApp +447852741459",
        "WhatsApp +44 7852 741459",
        "WhatsApp +44 (0)7852 741 459",
        "WhatsApp 0044 7852 741459",
        "wa.me/447852741459",
        "Ring the office on 07341 507725",
        "Ring the office on +44 7341 507725",
        "It's Ethan from Obsidian Media, have you got five minutes?",
        "We are OBSIDIAN  MEDIA GROUP LTD, based in Medway.",
        "ethan here from obsidianmedia",
        "Ethan, Obsidian-Media",
        "See what we do at obsidianmedia.site/results",
        "Email me back at team@obsidianmedia.site",
        "Find us on Instagram @obsidianmediauk",
        "Book a slot: calendly.com/team-obsidianmedia/30min",
    ]) {
        it(`holds a free-mail message containing: ${message}`, () => {
            const result = checkSolicitation({ email: "someone@gmail.com", message, holdWords: false });
            assert.equal(result.blocked, true, JSON.stringify(result.reasons));
            assert.ok(result.reasons.includes(OBSIDIAN), JSON.stringify(result.reasons));
        });
    }

    it("reads the name, the subject and the sender address as well as the message", () => {
        assert.ok(checkSolicitation({ name: "Ethan at Obsidian Media", email: "e@gmail.com", message: "Call me." }).reasons.includes(OBSIDIAN));
        assert.ok(checkSolicitation({ subject: "Obsidian Media", email: "e@gmail.com", message: "Call me." }).reasons.includes(OBSIDIAN));
        assert.ok(checkSolicitation({ email: "obsidianmedia.uk@gmail.com", message: "Call me." }).reasons.includes(OBSIDIAN));
    });

    it("gives one reason per pitcher however many details match", () => {
        const result = checkSolicitation({ email: "e@gmail.com", message: "Obsidian Media, obsidianmedia.site, 07852741459, 07341 507725", holdWords: false });
        assert.deepEqual(result.reasons, [OBSIDIAN]);
    });

    for (const message of [
        "We need an obsidian black worktop fitted",
        "Do you supply obsidian tiles? We saw them in a magazine.",
        "Can you paint the media wall in Obsidian, the Farrow and Ball sort of black?",
        "Looking for an Obsidian quartz splashback, about 3 metres. My number is 07700 900123.",
        "I work in media and need the boiler serviced before Friday.",
        "Call me on 07852 741458 after 5pm.",
        "Call me on 07341 507726 please.",
        "My number is 107852741459 on the order form.",
        "Order ref 078527414590, when will it arrive?",
    ]) {
        it(`passes a customer: ${message}`, () => {
            const result = checkSolicitation({ name: "Sarah", email: "sarah@gmail.com", message });
            assert.equal(result.blocked, false, JSON.stringify(result.reasons));
        });
    }

    it("keeps every entry narrow: a label, and names of two words or one long word", () => {
        for (const pitcher of KNOWN_PITCHERS) {
            assert.equal(pitcher.label, pitcher.label.toLowerCase());
            for (const name of pitcher.names) assert.ok(name.trim().length >= 6 && name !== "obsidian", name);
            for (const phone of pitcher.phones ?? []) assert.match(phone, /^0\d{9,10}$/);
            for (const domain of pitcher.domains ?? []) assert.ok(BLOCKED_DOMAINS.includes(domain), domain);
        }
    });
});

describe("v2.5 search-ranking pitches (Matt, 16 Nov 2026)", () => {
    // Sent through the One Warwick Park contact form on 16 Nov 2026.
    const OWP_PITCH = "Hi, when people search Google for what One Warwick Park Hotel does, do you show up near the top? We've put together a plan showing who ranks above you and how to move above them. Want me to send it over? Thanks, Elliott";
    const OWP = { names: ["One Warwick Park"], domains: ["onewarwickpark.co.uk"] };

    it("holds the real pitch from their address", () => {
        const result = checkSolicitation({ name: "Elliott Lee", email: "elliott@thornfieldgrowth.com", subject: "General Enquiry", message: OWP_PITCH, business: OWP });
        assert.equal(result.blocked, true);
        for (const reason of ["domain:thornfieldgrowth.com", "pitcher:thornfield growth"]) assert.ok(result.reasons.includes(reason), reason);
    });

    it("holds the same words from a free-mail address under another name, in the softer filter too", () => {
        for (const holdWords of [true, false]) {
            const result = checkSolicitation({ name: "Ellie", email: "ellie.lee@gmail.com", subject: "General Enquiry", message: OWP_PITCH, holdWords });
            assert.equal(result.blocked, true, JSON.stringify(result.reasons));
            assert.ok(result.reasons.filter((reason) => reason.startsWith("phrase:")).length >= 2, JSON.stringify(result.reasons));
        }
    });

    for (const message of [
        "Do you show up at the top of Google for spa breaks? We have a plan to get you there.",
        "We looked at who ranks above you in Tunbridge Wells and can help you outrank your competitors. Shall I send it over?",
        "Your competitors are ranking above you for wedding venues in Kent. Want me to send it over?",
        "Thornfield Growth here, call 07838 485697",
        "Visit thornfieldgrowth.com for the plan",
    ]) {
        it(`holds a free-mail message: ${message}`, () => {
            const result = checkSolicitation({ email: "someone@gmail.com", message, holdWords: false });
            assert.equal(result.blocked, true, JSON.stringify(result.reasons));
        });
    }

    for (const message of [
        "Is there a taxi rank near the hotel? We arrive by train on Friday.",
        "Could we have a room near the top floor with a view over the Pantiles?",
        "We have put together a plan for the day and would love to talk through it with your team.",
        "I found you when I searched Google for hotels in Tunbridge Wells. Do you have a double room on 12 December?",
        "Is the restaurant open for Sunday lunch? A table for six at the top of the hour, around 1pm.",
    ]) {
        it(`passes a guest: ${message}`, () => {
            const result = checkSolicitation({ name: "Sarah", email: "sarah@gmail.com", message, holdWords: false, business: OWP });
            assert.equal(result.blocked, false, JSON.stringify(result.reasons));
        });
    }
});

// ---------------------------------------------------------------------------
// v2.6 bot shape (17 Nov 2026). The real samples are the nine random-letter
// enquiries that reached Signature Auto Repairs on 16 and 17 Nov 2026 (names
// and messages as received; email addresses left out). The Gmail search of
// the last 30 days found no others on any site.
// ---------------------------------------------------------------------------

const BOT_SAMPLES = [
    { name: "Solzzg Yaekw", message: "ZdklGrSEIEbPSeYOculkrm" },
    { name: "Gorxmnu Cqaacaa", message: "YORGIQGSazELBiZuX" },
    { name: "Urokwil Uorxtlwtt", message: "arAxWnlKFxrPTfHRIvSmCrga" },
    { name: "Ewkmet Kyzzwg", message: "sUljjgvVWwtzkYBMiQ" },
    { name: "Lzpfstw Bdmgvjgd", message: "mofCwdlbfvnIjLyriVL" },
    { name: "Arve Nbmbe", message: "qFMElSZdtLWPsMOMb" },
    { name: "Kcgdrlv Sbctrpb", message: "PVJHkgfkktMFXGRe" },
    { name: "Brbyl Xfooxxjco", message: "fnPsxGsbgrbUHQjTpoIe" },
    { name: "Vvvqb Vxbbhytrg", message: "klMamIwGvuzblSPUPO" },
];

// Signature's own test strings for the same messages (copied from the
// notification text, where a letter either side may differ).
const SIGNATURE_TEST_MESSAGES = [
    "ZdklGrSEIEbPSeYOculkrmS",
    "UljjgvVWwtzkYBMiQ",
    "fnPsxGsbgrbUHQjTpoI",
];

// Real names: from real enquiries on Boostkit sites in November 2026, plus
// the spread the filter must never hold.
const REAL_NAMES = [
    "Florence Dodd", "Fay Pullen", "ben simmons", "Jagunath", "Adam Robinson", "Rachel Terry", "Maddy Ginn",
    "Patricia wild", "George Banks", "Tracy O'Donnell", "Renjith Ravindran", "Helena McGrath", "Andrew Davies",
    "Lucy Neale", "Roxanne", "Alistair Lamyman", "Sonali Patro", "Kerry Francis", "Rachael Idd-Bun",
    "Sydney Calkin", "Tommy Henderson", "Jess", "Catherine Farmer", "David Smith", "Rhianna McLean",
    "Annabel Austin", "Stephen Forster", "Mandy Smith", "Shannon Staley", "Amands", "Robert Schembri",
    "Mary-Jay Warwick", "Harriet Hammond", "Jasmine Etherton", "Mrs Elaine Parris", "Mindy Pursey",
    "Divya Vijay", "Heidi Foad", "Margaret Abernathy", "Clovis Deviaene", "Dee Edmead", "Rhys Bennett",
    "Victoria Bridgeman", "Maisie Bylett", "Sarah Holmes-Siedle", "Oliver Crossley", "Mrs Jayne Qureshi",
    "Sophia McBryde", "Andrea McGlew",
    // Irish, Welsh, Scottish
    "Siobhan Ní Bhriain", "Siobhán Ó Súilleabháin", "Caoimhe Ní Dhubhghaill", "Niamh Mhic Aoidh",
    "Gwyn Llwyd", "Dafydd ap Gruffydd", "Ffion Llywelyn", "Rhodri Wyn", "Eilidh MacDonald", "Mhairi Nic a' Phearsain",
    "Ruaridh Stewart", "Dugald Strachan", "Ishbel MacAskill",
    // Polish and other European
    "Krzysztof Wójcik", "Grzegorz Brzęczyszczykiewicz", "Przemysław Szczęsny", "Łukasz Chrząszcz",
    "Agnieszka Szczepańska", "Wojciech Strzelecki", "Zbigniew Pszczółkowski", "Hans Schmidt", "Jürgen Schwarzschild",
    "Anna Goldschmidt", "Lars Lindqvist", "Søren Kierkegaard", "Václav Dvořák", "Ruud van Nistelrooy",
    // Indian
    "Lakshmi Srinivasan", "Prithviraj Venkatraman", "Bhavya Shrestha", "Sanjay Bhattacharya", "Jyoti Chakraborty",
    "Kshitij Trivedi",
    // Nigerian and Ghanaian
    "Chukwuemeka Okonkwo", "Oluwaseun Adebayo", "Ngozi Nwachukwu", "Gbenga Mbanefo", "Nkechi Eze", "Kwabena Mensah",
    // Romanised Chinese and Vietnamese
    "Nguyen Thi Xuan", "Zhang Xiaoming", "Qiu Zhuang", "Ng", "Xu Qing", "Huang Jianguo",
    // Arabic and others
    "Muhammad Iqbal", "Tariq Qadir", "Mr X", "J", "Matt", "John Wright", "Knightsbridge Dental",
];

const REAL_MESSAGES = [
    "Quote please",
    "Hi, scratched bumper, can you help?",
    "07961 217007 call me",
    "TN2 3QR",
    "KR19 XYZ",
    "Brakes",
    "Test. Ignore.",
    ".",
    "",
    "ineedabrakecheck",
    "Hello,can you call me back please",
    "BMW 320d, KR19 XYZ, scuff on the nearside rear quarter",
    "Vehicle: VW Polo\nPanel: rear bumper\nPostcode: TN2 3QR",
    "Can I bring the car in to Knightsbridge on Friday?",
    "Photos: https://photos.app.goo.gl/abc and https://imgur.com/xyz",
    "My email is bob@gmail.com or bob@work.co.uk, website www.bobs.co.uk",
    "Hiii, sooo sorry, can we move the booking?",
    "Thnx",
    "brkpd rplcmnt",
    "Ok",
    "Dw i eisiau archebu bwrdd i bedwar nos Wener",
    "Chcę zarezerwować stolik dla czterech osób w piątek",
    "Table for 4 for 张伟 on Friday please",
];

describe("v2.6 bot shape: the real random-letter enquiries", () => {
    for (const sample of BOT_SAMPLES) {
        it(`holds ${sample.name} / ${sample.message}`, () => {
            const result = checkSolicitation({ ...sample, email: "someone@gmail.com" });
            assert.equal(result.blocked, true);
            assert.ok(result.reasons.includes("bot:random-letters"), result.reasons.join(", "));
        });
    }

    for (const message of SIGNATURE_TEST_MESSAGES) {
        it(`flags Signature's test string ${message}`, () => assert.equal(isRandomLetterString(message), true));
    }

    it("holds them on the softer filter too", () => {
        for (const sample of BOT_SAMPLES) assert.equal(checkSolicitation({ ...sample, holdWords: false }).blocked, true);
    });

    it("never holds on the name alone, even a random one (team lead, 17 Nov 2026)", () => {
        for (const sample of BOT_SAMPLES) assert.deepEqual(botShapeReasons({ name: sample.name, email: "someone@gmail.com", message: "Quote please" }), [], sample.name);
        assert.deepEqual(botShapeReasons({ name: "ZdklGrSEIEbPSeYOculkrm", message: "Quote please" }), []);
        assert.deepEqual(botShapeReasons({ name: "asdf qwerty", message: "Quote please" }), []);
    });

    it("holds a random name beside a dot-stuffed Gmail address", () => {
        assert.deepEqual(botShapeReasons({ name: "Lzpfstw Bdmgvjgd", email: "eg.ib.it.en.5@gmail.com", message: "Quote please" }), ["bot:dotted-email", "bot:random-name"]);
        assert.deepEqual(botShapeReasons({ name: "asdf qwerty", email: "a.s.d.f@gmail.com", message: "Quote please" }), ["bot:dotted-email", "bot:random-name"]);
    });

    it("holds an odd name with a dot-stuffed Gmail address, and neither alone", () => {
        assert.deepEqual(botShapeReasons({ name: "Solzzg Yaekw", email: "uz.aq.ur.oh.u5@gmail.com", message: "Quote please" }), ["bot:dotted-email", "bot:odd-name"]);
        assert.deepEqual(botShapeReasons({ name: "Solzzg Yaekw", email: "solzzg@gmail.com", message: "Quote please" }), []);
        assert.deepEqual(botShapeReasons({ name: "Kate Arding", email: "k.a.t.e.arding@gmail.com", message: "Quote please" }), []);
        assert.deepEqual(botShapeReasons({ name: "John Wright", email: "j.o.h.n.wright@gmail.com", message: "Quote please" }), ["bot:dotted-email", "bot:odd-name"]);
        assert.deepEqual(botShapeReasons({ name: "John Wright", email: "john.r.wright@gmail.com", message: "Quote please" }), []);
        assert.deepEqual(botShapeReasons({ name: "John Wright", email: "j.o.h.n.wright@outlook.com", message: "Quote please" }), []);
    });

    it("holds random strings in the subject or one line of a joined message", () => {
        assert.ok(botShapeReasons({ subject: "YORGIQGSazELBiZuX", message: "Quote please" }).includes("bot:random-letters"));
        assert.ok(botShapeReasons({ message: "Ford Focus\nklMamIwGvuzblSPUPO\nrear bumper" }).includes("bot:random-letters"));
    });

    it("holds several random words with no real word among them", () => {
        assert.deepEqual(botShapeReasons({ message: "Zdkl GrSEIEbPSe YOculkrm Bdmgvjgd" }), ["bot:random-letters"]);
        assert.deepEqual(botShapeReasons({ message: "Zdkl GrSEIEbPSe YOculkrm please" }), []);
    });
});

describe("v2.6 bot shape: real customers pass", () => {
    for (const name of REAL_NAMES) {
        it(`passes the name ${name}`, () => {
            assert.deepEqual(botShapeReasons({ name, email: "someone@gmail.com", message: "Quote please" }), []);
            assert.equal(checkSolicitation({ name, email: "someone@gmail.com", message: "Quote please" }).blocked, false);
        });
    }

    for (const message of REAL_MESSAGES) {
        it(`passes the message ${JSON.stringify(message)}`, () => {
            assert.deepEqual(botShapeReasons({ name: "Pat Smith", email: "pat@example.com", message }), []);
        });
    }

    it("passes subjects from form dropdowns", () => {
        for (const subject of ["booking", "afternoon-tea", "General Enquiry", "GeneralEnquiry", "Twilight Wedding Enquiry", "christmas-dining"]) {
            assert.deepEqual(botShapeReasons({ name: "Pat", subject, message: "Hello" }), [], subject);
        }
    });

    it("passes real dotted addresses", () => {
        assert.deepEqual(botShapeReasons({ name: "Kate Arding", email: "kate.s.arding@gmail.com", message: "Hello" }), []);
        assert.deepEqual(botShapeReasons({ name: "Paul Jeffrey", email: "paul.jeffrey100@btinternet.com", message: "Hello" }), []);
    });

    it("passes an empty enquiry (callback and booking forms have no message)", () => {
        assert.deepEqual(botShapeReasons({ name: "Pat", email: "pat@example.com" }), []);
        assert.deepEqual(botShapeReasons({}), []);
    });

    it("passes Matt's form tests", () => {
        assert.equal(checkSolicitation({ name: "Matt", email: "matt@boostkit.io", subject: "Test", message: "Ignore" }).blocked, false);
        assert.equal(checkSolicitation({ name: "Matt", email: "matt@boostkit.io", message: "Test" }).blocked, false);
    });
});

describe("v2.6 bot shape: noise, links, script, repeated fields", () => {
    for (const message of ["asdf", "asdfgh", "qwerty", "dfgdfg", "lkjhg", "aaaa", "xcvbn", "asdf asdf", "hjkl"]) {
        it(`holds the noise message ${message}`, () => {
            assert.deepEqual(botShapeReasons({ name: "Pat", message }), ["bot:noise"]);
        });
    }

    it("counts distinct links and never email addresses", () => {
        assert.equal(countLinks("see https://a.example.com/x and www.b.co.uk"), 2);
        assert.equal(countLinks("visit signature-seo.co.uk for a plan"), 1);
        assert.equal(countLinks("email bob@gmail.com or bob@work.co.uk"), 0);
        assert.equal(countLinks("https://a.com https://a.com/ www.a.com"), 1);
        assert.equal(countLinks("Thanks. Speak soon. Bye."), 0);
    });

    it("holds more than two links, across fields", () => {
        assert.deepEqual(botShapeReasons({ subject: "https://a.com", message: "www.b.co.uk and c.net" }), ["bot:links:3"]);
        assert.equal(checkSolicitation({ message: "Plan at https://one.com, https://two.com, https://three.com" }).blocked, true);
    });

    it("lets a site raise the link limit or switch it off", () => {
        const message = "https://a.com https://b.com https://c.com";
        assert.deepEqual(botShapeReasons({ message, botChecks: { maxLinks: 5 } }), []);
        assert.deepEqual(botShapeReasons({ message, botChecks: { links: false } }), []);
    });

    it("holds a link in the name", () => {
        assert.deepEqual(botShapeReasons({ name: "Cheap pills at pills.ru", message: "Hello" }), ["bot:link-in-name"]);
    });

    it("holds Cyrillic, Chinese and other non-Latin spam", () => {
        assert.deepEqual(botShapeReasons({ name: "Ivan", message: "Здравствуйте, предлагаем продвижение сайта" }), ["bot:script"]);
        assert.deepEqual(botShapeReasons({ name: "Wei", message: "您好，我们提供网站推广服务" }), ["bot:script"]);
    });

    it("holds Latin and Cyrillic letters mixed inside a word", () => {
        assert.deepEqual(botShapeReasons({ name: "Pat", message: "Неllo, I would like a quote" }), ["bot:mixed-script"]);
    });

    it("passes a non-Latin name with an English message, and accented Latin text", () => {
        assert.deepEqual(botShapeReasons({ name: "Олена Коваленко", message: "Hi, I would like a quote for a scratched bumper please" }), []);
        assert.deepEqual(botShapeReasons({ name: "Zoë Brontë", message: "Café booking for Siân and Dafydd, 5µm" }), []);
    });

    it("lets a site that takes other alphabets switch the script check off", () => {
        assert.deepEqual(botShapeReasons({ name: "Wei", message: "您好，我想预订", botChecks: { script: false } }), []);
    });

    it("holds the name repeated as the message or the subject", () => {
        assert.deepEqual(botShapeReasons({ name: "Robertcrova", message: "robertcrova" }), ["bot:repeated-fields"]);
        assert.deepEqual(botShapeReasons({ name: "Robert Crova", subject: "Robert  Crova", message: "Hello" }), ["bot:repeated-fields"]);
        assert.deepEqual(botShapeReasons({ name: "Pat", subject: "Booking", message: "Booking" }), []);
    });

    it("switches every check off with botChecks: false, and one check with a key", () => {
        const sample = { ...BOT_SAMPLES[6], email: "kc.gd.rl.v@gmail.com" };
        assert.deepEqual(botShapeReasons({ ...sample, botChecks: false }), []);
        assert.equal(checkSolicitation({ ...sample, botChecks: false }).blocked, false);
        assert.deepEqual(botShapeReasons({ ...sample, botChecks: { dottedEmail: false } }), ["bot:random-letters"]);
        assert.deepEqual(botShapeReasons({ ...sample, botChecks: { randomLetters: false } }), ["bot:dotted-email", "bot:random-name"]);
    });

    it("lists bot reasons after the pitch reasons", () => {
        const result = checkSolicitation({ name: "Pat", message: "Need a new website\nklMamIwGvuzblSPUPO" });
        assert.deepEqual(result, { blocked: true, reasons: ["word:website", "bot:random-letters"] });
    });
});

describe("v2.7.1 placeholder text (found live through the gate, 17 Nov 2026)", () => {
    it("holds Lorem ipsum filler in the message, subject or name", () => {
        const message = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
        assert.deepEqual(botShapeReasons({ name: "Lorem Ipsum", email: "lorem@gmail.com", message }), ["bot:placeholder"]);
        assert.equal(checkSolicitation({ name: "Pat", message, holdWords: false }).blocked, true);
        assert.deepEqual(botShapeReasons({ name: "Pat", subject: "Dolor sit amet", message: "Hello" }), ["bot:placeholder"]);
        assert.deepEqual(botShapeReasons({ name: "Lorem Ipsum", message: "Quote please" }), ["bot:placeholder"]);
    });

    it("passes ordinary words that share a stem", () => {
        for (const message of ["Lorem, can you call me?", "My dolor is fine", "Is the amet open?", "Consecutive days please", "Ipswich address"]) {
            assert.deepEqual(botShapeReasons({ name: "Pat", message }), [], message);
        }
    });

    it("holds test filler: repeated test, sample text, and a keyboard-mash line", () => {
        for (const message of ["test test test", "Testing, testing, testing", "TEST TEST TEST TEST", "Sample text", "This is placeholder text", "Hello\nasdf", "Quote please\nqwerty asdf"]) {
            assert.deepEqual(botShapeReasons({ name: "Pat", message }), ["bot:placeholder"], message);
        }
        assert.deepEqual(botShapeReasons({ name: "Pat", subject: "test test test", message: "Hello" }), ["bot:placeholder"]);
    });

    it("passes a customer who writes test once or twice", () => {
        for (const message of ["Can you test my boiler?", "Test", "Need a gas safety test and a boiler test", "MOT test please", "Testing the alarm, can you help?", "Is the sample I left ready?", "Text me when you are free"]) {
            assert.deepEqual(botShapeReasons({ name: "Pat", message }), [], message);
        }
    });

    it("never holds on a keyboard-mash name, and reports a mashed message once", () => {
        assert.deepEqual(botShapeReasons({ name: "asdf", message: "Quote please" }), []);
        assert.deepEqual(botShapeReasons({ name: "Pat", message: "asdf" }), ["bot:noise"]);
    });

    it("can be switched off", () => {
        assert.deepEqual(botShapeReasons({ name: "Pat", message: "Lorem ipsum", botChecks: { placeholder: false } }), []);
    });
});

describe("v2.6 owner tests (Matt, 17 Nov 2026)", () => {
    it("recognises Matt and any @boostkit.io address, in any case", () => {
        assert.equal(isOwnerTest("matt@boostkit.io"), true);
        assert.equal(isOwnerTest("  Matt@BoostKit.IO "), true);
        assert.equal(isOwnerTest("test@boostkit.io"), true);
    });

    it("recognises nothing else", () => {
        for (const email of ["x@notboostkit.io", "a@boostkit.io.evil.com", "boostkit.io@gmail.com", "matt@boostkit.co.uk", "", null, undefined, "matt"]) {
            assert.equal(isOwnerTest(email), false, String(email));
        }
    });
});
