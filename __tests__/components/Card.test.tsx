import "@testing-library/jest-dom";
import Card from "@/components/Card";
import { render, screen } from "@testing-library/react";
import { Airport } from "@/models/airport.model";
import { Flight } from "@/models/listing-result.model";

describe(Card, () => {
  it('should render with correct flight information', () => {
    const flight = {
      outboundFlight: {
        departureAirport: { locationCode: 'AMS' },
        arrivalAirport: { locationCode: 'LAX' },
        departureDateTime: '2023-10-01T10:00:00Z',
        arrivalDateTime: '2023-10-01T13:00:00Z',
      },
      pricingInfoSum: {
        totalPriceAllPassengers: 500
      },
      deeplink: {
        href: 'https://example.com/booking',
      }
    } as Flight;
    const airportMap: Record<string, Airport> = {
      AMS: { AirportName: 'Amsterdam Airport Schiphol', ItemName: 'AMS', Description: 'Amsterdam Airport Schiphol' },
      LAX: { AirportName: 'Los Angeles International Airport', ItemName: 'LAX', Description: 'Los Angeles International Airport' },
    };

    render(<Card flight={flight} airportMap={airportMap} />);

    expect(screen.getByText(/Amsterdam Airport Schiphol/i)).toBeInTheDocument();
    expect(screen.getByText(/Los Angeles International Airport/i)).toBeInTheDocument();
    expect(screen.getByText(/01 Oct 2023/i)).toBeInTheDocument();
    expect(screen.getByText(/€500.00/i)).toBeInTheDocument();
    expect(screen.getByText(/3h 0m/i)).toBeInTheDocument();
  });
});