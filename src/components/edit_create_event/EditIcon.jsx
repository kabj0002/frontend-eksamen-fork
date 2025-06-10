//Matilde

import { FiEdit3 } from "react-icons/fi";
import EditEventPopUp from "./forms/EditPopUp";
import { useState } from "react";
import { motion } from "motion/react";

const EditIcon = ({ event, onEdit, children }) => {
  const [showPopup, setShowPopup] = useState(false);

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <>
      <motion.button
        onClick={setShowPopup}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.1 }}
        className="text-primary-red hover:text-primary-red-hover2 ease-in-out duration-200"
        aria-label="Rediger event"
      >
        <div className="flex flex-row items-end justify-center gap-2 cursor-pointer">
          <span className="text-primary-red text-sm md:text-lg">
            {children}
          </span>
          <FiEdit3
            size={32}
            strokeWidth={1.5}
            className="w-6 h-auto sm:w-7 md:w-8 lg:w-9"
          ></FiEdit3>
        </div>
      </motion.button>

      {showPopup && (
        <EditEventPopUp
          eventToEdit={event}
          closePopup={closePopup}
          onEditSuccess={(updatedEvent) => {
            onEdit(updatedEvent);
            closePopup();
          }}
        ></EditEventPopUp>
      )}
    </>
  );
};

export default EditIcon;
