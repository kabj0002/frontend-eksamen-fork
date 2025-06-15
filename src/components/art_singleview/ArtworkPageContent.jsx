//Katinka
//Debug prompt (Matilde): Hvordan kan jeg tilgå artwork singleview siden fra både event siden og artwork siden, når de har forskellig URL
// -- Chatten foreslog at lave flere routes i filstrukturen og sætte hovedindholdet ind som et komponent

import ArtworkPageContentClient from "./ArtworkPageContentClient";
import { fetchEvents } from "@/api-mappe/EventsApiKald";

export default async function ArtworkPageContent({ artworkId, eventId }) {
  if (!artworkId) {
    return <div>Mangler artwork ID</div>;
  }

  try {
    const [artworkRes, events] = await Promise.all([
      fetch(`https://api.smk.dk/api/v1/art?object_number=${artworkId}`).then(
        (res) => res.json()
      ),
      fetchEvents(),
    ]);

    const artwork = artworkRes.items?.[0];

    if (!artwork) {
      return <div>Kunstværk blev ikke fundet</div>;
    }

    return (
      <ArtworkPageContentClient
        artwork={artwork}
        eventId={eventId}
        events={events}
      />
    );
  } catch (error) {
    console.error("Fejl:", error);
    return <div>Der opstod en fejl ved indlæsning</div>;
  }
}
