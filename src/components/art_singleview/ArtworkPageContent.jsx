//Katinka
//Debug prompt (Matilde): Hvordan kan jeg tilgå artwork singleview siden fra både event siden og artwork siden, når de har forskellig URL
// -- Chatten foreslog at lave flere routes i filstrukturen og sætte hovedindholdet ind som et komponent
// "use client";
// import Image from "next/image";
// import RelatedArt from "@/components/art_singleview/RelatedArt";
// import SingleArtTextContent from "@/components/art_singleview/SingleArtTextContent";
// import { fetchEvents } from "@/api-mappe/EventsApiKald";
// import BtnWithArrow from "../BtnWithArrow";
// import { useRouter } from "next/navigation";

// export default async function ArtworkPageContent({ artworkId, eventId }) {
//   if (!artworkId) return <div>Ugyldige parametre</div>;

//   // Henter kunstværk
//   const res = await fetch(
//     `https://api.smk.dk/api/v1/art?object_number=${artworkId}`
//   );
//   const data = await res.json();
//   const artwork = data.items?.[0];

//   if (!artwork) return <div>Kunstværk blev ikke fundet</div>;

//   // Henter events (bruger API-kald funktion)
//   let events = [];
//   try {
//     events = await fetchEvents();
//   } catch (error) {
//     console.error("Kunne ikke hente events:", error);
//   }

//   //For at kunne klikke sig tilbage til events
//   const router = useRouter();

//   const handleBackClick = () => {
//     if (eventId) {
//       router.push(`/event/${eventId}`); // eller `/events/${eventId}` afhængigt af din route
//     } else {
//       router.back(); // fallback hvis ingen eventId
//     }
//   };

//   // Udtrækker bredde og højde fra dimensions-array
//   const heightEntry = artwork.dimensions?.find((d) => d.type === "højde");
//   const widthEntry = artwork.dimensions?.find((d) => d.type === "bredde");

//   const height = heightEntry ? parseInt(heightEntry.value) : null;
//   const width = widthEntry ? parseInt(widthEntry.value) : null;

//   const isPortrait = height && width ? height > width : true; // fallback til portrait

//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
//       <div className="sticky top-10 bg-white w-fit lg:hidden cursor-pointer mt-4">
//         <BtnWithArrow direction="left" onClick={handleBackClick}>
//           TILBAGE TIL EVENT
//         </BtnWithArrow>
//       </div>
//       {/* Venstre sticky kolonne */}

//       <div className="lg:col-span-4 self-start lg:sticky top-10">
//         <div className="sticky top-10 bg-white w-fit cursor-pointer hidden lg:block mb-4">
//           <BtnWithArrow direction="left" onClick={handleBackClick}>
//             TILBAGE TIL EVENT
//           </BtnWithArrow>
//         </div>
//         <SingleArtTextContent
//           data={artwork}
//           allEvents={events}
//           eventId={eventId}
//           onlyMeta={true} // vi håndterer delvis render
//         />
//       </div>

//       {/* Højre kolonne: billede og tekst */}
//       <div className="lg:col-span-8 space-y-8">
//         <div>
//           {isPortrait ? (
//             <div className="w-auto h-[70vh] max-h-[600px] lg:h-[600px] lg:max-h-[600px]">
//               <Image
//                 src={artwork.image_thumbnail || "/imgs/placeholder.jpg"}
//                 alt={artwork.title || "Artwork"}
//                 width={1200}
//                 height={1600}
//                 quality={90}
//                 className="h-full w-auto object-contain mx-auto"
//               />
//             </div>
//           ) : (
//             <div className="w-full max-w-full h-auto lg:w-[700px]">
//               <Image
//                 src={artwork.image_thumbnail || "/imgs/placeholder.jpg"}
//                 alt={artwork.title || "Artwork"}
//                 width={1600}
//                 height={1200}
//                 quality={90}
//                 className="w-full h-auto object-contain mx-auto"
//               />
//             </div>
//           )}
//         </div>

//         {/* Tekstindhold */}
//         <SingleArtTextContent
//           data={artwork}
//           allEvents={events}
//           eventId={eventId}
//           onlyContent={true}
//         />
//         <RelatedArt artworkId={artworkId} />
//       </div>
//     </div>
//   );
// }

//server component
import ArtworkPageContentClient from "./ArtworkPageContentClient";
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

  const res = await fetch(
    `https://api.smk.dk/api/v1/art?object_number=${artworkId}`
  );
  const data = await res.json();
  const artwork = data.items?.[0];

  if (!artwork) return <div>Kunstværk blev ikke fundet</div>;

  let events = [];
  try {
    events = await fetchEvents();
  } catch (error) {
    console.error("Kunne ikke hente events:", error);
  }

  return (
    <ArtworkPageContentClient
      artwork={artwork}
      eventId={eventId}
      events={events}
    />
  );
}
