import { Airport, AirportResponse } from "../models/airport.model";
import Listings from "../components/Listings";
import Header from "@/components/Header";

export default async function Home() {

  const res = await fetch("http://localhost:3000/api/airports");
  const data: AirportResponse = await res.json()
  const airports: Airport[] = data.Airports;

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />
      <div className="px-12 max-w-5-xl mx-auto">
        <Listings Airports={airports}></Listings>
      </div>
    </div>
  );
}
