//Katinka
//Art Single View Text Content

import Link from "next/link";

//Rydder op i colors (Fået hjælp af AI)
function hexToHSL(hex) {
  // Omregning af hex til RGB
  let r = 0,
    g = 0,
    b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex.substring(1, 3), 16);
    g = parseInt(hex.substring(3, 5), 16);
    b = parseInt(hex.substring(5, 7), 16);
  }

  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0,
    s = 0,
    l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return { h, s, l };
}

const SingleArtTextContent = ({ data, allEvents = [] }) => {
  // Filtrérer events der indeholder dette værk
  const relatedEvents = allEvents.filter((event) =>
    event.artworkIds?.includes(data.object_number)
  );
  //Sorterer farverne efter Hue
  const sortedColors = [...data.colors].sort((a, b) => {
    const hslA = hexToHSL(a);
    const hslB = hexToHSL(b);
    return hslA.h - hslB.h;
  });

  return (
    <div className="sm:grid sm:grid-cols-3 gap-3 sm:gap-5 md:gap-8">
      <div className="pt-6 sm:pt-8 md:pt-12 sm:col-[1/2] sm:self-start sm:sticky sm:top-0">
        <h3 className="italic mb-4">
          {data.titles?.[0]?.title || "Ukendt titel"}
        </h3>
        <h4>{data.artist || "Ukendt kunstner"}</h4>
        <ul>
          <li>
            <span className="font-semibold">Kunstnerens nationalitet:</span>{" "}
            {data.production?.[0]?.creator_nationality || "Ukendt nationalitet"}
          </li>
          <li>
            <span className="font-semibold">Periode:</span>{" "}
            {data.production_date?.[0].period || "Ukendt periode"}
          </li>
          <li>
            <span className="font-semibold">Ansvarlig afdeling:</span>{" "}
            {data.responsible_department || "Ukendt afdeling"}
          </li>
          <li>
            <span className="font-semibold">Teknik:</span>{" "}
            {data.techniques?.join(", ") || "Ukendt teknik"}
          </li>
          <li>
            <span className="font-semibold">Materialer:</span>{" "}
            {data.materials?.join(", ") || "Ukendt materiale"}
          </li>
          <li>
            <span className="font-semibold">Farver brugt:</span>
          </li>
        </ul>
        <div className="flex flex-wrap py-3 justify-start ml-5">
          {sortedColors.length > 0 ? (
            sortedColors.map((color, index) => (
              <div
                key={index}
                className={`w-10 h-10 rounded-full border border-neutral-300 ${
                  index !== 0 ? "-ml-6" : "-ml-6"
                }`}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))
          ) : (
            <p className="text-gray-500">Ingen farver fundet i databasen.</p>
          )}
        </div>
      </div>

      {/*Rettelse af Maja: Den meget lange importerede tekst har ingen breaks og ser uoverskueligt ud. Vi ville gerne tilføje nogle breaks så det var mere letlæseligt */}
      {/*prompt til AI: "Er det muligt at skabe et break i teksten ved hvert 10 punktum så det bliver delt mere op i afsnit" */}
      <div className="pt-5 sm:pt-8 md:pt-12 sm:col-[2/4]">
        <h5>Kunstnerens historie:</h5>
        {data.production?.[0]?.creator_history ? (
          <div className="mt-2 md:mt-4">
            {(() => {
              // Split på punktum efterfulgt af mellemrum
              const sentences = data.production[0].creator_history.split(/\. /);
              // Saml 10 sætninger pr. afsnit
              const paragraphs = [];
              for (let i = 0; i < sentences.length; i += 10) {
                paragraphs.push(sentences.slice(i, i + 10).join(". "));
              }
              return paragraphs.map(
                (paragraph, idx) =>
                  paragraph.trim() && (
                    <p key={idx} className="mb-2">
                      {paragraph.trim()}
                      {paragraph.endsWith(".") ? "" : "."}
                    </p>
                  )
              );
            })()}
          </div>
        ) : (
          <p className="mt-2 md:mt-4">Ukendt historie</p>
        )}

        <h5 className="mt-6 md:mt-8">Tidligere udstillinger:</h5>
        <ul className="mt-2 md:mt-4">
          {data.exhibitions?.length > 0 ? (
            data.exhibitions.map((exh, i) => (
              <li key={i}>
                <span className="font-semibold">{exh.exhibition}</span> —{" "}
                {/* Ændrer til dansk dato */}
                {new Date(exh.date_start).toLocaleDateString("da-DK", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}{" "}
                til{" "}
                {new Date(exh.date_end).toLocaleDateString("da-DK", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}{" "}
                — {exh.venue}
              </li>
            ))
          ) : (
            <li>Ukendt</li>
          )}
        </ul>

        <h5 className="mt-6 md:mt-8">Se kunstværket på følgende events:</h5>
        <ul className="mt-2 md:mt-4 list-none list-inside ">
          {relatedEvents.length > 0 ? (
            relatedEvents.map((event) => (
              <li key={event.id}>
                <Link
                  href={`/events/${event.id}`}
                  className="first-letter:capitalize text-primary-red font-semibold inline-block transition-transform transform hover:scale-103 hover:text-primary-red-hover2"
                >
                  {event.title}
                </Link>
                <span>
                  {" "}
                  — {/* Ændrer til dansk dato */}
                  {new Date(event.date).toLocaleDateString("da-DK", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}{" "}
                  —{" "}
                  {event.location?.name && event.location?.address
                    ? `${event.location.name}, ${event.location.address}`
                    : "Lokation ikke tilgængelig"}
                </span>
              </li>
            ))
          ) : (
            <li>Ingen aktuelle events for dette værk</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default SingleArtTextContent;
