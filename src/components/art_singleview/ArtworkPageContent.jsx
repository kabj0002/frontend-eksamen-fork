//Katinka
//Debug prompt (Matilde): Hvordan kan jeg tilgå artwork singleview siden fra både event siden og artwork siden, når de har forskellig URL
// -- Chatten foreslog at lave flere routes i filstrukturen og sætte hovedindholdet ind som et komponent
//Ved implementering af loading skeleton gør jeg komponent til client og flytter fetch hertil. Bruger state til at vise skeleton mens billedet loader

"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import RelatedArt from "@/components/art_singleview/RelatedArt";
import SingleArtTextContent from "@/components/art_singleview/SingleArtTextContent";
import { fetchEvents } from "@/api-mappe/EventsApiKald";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "@/app/custom-skeleton.css"; // Min egen skeleton CSS

export default function ArtworkPageContent({ artworkId, eventId }) {
  const [artwork, setArtwork] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!artworkId) return;

      try {
        //simulere en langsom server for at se skeleton loading funktion
        await new Promise((resolve) => setTimeout(resolve, 3000)); // 3 sekunders delay

        // Henter kunstværk
        const res = await fetch(
          `https://api.smk.dk/api/v1/art?object_number=${artworkId}`
        );
        const data = await res.json();
        setArtwork(data.items?.[0]);

        // if (!artwork) return <div>Kunstværk blev ikke fundet</div>;
        const eventsData = await fetchEvents();
        setEvents(eventsData);
      } catch (error) {
        console.error("Kunne ikke hente events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [artworkId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center mx-3">
        <Skeleton height={500} width={400} />
        <div className="mt-4 w-full">
          <Skeleton count={3} />
        </div>
      </div>
    );
  }

  if (!artwork) return <div>Kunstværk blev ikke fundet</div>;

  // Udtrækker bredde og højde fra dimensions-array
  const heightEntry = artwork.dimensions?.find((d) => d.type === "højde");
  const widthEntry = artwork.dimensions?.find((d) => d.type === "bredde");

  const height = heightEntry ? parseInt(heightEntry.value) : null;
  const width = widthEntry ? parseInt(widthEntry.value) : null;

  const isPortrait = height && width ? height > width : true; // fallback til portrait

  return (
    <div>
      <div className="flex flex-col items-center mx-3">
        {isPortrait ? (
          // Portrait: Fast højde på desktop, tilpasser bredde på mobil
          <div className="w-auto h-[70vh] max-h-[900px] lg:h-[900px] lg:max-h-[900px]">
            {imageLoading && (
              <Skeleton className="w-full h-full" height="100%" />
            )}
            <Image
              src={artwork.image_thumbnail || "/imgs/placeholder.jpg"}
              alt={artwork.title || "Artwork"}
              width={1200}
              height={1600}
              quality={90}
              className="h-full w-auto object-contain mx-auto"
              onLoadingComplete={() => setImageLoading(false)}
            />
          </div>
        ) : (
          // Landscape: Fast bredde på desktop, tilpasser på mobil
          <div className="w-full max-w-full h-auto lg:w-[1200px]">
            {imageLoading && (
              <Skeleton className="w-full h-[600px]" height="100%" />
            )}
            <Image
              src={artwork.image_thumbnail || "/imgs/placeholder.jpg"}
              alt={artwork.title || "Artwork"}
              width={1600}
              height={1200}
              quality={90}
              className="w-full h-auto object-contain mx-auto"
              onLoadingComplete={() => setImageLoading(false)}
            />
          </div>
        )}

        <SingleArtTextContent
          data={artwork}
          allEvents={events}
          eventId={eventId}
        />
      </div>

      <RelatedArt artworkId={artworkId} />
    </div>
  );
}
