// ============ ROAD TRIP PLAYLISTS ============
// A curated soundtrack for each leg of the Boston → Miami road trip.
// Geography-inspired picks for 3 British lads driving across the East Coast.

export type PlaylistTrack = {
  title: string;
  artist: string;
  whyItFits: string;
};

export type LegPlaylist = {
  leg: string;
  vibe: string;
  spotifySearchUrl: string;
  tracks: PlaylistTrack[];
};

export const LEG_PLAYLISTS: LegPlaylist[] = [
  // ── Leg 1: Boston → New York ─────────────────────────────────────
  {
    leg: "Boston → New York",
    vibe: "Getting started energy — indie rock meets city anthems",
    spotifySearchUrl: `https://open.spotify.com/search/${encodeURIComponent("Boston → New York road trip")}`,
    tracks: [
      {
        title: "Shipping Up to Boston",
        artist: "Dropkick Murphys",
        whyItFits: "You literally are shipping out of Boston",
      },
      {
        title: "More Than a Feeling",
        artist: "Boston",
        whyItFits: "The band IS the city — mandatory opener",
      },
      {
        title: "Where Is My Mind",
        artist: "Pixies",
        whyItFits: "Boston legends to soundtrack the I-90 on-ramp",
      },
      {
        title: "A-Punk",
        artist: "Vampire Weekend",
        whyItFits: "Columbia kids with New England energy",
      },
      {
        title: "Last Nite",
        artist: "The Strokes",
        whyItFits: "NYC garage rock to ease you into Manhattan",
      },
      {
        title: "All My Friends",
        artist: "LCD Soundsystem",
        whyItFits: "For the lads — because that's what this trip is about",
      },
      {
        title: "Livin' on a Prayer",
        artist: "Bon Jovi",
        whyItFits: "You're driving through New Jersey — it's the law",
      },
      {
        title: "Empire State of Mind",
        artist: "Jay-Z feat. Alicia Keys",
        whyItFits: "Cue this as the skyline appears",
      },
      {
        title: "New York, New York",
        artist: "Frank Sinatra",
        whyItFits: "The only acceptable arrival anthem",
      },
    ],
  },

  // ── Leg 2: New York → Philadelphia ───────────────────────────────
  {
    leg: "New York → Philadelphia",
    vibe: "Short drive, big tunes — classic rock and hype",
    spotifySearchUrl: `https://open.spotify.com/search/${encodeURIComponent("New York → Philadelphia road trip")}`,
    tracks: [
      {
        title: "Born to Run",
        artist: "Bruce Springsteen",
        whyItFits: "The Boss owns the Jersey Turnpike",
      },
      {
        title: "Piano Man",
        artist: "Billy Joel",
        whyItFits: "Three lads belting this at full volume — guaranteed",
      },
      {
        title: "Because the Night",
        artist: "Patti Smith",
        whyItFits: "NYC punk queen meets Springsteen songwriting",
      },
      {
        title: "You Make My Dreams",
        artist: "Hall & Oates",
        whyItFits: "Philly's finest pop duo warms up the welcome",
      },
      {
        title: "The Seed 2.0",
        artist: "The Roots",
        whyItFits: "Philly hip-hop royalty on the approach",
      },
      {
        title: "Dreams and Nightmares",
        artist: "Meek Mill",
        whyItFits: "Philly's official anthem — the intro goes OFF",
      },
      {
        title: "End of the Road",
        artist: "Boyz II Men",
        whyItFits: "Philly smooth vocals for the Turnpike crawl",
      },
      {
        title: "Red Eyes",
        artist: "The War on Drugs",
        whyItFits: "Philly indie rock — perfect cruising tempo",
      },
    ],
  },

  // ── Leg 3: Philadelphia → Washington DC ──────────────────────────
  {
    leg: "Philadelphia → Washington DC",
    vibe: "Smooth cruise through history",
    spotifySearchUrl: `https://open.spotify.com/search/${encodeURIComponent("Philadelphia → Washington DC road trip")}`,
    tracks: [
      {
        title: "What's Going On",
        artist: "Marvin Gaye",
        whyItFits: "DC soul — still the most relevant question in the capital",
      },
      {
        title: "A Change Is Gonna Come",
        artist: "Sam Cooke",
        whyItFits: "Driving past the monuments hits different with this on",
      },
      {
        title: "Bustin' Loose",
        artist: "Chuck Brown",
        whyItFits: "The godfather of Go-Go — DC's own genre",
      },
      {
        title: "Waiting Room",
        artist: "Fugazi",
        whyItFits: "DC hardcore legends — Ian MacKaye is a local hero",
      },
      {
        title: "Banned in D.C.",
        artist: "Bad Brains",
        whyItFits: "Punk-reggae fury from the District itself",
      },
      {
        title: "Filler",
        artist: "Minor Threat",
        whyItFits: "80 seconds of DC straight edge to wake everyone up",
      },
      {
        title: "Lotus Flower Bomb",
        artist: "Wale",
        whyItFits: "DC's own rapper repping the DMV",
      },
      {
        title: "Do You Know What Time It Is",
        artist: "Rare Essence",
        whyItFits: "Go-Go deep cut — you're in DC now, feel the bounce",
      },
    ],
  },

  // ── Leg 4: DC → Nashville ────────────────────────────────────────
  {
    leg: "DC → Nashville",
    vibe: "Country roads and mountain passes — longest drive, best soundtrack",
    spotifySearchUrl: `https://open.spotify.com/search/${encodeURIComponent("DC → Nashville road trip")}`,
    tracks: [
      {
        title: "Take Me Home, Country Roads",
        artist: "John Denver",
        whyItFits: "You're literally driving through West Virginia",
      },
      {
        title: "Ring of Fire",
        artist: "Johnny Cash",
        whyItFits: "The Man in Black for the long mountain haul",
      },
      {
        title: "9 to 5",
        artist: "Dolly Parton",
        whyItFits: "Tennessee's queen welcomes you from 200 miles out",
      },
      {
        title: "Tennessee Whiskey",
        artist: "Chris Stapleton",
        whyItFits: "Smooth as the bourbon you'll be drinking tonight",
      },
      {
        title: "Ramblin' Man",
        artist: "The Allman Brothers Band",
        whyItFits: "Southern rock for a southern road — born to ramble",
      },
      {
        title: "Hey Good Lookin'",
        artist: "Hank Williams",
        whyItFits: "Classic country to carry you through the Shenandoah Valley",
      },
      {
        title: "Turtles All the Way Down",
        artist: "Sturgill Simpson",
        whyItFits: "Modern outlaw country for the winding mountain roads",
      },
      {
        title: "Feathered Indians",
        artist: "Tyler Childers",
        whyItFits: "Appalachian soul — this song was made for these roads",
      },
      {
        title: "Cover Me Up",
        artist: "Jason Isbell",
        whyItFits: "The most beautiful song in modern country, full stop",
      },
      {
        title: "Free Bird",
        artist: "Lynyrd Skynyrd",
        whyItFits: "Mandatory on any American road trip — save the solo for the last 5 miles",
      },
    ],
  },

  // ── Leg 5: Nashville → Miami ─────────────────────────────────────
  {
    leg: "Nashville → Miami",
    vibe: "From honky-tonks to palm trees — country fading into Latin beats",
    spotifySearchUrl: `https://open.spotify.com/search/${encodeURIComponent("Nashville → Miami road trip")}`,
    tracks: [
      {
        title: "Midnight Rider",
        artist: "The Allman Brothers Band",
        whyItFits: "Southern rock for the early Georgia miles",
      },
      {
        title: "Hey Ya!",
        artist: "OutKast",
        whyItFits: "Shake it like a Polaroid picture through Atlanta",
      },
      {
        title: "Move Bitch",
        artist: "Ludacris",
        whyItFits: "For Atlanta traffic — you'll understand when you're in it",
      },
      {
        title: "Free Fallin'",
        artist: "Tom Petty",
        whyItFits: "Gainesville, FL legend — you're in his backyard now",
      },
      {
        title: "Give Me Everything",
        artist: "Pitbull feat. Ne-Yo",
        whyItFits: "Mr. 305 announces your arrival to South Florida",
      },
      {
        title: "Conga",
        artist: "Gloria Estefan",
        whyItFits: "Miami Sound Machine energy as the palm trees appear",
      },
      {
        title: "La Vida Es Un Carnaval",
        artist: "Celia Cruz",
        whyItFits: "The queen of salsa for Little Havana vibes",
      },
      {
        title: "Dakiti",
        artist: "Bad Bunny & Jhay Cortez",
        whyItFits: "Latin heat for the final stretch on I-95",
      },
      {
        title: "Miami",
        artist: "Will Smith",
        whyItFits: "Welcome to Miami — bienvenido a Miami",
      },
      {
        title: "Margaritaville",
        artist: "Jimmy Buffett",
        whyItFits: "You made it — park the car, grab a drink, you're done",
      },
    ],
  },
];
