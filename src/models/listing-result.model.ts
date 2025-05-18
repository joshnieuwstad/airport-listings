export interface Flight {
  outboundFlight: {
    id: string;
    departureDateTime: string;
    arrivalDateTime: string;
    marketingAirline: {
      companyShortName: string;
    };
    flightNumber: number;
    departureAirport: {
      locationCode: string;
    };
    arrivalAirport: {
      locationCode: string;
    };
  };
  pricingInfoSum: {
    totalPriceAllPassengers: number;
    totalPriceOnePassenger: number;
    baseFare: number;
    taxSurcharge: number;
    currencyCode: string;
    productClass: string;
  };
  deeplink: {
    href: string;
  };
}

export interface FlightResponse {
  resultSet: {
    count: number;
  },
  flightOffer: Flight[];
}