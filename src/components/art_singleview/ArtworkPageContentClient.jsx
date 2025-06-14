//Katinka - Opretter client component for å kunne lave tilbage knap

"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import BtnWithArrow from "../BtnWithArrow";
import RelatedArt from "@/components/art_singleview/RelatedArt";
import SingleArtTextContent from "@/components/art_singleview/SingleArtTextContent";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "@/app/custom-skeleton.css"; // Min egen skeleton CSS
import { useState, useEffect } from "react";
import useMinimumLoading from "@/utils/useMinimumLoading";

export default function ArtworkPageContentClient({ artwork, eventId, events }) {
  const router = useRouter();

  const handleBackClick = () => {
    if (eventId) {
      router.push(`/events/${eventId}`);
    } else if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/events"); // fallback hvis der ikke er nogen historik
    }
  };

  const heightEntry = artwork.dimensions?.find((d) => d.type === "højde");
  const widthEntry = artwork.dimensions?.find((d) => d.type === "bredde");

  const height = heightEntry ? parseInt(heightEntry.value) : null;
  const width = widthEntry ? parseInt(widthEntry.value) : null;

  const isPortrait = height && width ? height > width : true;

  //Tilbage til event knap
  const currentEvent = events.find((event) => event.id === eventId);

  // Track loading baseret på om artwork findes eller ej
  const [loading, setLoading] = useState(true);

  // Når artwork ændrer sig, stop loading
  useEffect(() => {
    if (artwork) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [artwork]);

  // Bruger hook til minimum 3 sekunders loading
  const showSkeleton = useMinimumLoading(loading, 3000);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/*mobil*/}
      <div className="sticky top-10 pb-3 pr-2 rounded-sm bg-white w-fit lg:hidden cursor-pointer mt-4">
        <BtnWithArrow direction="left" onClick={handleBackClick}>
          <span className="uppercase text-left block">
            {eventId ? (
              <>
                Tilbage til{" "}
                <span className="font-semibold">
                  {currentEvent?.title || "event"}
                </span>
              </>
            ) : (
              "Tilbage til værk"
            )}
          </span>
        </BtnWithArrow>
      </div>

      <div className="lg:col-span-4 self-start lg:sticky top-10">
        {/*desktop*/}
        <div className="sticky top-10 pb-3 pr-2 rounded-sm bg-white w-fit cursor-pointer hidden lg:block mb-4">
          <BtnWithArrow direction="left" onClick={handleBackClick}>
            <span className="uppercase text-left block">
              {eventId ? (
                <>
                  Tilbage til{" "}
                  <span className="font-semibold">
                    {currentEvent?.title || "event"}
                  </span>
                </>
              ) : (
                "Tilbage til værk"
              )}
            </span>
          </BtnWithArrow>
        </div>
        <SingleArtTextContent
          data={artwork}
          allEvents={events}
          eventId={eventId}
          onlyMeta={true}
        />
      </div>

      <div className="lg:col-span-8 space-y-8">
        <>
          {showSkeleton ? (
            //Responsiv skeleton
            <div className="w-full max-w-full aspect-[7/5]">
              <Skeleton width="100%" height="100%" />
            </div>
          ) : (
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
          )}

          <SingleArtTextContent
            data={artwork}
            allEvents={events}
            eventId={eventId}
            onlyContent={true}
          />
          <RelatedArt artworkId={artwork.object_number} />
        </>
      </div>
    </div>
  );
}
