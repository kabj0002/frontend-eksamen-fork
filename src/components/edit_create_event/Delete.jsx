//Matilde
//Med hjælp fra AI til at få loading effekt og til først at vise warning pop up

//Prompt: Hvordan får jeg den til at vise en warning pop up, der spørger om man vil slette eventet
//Prompt: Hvordan gør jeg så "Ja" knappen bliver til "Sletter event...", og "Nej" knappen forsvinder imens,
// også så den loader i minimum 1 sekund for at brugeren kan se der sker noget.
//Prompt: Hvordan får jeg den til at ændre indholdet i pop uppen til "Event blev slettet" efter det blev slettet succesfuldt

import { deleteEvent } from "@/api-mappe/EventsApiKald";
import PopUpBase from "../PopUpBaseLayout";
import Button from "../Button";
import { LuTrash2 } from "react-icons/lu";
import { useState } from "react";
import { motion } from "motion/react";

const DeleteBtn = ({ eventId, onDeleted, children }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [hasDeleted, setHasDeleted] = useState(false);

  //Gør så knappen loader i minimum 1 sekund
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await Promise.all([deleteEvent(eventId), wait(1000)]);
      setHasDeleted(true);
    } catch (error) {
      console.error("Kunne ikke slette eventet:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    setShowPopup(false);
    setHasDeleted(false);
    if (hasDeleted && onDeleted) onDeleted();
  };

  return (
    <>
      <motion.button
        onClick={() => setShowPopup(true)}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.1 }}
        className="text-primary-red hover:text-primary-red-hover2 ease-in-out duration-200"
        aria-label="Slet event"
      >
        <div className="flex flex-row items-end justify-center gap-2 cursor-pointer">
          <span className="text-primary-red text-sm md:text-lg">
            {children}
          </span>
          <LuTrash2
            size={34}
            strokeWidth={1.5}
            className="w-6 h-auto sm:w-7 md:w-8 lg:w-9"
          />
        </div>
      </motion.button>

      {showPopup && (
        <PopUpBase>
          {!hasDeleted ? (
            <>
              <p>Er du sikker på at du vil slette dette event?</p>
              <div className="flex gap-4 justify-center mt-4">
                <Button
                  variant="CTA"
                  onClick={handleDelete}
                  loading={isDeleting}
                  loadingText="Sletter event..."
                  className="transition-all duration-300 w-auto"
                >
                  {isDeleting ? "Sletter event..." : "JA"}
                </Button>

                {!isDeleting && (
                  <Button variant="tertiary" onClick={handleClose}>
                    NEJ
                  </Button>
                )}
              </div>
            </>
          ) : (
            <>
              <p className="text-center">Event blev slettet.</p>
              <div className="flex justify-center mt-4">
                <Button variant="tertiary" onClick={handleClose}>
                  Luk
                </Button>
              </div>
            </>
          )}
        </PopUpBase>
      )}
    </>
  );
};

export default DeleteBtn;
