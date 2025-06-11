//Matilde
//Katinka - dropdown til mobile

"use client";

import { useEffect, useState, useRef } from "react";
import EventCard from "@/components/events/EventCard";
import SelectCity from "@/components/events/SelectCity";
import normalizeCity from "@/utils/normalizeCity";
import { fetchEvents } from "../../api-mappe/EventsApiKald";
import { IoIosArrowDown } from "react-icons/io";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "@/app/custom-skeleton.css"; // Min egen skeleton CSS

export default function Page() {
  const [events, setEvents] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getEvents = async () => {
      //simulere en langsom server for at se skeleton loading funktion
      await new Promise((resolve) => setTimeout(resolve, 3000)); // 3 sekunders delay

      try {
        const data = await fetchEvents();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    getEvents();
  }, []);

  //Sletter et event
  const handleDeleted = (deletedEventId) => {
    setEvents((prevEvents) =>
      prevEvents.filter((event) => event.id !== deletedEventId)
    );
  };

  //Opdaterer card efter redigering
  const handleEdit = (updatedEvent) => {
    setEvents((prevEvents) =>
      prevEvents.map((ev) => (ev.id === updatedEvent.id ? updatedEvent : ev))
    );
  };

  const filteredEvents =
    selectedCities.includes("Alle Byer") || selectedCities.length === 0
      ? events
      : events.filter((event) =>
          selectedCities.includes(normalizeCity(event.location.address))
        );

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Luk dropdown når man klikker udenfor
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <section>
      <h1 className="mb-2 sm:mb-3">Events</h1>
      <p>
        Oplev spændende kunstevents med fokus på modernismen – over hele
        Danmark. Gå på opdagelse i en tid præget af kunstnerisk opbrud og
        nyskabelse, hvor former, farver og idéer blev udfordret. Fra kubisme og
        ekspressionisme til abstrakte eksperimenter – udstillingerne rummer alt
        fra intime gallerier til anerkendte museer. Uanset om du er passioneret
        kunstkender eller bare nysgerrig, er der masser at opleve. Vi glæder os
        til at byde dig velkommen!
      </p>
      <div>
        <div className="border-2 border-black w-full my-6 sm:my-10 z-50 self-start sticky sm:top-37 md:top-41 lg:top-45"></div>

        <div className="grid sm:grid-cols-[1fr_2fr] gap-4">
          {/* Mobilversion, dropdown filtrering */}
          <div
            ref={dropdownRef}
            className="block md:hidden self-start sticky top-26 bg-white pt-2 z-50"
          >
            <div
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className="text-white bg-black flex justify-between items-center px-4 py-2 border-2 border-black rounded cursor-pointe"
            >
              <span>Vælg By</span>
              <IoIosArrowDown
                className={`transition-transform duration-300 ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </div>

            {isDropdownOpen && (
              <div className="px-4 pb-2">
                <SelectCity
                  selectedCities={selectedCities}
                  setSelectedCities={setSelectedCities}
                />
              </div>
            )}
          </div>

          {/* Desktop version, dropdown filtrering */}
          <div className="hidden md:block md:self-start md:sticky md:top-45 lg:top-55">
            <SelectCity
              selectedCities={selectedCities}
              setSelectedCities={setSelectedCities}
            />
          </div>

          {/* <div className="flex flex-col gap-4">
            {loading ? (
              <p className="mt-2 italic">Indlæser events... </p>
            ) : filteredEvents.length === 0 ? (
              <p className="mt-2 italic">
                Ingen events fundet på den valgte lokation...
              </p>
            ) : (
              filteredEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onDeleted={() => handleDeleted(event.id)}
                  onEdit={handleEdit}
                >
                  <Skeleton
                    baseColor="#c9c9c9"
                    highlightColor="#fdfdfd"
                    className="react-loading-skeleton block h-full w-full"
                    borderRadius={0}
                  />
                </EventCard>
              ))
            )}
          </div> */}
          <div className="flex flex-col gap-4">
            {loading ? (
              // Viser 3 skeletter mens siden loader
              <>
                <p className="mt-2 italic">Indlæser events... </p>

                <Skeleton height={300} count={3} />

                {/* <Skeleton height={300} />
                <Skeleton height={300} />
                <Skeleton height={300} /> */}
              </>
            ) : filteredEvents.length === 0 ? (
              <p className="mt-2 italic">
                Ingen events fundet på den valgte lokation...
              </p>
            ) : (
              filteredEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onDeleted={() => handleDeleted(event.id)}
                  onEdit={handleEdit}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
