import { ZONES, DISPATCH_MIN_DAYS, DISPATCH_MAX_DAYS, type Zone } from "lib/shipping";

/** One OfferShippingDetails per shipping zone, built from lib/shipping.ts so schema, feed and policy page agree. */
export function shippingDetailsLd(currency: string, zones: Zone[] = ZONES) {
  return zones.map((z) => ({
    "@type": "OfferShippingDetails",
    shippingRate: { "@type": "MonetaryAmount", value: z.rate.toFixed(2), currency },
    shippingDestination: z.countries.map((c) => ({ "@type": "DefinedRegion", addressCountry: c })),
    deliveryTime: {
      "@type": "ShippingDeliveryTime",
      handlingTime: { "@type": "QuantitativeValue", minValue: DISPATCH_MIN_DAYS, maxValue: DISPATCH_MAX_DAYS, unitCode: "DAY" },
      transitTime: { "@type": "QuantitativeValue", minValue: z.minDays, maxValue: z.maxDays, unitCode: "DAY" },
    },
  }));
}

/** 30 days on unused items, per /shipping-returns. */
export function returnPolicyLd(countries: string[]) {
  return {
    "@type": "MerchantReturnPolicy",
    applicableCountry: countries,
    returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
    merchantReturnDays: 30,
    merchantReturnLink: "https://lushaquarium.com/shipping-returns",
  };
}
