import { HotelHero } from "@/components/hotel-hero"
import { RoomBooking } from "@/components/room-booking"
import { TourismLocations } from "@/components/tourism-locations"
import { HotelServices } from "@/components/hotel-services"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <HotelHero />
      <RoomBooking />
      <TourismLocations />
      <HotelServices />
    </main>
  )
}
