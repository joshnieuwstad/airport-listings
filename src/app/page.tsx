import { Airport, AirportResponse } from "./models/airport.model";
import Listings from "./pages/listings/page";

export default async function Home() {

  const res = await fetch("http://localhost:3000/api/airports");
  const data: AirportResponse = await res.json()
  const airports: Airport[] = data.Airports;

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="bg-ts-green text-white py-16 px-6 text-center">
        <h1 className="text-4xl font-bold">
          Where do you want to go?
        </h1>
      </div>
      <div className="px-12 max-w-5-xl mx-auto">
        <Listings Airports={airports}></Listings>
      </div>
    </div>
  );
}
