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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";

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

  const airportOptions = Airports.map((airport) => ({
    key: airport.ItemName,
    value: airport.ItemName,
    label: `${airport.AirportName} ${airport.ItemName}`
  }));

  const handleDateChange = (departureDate: Date) => setFormData((prev) => ({
    ...prev,
    departureDate
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
    if (!departureDate || !origin || !destination) {
      setLoading(false);
      return;
    }
    const params = new URLSearchParams({
      origin,
      destination,
      departureDate: new Date(departureDate).toISOString(),
    });

    const res = await fetch(`/api/flights?${params.toString()}`);
    if (!res.ok) {
      toast.error("Error fetching flights");
      setLoading(false);
      return;
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
              required
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
              required
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
            <FontAwesomeIcon icon={faMagnifyingGlass} className="h-4 w-4" />
            <strong>Search</strong>
          </button>

        </div>
      </form>
      <div className="max-w-6xl mx-auto p-4 md:px-6 md:py-14">
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
                  <Card flight={flight} airportMap={airportMap} key={flight.outboundFlight.id} data-testid="card" />
                ))}
              </div>
            </div>
          ) : requestSent && (
            <div className="text-2xl font-bold text-ts-green">
              No Available Flights
            </div>
          )}
      </div>
    </>
  )
}
