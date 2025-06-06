//Katinka
//Debug prompt (Matilde): Hvordan kan jeg tilgå artwork singleview siden fra både event siden og artwork siden, når de har forskellig URL
// -- Chatten foreslog at lave flere routes i filstrukturen og sætte hovedindholdet ind som et komponent

import Image from "next/image";
import RelatedArt from "@/components/art_singleview/RelatedArt";
import SingleArtTextContent from "@/components/art_singleview/SingleArtTextContent";
import { fetchEvents } from "@/api-mappe/EventsApiKald";
import Skeleton from "react-loading-skeleton";

export default async function ArtworkPageContent({ artworkId, eventId }) {
  if (!artworkId) return <div>Ugyldige parametre</div>;

  // Henter kunstværk
  const res = await fetch(
    `https://api.smk.dk/api/v1/art?object_number=${artworkId}`
  );
  const data = await res.json();
  const artwork = data.items?.[0];

  if (!artwork) return <div>Kunstværk blev ikke fundet</div>;

  // Henter events (bruger API-kald funktion)
  let events = [];
  try {
    events = await fetchEvents();
  } catch (error) {
    console.error("Kunne ikke hente events:", error);
  }

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
            <Image
              // src={artwork.image_thumbnail || "/imgs/placeholder.jpg"}
              // alt={artwork.title || "Artwork"}
              src={artwork.image_thumbnail || <Skeleton />}
              alt={artwork.title || <Skeleton />}
              width={1200}
              height={1600}
              quality={90}
              className="h-full w-auto object-contain mx-auto"
            />
          </div>
        ) : (
          // Landscape: Fast bredde på desktop, tilpasser på mobil
          <div className="w-full max-w-full h-auto lg:w-[1200px]">
            <Image
              // src={artwork.image_thumbnail || "/imgs/placeholder.jpg"}
              // alt={artwork.title || "Artwork"}
              src={artwork.image_thumbnail || <Skeleton />}
              alt={artwork.title || <Skeleton />}
              width={1600}
              height={1200}
              quality={90}
              className="w-full h-auto object-contain mx-auto"
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
