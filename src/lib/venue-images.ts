// Maps venue names to arrays of image URLs for the city guide carousels.
// Separate file to keep city-profiles.ts clean and make images easy to update.
//
// All images sourced from Unsplash (images.unsplash.com).
// To swap a photo: replace the photo-{id} portion of any URL.

const u = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=800&h=600&fit=crop&q=80`;

// ─── Reusable category photos ───────────────────────────────────────────────
// These are assigned to multiple venues of the same type.

const SEAFOOD = [
  u("1559339352-11d035aa65de"), // lobster roll
  u("1615141982883-c7ad0e69fd62"), // oyster platter
  u("1534604973900-c43ab4c2e0ab"), // clam chowder bowl
];

const PIZZA = [
  u("1565299624946-b28f40a0ae38"), // pizza margherita
  u("1574071318508-1cdbab80d002"), // brick oven pizza
  u("1513104890138-7c749659a591"), // pizza slice
];

const ITALIAN = [
  u("1551183053-bf91a1d81141"), // pasta dish
  u("1595295333158-4742f28fbd85"), // Italian restaurant interior
  u("1498579150354-977475b7ea0b"), // Italian food spread
];

const BBQ = [
  u("1529193591184-b1d58069ecdd"), // smoked brisket
  u("1544025162-d76694265947"), // BBQ platter
  u("1558030006-450675393462"), // ribs close-up
];

const DELI = [
  u("1553909489-cd47e0907980"), // stacked deli sandwich
  u("1619096252214-ef06c45683e3"), // pastrami sandwich
  u("1509722747-f5abb26d1e9d"), // deli counter
];

const TACOS = [
  u("1565299585323-38d6b0865b47"), // street tacos
  u("1551504734-5ee1c4a1479b"), // tacos al pastor
  u("1599974579688-8dbdd335c77f"), // taco plate
];

const CRAFT_BEER = [
  u("1535958636474-b021ee887b13"), // craft beer flight
  u("1559526642-c3f001ea68ee"), // brewery taproom
  u("1575037614876-c38a4d44f5b8"), // beer hall interior
];

const ROOFTOP = [
  u("1470337458703-46a1888eb515"), // rooftop bar city skyline
  u("1517457373958-b7bdd4587205"), // cocktail with city view
  u("1514933651103-005eec06c04b"), // evening rooftop lounge
];

const SPORTS_BAR = [
  u("1574629810360-7efbbe195018"), // sports bar screens
  u("1567696153798-9111f9cd3d85"), // fans watching game
  u("1504754524776-8f4f37790ca0"), // bar with tvs
];

const DIVE_BAR = [
  u("1572116469696-31bfe79e56ab"), // dimly lit bar
  u("1514933651103-005eec06c04b"), // dive bar atmosphere
  u("1543007630-9710e4a00a20"), // neon bar sign
];

const LIVE_MUSIC = [
  u("1493225457124-a3eb161ffa5f"), // jazz club stage
  u("1511735111819-9a3f7709049c"), // live band performing
  u("1514525253161-7a46d19cd819"), // concert venue
];

const BREWERY = [
  u("1559526642-c3f001ea68ee"), // brewery interior
  u("1535958636474-b021ee887b13"), // beer flight
  u("1575037614876-c38a4d44f5b8"), // taproom
];

const BRUNCH = [
  u("1504754524776-8f4f37790ca0"), // brunch spread
  u("1533089860892-a7c6f0a88666"), // eggs benedict
  u("1495214783159-3503fd1f003e"), // coffee and pastries
];

const FRIED_CHICKEN = [
  u("1626645738196-c2a98082c326"), // fried chicken plate
  u("1562967914-01efa7e87832"), // crispy fried chicken
  u("1585937421612-70a008356fbe"), // chicken sandwich
];

const CUBAN = [
  u("1512058564366-18510be2db19"), // Cuban food plate
  u("1551504734-5ee1c4a1479b"), // Latin food
  u("1565299585323-38d6b0865b47"), // tropical food
];

const BURGER = [
  u("1568901346375-23c9450c58cd"), // gourmet burger
  u("1550547660-d9450f859349"), // stacked burger
  u("1586190848861-99aa4a171e90"), // burger and fries
];

const STEAKHOUSE = [
  u("1558030089-02acba3367b0"), // steak dinner
  u("1544025162-d76694265947"), // steak platter
  u("1546833998-877b37c2e5c6"), // fine dining steak
];

const SUSHI = [
  u("1579871494447-9811cf80d66c"), // sushi platter
  u("1553621042-f6e147245754"), // sushi rolls
  u("1583623025817-d180a2221d0a"), // nigiri assortment
];

const BAKERY = [
  u("1509440159596-0249088772ff"), // pastries display
  u("1517433670267-08bbd4be890f"), // fresh bread bakery
  u("1495214783159-3503fd1f003e"), // coffee and pastry
];

const FOOD_HALL = [
  u("1555396273-367ea4eb4db5"), // food hall interior
  u("1567521464027-f127ff144326"), // market food stalls
  u("1544025162-d76694265947"), // food spread
];

const COCKTAIL_BAR = [
  u("1514362545857-3bc16c8c7f1b"), // craft cocktails
  u("1551024709-8f23befc6f87"), // cocktail bar
  u("1517457373958-b7bdd4587205"), // mixology
];

const CHEESESTEAK = [
  u("1553909489-cd47e0907980"), // Philly cheesesteak style sandwich
  u("1619096252214-ef06c45683e3"), // hot sandwich
  u("1509722747-f5abb26d1e9d"), // sandwich counter
];

const MIDDLE_EASTERN = [
  u("1540914124281-342587941389"), // hummus mezze spread
  u("1547573854-74d2a71d0826"), // falafel plate
  u("1585937421612-70a008356fbe"), // Mediterranean food
];

const INDIAN = [
  u("1585937421612-70a008356fbe"), // curry dish
  u("1547573854-74d2a71d0826"), // Indian spread
  u("1540914124281-342587941389"), // spiced platter
];

const SOUTHERN = [
  u("1626645738196-c2a98082c326"), // soul food plate
  u("1562967914-01efa7e87832"), // fried chicken
  u("1504754524776-8f4f37790ca0"), // comfort food spread
];

const FRENCH = [
  u("1414235077428-338989a2e8c0"), // French bistro
  u("1551183053-bf91a1d81141"), // French cuisine
  u("1498579150354-977475b7ea0b"), // brasserie setting
];

const GREEK = [
  u("1540914124281-342587941389"), // Mediterranean spread
  u("1547573854-74d2a71d0826"), // grilled octopus
  u("1551183053-bf91a1d81141"), // Mediterranean restaurant
];

const VEGAN = [
  u("1512621776951-a57141f2eefd"), // plant-based food
  u("1543339308-a64c9d94d77c"), // vegan burger
  u("1568901346375-23c9450c58cd"), // gourmet plant burger
];

const HAWAIIAN = [
  u("1565299585323-38d6b0865b47"), // tropical food
  u("1551504734-5ee1c4a1479b"), // island platter
  u("1544025162-d76694265947"), // plate lunch style
];

const DONUT = [
  u("1509440159596-0249088772ff"), // donuts display
  u("1495214783159-3503fd1f003e"), // donut and coffee
  u("1517433670267-08bbd4be890f"), // bakery case
];

const PERUVIAN = [
  u("1565299585323-38d6b0865b47"), // ceviche
  u("1551504734-5ee1c4a1479b"), // seafood platter
  u("1540914124281-342587941389"), // Latin cuisine
];

const ASIAN_BBQ = [
  u("1529193591184-b1d58069ecdd"), // grilled meat
  u("1544025162-d76694265947"), // BBQ platter
  u("1553621042-f6e147245754"), // Asian dishes
];

const CLUB = [
  u("1514525253161-7a46d19cd819"), // nightclub scene
  u("1493225457124-a3eb161ffa5f"), // dance floor lights
  u("1511735111819-9a3f7709049c"), // nightlife
];

const SHOPPING_STREET = [
  u("1555396273-367ea4eb4db5"), // shopping street
  u("1567521464027-f127ff144326"), // retail corridor
];

const MARKET = [
  u("1555396273-367ea4eb4db5"), // indoor market
  u("1567521464027-f127ff144326"), // market stalls
];

// ─── Venue image map ────────────────────────────────────────────────────────
// Every venue name from city-profiles.ts mapped to 3-4 images.

const IMAGES: Record<string, string[]> = {
  // ═══════════════════════════════════════════════════════════════════════════
  //  BOSTON — Restaurants
  // ═══════════════════════════════════════════════════════════════════════════
  "Neptune Oyster": SEAFOOD,
  "Legal Sea Foods": [
    u("1534604973900-c43ab4c2e0ab"), // clam chowder
    u("1615141982883-c7ad0e69fd62"), // oyster bar
    u("1559339352-11d035aa65de"), // seafood
  ],
  "Regina Pizzeria": PIZZA,
  "Mike's Pastry": BAKERY,
  "Giacomo's Ristorante": ITALIAN,
  "Row 34": [
    u("1615141982883-c7ad0e69fd62"), // oysters
    u("1535958636474-b021ee887b13"), // craft beer
    u("1559339352-11d035aa65de"), // seafood bar
  ],
  "Toro": [
    u("1551183053-bf91a1d81141"), // tapas
    u("1498579150354-977475b7ea0b"), // Spanish food
    u("1540914124281-342587941389"), // small plates
  ],
  "Yankee Lobster Co.": SEAFOOD,
  "El Pelon Taqueria": TACOS,
  "Harpoon Beer Hall": CRAFT_BEER,
  "Mei Mei": [
    u("1553621042-f6e147245754"), // Asian fusion
    u("1512058564366-18510be2db19"), // Chinese-American
    u("1544025162-d76694265947"), // comfort food
  ],
  "The Barking Crab": SEAFOOD,

  // BOSTON — Attractions
  "Freedom Trail": [
    u("1694475184263-3e03f11c7ff8"), // Freedom Trail Boston
    u("1726347921598-8da9d212030e"), // Freedom Trail marker
    u("1561084817-331b51e4f2d3"), // Freedom Trail path
  ],
  "Fenway Park": [
    u("1641780918579-44386d863a6b"), // Fenway Park stadium
    u("1681351605771-a07893306fda"), // Fenway Park game
    u("1499019994040-051a7b3135f2"), // Fenway Park field
  ],
  "Museum of Fine Arts": [
    u("1564399580075-5dfe19c205f0"), // museum gallery
    u("1554907984-15263bfd63bd"), // art museum interior
    u("1518998053901-5348d7dc4ca6"), // museum hall
  ],
  "Boston Public Garden": [
    u("1694475182039-f41a22ce9be3"), // Boston Public Garden
    u("1726347921807-8551a19aefaf"), // Public Garden lagoon
    u("1558279209-19753befb32b"), // Public Garden bridge
  ],
  "New England Aquarium": [
    u("1544551763-46a013bb70d5"), // aquarium
    u("1559591937-2b5f8a9a6ed1"), // ocean tank
    u("1518837695005-2083093ee35b"), // marine life
  ],
  "Faneuil Hall / Quincy Market": [
    u("1555396273-367ea4eb4db5"), // market hall
    u("1567521464027-f127ff144326"), // food stalls
    u("1560518883-ce09059eeffa"), // historic market
  ],
  "Isabella Stewart Gardner Museum": [
    u("1564399580075-5dfe19c205f0"), // museum
    u("1554907984-15263bfd63bd"), // art gallery
    u("1518998053901-5348d7dc4ca6"), // palace interior
  ],
  "Harvard Yard": [
    u("1672045599447-09703f5e6553"), // Harvard Yard
    u("1673712234801-5df38a267604"), // Harvard campus
    u("1680674428972-3e40c64c730c"), // Harvard buildings
  ],
  "Boston Harbor Islands": [
    u("1507525428034-b723cf961d3e"), // harbor islands
    u("1476673160081-cf065ac3b5f5"), // island beach
    u("1518837695005-2083093ee35b"), // harbor view
  ],
  "SoWa Open Market": MARKET,

  // BOSTON — Nightlife
  "Bleacher Bar": SPORTS_BAR,
  "Drink": COCKTAIL_BAR,
  "The Tam": DIVE_BAR,
  "Trillium Brewing Fort Point": BREWERY,
  "Wally's Cafe Jazz Club": LIVE_MUSIC,
  "Lookout Rooftop Bar": ROOFTOP,
  "McGreevy's": SPORTS_BAR,
  // "Harpoon Beer Hall" already mapped above (restaurants)

  // BOSTON — Shopping
  "Newbury Street": SHOPPING_STREET,
  "Faneuil Hall Marketplace": MARKET,
  "SoWa Artists Guild": MARKET,
  "Harvard Square": SHOPPING_STREET,

  // ═══════════════════════════════════════════════════════════════════════════
  //  NEW YORK — Restaurants
  // ═══════════════════════════════════════════════════════════════════════════
  "Joe's Pizza": PIZZA,
  "Peter Luger Steak House": STEAKHOUSE,
  "Los Tacos No. 1": TACOS,
  "Di Fara Pizza": PIZZA,
  "Russ & Daughters": [
    u("1509722747-f5abb26d1e9d"), // deli counter
    u("1533089860892-a7c6f0a88666"), // bagels brunch
    u("1495214783159-3503fd1f003e"), // classic deli
  ],
  "Katz's Delicatessen": [
    u("1640290982696-758e885f1859"), // Katz's Deli
    u("1748341394265-c8bc50b1bd58"), // Katz's interior
    u("1748341385913-093d12ca4d16"), // Katz's pastrami
  ],
  "Xi'an Famous Foods": [
    u("1553621042-f6e147245754"), // noodles
    u("1583623025817-d180a2221d0a"), // Chinese food
    u("1512058564366-18510be2db19"), // hand-pulled noodles
  ],
  "Lucali": PIZZA,
  "The Halal Guys": [
    u("1540914124281-342587941389"), // halal platter
    u("1565299585323-38d6b0865b47"), // street food
    u("1547573854-74d2a71d0826"), // chicken rice
  ],
  "Tatiana by Kwame Onwuachi": [
    u("1414235077428-338989a2e8c0"), // fine dining
    u("1551183053-bf91a1d81141"), // elevated cuisine
    u("1546833998-877b37c2e5c6"), // tasting menu
  ],
  "Prince Street Pizza": PIZZA,
  "Juliana's Pizza": PIZZA,

  // NEW YORK — Attractions
  "Statue of Liberty & Ellis Island": [
    u("1681803531285-75db948035d3"), // Statue of Liberty
    u("1588384153148-ebd739ac430c"), // Liberty Island
    u("1503572327579-b5c6afe5c5c5"), // NYC harbor statue
  ],
  "Central Park": [
    u("1568515387631-8b650bbcdb90"), // Central Park aerial
    u("1569974498991-d3c12a504f95"), // Central Park lake
    u("1585320806297-9794b3e4eeae"), // Bethesda fountain
  ],
  "9/11 Memorial & Museum": [
    u("1694475386078-af18b0f90223"), // 9/11 Memorial pools
    u("1694709233547-d975e613033b"), // 9/11 Museum
    u("1694467666983-3fa4a29e7ecf"), // memorial tribute
  ],
  "Brooklyn Bridge": [
    u("1576653742613-c05fac617721"), // Brooklyn Bridge
    u("1641262037759-04c0489af7f8"), // bridge walkway
    u("1642654767430-6dab6b9e32e9"), // bridge at sunset
  ],
  "The High Line": [
    u("1656477716212-237ba33b529c"), // High Line park
    u("1565476460054-3f0b79f901e3"), // High Line walkway
    u("1712924936258-e91d196f2428"), // elevated garden
  ],
  "Top of the Rock": [
    u("1712152626883-af0730dc65f2"), // Top of the Rock view
    u("1573507677100-4a10fa287519"), // NYC skyline from top
    u("1585753021570-cb9f23c4dc68"), // Manhattan panorama
  ],
  "The Metropolitan Museum of Art": [
    u("1664392235934-502f6c74818c"), // Met Museum
    u("1591631523881-08ec202acc40"), // Met Museum interior
    u("1590700928582-5389e4ded3cb"), // Met Museum gallery
  ],
  "DUMBO, Brooklyn": [
    u("1534430480872-3498386e7856"), // DUMBO bridge view
    u("1503572699868-cc1e2b0cd52b"), // Brooklyn waterfront
    u("1570630706809-3d8ccbb1fce6"), // Manhattan Bridge frame
  ],
  "Chelsea Market": FOOD_HALL,
  "Broadway Show": [
    u("1514525253161-7a46d19cd819"), // theater lights
    u("1493225457124-a3eb161ffa5f"), // Broadway stage
    u("1511735111819-9a3f7709049c"), // theater performance
  ],

  // NEW YORK — Nightlife
  "The Dead Rabbit": COCKTAIL_BAR,
  "230 Fifth": ROOFTOP,
  "Barcade": [
    u("1574629810360-7efbbe195018"), // arcade bar
    u("1535958636474-b021ee887b13"), // craft beer
    u("1543007630-9710e4a00a20"), // retro games
  ],
  "Standings": SPORTS_BAR,
  "Blue Note Jazz Club": LIVE_MUSIC,
  "Westlight": ROOFTOP,
  "McSorley's Old Ale House": DIVE_BAR,
  "Football Factory at Legends": SPORTS_BAR,

  // NEW YORK — Shopping
  "SoHo": SHOPPING_STREET,
  "Fifth Avenue": SHOPPING_STREET,
  "Brooklyn Flea": MARKET,
  // "Chelsea Market" already mapped above

  // ═══════════════════════════════════════════════════════════════════════════
  //  PHILADELPHIA — Restaurants
  // ═══════════════════════════════════════════════════════════════════════════
  "Pat's King of Steaks": CHEESESTEAK,
  "John's Roast Pork": CHEESESTEAK,
  "Zahav": MIDDLE_EASTERN,
  "Reading Terminal Market": [
    u("1626276549957-c8a3a692ba6d"), // Reading Terminal Market
    u("1538620003849-6dab1af498a8"), // market stalls
    u("1615040757977-09b7e573f977"), // market food
  ],
  "Federal Donuts": [
    u("1509440159596-0249088772ff"), // donuts
    u("1626645738196-c2a98082c326"), // fried chicken
    u("1562967914-01efa7e87832"), // chicken + donuts
  ],
  "Vernick Food & Drink": [
    u("1414235077428-338989a2e8c0"), // fine dining
    u("1551183053-bf91a1d81141"), // new American
    u("1546833998-877b37c2e5c6"), // plated dish
  ],
  "Suraya": [
    u("1540914124281-342587941389"), // Lebanese mezze
    u("1547573854-74d2a71d0826"), // Mediterranean
    u("1585937421612-70a008356fbe"), // garden patio
  ],
  "Poi Dog": HAWAIIAN,
  "Talula's Daily": BRUNCH,
  "Pizzeria Beddia": PIZZA,
  "Monk's Cafe": [
    u("1535958636474-b021ee887b13"), // Belgian beer
    u("1559526642-c3f001ea68ee"), // beer bar
    u("1551183053-bf91a1d81141"), // mussels frites
  ],
  "Dalessandro's Steaks": CHEESESTEAK,

  // PHILADELPHIA — Attractions
  "Independence Hall": [
    u("1742457698755-18882af7d8cc"), // Independence Hall
    u("1735659398576-27bb7558f2ed"), // Independence Hall facade
    u("1614946403309-cc9d1f9b6164"), // Independence Hall Philly
  ],
  "Liberty Bell Center": [
    u("1580872395943-57f73db1d9aa"), // Liberty Bell
    u("1619697939470-4fe22576cc0c"), // Liberty Bell close-up
    u("1683553238308-9e33dcda0986"), // Liberty Bell exhibit
  ],
  "Philadelphia Museum of Art": [
    u("1655387952054-af61e143f4a2"), // Philly Museum of Art
    u("1643925263111-c44b0fa434a5"), // Rocky Steps
    u("1718034453615-77c2ab986329"), // museum exterior
  ],
  // "Reading Terminal Market" already mapped above
  "Eastern State Penitentiary": [
    u("1632360384065-62b21f100ee6"), // Eastern State Penitentiary
    u("1468934047141-60c4fecdcc00"), // penitentiary corridor
    u("1582559013237-d6b9b7571981"), // prison ruins
  ],
  "Spruce Street Harbor Park": [
    u("1585320806297-9794b3e4eeae"), // waterfront park
    u("1507525428034-b723cf961d3e"), // harbor
    u("1476673160081-cf065ac3b5f5"), // string lights
  ],
  "Elfreth's Alley": [
    u("1558618666-fcd25c85f82e"), // cobblestone alley
    u("1569974498991-d3c12a504f95"), // historic row houses
    u("1560518883-ce09059eeffa"), // colonial street
  ],
  "Italian Market (9th Street)": MARKET,
  "Schuylkill River Trail": [
    u("1585320806297-9794b3e4eeae"), // river trail
    u("1507525428034-b723cf961d3e"), // waterfront path
    u("1476673160081-cf065ac3b5f5"), // urban trail
  ],
  "Magic Gardens": [
    u("1564399580075-5dfe19c205f0"), // mosaic art
    u("1554907984-15263bfd63bd"), // outdoor art
    u("1518998053901-5348d7dc4ca6"), // immersive art
  ],

  // PHILADELPHIA — Nightlife
  "Yards Brewing Company": BREWERY,
  // "Monk's Cafe" already mapped above
  "Xfinity Live!": SPORTS_BAR,
  "Garage Fishtown": DIVE_BAR,
  "The Barbary": DIVE_BAR,
  "Assembly Rooftop Lounge": ROOFTOP,
  "Johnny Brenda's": LIVE_MUSIC,
  "Evil Genius Beer Lab": BREWERY,

  // PHILADELPHIA — Shopping
  "Rittenhouse Row": SHOPPING_STREET,
  "South Street": SHOPPING_STREET,
  // "Italian Market (9th Street)" already mapped above
  "King of Prussia Mall": SHOPPING_STREET,

  // ═══════════════════════════════════════════════════════════════════════════
  //  WASHINGTON DC — Restaurants
  // ═══════════════════════════════════════════════════════════════════════════
  "Ben's Chili Bowl": [
    u("1568901346375-23c9450c58cd"), // hot dog/sausage
    u("1553909489-cd47e0907980"), // American diner
    u("1504754524776-8f4f37790ca0"), // counter service
  ],
  "Old Ebbitt Grill": [
    u("1615141982883-c7ad0e69fd62"), // oyster bar
    u("1414235077428-338989a2e8c0"), // classic American
    u("1546833998-877b37c2e5c6"), // upscale dining
  ],
  "Founding Farmers": [
    u("1504754524776-8f4f37790ca0"), // farm-to-table
    u("1533089860892-a7c6f0a88666"), // brunch
    u("1626645738196-c2a98082c326"), // chicken waffles
  ],
  "Rasika": INDIAN,
  "Bub and Pop's": DELI,
  "Le Diplomate": FRENCH,
  "Roaming Rooster": FRIED_CHICKEN,
  "Bad Saint": [
    u("1553621042-f6e147245754"), // Asian food
    u("1583623025817-d180a2221d0a"), // Filipino
    u("1512058564366-18510be2db19"), // small plates
  ],
  "Duke's Grocery": BURGER,
  "Chaia Tacos": TACOS,
  "Maydan": MIDDLE_EASTERN,
  "Compass Rose": [
    u("1540914124281-342587941389"), // international small plates
    u("1547573854-74d2a71d0826"), // cheese bread
    u("1551183053-bf91a1d81141"), // global cuisine
  ],

  // WASHINGTON DC — Attractions
  "National Mall": [
    u("1647390796652-7654521e51c6"), // National Mall DC
    u("1694788847591-c9da90e41662"), // National Mall monuments
    u("1694788847650-ef24cba80517"), // Washington Monument
  ],
  "Smithsonian National Air and Space Museum": [
    u("1564399580075-5dfe19c205f0"), // museum
    u("1554907984-15263bfd63bd"), // aircraft exhibit
    u("1518998053901-5348d7dc4ca6"), // space museum
  ],
  "Smithsonian National Museum of African American History": [
    u("1564399580075-5dfe19c205f0"), // museum
    u("1554907984-15263bfd63bd"), // museum interior
    u("1518998053901-5348d7dc4ca6"), // exhibits
  ],
  "Lincoln Memorial": [
    u("1694475167895-fc828dd7100b"), // Lincoln Memorial
    u("1674480658851-75e8c7ba54ff"), // Lincoln statue
    u("1588565267250-236955d3f8d7"), // memorial steps
  ],
  "Georgetown Waterfront": [
    u("1585320806297-9794b3e4eeae"), // waterfront
    u("1507525428034-b723cf961d3e"), // harbor view
    u("1476673160081-cf065ac3b5f5"), // riverside
  ],
  "Library of Congress": [
    u("1668378367927-daade47e48ee"), // Library of Congress
    u("1668378102756-ae38db61937d"), // reading room
    u("1597132687570-0e3d020119e2"), // ornate interior
  ],
  "National Gallery of Art": [
    u("1564399580075-5dfe19c205f0"), // art gallery
    u("1554907984-15263bfd63bd"), // paintings
    u("1518998053901-5348d7dc4ca6"), // sculpture garden
  ],
  "Tidal Basin": [
    u("1585320806297-9794b3e4eeae"), // tidal basin
    u("1558618666-fcd25c85f82e"), // cherry blossoms
    u("1560518883-ce09059eeffa"), // Jefferson Memorial
  ],
  "U Street Murals Walk": [
    u("1554907984-15263bfd63bd"), // street art
    u("1564399580075-5dfe19c205f0"), // murals
    u("1569974498991-d3c12a504f95"), // urban art
  ],
  "The Wharf": [
    u("1555396273-367ea4eb4db5"), // waterfront market
    u("1567521464027-f127ff144326"), // fish market
    u("1507525428034-b723cf961d3e"), // waterfront dining
  ],

  // WASHINGTON DC — Nightlife
  "Dan's Cafe": DIVE_BAR,
  "The Gibson": COCKTAIL_BAR,
  "Blagden Alley": COCKTAIL_BAR,
  "Madam's Organ": LIVE_MUSIC,
  "Bluejacket Brewery": BREWERY,
  "Lucky Bar": SPORTS_BAR,
  "Service Bar": COCKTAIL_BAR,
  "The Rooftop at The Graham": ROOFTOP,

  // WASHINGTON DC — Shopping
  "Georgetown (M Street & Wisconsin Ave)": SHOPPING_STREET,
  "Eastern Market": MARKET,
  "14th Street Corridor": SHOPPING_STREET,
  "Union Market": MARKET,

  // ═══════════════════════════════════════════════════════════════════════════
  //  ATLANTA — Restaurants
  // ═══════════════════════════════════════════════════════════════════════════
  "Fox Bros Bar-B-Q": BBQ,
  "Ponce City Market": FOOD_HALL,
  "The Varsity": [
    u("1568901346375-23c9450c58cd"), // hot dog
    u("1550547660-d9450f859349"), // diner food
    u("1586190848861-99aa4a171e90"), // fast food classic
  ],
  "Busy Bee Cafe": SOUTHERN,
  "Bacchanalia": [
    u("1414235077428-338989a2e8c0"), // fine dining
    u("1546833998-877b37c2e5c6"), // tasting menu
    u("1551183053-bf91a1d81141"), // elegant plating
  ],
  "Hattie B's Hot Chicken": FRIED_CHICKEN,
  "Gunshow": [
    u("1414235077428-338989a2e8c0"), // creative dining
    u("1551183053-bf91a1d81141"), // chef's table
    u("1546833998-877b37c2e5c6"), // shared plates
  ],
  "Buford Highway Farmers Market": FOOD_HALL,
  "Antico Pizza Napoletana": PIZZA,
  "Slutty Vegan": VEGAN,
  "Mary Mac's Tea Room": SOUTHERN,
  "Supremo Taqueria": TACOS,

  // ATLANTA — Attractions
  "Martin Luther King Jr. National Historical Park": [
    u("1569974498991-d3c12a504f95"), // historic park
    u("1558618666-fcd25c85f82e"), // memorial
    u("1560518883-ce09059eeffa"), // historic site
  ],
  "Atlanta BeltLine Eastside Trail": [
    u("1585320806297-9794b3e4eeae"), // urban trail
    u("1554907984-15263bfd63bd"), // street art murals
    u("1476673160081-cf065ac3b5f5"), // paved trail
  ],
  "Georgia Aquarium": [
    u("1679928114130-d437b8bc7023"), // Georgia Aquarium
    u("1679928114068-0aa8ec2e7630"), // aquarium interior
    u("1684166494251-1357c6da9fe0"), // whale shark tank
  ],
  "World of Coca-Cola": [
    u("1714253256395-a86187d83e6f"), // World of Coca-Cola
    u("1669181533013-94e185454bb6"), // Coca-Cola exhibit
    u("1694056033362-8e34f224e65c"), // Atlanta landmark
  ],
  "Piedmont Park": [
    u("1733306598042-61022ae91155"), // Piedmont Park Atlanta
    u("1736512642636-423ec6799e76"), // Piedmont Park skyline
    u("1665791077858-b6ea053b6bce"), // park green space
  ],
  "High Museum of Art": [
    u("1564399580075-5dfe19c205f0"), // art museum
    u("1554907984-15263bfd63bd"), // modern architecture
    u("1518998053901-5348d7dc4ca6"), // gallery
  ],
  "Krog Street Market": FOOD_HALL,
  "Centennial Olympic Park": [
    u("1656940178655-b44eb538be53"), // Centennial Olympic Park
    u("1656940179326-7aa621e8e3e7"), // Olympic fountain
    u("1656940533594-fdfec1ebc9c2"), // Atlanta Olympic park
  ],
  "Center for Civil and Human Rights": [
    u("1564399580075-5dfe19c205f0"), // museum
    u("1554907984-15263bfd63bd"), // exhibits
    u("1518998053901-5348d7dc4ca6"), // civil rights
  ],
  "Jimmy Carter Presidential Library": [
    u("1564399580075-5dfe19c205f0"), // library
    u("1558618666-fcd25c85f82e"), // gardens
    u("1560518883-ce09059eeffa"), // presidential library
  ],

  // ATLANTA — Nightlife
  "Monday Night Brewing": BREWERY,
  "The Vortex Bar & Grill": [
    u("1572116469696-31bfe79e56ab"), // bar
    u("1568901346375-23c9450c58cd"), // burgers
    u("1543007630-9710e4a00a20"), // neon sign
  ],
  "Ticonderoga Club": COCKTAIL_BAR,
  "Terminal West": LIVE_MUSIC,
  "Clermont Lounge": DIVE_BAR,
  "SkyLounge at Glenn Hotel": ROOFTOP,
  "Stats Brewpub": SPORTS_BAR,
  "New Realm Brewing": BREWERY,

  // ATLANTA — Shopping
  // "Ponce City Market" already mapped above
  "Little Five Points": SHOPPING_STREET,
  "Lenox Square & Phipps Plaza": SHOPPING_STREET,
  "Westside Provisions District": SHOPPING_STREET,

  // ═══════════════════════════════════════════════════════════════════════════
  //  MIAMI — Restaurants
  // ═══════════════════════════════════════════════════════════════════════════
  "Versailles": CUBAN,
  "Joe's Stone Crab": SEAFOOD,
  "Coyo Taco": TACOS,
  "La Mar by Gaston Acurio": PERUVIAN,
  "Zak the Baker": BAKERY,
  "KYU": ASIAN_BBQ,
  "Casablanca Seafood Bar & Grill": SEAFOOD,
  "Ball & Chain": [
    u("1493225457124-a3eb161ffa5f"), // live music
    u("1512058564366-18510be2db19"), // Cuban food
    u("1511735111819-9a3f7709049c"), // salsa band
  ],
  "Sushi Garage": SUSHI,
  "Los Gorditos": [
    u("1565299585323-38d6b0865b47"), // arepas
    u("1551504734-5ee1c4a1479b"), // Venezuelan
    u("1599974579688-8dbdd335c77f"), // Latin street food
  ],
  "The Salty Donut": DONUT,
  "Mandolin Aegean Bistro": GREEK,

  // MIAMI — Attractions
  "South Beach & Art Deco Historic District": [
    u("1580650897109-bbc9da8a47fd"), // South Beach Art Deco
    u("1580650897119-b47aad929934"), // Ocean Drive Miami
    u("1580650897111-ee659750cf08"), // Art Deco buildings
  ],
  "Wynwood Walls": [
    u("1664476634626-cdf636965082"), // Wynwood Walls murals
    u("1547599779-893af5ceaee7"), // Wynwood street art
    u("1558729387-b9a8aff265bb"), // Wynwood graffiti
  ],
  "Vizcaya Museum and Gardens": [
    u("1675724176242-d8c91f007f52"), // Vizcaya Museum
    u("1722815454994-8fe5fabe8e91"), // Vizcaya gardens
    u("1722815792516-39b6650e26a5"), // Vizcaya villa
  ],
  "Little Havana / Calle Ocho Walk": [
    u("1548209570-75a4a6d34466"), // Little Havana
    u("1548211726-7f93384ec097"), // Calle Ocho
    u("1574167630074-8221b69f8b98"), // Cuban culture
  ],
  "P\u00E9rez Art Museum Miami (PAMM)": [
    u("1564399580075-5dfe19c205f0"), // contemporary art
    u("1554907984-15263bfd63bd"), // waterfront museum
    u("1518998053901-5348d7dc4ca6"), // modern architecture
  ],
  "Everglades National Park": [
    u("1649036853210-39256f4d8885"), // Everglades National Park
    u("1709640213114-d378786731f1"), // Everglades wetlands
    u("1709640213692-9761aba5e8e1"), // Everglades wildlife
  ],
  "Key Biscayne / Crandon Park": [
    u("1514214246283-d427a95c5d2f"), // tropical beach
    u("1507525428034-b723cf961d3e"), // island park
    u("1476673160081-cf065ac3b5f5"), // palm trees
  ],
  "Bayside Marketplace": MARKET,
  "Design District": [
    u("1555396273-367ea4eb4db5"), // luxury shopping
    u("1564399580075-5dfe19c205f0"), // art installations
    u("1567521464027-f127ff144326"), // design stores
  ],
  "Bill Baggs Cape Florida State Park": [
    u("1514214246283-d427a95c5d2f"), // lighthouse beach
    u("1507525428034-b723cf961d3e"), // coastal park
    u("1476673160081-cf065ac3b5f5"), // sandy beach
  ],

  // MIAMI — Nightlife
  // "Ball & Chain" already mapped above
  "Wynwood Brewing Company": BREWERY,
  "E11EVEN": CLUB,
  "Broken Shaker": COCKTAIL_BAR,
  "The Corner": DIVE_BAR,
  "Sugar": ROOFTOP,
  "Gramps": DIVE_BAR,
  "The Wharf Miami": [
    u("1507525428034-b723cf961d3e"), // waterfront bar
    u("1470337458703-46a1888eb515"), // outdoor bar
    u("1517457373958-b7bdd4587205"), // sunset drinks
  ],

  // MIAMI — Shopping
  // "Design District" already mapped above
  "Lincoln Road Mall": SHOPPING_STREET,
  "Wynwood Shops": SHOPPING_STREET,
  "Aventura Mall": SHOPPING_STREET,
};

/**
 * Returns image URLs for a venue, or an empty array if none are mapped.
 * Used by city-profile-view.tsx to enrich venue data before rendering cards.
 */
export function getVenueImages(name: string): string[] {
  return IMAGES[name] ?? [];
}
