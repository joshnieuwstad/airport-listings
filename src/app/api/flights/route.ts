import flightsData from '../data/flights-from-AMS.json'
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  await new Promise((res) => setTimeout(res, 500)); // Simulate latency

  const { searchParams } = new URL(request.url);
  const origin = searchParams.get('origin');
  const destination = searchParams.get('destination');
  const date = searchParams.get('departureDate');

  if (!origin || !destination || !date) {
    return NextResponse.json(
      { error: 'Origin, Destination and departure date are required' },
      { status: 400 }
    );
  }

  const departureDate = new Date(date);

  function isSameDate(d1: Date, d2: Date) {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  }

  const matchedFlights = flightsData.flightOffer.filter((flight) => {
    const flightOrigin = flight.outboundFlight.departureAirport.locationCode;
    const flightDestination = flight.outboundFlight.arrivalAirport.locationCode;
    const flightDeparture = new Date(flight.outboundFlight.departureDateTime);

    return (
      flightOrigin === origin &&
      flightDestination === destination &&
      isSameDate(flightDeparture, departureDate)
    );
  });

  return NextResponse.json({ flightOffer: matchedFlights });
}
