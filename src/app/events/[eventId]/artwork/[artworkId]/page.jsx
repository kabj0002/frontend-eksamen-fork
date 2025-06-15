//Katinka
//Denne side viser SingleArtView når man klikker på image i gallery i SingleEvent

import ArtworkPageContent from "@/components/art_singleview/ArtworkPageContent";

export default async function EventArtworkPage({ params }) {
  const { eventId, artworkId } = params;

  if (!artworkId || !eventId) return <div>Ugyldige parametre</div>;

  return <ArtworkPageContent artworkId={artworkId} eventId={eventId} />;
}
