"use client"

import { useEffect, useRef } from "react"

interface Property {
  id: string
  name: string
  price: number
  rating: number
  distance: number
  bedrooms: number
  bathrooms: number
  maxGuests: number
}

interface MapComponentProps {
  center: [number, number]
  properties: Property[]
}

export default function MapComponent({ center, properties }: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)

  useEffect(() => {
    if (typeof window !== "undefined" && mapRef.current && !mapInstanceRef.current) {
      // Dynamically import Leaflet to avoid SSR issues
      import("leaflet").then((L) => {
        // Initialize map
        const map = L.map(mapRef.current!).setView(center, 14)

        // Add tile layer
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap contributors",
        }).addTo(map)

        // Add main property marker
        const mainMarker = L.marker(center).addTo(map)
        mainMarker.bindPopup("<b>내 숙소</b><br>예측 위치").openPopup()

        // Add similar properties markers
        properties.forEach((property, index) => {
          // Generate random coordinates around the center
          const lat = center[0] + (Math.random() - 0.5) * 0.01
          const lng = center[1] + (Math.random() - 0.5) * 0.01

          const marker = L.marker([lat, lng]).addTo(map)
          marker.bindPopup(`
            <div>
              <b>${property.name}</b><br>
              ₩${property.price.toLocaleString()}<br>
              ⭐ ${property.rating} · ${property.distance}km
            </div>
          `)
        })

        mapInstanceRef.current = map
      })
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [center, properties])

  return <div ref={mapRef} className="w-full h-full" />
}
