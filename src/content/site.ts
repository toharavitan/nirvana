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
  tagline: "Luxury villas & boutique hotel in Tamarindo, Costa Rica",
  description:
    "Nirvana Villas Tamarindo — a family-owned collection of luxury villas in " +
    "the heart of Tamarindo, Costa Rica. Each private villa has its own pool, " +
    "a short walk from the beach, blending modern architecture with the true " +
    "spirit of Pura Vida.",

  // Canonical origin, used for metadata, canonical URLs and schema.org.
  // TODO(client): confirm the live domain (inferred from the contact email).
  url: "https://nirvanatamarindo.com",

  // Search keywords the brand should rank for — kept here so metadata and
  // structured data draw from one list.
  keywords: [
    "Nirvana Villas Tamarindo",
    "villas in Tamarindo",
    "luxury villas Tamarindo Costa Rica",
    "Tamarindo boutique hotel",
    "private pool villa Tamarindo",
    "Tamarindo vacation rental",
    "Guanacaste villas",
    "villas near Playa Tamarindo",
    "family villas Costa Rica",
    "Pura Vida villas",
  ],

  location: {
    town: "Tamarindo",
    province: "Guanacaste",
    country: "Costa Rica",
    countryCode: "CR",
    // ISO 3166-2 region code for Guanacaste, used in geo meta tags.
    regionCode: "CR-G",
    // TODO(client): exact street address for maps and schema.org
    address: "Tamarindo, Guanacaste, Costa Rica",
    // Tamarindo town centre — TODO(client): replace with the villas' exact
    // coordinates once the street address is confirmed.
    latitude: 10.2993,
    longitude: -85.8407,
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
  eyebrow: "Introduction",
  headline: "Your private tropical oasis in the heart of Tamarindo.",
  body: [
    "Nirvana Villas is a family-owned collection of luxury villas, " +
      "thoughtfully designed to bring together modern architecture, natural " +
      "beauty, privacy, and comfort.",
    "Surrounded by lush tropical gardens and just a short walk from the " +
      "beach, each villa offers its own private pool and a peaceful space to " +
      "relax, unwind, and enjoy the true essence of Pura Vida. Welcome to " +
      "Nirvana — your home in paradise.",
  ],
  stats: [
    // Verified against the Airbnb listing (airbnb.com/rooms/53234685).
    // TODO(client): confirm total villa count for the whole compound.
    { value: "4", label: "private villas" },
    { value: "6", label: "guests per villa" },
    { value: "7 min", label: "walk to the beach" },
    { value: "4.99", label: "rating · 206 stays" },
  ],
  caption: "The palm walkway, midday",
} as const;

export const villa = {
  eyebrow: "About the villas",
  headline: "Every door opens onto water.",
  intro: [
    "Nirvana Villas is ideally located in the heart of Tamarindo, with " +
      "everything you need just a short walk away — the beach, restaurants, " +
      "cafés, bars, supermarkets, shops, banks, and local services all within " +
      "easy reach. Enjoy the convenience of being close to everything " +
      "Tamarindo has to offer, while coming home to the peaceful, private " +
      "atmosphere of your own tropical oasis.",
    "Each villa is completely private and thoughtfully designed to combine " +
      "modern architecture with relaxed tropical living. High ceilings, large " +
      "windows, abundant natural light, and an elegant blend of wood, " +
      "concrete, and lush greenery create bright, open spaces that feel both " +
      "sophisticated and inviting.",
  ],
  chapters: [
    {
      title: "The bedrooms",
      body:
        "Three of them, each with teak headboards, linen, and its own air " +
        "conditioning. In the master, a wall of glass slides away entirely — " +
        "wake up and the pool is three steps from the bed. Clerestory windows " +
        "run above the wardrobes, so the rooms fill with light without ever " +
        "being overlooked.",
      image: "bedroom-poolside",
    },
    {
      title: "The living room",
      body:
        "High ceilings, a teak roof, porthole windows, and a live-edge table " +
        "cut from a single slab. Large windows carry the light through, and " +
        "wood, concrete, and greenery meet the way they do outside. Deep enough " +
        "to be cool at midday, open enough that you'll spend most of it half " +
        "outside.",
      image: "living-room",
    },
    {
      title: "The kitchen",
      body:
        "Large and fully equipped — marble island, full-size appliances, " +
        "everything you need to cook properly — and a fish market fifteen " +
        "minutes away that makes it worth doing. Or don't. The terrace is right " +
        "there.",
      image: "kitchen",
    },
    {
      title: "The pool",
      body:
        "Yours alone, walled in planting, with a palapa and a daybed at the far " +
        "end for when the sun comes round, and a full outdoor bathroom at hand " +
        "so the day never has to go inside. Lit from within after dark.",
      image: "pool-palapa",
    },
  ],
} as const;

export const details = {
  eyebrow: "The particulars",
  headline: "What's here.",
  // Verified against the Airbnb listing (airbnb.com/rooms/53234685); the
  // room count, outdoor bathroom, A/C layout, TV, towels, toiletries and
  // square-metre figures are from the owner's own description.
  items: [
    { title: "Three bed, three bath", body: "Three spacious bedrooms and three full bathrooms — plus a fourth, outdoor, beside the pool." },
    { title: "Private pool & BBQ", body: "Walled and planted, lit at night, with an outdoor shower." },
    { title: "Full kitchen", body: "Large and fully equipped — marble island, full-size appliances, filtered water and ice." },
    { title: "Air conditioning", body: "Its own unit in each bedroom and across the living and kitchen areas, with ceiling fans throughout." },
    { title: "Wifi & workspace", body: "Reliable high-speed throughout, with a dedicated desk for the days you're half working." },
    { title: "TV & cable", body: "In the living room, for the evenings you'd rather stay in." },
    { title: "Towels & toiletries", body: "Fresh bath and pool towels, and bath products made in Costa Rica by a family business we're glad to support." },
    { title: "Daily housekeeping", body: "An on-site team tidies the villa every morning." },
    { title: "Concierge", body: "Airport transfers, tours and reservations, arranged for you." },
    { title: "Laundry", body: "Washer and dryer inside each villa." },
    { title: "Gated & secure", body: "24/7 security, keypad self check-in, private parking." },
    { title: "Room to spread out", body: "About 240 m² (2,583 sq ft) of private space in all, 160 m² (1,722 sq ft) of it under roof." },
  ],
} as const;

export const location = {
  eyebrow: "Experience Tamarindo",
  headline: "More than a destination — a way of life.",
  body:
    "Tamarindo is a vibrant beach town where tropical nature, warm Pacific " +
    "waters, beautiful sunsets, local culture, and an international community " +
    "come together. Here, life moves at a different rhythm — relaxed, warm, " +
    "and unhurried. Slow down, reconnect, embrace the moment, and experience " +
    "the true spirit of Pura Vida.",
  // Beach and town distances verified against the Airbnb listing.
  // TODO(client): verify Langosta and airport times.
  distances: [
    { label: "Playa Tamarindo", value: "7 min walk" },
    { label: "Shops & restaurants", value: "1 min walk" },
    { label: "Playa Langosta", value: "15 min walk" },
    { label: "Liberia airport (LIR)", value: "1 hr 15 drive" },
  ],
} as const;

export const fieldNotes = {
  eyebrow: "Field notes",
  headline: "Guanacaste keeps its own record.",
  // TODO(client): the second sentence of the first paragraph is a plausible
  // stand-in — confirm whether wild guaria morada is actually still found
  // locally, and name the spot if so. The 1939 date and the 1880s survey are
  // verifiable public fact and safe to keep as written.
  body: [
    "The guaria morada — Costa Rica's national flower since 1939 — is an " +
      "orchid native to this coast, and still turns up wild on old fence " +
      "posts and shade trees around town.",
    "The province was first surveyed in any real detail in the 1880s, when " +
      "Guanacaste's boundary was still being drawn on paper. The coastline it " +
      "traced has changed very little since: the same bay, the same reef " +
      "break, the same run of sand.",
  ],
  caption: "Guanacaste, in fragments",
} as const;

export const inquiry = {
  eyebrow: "Reservations",
  headline: "Come and stay.",
  body:
    "Tell us when you're thinking of coming and how many of you there are, and " +
    "we'll come back with availability and rates.",
  social: "Guest favourite on Airbnb — rated 4.99 across 206 stays.",
  success: {
    headline: "Thank you.",
    body: "We've got it, and we'll be in touch shortly.",
  },
} as const;

export const experiences = {
  // The concierge introduces the page before the menu of experiences.
  concierge: {
    eyebrow: "Nirvana Concierge",
    headline: "More than a service — a personal touch to your stay.",
    body: [
      "Our Nirvana Concierge is here to help you experience the very best of " +
        "Tamarindo and Costa Rica, taking care of the details so you can simply " +
        "enjoy every moment.",
      "From sunset catamarans, surfing and adventure tours to private chefs, " +
        "in-villa massages, hidden beaches, nature experiences and airport " +
        "transfers, we can help create a stay that feels entirely your own.",
    ],
    tagline: "Your stay. Your experience. Your Pura Vida.",
  },

  eyebrow: "Experiences",
  headline: "Discover Costa Rica, your way.",
  intro:
    "From ocean adventures and tropical wildlife to waterfalls, volcanoes and " +
    "unforgettable sunsets, Costa Rica is yours to explore. Our Nirvana " +
    "Concierge can help you discover and arrange carefully selected " +
    "experiences throughout Tamarindo and beyond — making every part of your " +
    "stay effortless.",

  menu: [
    {
      category: "Ocean",
      items: ["Surfing", "Catamaran", "Private Yacht", "Snorkeling", "Scuba Diving"],
    },
    {
      category: "Adventure",
      items: ["ATV", "UTV", "Zip Line", "River Tubing", "Horseback Riding"],
    },
    {
      category: "Nature",
      items: ["Rio Celeste", "Waterfalls", "Sloths", "Wildlife", "Tamarindo Estuary"],
    },
    {
      category: "Volcano & Rainforest",
      items: ["Rincón de la Vieja", "Hot Springs", "Mud Baths", "Hanging Bridges"],
    },
    {
      category: "Wellness",
      items: ["In-Villa Massage", "Relaxation", "Wellness"],
    },
    {
      category: "Explore",
      items: ["Nearby Beaches", "Private Transportation", "Golf Cart Rental"],
    },
  ],

  closing: {
    headline: "Let us create your experience.",
    body:
      "Contact our concierge to discover more experiences and plan your stay.",
    // The full concierge guide of everything we arrange.
    // TODO(client): this is a temporary Google Drive link — replace it with the
    // final guide once the organised folder of activities is ready.
    guideLabel: "Explore all experiences",
    guideUrl:
      "https://drive.google.com/file/d/1FRC7_vWeAnR_i_WGnuQRmMNzwUToxPnx/view",
    contactLabel: "Contact the concierge",
  },
} as const;

// ---------------------------------------------------------------------------
// Reviews
//
// Real guest reviews, pulled from the Airbnb listing (airbnb.com/rooms/53234685)
// in the guests' original English. The aggregate (rating / count / badge) is
// what Airbnb showed on 2026-09-18 — refresh it periodically. This is a curated
// selection shown in an on-site pop-up; the full set is linked out to Airbnb.
// TODO(client): top up this list from time to time, and update the aggregate.
// ---------------------------------------------------------------------------
export const reviews = {
  eyebrow: "Reviews",
  headline: "What guests say.",
  rating: "4.99",
  count: 206,
  badge: "Guest favourite",
  // Airbnb's own line: top 10% of homes, by ratings, reviews and reliability.
  distinction: "Top 10% of homes on Airbnb",
  url: site.contact.airbnb,
  allUrl: "https://www.airbnb.com/rooms/53234685/reviews",
  items: [
    {
      name: "Kiera",
      location: "New City, New York",
      date: "September 2026",
      text:
        "Absolutely loved this place! The villa was beautiful and so close to " +
        "the beach and amazing restaurants and bars. Our host was so helpful " +
        "and helped with booking all our excursions and recommended great " +
        "restaurants and things to do in the area. Would highly recommend and " +
        "would stay here again!",
    },
    {
      name: "Andrea",
      location: "New York, New York",
      date: "August 2026",
      text:
        "Loved our time staying at Nirvana Villas! As a group of 3 girls " +
        "staying alone, felt very safe and the team is so nice and responsive! " +
        "Thank you!!",
    },
    {
      name: "Susanne",
      location: "Airbnb guest of 12 years",
      date: "August 2026",
      text:
        "We very much enjoyed our 4 nights at Nirvana Villas. Everything was " +
        "as pictured. The location is walking distance to the beach and shops " +
        "and restaurants. The hosts helped us with organizing a day trip and " +
        "provided us with great recommendations for restaurants. We enjoyed " +
        "the villa and the pool.",
    },
    {
      name: "Carina",
      location: "Airbnb guest of 4 years",
      date: "August 2026",
      text:
        "We had a fantastic time at Nirvana Villas. The place is even better " +
        "than in the photos. The designer of the villa thought of every " +
        "little detail — huge space, very functional, amazing pool with a " +
        "large area to sit, covered from rain. The daily cleaning service was " +
        "a huge bonus also. This is the most professionally managed property " +
        "we have ever stayed in.",
    },
    {
      name: "JoDina",
      location: "Everett, Washington",
      date: "August 2026",
      text:
        "Such a gem in the heart of Tamarindo. Steps from everything you need " +
        "to enjoy your stay. The house and pool are stunning. I highly " +
        "recommend staying at Nirvana. You will not regret it!",
    },
    {
      name: "Irene",
      location: "Miami Shores, Florida",
      date: "July 2026",
      text:
        "The villa was above and beyond our expectations. Beautifully designed " +
        "with careful attention to every detail. The location was excellent — " +
        "walking distance to the beach, restaurants, shops, etc. Our hosts " +
        "were friendly and helpful, providing great recommendations to beach " +
        "clubs and restaurants. We will definitely come back again.",
    },
    {
      name: "Chris",
      location: "Airbnb guest of 5 years",
      date: "July 2026",
      text:
        "Our stay was amazing! The pictures do not do these villas justice. " +
        "The villa itself was perfect, clean and opened to a beautiful " +
        "landscaped pool, which was a hit for our family. The villas were " +
        "close enough to town without all the noise, as was described, but the " +
        "service from the hosts was top notch and made our experience here in " +
        "Tamarindo even better. Highly recommend this place to any and everyone.",
    },
    {
      name: "Jennifer",
      location: "Fredericksburg, Virginia",
      date: "June 2026",
      text:
        "This was our third time staying at Nirvana and it feels like a home " +
        "now. We're always so impressed by the level of service and kindness " +
        "we receive. They set up multiple excursions for us as well as our " +
        "transportation to and from the airport, and have great local " +
        "recommendations. A team comes daily to tidy up around the villa and " +
        "pool. I didn't lift a finger from the moment I arrived at the airport " +
        "to the moment we departed. The location is amazing — not in the " +
        "middle of all the hustle and bustle of Tamarindo, but simply around " +
        "the corner, so it's quite a bit more peaceful. It's truly a dream " +
        "spot. I can't wait to return.",
    },
    {
      name: "Daniel",
      location: "Airbnb guest of 3 years",
      date: "June 2026",
      text:
        "The Nirvana Villas were absolutely incredible. The property is " +
        "impeccable, with easy access to the beach, Tamarindo's best dining, " +
        "and great nightlife. I highly recommend staying at Nirvana if you're " +
        "making the trip!",
    },
    {
      name: "Ryan",
      location: "Jacksonville Beach, Florida",
      date: "May 2026",
      text:
        "This place is amazing. The place itself is like a work of art. Every " +
        "detail seemed to have been thought out. Super close to some good " +
        "restaurants and walkable to the beach and all of Tamarindo. The hosts " +
        "are amazing and very helpful. Stayed with young kids who had a blast. " +
        "10/10 would definitely stay again.",
    },
    {
      name: "Vernon",
      location: "Niagara-on-the-Lake, Canada",
      date: "May 2026",
      text:
        "Amazing stay and experience at this beautiful oasis in the heart of " +
        "Tamarindo! Our hosts were always responsive and friendly, arranging " +
        "local adventures including airport transport and surfing. Would " +
        "definitely recommend and would return!",
    },
    {
      name: "Alexander",
      location: "Chicago, Illinois",
      date: "July 2026",
      text:
        "Loved staying here! Great location, super clean, extremely friendly. " +
        "10/10.",
    },
  ],
} as const;

// ---------------------------------------------------------------------------
// Concierge guide
//
// The printed experiences guide, shown on-site as a page-flip "magazine" rather
// than an outbound PDF link. Pages live in /public/guide as page-01.webp …
// page-NN.webp, rasterised from the source PDF (~1200px, WebP, ~140KB each).
// TODO(client): when the guide is updated, re-export the pages and adjust
// pageCount; downloadUrl still points at the original Google Drive PDF.
// ---------------------------------------------------------------------------
export const guide = {
  title: "What to do while visiting Tamarindo",
  subtitle: "The Nirvana experiences guide",
  pageCount: 20,
  pathBase: "/guide/page-",
  downloadUrl:
    "https://drive.google.com/file/d/1FRC7_vWeAnR_i_WGnuQRmMNzwUToxPnx/view",
} as const;

// ---------------------------------------------------------------------------
// The individual villas
//
// Each has its own page at /villas/<slug>. The sixth carries a name, Almendro,
// rather than a number.
// TODO(client): give villas 01–05 their real names, and per-villa copy/photos.
// Right now every villa page shares the same room, amenity and gallery content.
// ---------------------------------------------------------------------------
export const villas = [
  { slug: "villa-01", label: "Villa 01", name: "Villa 01", number: "01", image: "pool-villa-day" },
  { slug: "villa-02", label: "Villa 02", name: "Villa 02", number: "02", image: "terrace-pool" },
  { slug: "villa-03", label: "Villa 03", name: "Villa 03", number: "03", image: "bedroom-poolside" },
  { slug: "villa-04", label: "Villa 04", name: "Villa 04", number: "04", image: "indoor-outdoor" },
  { slug: "villa-05", label: "Villa 05", name: "Villa 05", number: "05", image: "pool-palapa" },
  { slug: "almendro", label: "Almendro", name: "Almendro", number: "06", image: "pool-dusk" },
] as const;

export type NavItem = {
  label: string;
  href: string;
  menu?: readonly { label: string; href: string }[];
};

export const nav: readonly NavItem[] = [
  {
    label: "Villas",
    href: "/villas",
    menu: [
      { label: "All villas", href: "/villas" },
      ...villas.map((v) => ({ label: v.label, href: `/villas/${v.slug}` })),
    ],
  },
  { label: "Experiences", href: "/experiences" },
  { label: "Reservation", href: "/reservation" },
];
