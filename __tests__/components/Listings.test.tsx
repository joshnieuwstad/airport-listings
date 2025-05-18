import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Listings from "../../src/components/Listings";
import { Airport } from "@/models/airport.model";
import { Flight, FlightResponse } from "@/models/listing-result.model";
import toast from "react-hot-toast";

const mockAirports: Airport[] = [
  { AirportName: "Amsterdam", ItemName: "AMS", Description: "Amsterdam Airport" },
  { AirportName: "Rotterdam", ItemName: "RTM", Description: "Rotterdam Airport" },
];

let mockedFlightOffers: FlightResponse;

const mockFetch = (response: any, status: number = 200, ok: boolean = true) => {
  global.fetch = jest.fn().mockResolvedValue({
    ok,
    status,
    json: () => Promise.resolve(response),
  });
}
const setFormFieldsAndSubmit = () => {
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
};


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

jest.mock('react-hot-toast', () => ({
  ...jest.requireActual('react-hot-toast'),
  error: jest.fn(),
}));

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
  it('should submit the form when all fields are valid and call fetch', async () => {
    mockedFlightOffers = {
      resultSet: { count: 2 },
      flightOffer: [
        {
          outboundFlight: {
            id: 'flight-1',
          },
        } as Flight,
        {
          outboundFlight: {
            id: 'flight-2',
          },
        } as Flight,
      ],
    };

    mockFetch(mockedFlightOffers);

    render(<Listings Airports={mockAirports} />);

    setFormFieldsAndSubmit();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/flights?')
      );
      expect(screen.getAllByTestId('card')).toHaveLength(2);
    });
  });

  it('should not submit the form when fields are invalid', async () => {
    mockedFlightOffers = {
      resultSet: { count: 2 },
      flightOffer: [
        {
          outboundFlight: {
            id: 'flight-1',
          },
        } as Flight,
        {
          outboundFlight: {
            id: 'flight-2',
          },
        } as Flight,
      ],
    };

    mockFetch(mockedFlightOffers);

    render(<Listings Airports={mockAirports} />);

    await waitFor(() => {
      expect(global.fetch).not.toHaveBeenCalled();
    });
  });

  it('should show toast message when fetch fails', async () => {
    mockedFlightOffers = {
      resultSet: { count: 2 },
      flightOffer: [
        {
          outboundFlight: {
            id: 'flight-1',
          },
        } as Flight,
        {
          outboundFlight: {
            id: 'flight-2',
          },
        } as Flight,
      ],
    };

    mockFetch(mockedFlightOffers, 500, false);

    render(<Listings Airports={mockAirports} />);

    setFormFieldsAndSubmit();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
      expect(toast.error).toHaveBeenCalledWith('Error fetching flights');
    });
  });

  it('should show loading state when fetching', async () => {
    render(<Listings Airports={mockAirports} />);

    setFormFieldsAndSubmit();

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});