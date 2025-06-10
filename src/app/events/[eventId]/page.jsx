"use client";

// Maja
// import Gallery from "@/components/single_event/art_gallery/Gallery";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import TestGallery from "@/components/single_event/art_gallery/TestGallery";
import Eventinfo from "@/components/single_event/EventInfo";
import SignUpForm from "@/components/single_event/sign_up/SignUpForm";
import { fetchEventById } from "@/api-mappe/EventsApiKald";
import { SignedIn } from "@clerk/nextjs";
import EditIcon from "@/components/edit_create_event/EditIcon";
import DeleteBtn from "@/components/edit_create_event/Delete";

export default function Eventpage() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const getEvent = async () => {
      try {
        const data = await fetchEventById(eventId);
        setEvent(data);
      } catch (error) {
        console.error("Kunne ikke hente event:", error);
      }
    };

    if (eventId) getEvent();
  }, [eventId]);

  const handleEdit = (updatedEvent) => {
    console.log("Updated event modtaget fra API:", updatedEvent);
    setEvent(updatedEvent);
  };

  const handleDeleted = () => {
    router.push("/events");
  };

  if (!event) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-center mb-2 first-letter:capitalize">
        {event.title}
      </h1>
      <SignedIn>
        <div className="flex justify-center mb-8 gap-10">
          <EditIcon event={event} onEdit={handleEdit}>
            REDIGER EVENT
          </EditIcon>
          <DeleteBtn eventId={event.id} onDeleted={handleDeleted}>
            SLET EVENT
          </DeleteBtn>
        </div>
      </SignedIn>
      <TestGallery event={event} eventId={eventId} />
      <Eventinfo event={event} setEvent={setEvent} />
      <SignUpForm />
    </div>
  );
}
