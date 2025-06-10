"use client";
//Maja
//Denne komponent viser tilmeldingsformularen for et event, hvor brugeren kan booke billetter.
//brugt Ai til hjælp af RHF så forms blev brugt rigtigt og så det ikke blev for kompliceret
import { useRouter, useParams } from "next/navigation";
import { set, useForm } from "react-hook-form";
import transferReservationInformation from "@/app/store/reservationInformation";
import { useEffect, useRef, useState } from "react";
import { FiMinus, FiPlus } from "react-icons/fi";
import { fetchEventById, bookTickets } from "../../../api-mappe/EventsApiKald";
import Button from "@/components/Button";

const SignUpForm = () => {
  const [event, setEvent] = useState(null);
  const { eventId } = useParams();
  const router = useRouter();
  const { register, getValues, trigger, setValue, formState } = useForm();
  const { errors } = formState;
  const setReservation = transferReservationInformation(
    (state) => state.setReservation
  );

  const formRef = useRef();
  const [shake, setShake] = useState(false);
  const [showError, setShowError] = useState(false);
  const [billetter, setBilletter] = useState(0);
  const [totalTickets, setTotalTickets] = useState(null);
  const [bookedTickets, setBookedTickets] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  //const wait er funktionder der bruges til at vente 1 sekund før bekræftelsesmailen sendes, så brugeren ikke oplever en forsinkelse
  //det er for at give brugeren en bedre oplevelse, da det kan tage lidt tid at booke billetterne
  //Der er animation på knappen når den er i loading state, så brugeren kan se at der sker noget
  //også for at undgå at brugeren klikker flere gange på knappen
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  //Tilføjer en const som tjekker om billetter er udsolgtAdd commentMore actions
  const remainingTickets =
    totalTickets !== null && bookedTickets !== null
      ? totalTickets - bookedTickets
      : null;

  const isSoldOut = remainingTickets === 0; //NYT: Tilføjet til brug i disable af inputs og knapper

  // Henter event data fra api-mappen
  useEffect(() => {
    const fetchEvent = async () => {
      const data = await fetchEventById(eventId);
      setTotalTickets(data.totalTickets);
      setBookedTickets(data.bookedTickets);
      setEvent(data);
    };
    if (eventId) fetchEvent();
  }, [eventId]);

  // Opdaterer react hook form når antal billetter ændres
  const handleChange = (val) => {
    if (val < 1) return;
    setBilletter(val);
    setValue("billetter", val, { shouldValidate: true });
  };

  // Funktionen når "bekræft reservation" trykkes
  const handleConfirm = async (e) => {
    e.preventDefault();
    const valid = await trigger();
    if (!valid) {
      setShowError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    setShowError(false);
    setIsSubmitting(true);
    const values = getValues();

    try {
      // Book billetter
      const response = await Promise.all([
        bookTickets(eventId, { tickets: billetter }),
        wait(1000),
      ]);

      console.log("BOOK TICKETS RESPONSE:", response);

      // for at send bekræftelsesmail til brugeren
      await fetch("/api/sendConfirmation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: values.email, // brugerens mail fra inputfeltet!
          navn: values.navn,
          billetter: billetter,
          eventId: eventId,
        }),
      }).then((res) => res.json());

      // Opdaterer reservation information i zustand (store/reservationInformation.js)
      // og navigerer til tickets siden
      setReservation(values);
      router.push(`/events/${eventId}/tickets`);
    } catch (error) {
      setShowError(true);
    }
  };

  return (
    <form
      ref={formRef}
      className="bg-white shadow-[0_0_15px_rgba(0,0,0,0.2)] rounded-xl px-8 py-6 m-8 max-w-sm w-full mx-auto flex flex-col"
      onSubmit={handleConfirm}
    >
      <h3 className="font-semibold text-center text-lg mb-6">
        Tilmeld dig gratis
      </h3>
      {/*input felt der har plus og minus til billet antal fungerer lidt bedre frem for pile op og ned*/}
      <div className="mb-4">
        <label htmlFor="billetter" className="block text-sm mb-1">
          Antal billetter:
        </label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="minus"
            onClick={() => handleChange(billetter - 1)}
            disabled={isSoldOut || billetter <= 1} //NYT: Disable hvis udsolgt eller allerede 1
            className="p-3 text-primary-red rounded-md bg-white shadow-[0_0_10px_rgba(0,0,0,0.1)]  hover:bg-primary-red hover:text-white transition"
          >
            <FiMinus />
          </button>
          <span
            className={`w-60 text-center rounded-md p-2 bg-white shadow-[0_0_10px_rgba(0,0,0,0.1)] ${
              errors.billetter && "border-primary-red"
            } ${shake && errors.billetter ? "animate-shake" : ""}`}
            style={{ minWidth: "3rem", display: "inline-block" }}
          >
            {billetter}
          </span>
          <button
            type="button"
            aria-label="plus"
            onClick={() => handleChange(billetter + 1)}
            disabled={
              isSoldOut || //NYT: Disable hvis udsolgtAdd commentMore actions
              (totalTickets !== null &&
                bookedTickets !== null &&
                billetter >= totalTickets - bookedTickets)
            }
            className="p-3 text-primary-red rounded-md bg-white shadow-[0_0_10px_rgba(0,0,0,0.1)] hover:bg-primary-red hover:text-white transition"
          >
            <FiPlus />
          </button>
        </div>
      </div>
      {/* inputfelt til navn som også har animation fra globals.css hvis den ikke er udfyldt rigtigt*/}
      <div className="mb-4">
        <label htmlFor="navn" className="block text-sm mb-1">
          Navn på reservation:
        </label>
        <input
          type="text"
          id="navn"
          placeholder="Dit navn..."
          {...register("navn", { required: true })}
          disabled={isSoldOut} //NYT: Disable hvis udsolgtAdd commentMore actions
          className={`w-full rounded-md p-2 shadow-[0_0_10px_rgba(0,0,0,0.1)] focus:outline-none focus:ring-2 focus:ring-primary-red ${
            errors.navn && "border-primary-red"
          } ${shake && errors.navn ? "animate-shake" : ""}`}
        />
      </div>
      {/* inputfelt til mail som også har animation fra globals.css hvis den ikke er udfyldt rigtigt*/}
      <div className="mb-4">
        <label htmlFor="email" className="block text-sm mb-1">
          Din mail:
        </label>
        <input
          type="email"
          id="email"
          placeholder="Din mail..."
          {...register("email", {
            required: true,
          })}
          disabled={isSoldOut} //NYT: Disable hvis udsolgtAdd commentMore actions
          className={`w-full rounded-md p-2 shadow-[0_0_10px_rgba(0,0,0,0.1)] focus:outline-none focus:ring-2 focus:ring-primary-red ${
            errors.email && "border-primary-red"
          } ${shake && errors.email ? "animate-shake" : ""}`}
        />
      </div>
      {showError && (
        <div className="text-primary-red text-center text-xs mb-2">
          Udfyld alle felter korrekt
        </div>
      )}
      {/* Her vises hvor mange billetter der er tilbage */}
      <div className="text-center text-sm text-gray-600 mb-4">
        {totalTickets !== null && bookedTickets !== null ? (
          remainingTickets > 0 ? (
            <>
              {/*NYT: Vis antal billetter hvis der er nogen tilbage */}
              {`Der er ${remainingTickets} `}
              {remainingTickets === 1 ? "billet" : "billetter"} tilbage
            </>
          ) : (
            //NYT: Vis "UDSOLGT" med tydelig styling
            <span className="text-primary-red font-semibold">UDSOLGT</span>
          )
        ) : (
          "Indlæser antal billetter..."
        )}
      </div>
      {/* Bekræft reservation knap */}
      {/*NYT: Disable hover og bevægelse */}
      <Button
        type="submit"
        disabled={isSoldOut}
        loading={isSubmitting}
        loadingText="Bekræfter reservation..."
        className={`w-full rounded-md py-2 text-white font-semibold transition ${
          isSoldOut
            ? "bg-gray-300 cursor-not-allowed hover:bg-gray-300 border-none transform-none transition-none"
            : "bg-primary-red hover:bg-red-600"
        }`}
      >
        Bekræft reservation
      </Button>
    </form>
  );
};

export default SignUpForm;
