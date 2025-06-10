//Katinka - Opretter client component for å kunne lave tilbage knap

"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import BtnWithArrow from "../BtnWithArrow";
import RelatedArt from "@/components/art_singleview/RelatedArt";
import SingleArtTextContent from "@/components/art_singleview/SingleArtTextContent";

export default function ArtworkPageContentClient({ artwork, eventId, events }) {
  const router = useRouter();

  const handleBackClick = () => {
    console.log("Navigerer tilbage til event:", eventId);
    if (eventId) {
      router.push(`/events/${eventId}`);
    } else {
      router.push("/events");
    }
  };

  const heightEntry = artwork.dimensions?.find((d) => d.type === "højde");
  const widthEntry = artwork.dimensions?.find((d) => d.type === "bredde");

  const height = heightEntry ? parseInt(heightEntry.value) : null;
  const width = widthEntry ? parseInt(widthEntry.value) : null;

  const isPortrait = height && width ? height > width : true;

  //Tilbage til event knap
  const currentEvent = events.find((event) => event.id === eventId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Tilbage knap fjernes fra related singleart */}
      {eventId && (
        <div className="sticky top-10 bg-white w-fit lg:hidden cursor-pointer mt-4">
          <BtnWithArrow direction="left" onClick={handleBackClick}>
            <span className="uppercase">{`Tilbage til ${
              currentEvent?.title || "event"
            }`}</span>
          </BtnWithArrow>
        </div>
      )}

      {eventId && (
        <div className="lg:col-span-4 self-start lg:sticky top-10">
          <div className="sticky top-10 bg-white w-fit cursor-pointer hidden lg:block mb-4">
            <BtnWithArrow direction="left" onClick={handleBackClick}>
              <span className="uppercase">{`Tilbage til ${
                currentEvent?.title || "event"
              }`}</span>
            </BtnWithArrow>
          </div>
          <SingleArtTextContent
            data={artwork}
            allEvents={events}
            eventId={eventId}
            onlyMeta={true}
          />
        </div>
      )}
      {/* Sørger for at sticky text til venstre ikke styles anderledes */}
      {!eventId && (
        <div className="lg:col-span-4 self-start lg:sticky top-10">
          <SingleArtTextContent
            data={artwork}
            allEvents={events}
            eventId={eventId}
            onlyMeta={true}
          />
        </div>
      )}

      <div className="lg:col-span-8 space-y-8">
        <div>
          {isPortrait ? (
            <div className="w-auto h-[70vh] max-h-[600px] lg:h-[600px] lg:max-h-[600px]">
              <Image
                src={artwork.image_thumbnail || "/imgs/placeholder.jpg"}
                alt={artwork.title || "Artwork"}
                width={1200}
                height={1600}
                quality={90}
                className="h-full w-auto object-contain mx-auto"
              />
            </div>
          ) : (
            <div className="w-full max-w-full h-auto lg:w-[700px]">
              <Image
                src={artwork.image_thumbnail || "/imgs/placeholder.jpg"}
                alt={artwork.title || "Artwork"}
                width={1600}
                height={1200}
                quality={90}
                className="w-full h-auto object-contain mx-auto"
              />
            </div>
          )}
        </div>

        <SingleArtTextContent
          data={artwork}
          allEvents={events}
          eventId={eventId}
          onlyContent={true}
        />
        <RelatedArt artworkId={artwork.object_number} />
      </div>
    </div>
  );
}
