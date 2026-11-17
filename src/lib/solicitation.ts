/**
 * Vendor/sales solicitation filter shared with Elite Tools and Boostform.
 * Keep BLOCKED_EMAILS, BLOCKED_DOMAINS, and PITCH_PHRASES verbatim so the
 * lists can be diffed across those repos.
 *
 * Version 2.7.2 (17 Nov 2026). v2.7.2 widens `bot:placeholder` to test filler
 * ("test test test", "sample text", keyboard-mash lines) and Jev 2.1.0 holds
 * spam >= 0.5 with customer <= 0.2. v2.7.1 added `bot:placeholder` (Lorem ipsum
 * filler, found live through the central gate). v2.7 adds screenEnquiry, the one entry point:
 * owner test, rules, then Jev (TypeSafe) on every submission the rules would
 * deliver, fail-open (SCREEN ENQUIRY below; pitchJev.ts is folded in).
 * v2.6 (17 Nov 2026) adds bot-shape checks: random-letter
 * names and messages, link stuffing, foreign-script spam, one-word noise and
 * repeated fields hold on their own (reasons `bot:...`), and each check can
 * be switched off per site with `botChecks`. It also adds `isOwnerTest(email)`
 * for Boostkit's own test submissions, which must reach Matt only.
 * v2.5 (16 Nov 2026) adds search-ranking pitch phrases ("who
 * ranks above you", "show up near the top") and Thornfield Growth as a known
 * pitcher. v2.4 added KNOWN_PITCHERS: agencies known to
 * pitch through client forms, held on their name, domain, handle or phone
 * number anywhere in the submission. v2.3 added `holdWords: false` for the softer
 * filter on sites that sell marketing themselves (Fuel, boostkit.io). Canonical copy:
 * C:\dev\projects\_HOME\shared-code\solicitation\solicitation.ts
 * Sites copy this file verbatim. Change it there first, then re-copy.
 *
 * A submission is blocked when any of these is true:
 * - (v2.1) any HOLD_WORDS word appears as a whole word (Matt, 7 Nov 2026:
 *   anything mentioning these never reaches a client's inbox; a genuine
 *   enquiry that uses one is held for Matt to release, not lost)
 * - the sender email is in BLOCKED_EMAILS, or its domain is in BLOCKED_DOMAINS
 * - (v2.4) the name, subject, message or sender address mentions a
 *   KNOWN_PITCHERS entry: its name, a domain, a handle or a phone number.
 *   This holds on its own and is not switched off by `holdWords: false`
 * - two or more distinct PITCH_PHRASES match
 * - one phrase matches AND score <= LOW_SCORE_MAX (out of 10)
 * - one phrase matches AND the sender domain ends in a BUSINESS_TLDS suffix
 *   (v2), for example someone@calls.pro
 * - one phrase matches AND the message names the business in the third person,
 *   such as "Sparkyben's phone enquiries", from a sender outside the
 *   business's own domains (v2; needs `business.names`)
 * - (v2.6) any bot-shape reason (`bot:...`, see BOT SHAPE below). These hold
 *   on their own, in the full and the softer filter alike
 *
 * `score` is the Elite Tools triage score out of 10, where a low number is a
 * poor fit. Omit it when no triage score exists. Do not pass the local
 * spam-heuristic score from spamDetection.ts: that scale runs the other way.
 *
 * Free-mail domains (gmail.com and the like) are never domain-blocked and
 * never count as a business TLD. A listed mailbox on those domains still
 * matches BLOCKED_EMAILS.
 * Apart from HOLD_WORDS, bare words are not phrases. Each phrase is
 * one signal; a single phrase alone never blocks. Do not add a v2 phrase
 * that contains another listed phrase, or one clause would count twice.
 */

export const SOLICITATION_FILTER_VERSION = "2.7.2";

/**
 * Any one of these, as a whole word (plural included), holds the submission
 * on its own. Matt's list, 7 Nov 2026. Whole words only: "metal" or
 * "metabolism" do not match "meta"; "website" also matches "websites" and
 * "web site". Add a word here (lower case, singular) to extend the list.
 */
export const HOLD_WORDS = [
    "seo",
    "keyword",
    "ranking",
    "meta",
    "ppc",
    "website",
    // v2.2 (Matt, 7 Nov 2026): phrases count as one entry
    "backlink",
    "google ad",
    "lead generation",
    "domain authority",
    "guest post",
] as const;

export const BLOCKED_EMAILS = [
    "anjalisingh.webdigital@gmail.com",
    "team@obsidianmedia.site",
] as const;

/** Append a sending domain to block every mailbox on it. Never add a free-mail host. */
export const BLOCKED_DOMAINS: string[] = [
    "ringful.pro",
    "obsidianmedia.site",
    "thornfieldgrowth.com",
];

/**
 * v2.4: agencies known to pitch clients through their own contact forms. Any
 * one detail below, anywhere in the name, subject, message or sender address,
 * holds the submission on its own, so a pitch sent from a free-mail address
 * with the agency's details in the body is still held. To add the next
 * agency, append one entry here (and its sending domain to BLOCKED_DOMAINS).
 *
 * - `label`: lower case, used in the reason (`pitcher:<label>`).
 * - `names`: the brand as written, two words or more or one distinctive
 *   made-up word. Never a single ordinary word: "obsidian" alone must not
 *   hold a customer asking about an obsidian worktop. Case is ignored and
 *   the words may be run together or split by spaces, dots, dashes or
 *   underscores, so "obsidian media" also matches "ObsidianMedia",
 *   "obsidianmedia.site" and "@obsidianmediauk".
 * - `domains` and `handles`: matched as written, case ignored.
 * - `phones`: UK numbers, digits only, starting 0. Matched with any spacing,
 *   dashes, dots or brackets, and as +44, 0044 or 44 in place of the 0.
 */
export type KnownPitcher = {
    label: string;
    names: readonly string[];
    domains?: readonly string[];
    handles?: readonly string[];
    phones?: readonly string[];
};

export const KNOWN_PITCHERS: readonly KnownPitcher[] = [
    {
        // Added 15 Nov 2026 (Matt): pitched aplgasandheating.co.uk through its contact form.
        label: "obsidian media",
        names: ["obsidian media"],
        domains: ["obsidianmedia.site"],
        handles: ["obsidianmediauk", "team-obsidianmedia"],
        phones: ["07852741459", "07341507725"],
    },
    {
        // Added 16 Nov 2026 (Matt): pitched onewarwickpark.co.uk through its contact form.
        label: "thornfield growth",
        names: ["thornfield growth"],
        domains: ["thornfieldgrowth.com"],
        phones: ["07838485697"],
    },
];

export const PITCH_PHRASES = [
    "seo",
    "search engine optimisation",
    "search engine optimization",
    "website redesign",
    "redesign your website",
    "web design services",
    "web development services",
    "app development services",
    "checked your website",
    "check your website",
    "got a chance to check your website",
    "first page of google",
    "google ranking",
    "rank higher",
    "digital marketing",
    "guest post",
    "backlinks",
    "lead generation services",
    // v2 (7 Nov 2026): call tracking and attribution pitches
    "call tracking",
    "phone enquiries",
    "phone inquiries",
    "calls come from",
    "enquiries come from",
    "inquiries come from",
    "leads come from",
    "which ad or page",
    "which page or ad",
    "your marketing",
    // v2: the offer and the ask
    "i can show you",
    "can i show you",
    "happy to show you",
    "want me to send it over",
    "shall i send it over",
    "should i send it over",
    "can i send it over",
    "quick question about your website",
    "quick question about your business",
    // v2: growth promises
    "increase your bookings",
    "increase your leads",
    "increase your enquiries",
    "increase your sales",
    "increase your revenue",
    "get more leads",
    "more reviews",
    "ai receptionist",
    "virtual receptionist",
    "missed calls",
    "never miss a call",
    "businesses like yours",
    // v2: meeting requests and openers
    "book a call with",
    "book in a call",
    "hop on a call",
    "jump on a call",
    "15-minute call",
    "15 minute call",
    "10-minute call",
    "partnership opportunity",
    "collaboration opportunity",
    "i noticed your business",
    "came across your business",
    "free audit",
    "free website audit",
    // v2.5 (16 Nov 2026): search-ranking pitches ("who ranks above you and how
    // to move above them", One Warwick Park). Never bare "rank" or "near the
    // top": a hotel guest asks about the taxi rank or a room near the top floor.
    "people search google",
    "show up near the top",
    "show up at the top",
    "top of google",
    "ranks above you",
    "rank above you",
    "ranking above you",
    "outrank you",
    "move above them",
    "your competitors",
    "put together a plan",
] as const;

/**
 * Sender domain suffixes that are almost always a sales or tech business.
 * One of these plus one phrase blocks. Never add a country or free-mail suffix.
 */
export const BUSINESS_TLDS = [
    "agency",
    "ai",
    "consulting",
    "digital",
    "growth",
    "io",
    "marketing",
    "media",
    "pro",
    "solutions",
    "tech",
] as const;

/** Elite Tools triage scores are out of 10. This value and below is a low score. */
export const LOW_SCORE_MAX = 3;

const FREE_MAIL_DOMAINS = new Set([
    "aol.com",
    "btinternet.com",
    "gmail.com",
    "googlemail.com",
    "hotmail.co.uk",
    "hotmail.com",
    "icloud.com",
    "live.co.uk",
    "live.com",
    "me.com",
    "msn.com",
    "outlook.com",
    "proton.me",
    "protonmail.com",
    "sky.com",
    "yahoo.co.uk",
    "yahoo.com",
]);

function escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const PHRASE_PATTERNS = PITCH_PHRASES.map((phrase) => ({
    phrase,
    pattern: new RegExp(`\\b${escapeRegExp(phrase)}\\b`, "i"),
}));

const HOLD_WORD_PATTERNS = HOLD_WORDS.map((word) => ({
    word,
    // "website" also catches "web site"; the words of a phrase may be split by
    // any whitespace; every entry allows a plural "s" on its last word.
    pattern: new RegExp(`\\b${word === "website" ? "web\\s?site" : word.split(" ").map(escapeRegExp).join("\\s+")}s?\\b`, "i"),
}));

const SEPARATORS = "[\\s._-]*";
const PHONE_SEPARATORS = "[\\s().-]*";

/** "07852741459" as written any way: 07852 741459, 07852-741-459, +44 7852 741459, +44 (0)7852 741 459. */
function phonePattern(phone: string): RegExp | null {
    const digits = phone.replace(/\D/g, "").replace(/^(?:0044|44)/, "").replace(/^0/, "");
    if (digits.length < 9) return null;
    const national = digits.split("").join(PHONE_SEPARATORS);
    return new RegExp(`(?<![\\d+])(?:(?:\\+|00)?44${PHONE_SEPARATORS}(?:0${PHONE_SEPARATORS})?|0${PHONE_SEPARATORS})${national}(?!\\d)`);
}

const PITCHER_PATTERNS = KNOWN_PITCHERS.map((pitcher) => ({
    label: pitcher.label,
    patterns: [
        ...pitcher.names.map((name) => name.trim()).filter((name) => name.length >= 6)
            .map((name) => new RegExp(`(?<![a-z0-9])${name.split(/\s+/).map(escapeRegExp).join(SEPARATORS)}`, "i")),
        ...[...(pitcher.domains ?? []), ...(pitcher.handles ?? [])].map((entry) => entry.trim()).filter((entry) => entry.length >= 6)
            .map((entry) => new RegExp(`(?<![a-z0-9])${escapeRegExp(entry)}(?![a-z0-9])`, "i")),
        ...(pitcher.phones ?? []).map(phonePattern).filter((pattern): pattern is RegExp => pattern !== null),
    ],
}));

export type SolicitationBusiness = {
    /** Trading names as a pitcher would write them, e.g. ["SparkyBen", "Sparky Ben"]. */
    names?: readonly string[];
    /** The business's own email domains, e.g. ["sparkyben.co.uk"]. Their staff are never third-person flagged. */
    domains?: readonly string[];
};

export type SolicitationInput = {
    email?: string | null;
    name?: string | null;
    subject?: string | null;
    message?: string | null;
    /** Elite Tools triage score out of 10. Omit when no score exists. */
    score?: number | null;
    /** v2: the site's own business, for the third-person check. Optional. */
    business?: SolicitationBusiness | null;
    /**
     * v2.3: set false for the softer filter (HOLD_WORDS ignored), on sites
     * whose real customers ask about SEO or ads. Defaults to true.
     */
    holdWords?: boolean;
    /**
     * v2.6: bot-shape checks, all on by default. Pass `false` to switch every
     * one off, or an object with a check set to `false` to switch just that
     * one off, e.g. `{ script: false }` on a site that takes enquiries in
     * other alphabets, or `{ maxLinks: 5 }` where customers paste links.
     */
    botChecks?: false | BotCheckOptions | null;
};

export type SolicitationResult = {
    blocked: boolean;
    reasons: string[];
};

function normaliseEmail(email: string | null | undefined): string {
    return (email ?? "").trim().toLowerCase();
}

function normaliseDomain(domain: string): string {
    return domain.trim().toLowerCase().replace(/\.+$/, "");
}

function senderDomain(email: string): string | null {
    const at = email.lastIndexOf("@");
    if (at <= 0 || at === email.length - 1) return null;
    const domain = normaliseDomain(email.slice(at + 1));
    return domain || null;
}

function scannedText(input: SolicitationInput): string {
    const fields = [input.name, input.subject, input.message].map((value) => {
        if (typeof value !== "string") return "";
        return value
            .replace(/[\u2018\u2019\u02bc]/g, "'")
            .replace(/[\u2010-\u2013]/g, "-")
            .replace(/[^\S\n]+/g, " ")
            .trim();
    });
    return fields.filter(Boolean).join("\n");
}

function lowScore(score: number | null | undefined): number | null {
    if (typeof score !== "number" || !Number.isFinite(score) || score > LOW_SCORE_MAX) return null;
    return score;
}

function businessTld(domain: string | null): string | null {
    if (!domain || FREE_MAIL_DOMAINS.has(domain)) return null;
    const suffix = domain.slice(domain.lastIndexOf(".") + 1);
    return (BUSINESS_TLDS as readonly string[]).includes(suffix) ? suffix : null;
}

function ownDomain(domain: string | null, business: SolicitationBusiness | null | undefined): boolean {
    if (!domain) return false;
    return (business?.domains ?? []).some((entry) => {
        const own = normaliseDomain(entry);
        return own !== "" && (domain === own || domain.endsWith(`.${own}`));
    });
}

/** "Sparkyben's" style mention of the business. Matches with or without spaces in the name. */
function thirdPersonMention(text: string, business: SolicitationBusiness | null | undefined): string | null {
    for (const raw of business?.names ?? []) {
        const name = raw.trim();
        if (name.length < 3) continue;
        const flexible = name.split(/\s+/).map(escapeRegExp).join("\\s*");
        const match = new RegExp(`\\b(${flexible})'s\\b`, "i").exec(text);
        if (match) return `${match[1].toLowerCase()}'s`;
    }
    return null;
}

// ---------------------------------------------------------------------------
// BOT SHAPE (v2.6, 17 Nov 2026)
//
// Automated posts that carry no pitch words at all: random letter strings
// typed into the name and message, messages stuffed with links, text in
// another alphabet on an English-only site, one-word keyboard noise, and the
// name pasted into the message. Unlike pitch phrases, one bot-shape reason
// holds on its own. Held, not dropped: Matt can release it.
//
// Added after random-letter enquiries ("Solzzg Yaekw", message
// "ZdklGrSEIEbPSeYOculkrm") reached Signature Auto Repairs on 16 and 17 Nov
// 2026. Every check is tuned to pass real UK, Irish, Welsh, Scottish, Polish,
// Indian, Nigerian and romanised Chinese names (see the tests).
// ---------------------------------------------------------------------------

export type BotCheckOptions = {
    /** `bot:random-letters`: a message or subject line that is a random letter string. */
    randomLetters?: boolean;
    /** `bot:random-name` (long consonant run, tripled letter, mixed-case noise, keyboard mash): only reported beside a dotted Gmail address, never alone. */
    randomName?: boolean;
    /** `bot:links:N` (more than `maxLinks` distinct links) and `bot:link-in-name`. */
    links?: boolean;
    /** Most distinct links allowed across name, subject and message. Default MAX_LINKS (2). */
    maxLinks?: number;
    /** `bot:script` (mostly non-Latin letters) and `bot:mixed-script` (Latin and Cyrillic mixed inside one word). */
    script?: boolean;
    /** `bot:noise`: the whole message is keyboard mash, one repeated letter or a vowel-less string. */
    noise?: boolean;
    /** `bot:repeated-fields`: the name repeated as the message or the subject. */
    repeatedFields?: boolean;
    /** `bot:placeholder` (v2.7.1): Lorem ipsum filler ("lorem ipsum", "dolor sit amet", "consectetur adipiscing") anywhere. */
    placeholder?: boolean;
    /** `bot:dotted-email` + `bot:random-name` or `bot:odd-name`: a Gmail address with 3+ dots AND a random or odd-looking name. Neither holds alone. */
    dottedEmail?: boolean;
};

/** More distinct links than this across name, subject and message holds. */
export const MAX_LINKS = 2;
/** A letters-only line at least this long is tested as one random string. */
export const RANDOM_TOKEN_MIN_LENGTH = 10;
/** Consonants in a row in a name word (ch, sh, sz, rz and the like count as one) that no real name has. */
export const NAME_CONSONANT_RUN_HOLD = 7;
/** Consonants in a row that make a word look odd. */
export const CONSONANT_RUN_ODD = 5;
/** Small-letter-to-capital switches inside one word that only random strings have. */
export const CASE_SWITCHES_HOLD = 3;
/** Dots in a Gmail address's local part that, with an odd-looking name, hold. */
export const DOTTED_EMAIL_MIN_DOTS = 3;

/** Common words a real enquiry almost always contains one of. Guards the multi-word gibberish check. */
const COMMON_WORDS = new Set([
    "a", "about", "after", "again", "all", "am", "an", "and", "any", "are", "as", "at", "be", "been", "book",
    "booking", "but", "by", "call", "can", "car", "could", "date", "day", "dear", "do", "does", "for", "from",
    "get", "had", "has", "have", "hello", "help", "hi", "how", "i", "if", "in", "is", "it", "job", "just",
    "know", "like", "looking", "me", "my", "need", "no", "not", "of", "ok", "on", "or", "our", "please",
    "price", "quote", "regards", "so", "table", "thank", "thanks", "that", "the", "there", "this", "time",
    "to", "today", "up", "want", "was", "we", "what", "when", "which", "will", "with", "would", "yes", "you", "your",
]);

const KEYBOARD_ROWS = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];

/** Lorem ipsum filler: real Latin words, so the random-letter checks pass it. Phrases only, never a bare word. */
const PLACEHOLDER_PATTERN = /\b(?:lorem\s+ipsum|dolor\s+sit\s+amet|consectetur\s+adipiscing)\b/i;
/** Template filler left in a form by a script. */
const FILLER_PATTERN = /\b(?:sample\s+text|placeholder\s+text|dummy\s+text|text\s+goes\s+here)\b/i;
/** "test test test", "Testing, testing, testing": the word three or more times in a row. */
const REPEATED_TEST_PATTERN = /\b(test(?:ing)?)\b(?:[\s,.!-]+\1\b){2,}/i;

const LINK_PATTERN = /(?:https?:\/\/|www\.)[^\s<>"']+|\b[a-z0-9][a-z0-9-]*(?:\.[a-z0-9-]+)*\.(?:com|co\.uk|org\.uk|org|net|io|uk|info|site|biz|pro|ru|xyz|top|online|shop|store|live|click|link|ly)\b(?:\/[^\s<>"']*)?/gi;
const EMAIL_PATTERN = /[^\s@<>"']+@[^\s@<>"']+\.[a-z]{2,}/gi;
const GMAIL_DOMAINS = new Set(["gmail.com", "googlemail.com"]);
const DIGRAPHS = /sch|tch|ch|sh|th|ph|gh|kh|zh|wh|rh|ck|sz|cz|rz|dz/g;
const VOWELS = "aeiouy";
// Unicode property patterns are built at runtime so the file compiles on any TypeScript target.
const LETTER = new RegExp("\\p{L}", "u");
const WORD_SPLIT = new RegExp("[^\\p{L}\\p{M}]+", "u");
const LETTER_RUN = new RegExp("[\\p{L}\\p{M}'\\u2019]+", "gu");

/** Latin script, accented letters included (Polish, Irish, Welsh, Vietnamese and the rest). */
function isLatinLetter(code: number): boolean {
    return (code >= 0x41 && code <= 0x5a) || (code >= 0x61 && code <= 0x7a)
        || code === 0xaa || code === 0xb5 || code === 0xba
        || (code >= 0xc0 && code <= 0x24f) || (code >= 0x1e00 && code <= 0x1eff);
}

function isCyrillic(code: number): boolean {
    return code >= 0x400 && code <= 0x52f;
}

/** Strip accents and fold the letters NFD does not split: "Wójcik" to "Wojcik", "Łukasz" to "Lukasz". */
function foldLatin(text: string): string {
    return text.normalize("NFD").replace(/[̀-ͯ]/g, "")
        .replace(/ł/g, "l").replace(/Ł/g, "L").replace(/ø/g, "o").replace(/Ø/g, "O")
        .replace(/đ/g, "d").replace(/Đ/g, "D").replace(/ß/g, "ss").replace(/æ/g, "ae").replace(/Æ/g, "Ae")
        .replace(/œ/g, "oe").replace(/Œ/g, "Oe").replace(/þ/g, "th").replace(/ð/g, "d").replace(/ı/g, "i");
}

/** Letter words of a field, accents folded, apostrophes dropped ("O'Donnell" is one word). */
function letterWords(text: string): string[] {
    return (foldLatin(text).match(LETTER_RUN) ?? []).map((word) => word.replace(/['’]/g, "")).filter(Boolean);
}

function isAsciiWord(word: string): boolean {
    return /^[A-Za-z]+$/.test(word);
}

/** Longest run of consonants, counting y as a vowel and ch, sh, sz, rz and the like as one consonant. */
export function longestConsonantRun(word: string): number {
    let longest = 0;
    let run = 0;
    for (const ch of word.toLowerCase().replace(DIGRAPHS, "c")) {
        run = VOWELS.includes(ch) ? 0 : run + 1;
        if (run > longest) longest = run;
    }
    return longest;
}

/** Small letter followed by a capital, inside one word: "McDonald" has 1, "ZdklGrSEIEb" has 3. */
export function caseSwitches(word: string): number {
    let switches = 0;
    for (let i = 1; i < word.length; i++) {
        const before = word[i - 1];
        const here = word[i];
        if (before !== before.toUpperCase() && here !== here.toLowerCase()) switches++;
    }
    return switches;
}

function vowelShare(word: string): number {
    const lower = word.toLowerCase();
    let vowels = 0;
    for (const ch of lower) if (VOWELS.includes(ch)) vowels++;
    return lower.length === 0 ? 1 : vowels / lower.length;
}

function hasTripleLetter(word: string): boolean {
    return /([a-z])\1\1/i.test(word);
}

/** Keys in a row from one keyboard row ("asdf", "lkjh"), or such a run repeated ("dfgdfg"). */
function isKeyboardMash(word: string): boolean {
    const lower = word.toLowerCase();
    if (lower.length < 4) return false;
    const unit = /^(.{3,}?)\1+$/.exec(lower)?.[1] ?? lower;
    return KEYBOARD_ROWS.some((row) => row.includes(unit) || [...row].reverse().join("").includes(unit));
}

/**
 * True when a whole line is one letters-only string of 10 or more that a
 * person would not type: three or more small-to-capital switches
 * ("ZdklGrSEIEbPSe") or five consonants in a row ("PVJHkgfkkt"). A
 * run-together sentence such as "ineedabrakecheck" passes.
 */
export function isRandomLetterString(text: string): boolean {
    const token = text.trim();
    if (token.length < RANDOM_TOKEN_MIN_LENGTH || !isAsciiWord(token)) return false;
    return caseSwitches(token) >= CASE_SWITCHES_HOLD || longestConsonantRun(token) >= CONSONANT_RUN_ODD;
}

/** A word that looks typed at random. Used only where several such words, and no common word, appear together. */
function isOddWord(word: string): boolean {
    if (word.length < 4 || !isAsciiWord(word)) return false;
    return longestConsonantRun(word) >= CONSONANT_RUN_ODD
        || (word.length >= 6 && caseSwitches(word) >= 2)
        || hasTripleLetter(word)
        || vowelShare(word) === 0
        || (word.length >= 5 && vowelShare(word) <= 0.2);
}

/** Three or more longer words, none of them common, most of them odd: "Zdkl GrSEIEb PSeYOcu". */
function isGibberishText(text: string): boolean {
    const words = letterWords(text);
    if (words.some((word) => COMMON_WORDS.has(word.toLowerCase()))) return false;
    const long = words.filter((word) => word.length >= 4);
    if (long.length < 3) return false;
    return long.filter(isOddWord).length / long.length >= 0.6;
}

/** The whole message is keyboard mash ("asdf", "dfgdfg"), one letter repeated ("aaaa") or one vowel-less string ("xcvbn"). */
function isNoiseMessage(message: string): boolean {
    const trimmed = message.trim();
    if (!trimmed) return false;
    if (/^([a-z])\1{3,}$/i.test(trimmed)) return true;
    const words = trimmed.split(/\s+/);
    if (words.length === 1 && isAsciiWord(trimmed) && trimmed.length >= 5 && vowelShare(trimmed) === 0) return true;
    return words.every((word) => isAsciiWord(word) && isKeyboardMash(word));
}

/**
 * Placeholder or test filler: Lorem ipsum, "sample text", "test" said three
 * or more times in a row ("test test test", "testing, testing, testing").
 * A customer who writes "test" once ("Can you test my boiler?") passes.
 */
function isPlaceholderText(text: string): boolean {
    return PLACEHOLDER_PATTERN.test(text) || FILLER_PATTERN.test(text) || REPEATED_TEST_PATTERN.test(text);
}

/** A line made only of keyboard mash ("asdf", "qwerty asdf"). */
function hasMashLine(text: string): boolean {
    return text.split(/\r?\n/).some((line) => {
        const words = line.trim().split(/\s+/).filter(Boolean);
        return words.length > 0 && words.every((word) => isAsciiWord(word) && isKeyboardMash(word));
    });
}

/** Strong: no real name looks like this. */
function isRandomName(name: string): boolean {
    const trimmed = name.trim();
    if (!trimmed) return false;
    if (isRandomLetterString(trimmed)) return true;
    return letterWords(trimmed).some((word) => isAsciiWord(word) && (
        longestConsonantRun(word) >= NAME_CONSONANT_RUN_HOLD
        || hasTripleLetter(word)
        || (word.length >= RANDOM_TOKEN_MIN_LENGTH && caseSwitches(word) >= CASE_SWITCHES_HOLD)
        || isKeyboardMash(word)
    ));
}

/** Weak: odd, but real names ("Wright", "Schmidt", "Llwyd") can look like this too, so it never holds alone. */
function isOddName(name: string): boolean {
    return letterWords(name).some((word) => isAsciiWord(word) && word.length >= 4 && (
        longestConsonantRun(word) >= CONSONANT_RUN_ODD || vowelShare(word) <= 0.2
    ));
}

/** Distinct links (web addresses and bare domains) in the text. Email addresses are not links. */
export function countLinks(text: string): number {
    const withoutEmails = text.replace(EMAIL_PATTERN, " ");
    const links = withoutEmails.match(LINK_PATTERN) ?? [];
    return new Set(links.map((link) => link.toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/[/.,)!?]+$/, ""))).size;
}

/** Letters by script: Latin, everything else, and whether a word mixes Latin with Cyrillic ("Неllo"). */
function scriptCounts(text: string): { latin: number; other: number; mixedWord: boolean } {
    let latin = 0;
    let other = 0;
    let mixedWord = false;
    for (const word of text.split(WORD_SPLIT)) {
        let wordLatin = 0;
        let wordCyrillic = 0;
        for (const ch of word) {
            if (!LETTER.test(ch)) continue;
            const code = ch.codePointAt(0) ?? 0;
            if (isLatinLetter(code)) {
                latin++;
                wordLatin++;
            } else {
                other++;
                if (isCyrillic(code)) wordCyrillic++;
            }
        }
        if (wordLatin > 0 && wordCyrillic > 0) mixedWord = true;
    }
    return { latin, other, mixedWord };
}

function sameText(a: string, b: string): boolean {
    const norm = (value: string) => value.trim().toLowerCase().replace(/\s+/g, " ");
    const left = norm(a);
    return left.length >= 3 && left === norm(b);
}

function gmailDots(email: string): number {
    const domain = senderDomain(email);
    if (!domain || !GMAIL_DOMAINS.has(domain)) return 0;
    const local = email.slice(0, email.lastIndexOf("@")).split("+")[0];
    return (local.match(/\./g) ?? []).length;
}

/**
 * v2.6: reasons a submission looks automated, in this order:
 * `bot:random-letters`, `bot:noise`, `bot:links:N`, `bot:link-in-name`,
 * `bot:script`, `bot:mixed-script`, `bot:repeated-fields`,
 * `bot:placeholder` (v2.7.1), then `bot:dotted-email` with `bot:random-name` or `bot:odd-name` (a name never
 * holds on its own; only beside a dot-stuffed Gmail address). Empty when it looks like a person wrote it. Any
 * one of these holds. checkSolicitation already includes them; call this
 * only when you need the bot-shape reasons on their own.
 */
export function botShapeReasons(input: SolicitationInput): string[] {
    const options = input.botChecks;
    const reasons: string[] = [];
    if (options === false) return reasons;
    const on = (check: Exclude<keyof BotCheckOptions, "maxLinks">) => !options || options[check] !== false;
    const name = typeof input.name === "string" ? input.name : "";
    const subject = typeof input.subject === "string" ? input.subject : "";
    const message = typeof input.message === "string" ? input.message : "";
    const email = normaliseEmail(input.email);
    const all = [name, subject, message].filter((value) => value.trim() !== "").join("\n");

    if (on("randomLetters")) {
        // Sites often join several fields into `message`, one per line, so each line is tested.
        const lines = [subject, ...message.split(/\r?\n/)];
        if (lines.some(isRandomLetterString) || isGibberishText(message) || isGibberishText(subject)) reasons.push("bot:random-letters");
    }

    if (on("noise") && isNoiseMessage(message)) reasons.push("bot:noise");

    if (on("links")) {
        const max = options && typeof options.maxLinks === "number" ? options.maxLinks : MAX_LINKS;
        const links = countLinks(all);
        if (links > max) reasons.push(`bot:links:${links}`);
        if (countLinks(name) > 0) reasons.push("bot:link-in-name");
    }

    if (on("script")) {
        const { latin, other, mixedWord } = scriptCounts(all);
        if (other >= 3 && other >= latin) reasons.push("bot:script");
        if (mixedWord) reasons.push("bot:mixed-script");
    }

    if (on("repeatedFields") && (sameText(name, message) || sameText(name, subject))) reasons.push("bot:repeated-fields");

    // Keyboard-mash lines count only in the subject and message (a name never
    // holds on its own), and not twice when the whole message is noise.
    if (on("placeholder") && (isPlaceholderText(all)
        || (!reasons.includes("bot:noise") && hasMashLine([subject, message].join("\n"))))) reasons.push("bot:placeholder");

    // A name never holds on its own: real surnames can look random. A random
    // or odd name holds only with a dot-stuffed Gmail address beside it.
    if (on("dottedEmail") && gmailDots(email) >= DOTTED_EMAIL_MIN_DOTS) {
        if (on("randomName") && isRandomName(name)) reasons.push("bot:dotted-email", "bot:random-name");
        else if (isOddName(name)) reasons.push("bot:dotted-email", "bot:odd-name");
    }

    return reasons;
}

// ---------------------------------------------------------------------------
// OWNER TESTS (v2.6, 17 Nov 2026)
// Matt: test enquiries must never reach a client. A submission from one of
// these domains is Boostkit testing the form. Every site route sends it to
// Matt only, through its held channel marked "Test", never to the client.
// ---------------------------------------------------------------------------

export const OWNER_TEST_DOMAINS = ["boostkit.io"] as const;

/** True for matt@boostkit.io and any other @boostkit.io address (exact domain, any case). */
export function isOwnerTest(email: string | null | undefined): boolean {
    const domain = senderDomain(normaliseEmail(email));
    return domain !== null && (OWNER_TEST_DOMAINS as readonly string[]).includes(domain);
}

/**
 * Decide whether a form submission is a vendor pitch.
 * Reasons list what matched, in list order: blocked email, blocked domain,
 * (v2.4) `pitcher:<label>` for a known pitcher, hold words, matched phrases,
 * then `low-score:N` when a low triage score took part, then (v2)
 * `tld:<suffix>` and `third-person:<name>'s` when they took part, then (v2.6)
 * any `bot:...` reasons from botShapeReasons.
 */
export function checkSolicitation(input: SolicitationInput): SolicitationResult {
    const reasons: string[] = [];
    const email = normaliseEmail(input.email);

    if (email && BLOCKED_EMAILS.some((blocked) => blocked.toLowerCase() === email)) {
        reasons.push(`email:${email}`);
    }

    const domain = email ? senderDomain(email) : null;
    if (domain && !FREE_MAIL_DOMAINS.has(domain)) {
        const listed = BLOCKED_DOMAINS.some((entry) => normaliseDomain(entry) === domain);
        if (listed) reasons.push(`domain:${domain}`);
    }

    const text = scannedText(input);
    const pitcherText = [text, email].filter(Boolean).join("\n");
    if (pitcherText) {
        for (const { label, patterns } of PITCHER_PATTERNS) {
            if (patterns.some((pattern) => pattern.test(pitcherText))) reasons.push(`pitcher:${label}`);
        }
    }
    if (text) {
        if (input.holdWords !== false) {
            for (const { word, pattern } of HOLD_WORD_PATTERNS) {
                if (pattern.test(text)) reasons.push(`word:${word}`);
            }
        }
        for (const { phrase, pattern } of PHRASE_PATTERNS) {
            if (pattern.test(text)) reasons.push(`phrase:${phrase}`);
        }
    }

    const phraseCount = reasons.filter((reason) => reason.startsWith("phrase:")).length;
    const score = lowScore(input.score);
    if (phraseCount >= 1 && score !== null) reasons.push(`low-score:${score}`);

    const tld = businessTld(domain);
    if (phraseCount >= 1 && tld !== null) reasons.push(`tld:${tld}`);

    const mention = text && !ownDomain(domain, input.business) ? thirdPersonMention(text, input.business) : null;
    if (phraseCount >= 1 && mention !== null) reasons.push(`third-person:${mention}`);

    reasons.push(...botShapeReasons(input));

    const blocked = reasons.some((reason) => reason.startsWith("email:") || reason.startsWith("domain:") || reason.startsWith("pitcher:") || reason.startsWith("word:") || reason.startsWith("bot:"))
        || phraseCount >= 2
        || (phraseCount >= 1 && (score !== null || tld !== null || mention !== null));

    return { blocked, reasons };
}

// ---------------------------------------------------------------------------
// SCREEN ENQUIRY: the one entry point (v2.7.0, Jev 2.0.0, 17 Nov 2026)
//
// Sites and the central enquiry gate call screenEnquiry() and nothing else.
// It runs, in order:
//  1. Owner test: an @boostkit.io sender returns action "owner-test" (Matt
//     only, marked Test). No Jev call.
//  2. Rules, no network: checkSolicitation (blocked senders, known pitchers,
//     hold words, pitch phrases, bot shape). A hold by anything other than
//     hold words alone is final. No Jev call.
//  3. Jev (TypeSafe), one request, four judgments (JEV_QUESTIONS), on every
//     submission the rules would deliver and on holds by hold words alone.
//     Code decides from the answers (truth table at jevVerdict). Jev never
//     sees the name, email or phone fields, and emails, phone numbers and
//     postcodes inside the text become [email], [phone] and [postcode].
//  4. Fail-open: no key, mode off, the daily cap, a timeout, an HTTP error or
//     a missing answer all keep the rules' verdict.
//
// Replaces pitchJev.ts 1.0.3, which asked Jev only about hold-word holds.
// Eval, thresholds and cost: C:\dev\projects\_HOME\workstreams\jev-pitch-filter\
// (eval/run-eval-v2.ts, eval/score-v2.txt).
// ---------------------------------------------------------------------------

export const PITCH_JEV_VERSION = "2.1.0";

/** Pinned so thresholds tuned on the eval keep meaning the same thing. */
export const JEV_MODEL = "jev-1.14.0";
export const JEV_ENDPOINT = "https://api.typesafe.ai/v1/systemone";
export const JEV_TIMEOUT_MS = 3000;
/** Per site per UTC day, per server instance. A guard against floods, not billing. */
export const DEFAULT_DAILY_CAP = 300;

/**
 * Hold as junk when gibberish or spam reaches 0.7 (TypeSafe's suggested 0.7,
 * not fitted), or (Jev 2.1.0) when spam reaches 0.5 and customer is 0.2 or
 * less. On the 17 Nov 2026 eval (135 cases: 75 genuine, 30 pitches, 30 junk)
 * the highest genuine scores were gibberish 0.29 and spam 0.52 ("Test", with
 * customer 0.32), and every random-letter case scored gibberish 0.86 or more.
 * The second row catches "Hello. And Bye."; at customer 0.3 instead of 0.2 it
 * would sit 0.02 from holding "Test" and ".", so 0.2 was chosen.
 */
export const JUNK_IF = { gibberishMin: 0.7, spamMin: 0.7, spamWithLowCustomerMin: 0.5, lowCustomerMax: 0.2 } as const;

/** Hold as a pitch when both hold. Same 0.7 / 0.3 split as Jev 1.0.x soft sites. */
export const HOLD_IF = { sellingMin: 0.7, customerMax: 0.3 } as const;

/**
 * A hold-word hold on a full-filter site is delivered only for a clear
 * customer (and only when Jev does not call it junk or a pitch). On the eval
 * every threshold from 0.5 / 0.5 to 0.9 / 0.1 gave 0 false delivers.
 */
export const DELIVER_IF = { customerMin: 0.7, sellingMax: 0.3 } as const;

/** The four judgments. Wording here is what the eval measured; change it only with a re-run. */
export const JEV_QUESTIONS = {
    customer: {
        type: "noul",
        instructions:
            "Is the sender a customer, or someone hoping to become one, writing to `business` about something they want from it?",
        criteria: {
            true: "The sender wants to book, buy, get a quote or a visit, ask about the business's own food, rooms, prices or services, or follow up their own booking, job or visit.",
            false: "The sender is offering the business something: marketing, a website, leads, software, a product, a listing or a partnership.",
        },
    },
    selling: {
        type: "noul",
        instructions: "Is the sender trying to sell or promote something to `business`?",
        criteria: {
            true: "The sender offers their own or another company's product, service, software, marketing, leads, listing or partnership to the business.",
            false: "The sender only wants to book with, buy from, work for or ask the business about its own services.",
        },
    },
    gibberish: {
        type: "noul",
        instructions: "Is `message.text` made of random characters rather than real words?",
        criteria: {
            true: "Random letter strings, made-up words or keyboard mashing, such as 'Pfwjdke Hsodmfn' or 'asdf asdf'.",
            false: "Real words in any language, numbers, placeholders such as [phone], or a car registration, however short or misspelt.",
        },
    },
    spam: {
        type: "noul",
        instructions: "Is `message` spam that has nothing to do with `business`?",
        criteria: {
            true: "Adverts for gambling, dating, crypto, prizes or link-building, sent to many websites alike.",
            false: "The message is about the business, its services, or something the sender wants from it.",
        },
    },
} as const;

export type PitchJevMode = "off" | "shadow" | "on";

export type ScreenSite = {
    /** Short site id for logs and the cap, e.g. "sparkyben". */
    id: string;
    /** One plain sentence Jev reads, e.g. "SparkyBen, an electrician in Tunbridge Wells". */
    description: string;
    /** true for the full filter, false for the softer one (hold words ignored). */
    holdWords: boolean;
};

/** Older name, kept so Jev 1.0.x callers compile. */
export type PitchJevSite = ScreenSite;

export type JevAnswer = {
    customer: number;
    selling: number;
    gibberish: number;
    spam: number;
    model: string;
    inputTokens: number | null;
};

/** What code made of Jev's answers. */
export type JevVerdict = "junk" | "pitch" | "customer" | "unsure" | "clean";

export type ScreenAction = "deliver" | "hold" | "owner-test";

export type ScreenResult = {
    /** deliver: send to the client. hold: Matt's held path. owner-test: Matt only, marked Test. */
    action: ScreenAction;
    /** true unless action is "deliver" (kept for Jev 1.0.x callers). */
    blocked: boolean;
    /** Machine-readable reasons for the held notice: rule reasons, then `jev:...` when Jev decided, or `owner-test`. */
    reasons: string[];
    /** Present whenever Jev was due to be asked (answered or not). */
    jev: {
        mode: PitchJevMode;
        /** "clean": the rules would deliver. "words-only": held by hold words alone. */
        path: "clean" | "words-only";
        rules: "hold" | "deliver";
        answer: JevAnswer | null;
        error: string | null;
        verdict: JevVerdict | null;
        final: "hold" | "deliver";
        latencyMs: number;
    } | null;
};

export type ScreenOptions = {
    site: ScreenSite;
    /** Form label for the log line, e.g. "contact". */
    form: string;
    input: SolicitationInput;
    /** Defaults to this file's checkSolicitation. Older callers pass it in. */
    check?: (input: SolicitationInput) => SolicitationResult;
    /** "off" (default), "shadow" (ask and log, rules decide) or "on". Defaults to env.PITCH_JEV_MODE. */
    mode?: PitchJevMode;
    /** Defaults to env.TYPESAFE_API_KEY. */
    apiKey?: string;
    /** Defaults to process.env where it exists. */
    env?: Record<string, string | undefined>;
    fetchImpl?: typeof fetch;
    /** Default JEV_TIMEOUT_MS (3000). */
    timeoutMs?: number;
    /** Calls per site per UTC day on this server instance. false: no cap (the caller caps). Default env.PITCH_JEV_DAILY_CAP or DEFAULT_DAILY_CAP. */
    cap?: number | false;
    now?: () => number;
    log?: (line: string) => void;
};

export function readMode(value: string | undefined): PitchJevMode {
    const mode = (value ?? "").trim().toLowerCase();
    return mode === "shadow" || mode === "on" ? mode : "off";
}

/** Every reason is a hold word: the only kind of hold Jev may lift. */
export function isWordsOnly(result: SolicitationResult): boolean {
    return result.blocked && result.reasons.length > 0 && result.reasons.every((reason) => reason.startsWith("word:"));
}

/**
 * The truth table. Jev judges; this decides.
 * - gibberish >= 0.7 or spam >= 0.7, or spam >= 0.5 with customer <= 0.2: junk, hold.
 * - selling >= 0.7 and customer <= 0.3: pitch, hold.
 * - otherwise, if the rules would deliver: clean, deliver.
 * - otherwise (a hold-word hold): customer >= 0.7 and selling <= 0.3 is a
 *   customer, deliver; anything else is unsure, hold on a full-filter site.
 *   A soft site never holds for hold words, so it never reaches this row.
 */
export function jevVerdict(answer: Pick<JevAnswer, "customer" | "selling" | "gibberish" | "spam">, path: "clean" | "words-only"): JevVerdict {
    if (answer.gibberish >= JUNK_IF.gibberishMin || answer.spam >= JUNK_IF.spamMin) return "junk";
    if (answer.spam >= JUNK_IF.spamWithLowCustomerMin && answer.customer <= JUNK_IF.lowCustomerMax) return "junk";
    if (answer.selling >= HOLD_IF.sellingMin && answer.customer <= HOLD_IF.customerMax) return "pitch";
    if (path === "clean") return "clean";
    return answer.customer >= DELIVER_IF.customerMin && answer.selling <= DELIVER_IF.sellingMax ? "customer" : "unsure";
}

const jevDailyCounts = new Map<string, number>();

function takeFromJevCap(siteId: string, cap: number, now: number): boolean {
    const key = `${siteId}:${new Date(now).toISOString().slice(0, 10)}`;
    const used = jevDailyCounts.get(key) ?? 0;
    if (used >= cap) return false;
    if (jevDailyCounts.size > 200) jevDailyCounts.clear();
    jevDailyCounts.set(key, used + 1);
    return true;
}

/** For tests only. */
export function resetJevCap(): void {
    jevDailyCounts.clear();
}

/** Older name for resetJevCap. */
export const resetPitchJevCap = resetJevCap;

const REDACT_EMAIL = /[A-Z0-9._%+-]+@[A-Z0-9-]+(?:\.[A-Z0-9-]+)+/gi;
// +44 or 0 then 9 or 10 more digits, with spaces, dots, dashes or brackets between.
const REDACT_UK_PHONE = /(?:\+\s*44\s*(?:\(\s*0\s*\)\s*)?|(?<![\w+])0)(?:[\s.()-]*\d){9,10}(?!\d)/g;
// Any other international number: + then 8 to 15 digits.
const REDACT_INTL_PHONE = /\+(?:[\s.()-]*\d){8,15}(?!\d)/g;
// Full UK postcodes, e.g. TN4 0HE, sw1a1aa.
const REDACT_POSTCODE = /\b[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}\b/gi;

/** Replace emails, phone numbers and full postcodes with placeholders (the sites' privacy notices do not name TypeSafe). */
export function redactContactDetails(text: string): string {
    return text
        .replace(REDACT_EMAIL, "[email]")
        .replace(REDACT_UK_PHONE, "[phone]")
        .replace(REDACT_INTL_PHONE, "[phone]")
        .replace(REDACT_POSTCODE, "[postcode]");
}

/** The exact request body sent to Jev: business description, subject and message, redacted. */
export function buildJevRequest(site: ScreenSite, subject: string | null | undefined, message: string | null | undefined) {
    const state: Record<string, unknown> = {
        business: site.description,
        message: {
            ...(subject && subject.trim() ? { subject: redactContactDetails(subject.trim().slice(0, 300)) } : {}),
            text: redactContactDetails((message ?? "").trim().slice(0, 6000)),
        },
    };
    return { model: JEV_MODEL, state, questions: JEV_QUESTIONS };
}

function noulAnswer(answers: unknown, name: string): number | null {
    const answer = (answers as Record<string, { noul?: unknown }> | null | undefined)?.[name];
    const value = answer?.noul;
    return typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 1 ? value : null;
}

/** One Jev request. Never throws; a failure comes back as an error code, never as an answer. */
export async function askJev(
    site: ScreenSite,
    subject: string | null | undefined,
    message: string | null | undefined,
    key: string,
    fetchImpl: typeof fetch = fetch,
    timeoutMs: number = JEV_TIMEOUT_MS,
): Promise<{ answer: JevAnswer | null; error: string | null }> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
        const response = await fetchImpl(JEV_ENDPOINT, {
            method: "POST",
            headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
            body: JSON.stringify(buildJevRequest(site, subject, message)),
            signal: controller.signal,
        });
        if (!response.ok) return { answer: null, error: `http-${response.status}` };
        const body = (await response.json()) as { model?: unknown; answers?: unknown; usage?: { input_tokens?: unknown } };
        const customer = noulAnswer(body.answers, "customer");
        const selling = noulAnswer(body.answers, "selling");
        const gibberish = noulAnswer(body.answers, "gibberish");
        const spam = noulAnswer(body.answers, "spam");
        if (customer === null || selling === null || gibberish === null || spam === null) return { answer: null, error: "missing-answer" };
        const tokens = body.usage?.input_tokens;
        return {
            answer: {
                customer,
                selling,
                gibberish,
                spam,
                model: typeof body.model === "string" ? body.model : JEV_MODEL,
                inputTokens: typeof tokens === "number" ? tokens : null,
            },
            error: null,
        };
    } catch (error) {
        const aborted = controller.signal.aborted || (error instanceof Error && error.name === "AbortError");
        return { answer: null, error: aborted ? "timeout" : "network" };
    } finally {
        clearTimeout(timer);
    }
}

function jevReason(verdict: JevVerdict, answer: JevAnswer): string {
    const n = (value: number) => value.toFixed(2);
    if (verdict === "junk") return `jev:junk (gibberish ${n(answer.gibberish)}, spam ${n(answer.spam)})`;
    return `jev:${verdict === "unsure" ? "unsure-or-pitch" : verdict} (customer ${n(answer.customer)}, selling ${n(answer.selling)})`;
}

/**
 * Screen one form submission. The only function a site or the central gate
 * needs. Never throws: on any unexpected error it returns the rules' verdict.
 */
export async function screenEnquiry(options: ScreenOptions): Promise<ScreenResult> {
    const { site, form, input } = options;
    const check = options.check ?? checkSolicitation;

    if (isOwnerTest(input.email)) return { action: "owner-test", blocked: true, reasons: ["owner-test"], jev: null };

    const baseline = check({ ...input, holdWords: site.holdWords });
    const rulesOnly = (): ScreenResult => ({ action: baseline.blocked ? "hold" : "deliver", blocked: baseline.blocked, reasons: baseline.reasons, jev: null });
    try {
        const env = options.env ?? (typeof process !== "undefined" ? process.env : {});
        const now = options.now ?? Date.now;
        const log = options.log ?? ((line: string) => console.info(line));

        let path: "clean" | "words-only";
        if (!baseline.blocked) path = "clean";
        else if (isWordsOnly(baseline) && isWordsOnly(check({ ...input, name: null, email: null, holdWords: true }))) path = "words-only";
        else return rulesOnly(); // held by rules Jev may not lift, or a hold word only in the name, which Jev cannot see

        const text = `${input.subject ?? ""}${input.message ?? ""}`.trim();
        if (!text) return rulesOnly(); // nothing for Jev to read (callback forms)

        const mode = options.mode ?? readMode(env.PITCH_JEV_MODE);
        if (mode === "off") return rulesOnly();

        const rules: "hold" | "deliver" = baseline.blocked ? "hold" : "deliver";
        const started = now();
        let answer: JevAnswer | null = null;
        let error: string | null = null;
        const key = (options.apiKey ?? env.TYPESAFE_API_KEY ?? "").trim();
        const capValue = Number.parseInt(env.PITCH_JEV_DAILY_CAP ?? "", 10);
        const cap = options.cap === false ? null : options.cap ?? (Number.isFinite(capValue) && capValue >= 0 ? capValue : DEFAULT_DAILY_CAP);
        if (!key) error = "no-key";
        else if (cap !== null && !takeFromJevCap(site.id, cap, started)) error = "daily-cap";
        else ({ answer, error } = await askJev(site, input.subject, input.message, key, options.fetchImpl ?? fetch, options.timeoutMs));
        const latencyMs = Math.max(0, now() - started);

        const verdict = answer ? jevVerdict(answer, path) : null;
        const jevSays: "hold" | "deliver" | null = verdict === null ? null : verdict === "clean" || verdict === "customer" ? "deliver" : "hold";
        const final = mode === "on" && jevSays !== null ? jevSays : rules;

        // Jev's reason is added when it changed the outcome: a hold the rules
        // would have delivered, or a hold-word hold it lifted.
        const changed = mode === "on" && final !== rules;
        const reasons = changed && answer && verdict ? [...baseline.reasons, jevReason(verdict, answer)] : baseline.reasons;

        log(`[screen-enquiry] ${JSON.stringify({
            v: SOLICITATION_FILTER_VERSION,
            jevV: PITCH_JEV_VERSION,
            site: site.id,
            form,
            mode,
            path,
            rules,
            customer: answer ? Number(answer.customer.toFixed(3)) : null,
            selling: answer ? Number(answer.selling.toFixed(3)) : null,
            gibberish: answer ? Number(answer.gibberish.toFixed(3)) : null,
            spam: answer ? Number(answer.spam.toFixed(3)) : null,
            model: answer?.model ?? null,
            tokens: answer?.inputTokens ?? null,
            error,
            verdict,
            final,
            latencyMs,
        })}`);

        return {
            action: final,
            blocked: final === "hold",
            reasons,
            jev: { mode, path, rules, answer, error, verdict, final, latencyMs },
        };
    } catch {
        return rulesOnly();
    }
}
