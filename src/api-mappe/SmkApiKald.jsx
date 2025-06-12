//maja
//fetch til at hente kunstværker fra SMK
async function fetchArtworkById(artworkId) {
  try {
    const response = await fetch(
      `https://api.smk.dk/api/v1/art/?object_number=${artworkId}`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch artwork with ID ${artworkId}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching artwork with ID ${artworkId}:`, error);
    throw error;
  }
}

//FETCH SPECIFIKKE VÆRKER TIL FORSIDEN
// ID'er på de specifikke værker til forsiden
const selectedIds = [
  "KMS3658",
  "KMS4409",
  "KMS4149",
  "KMS6730",
  "KMS4873",
  "KMS8562",
];

// Eksporteret funktion, så den kan bruges fra andre komponenter
async function fetchSelectedWorks() {
  const works = await Promise.all(
    selectedIds.map(async (id) => {
      try {
        const res = await fetch(
          `https://api.smk.dk/api/v1/art?object_number=${id}`
        );
        const data = await res.json();
        const item = data.items?.[0];
        console.log("ITEM:", item);
        console.log("PRODUCTION:", item.production);
        if (!item) return null;

        return {
          image: item.image_thumbnail,
          title: item.titles?.[0]?.title ?? "Ukendt titel",
          artist:
            Array.isArray(item.artist) && item.artist.length > 0
              ? item.artist[0]
              : "Ukendt kunstner",
        };
      } catch (error) {
        console.error(`Fejl ved værk ${id}:`, error);
        return null;
      }
    })
  );

  return works.filter((work) => work?.image);
}

export { fetchArtworkById, fetchSelectedWorks };
