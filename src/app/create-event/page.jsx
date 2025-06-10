//Matilde og Katinka
//Brugt AI til at koble form og artwork list sammen, samt en masse debugging
//Prompt: Hvilke ting fra min form og artworks fil skal jeg flytte op i page for at få det til
// at kunne hænge sammen ved opret?
"use client";
import { useState, useRef } from "react";
import { useEventFormLogic } from "@/utils/eventFormsLogic";
import ArtworkList from "@/components/edit_create_event/ArtworkList";
import EventForm from "@/components/edit_create_event/forms/InputForm";
import Button from "@/components/Button";
import PopUpBase from "@/components/PopUpBaseLayout";
import Link from "next/link";
import BtnWithArrow from "@/components/BtnWithArrow";
import { RxCross2 } from "react-icons/rx";

export default function Page() {
  const { locations, createNewEvent } = useEventFormLogic();

  //States til form og navigation af steps
  const [selectedArtworks, setSelectedArtworks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  //States til popup
  const [showPopup, setShowPopup] = useState(false);
  const [eventLink, setEventLink] = useState("");

  //Prompt: Hvordan laver jeg min opret event så den er i to steps, så man først udfylder formularen og derefter vælger artworks
  // Gemmer data fra step 1 for at kunne bruge det i step 2 og ved oprettelse
  const [formData, setFormData] = useState({});
  const [artworkError, setArtworkError] = useState(null);

  // Find max antal artworks baseret på valgt lokation
  const maxSelection = selectedLocation
    ? locations.find((loc) => loc.id === selectedLocation)?.maxArtworks ?? 0
    : 0;

  // Reference til formen (for at kunne hente seneste værdier)
  const formRef = useRef(null);

  // Når form i step 1 valideres:
  // Henter data fra form og går videre til step 2
  const handleNextStep = (dataFromForm) => {
    setFormData(dataFromForm); //Gemmer dataFromForm objekt i et state så det kan bruges i step 2
    setSelectedDate(dataFromForm.date); //Tager den valgte dato fra form så den kan bruges i ArtworkList
    setSelectedLocation(dataFromForm.locationId); //Tager den valgte lokation fra form så den kan bruges i ArtworkList
    setStep(2);
  };

  //Gør så knap loader i minimum 1 sekund
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const closePopup = () => {
    setShowPopup(false);
  };

  // Når event oprettes ved tryk på "Opret event" knappen
  const handleCreateEvent = async () => {
    // Tjek om mindst ét artwork er valgt
    if (selectedArtworks.length === 0) {
      setArtworkError("Du skal vælge mindst ét artwork for at oprette event.");
      return;
    }

    //Sørger for at man ikke kan gemme hvis max værker overstiger pladsen på lokationenAdd commentMore actions
    if (selectedArtworks.length > maxSelection) {
      setArtworkError(
        `Du kan maks vælge ${maxSelection} værker til denne lokation.`
      );
      return;
    }

    setArtworkError("");
    setIsSubmitting(true);

    //Prompt: Hvordan får jeg min form til at sende den seneste data med når man opretter et event,
    // hvis man har ændret i den, efter man er gået videre til næste step (vælg værker)?

    // Henter den nyeste formdata i tilfælde af at brugeren har lavet ændringer efter step 1
    const latestFormData = formRef.current?.getValues?.() ?? {};

    //Samler data fra form og artworks
    const eventData = {
      ...latestFormData, //Sender seneste form data med ved opret
      artworkIds: selectedArtworks, //Sender valgte artworks med ved opret
    };

    try {
      //Kalder createNewEvent (POST-request) fra eventFormsLogic filen sammen med en pause på 1 sekund (for at få loading på knap)
      const [createdEvent] = await Promise.all([
        createNewEvent(eventData), // bruger funktionen fra logic-filen
        wait(1000), //loader knap i 1 sekund
      ]);

      //Vis popup ved oprettelse med link til eventet
      setEventLink(`/events/${createdEvent.id}`);
      setShowPopup(true);

      //Nulstil formular og artworksAdd commentMore actions
      setSelectedArtworks([]);
      setStep(1);
      setFormData({});
      setSelectedDate(null);
      setSelectedLocation(null);
      formRef.current?.reset();
    } catch (error) {
      console.error("Fejl ved oprettelse af event:", error);
    } finally {
      setIsSubmitting(false); //stopper loading på knap
    }
  };

  return (
    <div>
      <h1>Opret Events</h1>
      <div className="grid lg:grid-cols-[1fr_2fr] gap-12 pt-5">
        <div>
          <EventForm
            onNext={handleNextStep}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
            formRef={formRef}
          />
        </div>

        <div>
          <ArtworkList
            selectedArtworks={selectedArtworks}
            setSelectedArtworks={setSelectedArtworks}
            selectedDate={selectedDate}
            maxSelection={maxSelection}
            blurred={step === 1} // Blur når step 1, ikke blur når step 2
          />
        </div>
      </div>

      {step === 2 && (
        <div className="flex justify-center sm:justify-end sticky bottom-5 pointer-events-none z-10">
          <div className="mt-4 flex flex-col items-center sm:items-end justify-end pointer-events-auto">
            <Button
              variant="CTA"
              onClick={handleCreateEvent}
              disabled={selectedArtworks.length === 0}
              loading={isSubmitting}
              loadingText="Opretter event..."
              className="!text-xl px-4 py-2"
            >
              Opret Event
            </Button>
            {artworkError && (
              <p className="!text-red-600 mt-2 !text-sm font-medium w-2/3 text-center sm:text-right text-shadow-white">
                {artworkError}
              </p>
            )}
          </div>
        </div>
      )}

      {showPopup && (
        <PopUpBase>
          <div className="flex justify-end">
            <button
              onClick={closePopup}
              className="hover:text-gray-500 ease-in-out duration-300"
            >
              <RxCross2 />
            </button>
          </div>
          <p className="text-center">Event oprettet!</p>
          <div className="flex justify-center">
            <Link href={eventLink}>
              <BtnWithArrow>Gå til event</BtnWithArrow>
            </Link>
          </div>
        </PopUpBase>
      )}
    </div>
  );
}
