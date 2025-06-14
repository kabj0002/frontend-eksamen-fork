//Katinka
//Denne side viser Singleview når man klikker på image i RelatedArt i SingleArt page

import ArtworkPageContent from "@/components/art_singleview/ArtworkPageContent";

export default async function ArtworkPage({ params }) {
  const { artworkId } = params;

  if (!artworkId) return <div>Ugyldige parametre</div>;

  return (
    <div>
      <ArtworkPageContent artworkId={artworkId} eventId={undefined} />
    </div>
  );
}
