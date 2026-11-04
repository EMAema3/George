/** schema.org JSON-LD builders — VacationRental + LodgingBusiness on stay pages, FAQPage on FAQs. */

export function vacationRentalSchema(p, siteUrl, locale = 'en') {
  const img = (f) => `${siteUrl}${p.images.dir}/${f}.webp`;
  return {
    '@context': 'https://schema.org',
    '@type': 'VacationRental',
    name: p.name,
    identifier: p.slug,
    url: siteUrl + '/',
    image: p.images.gallery.slice(0, 8).map((g) => img(g.file)),
    address: {
      '@type': 'PostalAddress',
      streetAddress: p.address.street,
      addressLocality: p.address.city,
      addressCountry: p.address.countryCode,
    },
    geo: { '@type': 'GeoCoordinates', latitude: p.geo.lat, longitude: p.geo.lng },
    containsPlace: {
      '@type': 'Accommodation',
      occupancy: { '@type': 'QuantitativeValue', maxValue: p.specs.maxGuests },
      numberOfBedrooms: p.specs.bedrooms,
      numberOfBathroomsTotal: p.specs.bathrooms,
      floorSize: { '@type': 'QuantitativeValue', value: p.specs.sizeM2, unitCode: 'MTK' },
      bed: { '@type': 'BedDetails', numberOfBeds: p.specs.beds, typeOfBed: p.specs.bedType },
      amenityFeature: [
        { '@type': 'LocationFeatureSpecification', name: 'Pool', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Gym', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Wi-Fi 100 Mbps', value: true },
        { '@type': 'LocationFeatureSpecification', name: '24/7 security', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Valet parking', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Air conditioning', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Washer', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Balcony', value: true },
      ],
    },
    priceRange: `$${p.pricing.monthlyNightly}–$${Math.max(p.pricing.baseNightly, ...(p.pricing.seasons || []).map((s) => s.nightly))} USD per night`,
    checkinTime: p.checkin.from,
    checkoutTime: p.checkin.checkout,
    knowsLanguage: ['en', 'es', 'nl', 'pt', 'de'],
  };
}

export function lodgingBusinessSchema(p, siteUrl, site) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    name: `${p.name} — ${site.brand}`,
    url: siteUrl + '/',
    email: site.email,
    telephone: site.whatsappDisplay,
    address: {
      '@type': 'PostalAddress',
      streetAddress: p.address.street,
      addressLocality: p.address.city,
      addressCountry: p.address.countryCode,
    },
    geo: { '@type': 'GeoCoordinates', latitude: p.geo.lat, longitude: p.geo.lng },
    parentOrganization: { '@type': 'Organization', name: site.operator },
  };
}

export function faqSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((i) => ({
      '@type': 'Question',
      name: i.q,
      acceptedAnswer: { '@type': 'Answer', text: i.a },
    })),
  };
}

export function articleSchema({ title, description, url, datePublished, siteUrl }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url,
    datePublished,
    author: { '@type': 'Organization', name: 'Casa Playa Aruba' },
    publisher: { '@type': 'Organization', name: 'Casa Playa Aruba', url: siteUrl },
  };
}
