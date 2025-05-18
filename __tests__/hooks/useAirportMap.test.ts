import { useAirportMap } from "@/hooks/useAirportMap";
import { Airport } from "@/models/airport.model";
import "@testing-library/jest-dom";
import { renderHook } from "@testing-library/react";

describe('useAirportMap', () => {
  const mockAirports: Airport[] = [
    { ItemName: 'AMS', AirportName: 'Amsterdam', Description: 'Amsterdam Airport', },
    { ItemName: 'CDG', AirportName: 'Paris', Description: 'Charles de Gaulle Airport', },
  ];

  it('should map airports by ItemName', () => {
    const { result } = renderHook(() => useAirportMap(mockAirports));

    expect(result.current).toEqual({
      AMS: mockAirports[0],
      CDG: mockAirports[1],
    });
  });

  it('should return an empty object for empty input', () => {
    const { result } = renderHook(() => useAirportMap([]));

    expect(result.current).toEqual({});
  });

  it('should memoize the result', () => {
    const { result, rerender } = renderHook(({ airports }) => useAirportMap(airports), {
      initialProps: { airports: mockAirports },
    });

    const firstResult = result.current;

    rerender({ airports: mockAirports });

    expect(result.current).toBe(firstResult);
  });
});