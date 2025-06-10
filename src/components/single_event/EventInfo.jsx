"use client";

// Maja
// Denne komponent viser information om et event, herunder titel, beskrivelse, dato, sted og klokkeslæt.
// Den indeholder også redigeringsknap så den kan tilgås flere steder på hjemmesiden.
import { LuMapPin, LuClock4 } from "react-icons/lu";
import { FiCalendar } from "react-icons/fi";
import { formatDate } from "@/utils/formatDate";

const Eventinfo = ({ event, onEdit }) => {
  const formattedDate = formatDate(event.date);

  return (
    <div className="flex flex-col">
      <p className="mx-auto text-center first-letter:capitalize">
        {event.description}
      </p>

      <div className="grid grid-cols-3 py-10 gap-5 sm:py-14 sm:gap-18 md:py-18 md:gap-23 lg:py-20 lg:gap-28 text-center max-w-[1000px] mx-auto">
        <div className="flex flex-col items-center">
          <FiCalendar
            size={50}
            className="text-primary-red sm:w-17 md:w-20 lg:w-23 h-auto"
            strokeWidth={1.4}
          />
          <div className="font-semibold capitalize text-text-p mt-5 text-sm sm:text-m md:text-lg lg:text-xl">
            {formattedDate}
          </div>
        </div>

        <div className="flex flex-col items-center">
          <LuMapPin
            size={50}
            className="text-primary-red sm:w-17 md:w-20 lg:w-23 h-auto"
            strokeWidth={1.4}
          />
          <div className="font-semibold text-text-p mt-5 text-sm sm:text-m md:text-lg lg:text-xl">
            {event.location?.address}
          </div>
        </div>

        <div className="flex flex-col items-center">
          <LuClock4
            size={50}
            className="text-primary-red sm:w-17 md:w-20 lg:w-23 h-auto"
            strokeWidth={1.4}
          />
          <div className="font-semibold text-text-p mt-5 text-sm sm:text-m md:text-lg lg:text-xl">
            Kl. 10-14
          </div>
        </div>
      </div>
    </div>
  );
};

export default Eventinfo;
