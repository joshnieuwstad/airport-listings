export interface Airport {
    ItemName: string,
    AirportName: string,
    Description: string,
}

export interface AirportResponse {
    Airports: Airport[];
}