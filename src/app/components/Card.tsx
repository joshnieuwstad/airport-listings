import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Airport } from "../models/airport.model";
import { Flight } from "../models/listing-result.model";
import { faCalendar } from "@fortawesome/free-solid-svg-icons/faCalendar";
import { faPlane } from "@fortawesome/free-solid-svg-icons";

interface CardProps {
    flight: Flight;
    airportMap: Record<string, Airport>
}

export default function Card({ flight, airportMap }: CardProps) {

    const formatDate = (dateString: Date | string): string => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        }).format(date)
    }

    const formatPrice = (amount: number, currency = 'EUR'): string => {
        return new Intl.NumberFormat('en-NL', {
            style: 'currency',
            currency,
        }).format(amount);
    }

    const getTimeDifference = (startDate: string, endDate: string): string => {
        const start = new Date(startDate)
        const end = new Date(endDate)

        const diffMs = end.getTime() - start.getTime() // difference in milliseconds

        if (isNaN(diffMs)) {
            throw new Error('Invalid date input')
        }

        const totalMinutes = Math.floor(diffMs / (1000 * 60))
        const hours = Math.floor(totalMinutes / 60)
        const minutes = totalMinutes % 60

        return `${hours}h ${minutes}m`
    }


    return (
        <div className="bg-white shadow-md rounded-xl p-5 transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-ts-green bg-opacity-10 rounded-full flex items-center justify-center mr-3">
                    <FontAwesomeIcon icon={faPlane} className="text-white" />
                </div>
                <div className="flex-1">
                    <div className="text-lg font-semibold">
                        {airportMap[flight.outboundFlight.departureAirport.locationCode].AirportName} -&gt; {airportMap[flight.outboundFlight.arrivalAirport.locationCode].AirportName}
                    </div>
                </div>
            </div>
            <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                    <FontAwesomeIcon icon={faCalendar} className="text-gray-600" />
                </div>
                <div className="text-gray-600">{formatDate(flight.outboundFlight.departureDateTime)}</div>
            </div>

            <div className="flex items-center text-sm text-gray-500 mb-4">
                <div className="mr-2">Flight Duration:</div>
                <span className="font-medium">{getTimeDifference(flight.outboundFlight.departureDateTime, flight.outboundFlight.arrivalDateTime)}</span>
            </div>

            <div className="flex justify-between items-center mt-4">
                <div>
                    <div className="text-xs text-gray-500">From</div>
                    <span className="text-xl font-bold">{formatPrice(flight.pricingInfoSum.totalPriceAllPassengers)}</span>
                </div>
                <button className="bg-ts-purple text-white px-4 py-2 rounded-full">
                    Book
                </button>
            </div>
        </div>
    )
}