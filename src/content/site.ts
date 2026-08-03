/**
 * All copy and hard facts for the site, in one place.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * PLACEHOLDER NOTICE
 *
 * Everything marked `TODO(client)` is a plausible stand-in written to the tone
 * of the brand, not a verified fact. It is confined to this file so replacing
 * it is a single editing pass and never a code change. The rest — materials,
 * layout, setting — is described from the client's own photography and is
 * accurate.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const site = {
  name: "Nirvana",
  fullName: "Nirvana Tamarindo Boutique Villas",
  tagline: "Four private villas in Tamarindo, Costa Rica",
  description:
    "Four teak-and-limestone villas, each with its own pool, set behind a gate " +
    "a few streets back from Playa Tamarindo on Costa Rica's Pacific coast.",

  location: {
    town: "Tamarindo",
    province: "Guanacaste",
    country: "Costa Rica",
    // TODO(client): exact street address for maps and schema.org
    address: "Tamarindo, Guanacaste, Costa Rica",
  },

  contact: {
    // TODO(client): real address, number and WhatsApp
    email: "stay@nirvanatamarindo.com",
    phone: "+506 0000 0000",
    whatsapp: "+50600000000",
    airbnb: "https://www.airbnb.com/rooms/53234685",
    whatsappMessage:
      "Hello! We'd like to book a vacation at Nirvana Tamarindo — could you " +
      "share availability and rates?",
    whatsappLabel: "Want to book a vacation?",
  },
} as const;

// ---------------------------------------------------------------------------
// Sections
// ---------------------------------------------------------------------------

export const hero = {
  eyebrow: "Tamarindo · Guanacaste · Costa Rica",
  title: "Nirvana",
  subtitle: "Four private villas, a few streets back from the Pacific.",
  scrollHint: "Scroll to arrive",
  cta: "[ Explore the villas ]",
  // TODO(client): exact coordinates once the street address is confirmed
  coordinates: "10°18′N · 85°50′W",
} as const;

export const threshold = {
  eyebrow: "The arrival",
  headline: "Past the gate, the road goes quiet.",
  body:
    "The property turns inward. One palm walkway runs its length, four villas " +
    "open off it, and nothing passes through. What reaches you from here is " +
    "water, wind in the palms, and not much else.",
} as const;

export const essence = {
  eyebrow: "The idea",
  headline: "Built to be lived in, not looked at.",
  body: [
    "Nirvana was built small on purpose. Four villas, each with its own pool " +
      "and its own walled garden, so the place never feels shared even when " +
      "it's full.",
    "The materials do the work: solid teak ceilings, polished terrazzo " +
      "underfoot, stucco walls that stay cool through the afternoon. Glass " +
      "doors fold back along a whole wall, and the distinction between the " +
      "living room and the terrace stops being useful.",
  ],
  stats: [
    // Verified against the Airbnb listing (airbnb.com/rooms/53234685).
    // TODO(client): confirm total villa count for the whole compound.
    { value: "4", label: "private villas" },
    { value: "6", label: "guests per villa" },
    { value: "7 min", label: "walk to the beach" },
    { value: "4.98", label: "rating · 197 stays" },
  ],
  caption: "The palm walkway, midday",
} as const;

export const villa = {
  eyebrow: "The villas",
  headline: "Every door opens onto water.",
  chapters: [
    {
      title: "The bedroom",
      body:
        "Teak headboards, linen, and a wall of glass that slides away entirely. " +
        "Wake up and the pool is three steps from the bed. Clerestory windows " +
        "run above the wardrobes, so the room fills with light without ever " +
        "being overlooked.",
      image: "bedroom-poolside",
    },
    {
      title: "The living room",
      body:
        "A teak ceiling, porthole windows, and a live-edge table cut from a " +
        "single slab. The room is deep enough to be cool at midday and open " +
        "enough that you'll spend most of it half outside.",
      image: "living-room",
    },
    {
      title: "The kitchen",
      body:
        "Marble island, full-size appliances, everything you need to cook " +
        "properly — and a fish market fifteen minutes away that makes it worth " +
        "doing. Or don't. The terrace is right there.",
      image: "kitchen",
    },
    {
      title: "The pool",
      body:
        "Yours alone, walled in planting, with a palapa and a daybed at the far " +
        "end for when the sun comes round. Lit from within after dark.",
      image: "pool-palapa",
    },
  ],
} as const;

export const details = {
  eyebrow: "The particulars",
  headline: "What's here.",
  // Verified against the Airbnb listing (airbnb.com/rooms/53234685).
  items: [
    { title: "Private pool & BBQ", body: "Walled and planted, lit at night, with an outdoor shower." },
    { title: "Full kitchen", body: "Marble island, full-size appliances, filtered water and ice." },
    { title: "Air conditioning", body: "In every bedroom, plus ceiling fans throughout." },
    { title: "Daily housekeeping", body: "An on-site team tidies the villa every morning." },
    { title: "Concierge", body: "Airport transfers, tours and reservations, arranged for you." },
    { title: "Wifi & workspace", body: "High-speed throughout, with a dedicated office space." },
    { title: "Laundry", body: "Washer and dryer inside each villa." },
    { title: "Gated & secure", body: "24/7 security, keypad self check-in, private parking." },
  ],
} as const;

export const location = {
  eyebrow: "The setting",
  headline: "Close enough to walk. Far enough to sleep.",
  body:
    "Tamarindo is a working surf town on the Nicoya Peninsula — a long, " +
    "consistent beach break, fishing boats on the bay, and enough restaurants " +
    "to eat somewhere different every night. Nirvana sits a few streets back " +
    "from all of it, which is the point.",
  // Beach and town distances verified against the Airbnb listing.
  // TODO(client): verify Langosta and airport times.
  distances: [
    { label: "Playa Tamarindo", value: "7 min walk" },
    { label: "Shops & restaurants", value: "1 min walk" },
    { label: "Playa Langosta", value: "15 min walk" },
    { label: "Liberia airport (LIR)", value: "1 hr 15 drive" },
  ],
} as const;

export const inquiry = {
  eyebrow: "Reservations",
  headline: "Come and stay.",
  body:
    "Tell us when you're thinking of coming and how many of you there are, and " +
    "we'll come back with availability and rates.",
  social: "Guest favourite on Airbnb — rated 4.98 across 197 stays.",
  success: {
    headline: "Thank you.",
    body: "We've got it, and we'll be in touch shortly.",
  },
} as const;

export const nav = [
  { label: "Villas", href: "#villas" },
  { label: "Experience", href: "#story" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact", href: "#inquire" },
] as const;
