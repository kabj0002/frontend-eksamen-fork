//maja
//Denne komponent viser et kunstværk i et galleri, hvor brugeren kan klikke for at læse mere om værket.
//Den er stylet med en tydelig hover så brugeren kan se at den er klikbar.
//Hele billedet er et link men den har også en animeret knap med pil

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { fetchArtworkById } from "../../../api-mappe/SmkApiKald";
import BtnWithArrow from "@/components/BtnWithArrow";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "@/app/custom-skeleton.css"; // Min egen skeleton CSS

const TestArtCart = ({ artworkId, eventId }) => {
  const [artwork, setArtwork] = useState(null);

  //henter kunstværket baseret på artworkId (hentet fra api-mappen)
  useEffect(() => {
    const fetchArtwork = async () => {
      //simulere en langsom server for at se skeleton loading funktion
      await new Promise((resolve) => setTimeout(resolve, 3000)); // 3 sekunders delay

      try {
        const data = await fetchArtworkById(artworkId);
        if (data.items && data.items.length > 0) {
          setArtwork(data.items[0]);
        }
      } catch (error) {
        console.error("Error fetching artwork:", error);
      }
    };
    fetchArtwork();
  }, [artworkId]);

  if (!artwork) {
    return (
      <div className="flex flex-row gap-4">
        <Skeleton height={200} width={300} />
        <Skeleton height={300} width={200} />
        <Skeleton height={250} width={250} />
        <Skeleton height={300} width={200} />
        <Skeleton height={200} width={300} />
      </div>
    );
  }

  // Dynamisk link baseret på eventId og artwork object_number
  const linkHref = `/events/${eventId}/artwork/${artwork.object_number}`;

  return (
    <Link
      href={linkHref}
      className="relative flex items-center justify-center overflow-hidden rounded-sm shadow-lg bg-white max-w-[420px] min-w-[250px] cursor-pointer"
      style={{ padding: 0 }}
    >
      <Image
        src={artwork.image_thumbnail || "/imgs/placeholder.jpg"}
        alt={artwork.titles?.[0]?.title || "Artwork"}
        width={600}
        height={800}
        className="object-contain w-full h-auto transition duration-300 group-hover:opacity-40"
        style={{ display: "block" }}
      />
      <div className="absolute inset-0 flex flex-col justify-end px-6 py-4 opacity-0 transition-opacity duration-300 hover:opacity-100 bg-white/10 backdrop-blur-[2px] rounded-sm">
        <span className="text-white font-semibold text-lg mb-1 break-words leading-tight max-w-full text-balance sm:text-sm md:text-md lg:text-lg line-clamp-2 text-shadow-red">
          {artwork.titles?.[0]?.title || "TITEL PÅ BILLEDE"}
        </span>
        <span className=" group ">
          <BtnWithArrow>
            <span className="font-semibold text-lg">LÆS MERE</span>
          </BtnWithArrow>
        </span>
      </div>
    </Link>
  );
};

export default TestArtCart;
