export type Cabin = "economy" | "business" | "first";
export type Stops = "any" | "nonstop" | "1plus";
export type Sort = "price_asc" | "price_desc" | "duration";

export interface Segment {
  carrier: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departure: string;
  arrival: string;
  durationMinutes: number;
  originTimezone: string;
  destinationTimezone: string;
}

export interface Offer {
  id: string;
  route: string;
  price: number;
  currency: "PKR";
  cabin: Cabin;
  stops: Stops;
  airline: string;
  airlineCode: string;
  segments: Segment[];
  durationMinutes: number;
}

export interface OffersResponse {
  offers: Offer[];
  count: number;
  failedAirlines: string[];
}
