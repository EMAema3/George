/** The Aruba content hub — English articles (translated later, per the spec: segment pages + booking first). */
export const guides = [
  { slug: 'three-days-in-oranjestad-on-foot', tag: 'Itinerary', title: 'Three days in Oranjestad, on foot', blurb: 'The flagship itinerary: eat, swim and wander without ever starting a car.', img: 'oranjestad-main-street-red-tram' },
  { slug: 'where-to-stay-night-before-aruba-cruise', tag: 'Cruise', title: 'Where to stay the night before an Aruba cruise', blurb: 'The case for sleeping 400 m from the terminal, and how embarkation morning actually works.', img: 'oranjestad-cruise-ship-palm-trees' },
  { slug: 'aruba-carnival-2027-dates-parade-routes', tag: 'Carnival', title: 'Aruba Carnival 2027: dates, parades and where to watch', blurb: 'The season, the Grand Parade, and how to end up in the right place.', img: 'aruba-carnival-purple-feather-costume' },
  { slug: 'can-you-walk-to-a-beach-from-downtown-oranjestad', tag: 'Beaches', title: 'Can you walk to a beach from downtown Oranjestad?', blurb: 'Yes. Here’s the honest version, with minutes and metres.', img: 'aruba-beach-palapas-palm-trees' },
  { slug: 'aruba-tourist-levy-fees-explained', tag: 'Money', title: 'Aruba tourist levy and fees, explained for 2027', blurb: 'The 12.5% levy, the $3 environmental levy and the airport sustainability fee, line by line.', img: 'aruba-aerial-coastline' },
  { slug: 'us-preclearance-aruba-airport', tag: 'Travel', title: 'US preclearance in Aruba, and why it matters', blurb: 'Clear US customs before you fly and land home as a domestic passenger.', img: 'aruba-airport-transfer-luggage-car' },
  { slug: 'why-aruba-is-outside-the-hurricane-belt', tag: 'Weddings', title: 'Why Aruba sits outside the hurricane belt', blurb: 'The geography behind the Caribbean’s safest date, and what it means for planning a year out.', img: 'aruba-beach-wedding-setup-ocean' },
  { slug: 'queen-beatrix-airport-to-downtown-oranjestad', tag: 'Travel', title: 'Getting from Queen Beatrix Airport to downtown Oranjestad', blurb: 'Taxi, transfer, bus or rental car: times and costs for the 5 km ride.', img: 'oranjestad-waterfront-pastel-buildings' },
];
export const guideBySlug = (slug) => guides.find((g) => g.slug === slug);
