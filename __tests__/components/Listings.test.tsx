import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Listings from "../../src/components/Listings";
import { Airport } from "@/models/airport.model";
import { Flight, FlightResponse } from "@/models/listing-result.model";

const mockAirports: Airport[] = [
  { AirportName: "Amsterdam", ItemName: "AMS", Description: "Amsterdam Airport" },
  { AirportName: "Rotterdam", ItemName: "RTM", Description: "Rotterdam Airport" },
];

let mockedFlightOffers: FlightResponse;


jest.mock('@/components/Select', () => (props: any) => (
  <select
    aria-label={props.label}
    name={props.name}
    value={props.value}
    onChange={props.onChange}
  >
    <option value="">Select...</option>
    <option value="AMS">Amsterdam</option>
    <option value="RTM">Rotterdam</option>
  </select>
));

jest.mock('@/components/DatePicker', () => (props: any) => (
  <input
    aria-label={props.label}
    name={props.name}
    type="date"
    value={props.value || ''}
    onChange={(e) => props.onChange(new Date(e.target.value))}
  />
));

jest.mock('@/components/Loader', () => () => <div>Loading...</div>);
jest.mock('@/components/Card', () => (props: any) => (
  <div data-testid={props['data-testid'] || 'card'}>{props.children || 'Flight Card'}</div>
));

describe("Listings component", () => {
  it("should render correctly", () => {
    render(<Listings Airports={mockAirports} />);
    expect(screen.getByLabelText(/origin/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/destination/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/departure date/i)).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });
});

describe('Listings form submission', () => {
  beforeEach(() => {
    mockedFlightOffers = {
      resultSet: { count: 2 },
      flightOffer: [
        {
          outboundFlight: {
            id: 'flight-1',
            departureDateTime: '2025-06-01T08:00:00Z',
            arrivalDateTime: '2025-06-01T10:00:00Z',
            marketingAirline: { companyShortName: 'KLM' },
            flightNumber: 123,
            departureAirport: { locationCode: 'AMS' },
            arrivalAirport: { locationCode: 'CDG' },
          },
          pricingInfoSum: {
            totalPriceAllPassengers: 200,
            totalPriceOnePassenger: 100,
            baseFare: 80,
            taxSurcharge: 20,
            currencyCode: 'EUR',
            productClass: 'Economy',
          },
          deeplink: { href: 'https://example.com/booking' },
        },
        {
          outboundFlight: {
            id: 'flight-2',
            departureDateTime: '2025-06-01T12:00:00Z',
            arrivalDateTime: '2025-06-01T14:00:00Z',
            marketingAirline: { companyShortName: 'Transavia' },
            flightNumber: 456,
            departureAirport: { locationCode: 'AMS' },
            arrivalAirport: { locationCode: 'CDG' },
          },
          pricingInfoSum: {
            totalPriceAllPassengers: 250,
            totalPriceOnePassenger: 125,
            baseFare: 100,
            taxSurcharge: 25,
            currencyCode: 'EUR',
            productClass: 'Economy',
          },
          deeplink: { href: 'https://example.com/booking2' },
        },
      ],
    };

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockedFlightOffers)
    });
  });

  it('should submit the form when all fields are valid and calls fetch', async () => {
    render(<Listings Airports={mockAirports} />)

    fireEvent.change(screen.getByLabelText(/origin/i), {
      target: { value: 'AMS' }
    });

    fireEvent.change(screen.getByLabelText(/destination/i), {
      target: { value: 'RTM' }
    });

    fireEvent.change(screen.getByLabelText(/departure date/i), {
      target: { value: '2025-06-01' }
    });

    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/flights?')
      );
      expect(screen.getAllByTestId('card')).toHaveLength(2);
    });
  });

  it('should not submit the form when fields are invalid', async () => {
    render(<Listings Airports={mockAirports} />);

    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    await waitFor(() => {
      expect(global.fetch).not.toHaveBeenCalled();
    });
  });

  it('should show loading state when fetching', async () => {
    render(<Listings Airports={mockAirports} />);

    fireEvent.change(screen.getByLabelText(/origin/i), {
      target: { value: 'AMS' }
    });

    fireEvent.change(screen.getByLabelText(/destination/i), {
      target: { value: 'RTM' }
    });

    fireEvent.change(screen.getByLabelText(/departure date/i), {
      target: { value: '2025-06-01' }
    });

    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
})