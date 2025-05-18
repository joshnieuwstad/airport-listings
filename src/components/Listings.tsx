"use client"

import { useState } from "react";
import { ListingSearch } from "../models/listing-search.model";
import { Flight, FlightResponse } from "@/models/listing-result.model";
import Select from "@/components/Select";
import { AirportResponse } from "@/models/airport.model";
import { useAirportMap } from "@/hooks/useAirportMap";
import DatePicker from "@/components/DatePicker";
import Loader from "@/components/Loader";
import Card from "@/components/Card";

export default function Listings({ Airports }: AirportResponse) {

  const [formData, setFormData] = useState<ListingSearch>({
    origin: '',
    destination: '',
    departureDate: null
  });
  const [matchedFlights, setMatchedFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [requestSent, setRequestSent] = useState<boolean>(false);

  const airportMap = useAirportMap(Airports);

  const handleDateChange = (e: Date) => setFormData((prev) => ({
    ...prev,
    departureDate: e
  }))

  const airportOptions = Airports.map((airport) => ({
    key: airport.ItemName,
    value: airport.ItemName,
    label: `${airport.AirportName} ${airport.ItemName}`
  }));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const { origin, destination, departureDate } = formData;
    if (!departureDate) {
      return;
    }
    const params = new URLSearchParams({
      origin,
      destination,
      departureDate: new Date(departureDate).toISOString(),
    });

    const res = await fetch(`/api/flights?${params.toString()}`);
    if (!res.ok) {
      throw new Error('Failed to fetch flights');
    }

    const data: FlightResponse = await res.json();
    setMatchedFlights(data.flightOffer);
    setLoading(false);
    setRequestSent(true);
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="relative bg-white shadow-lg -mt-10 rounded-xl px-4 py-10 md:px-6 md:py-14 max-w-6xl mx-auto z-10 transform transition-all duration-300 hover:shadow-xl"
      >
        <div className="grid md:grid-cols-3 gap-4">
          <div className="relative">
            <Select
              id="origin"
              label="Origin"
              name="origin"
              placeholder="Select an airport"
              value={formData.origin}
              onChange={handleChange}
              options={airportOptions}
            />

          </div>
          <div className="relative">
            <Select
              id="destination"
              label="Destination"
              name="destination"
              placeholder="Select an airport"
              value={formData.destination}
              onChange={handleChange}
              options={airportOptions}
            />
          </div>

          <div className="relative">
            <DatePicker
              id="departureDate"
              label="Departure Date"
              name="departureDate"
              value={formData.departureDate}
              onChange={handleDateChange}
            />
          </div>
        </div>
        <div className="items-center">
          <button
            type="submit"
            className="absolute flex items-center gap-2 text-center left-1/2 transform -translate-x-1/2 translate-y-1/2 bg-ts-pink text-white border-4 border-white rounded-full py-2 px-5 shadow-md hover:bg-ts-pink-light transition-all"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
            </svg>
            <strong>Search</strong>
          </button>

        </div>
      </form>
      <div className="max-w-6xl mx-auto p-4 mt-12">

        {loading ?
          (
            <Loader />
          ) :
          matchedFlights.length ? (
            <div>
              <div className="text-2xl font-bold text-ts-green mb-6">
                Available Flights
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {matchedFlights.map((flight) => (
                  <Card flight={flight} airportMap={airportMap} key={flight.outboundFlight.id} />
                ))}
              </div>
            </div>
          ) : requestSent && (
            <div className="text-2xl font-bold text-ts-green mb-6">
              No Available Flights
            </div>
          )}
      </div>
    </>
  )
}
