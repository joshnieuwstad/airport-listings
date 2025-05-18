import DatePicker from "@/components/DatePicker";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";

describe(DatePicker, () => {
  it('should render with correct label', () => {
    const onChange = jest.fn();
    render(<DatePicker
      id="departureDate"
      name="departureDate"
      value={null}
      onChange={onChange}
      label="Departure Date"
    />);
    const label = screen.getByLabelText(/departure date/i);
    expect(label).toBeInTheDocument();
  });

  it('should call onChange when date is selected', () => {
    const onChange = jest.fn();
    render(<DatePicker
      id="departureDate"
      name="departureDate"
      value={null}
      onChange={onChange}
      label="Departure Date"
    />);
    const input = screen.getByLabelText(/departure date/i);
    fireEvent.change(input, { target: { value: '2023-10-01' } });
    expect(onChange).toHaveBeenCalled();
  });

  it('should return nothing if no date is provided', () => {
    const onChange = jest.fn();
    render(<DatePicker
      id="departureDate"
      name="departureDate"
      value={null}
      onChange={onChange}
      label="Departure Date"
    />);
    const input = screen.getByLabelText(/departure date/i);
    fireEvent.change(input, { target: { value: 'invalid-date' } });
    expect(onChange).not.toHaveBeenCalled();
  });
});
