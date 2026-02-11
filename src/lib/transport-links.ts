// ============ TRANSPORT LINK GENERATORS ============
// Simple URL builders for booking flights, trains, and cars.
// No API keys — just well-formed links to external booking sites.

/**
 * Google Flights search URL for a one-way flight.
 * @param fromCity - Departure city name (e.g., "Washington DC")
 * @param toCity - Arrival city name (e.g., "Atlanta")
 * @param date - Travel date in YYYY-MM-DD format
 */
export function googleFlightsUrl(
  fromCity: string,
  toCity: string,
  date: string
): string {
  const query = encodeURIComponent(
    `flights from ${fromCity} to ${toCity} on ${date}`
  );
  return `https://www.google.com/travel/flights?q=${query}`;
}

/** Amtrak home page for booking train tickets. */
export function amtrakUrl(): string {
  return "https://www.amtrak.com/home.html";
}

/**
 * Kayak car rental search URL.
 * @param city - Pickup city name (e.g., "Miami")
 * @param pickupDate - Pickup date in YYYY-MM-DD format
 * @param dropoffDate - Dropoff date in YYYY-MM-DD format
 */
export function kayakCarsUrl(
  city: string,
  pickupDate: string,
  dropoffDate: string
): string {
  const location = encodeURIComponent(city);
  return `https://www.kayak.com/cars/${location}/${pickupDate}/${dropoffDate}`;
}

/** Uber deep link — opens the Uber mobile app or web experience. */
export function uberUrl(): string {
  return "https://m.uber.com/";
}
