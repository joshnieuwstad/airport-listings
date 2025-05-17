import { useMemo } from "react";
import { Airport } from "../models/airport.model";

export function useAirportMap(airports: Airport[]) {
    return useMemo(() => {
        return airports.reduce((acc: Record<string, Airport>, airport) => {
            console.log('here') //--- get many print outs here server and client side?
            acc[airport.ItemName] = airport;
            return acc;
        }, {});
    }, [airports]);
}
