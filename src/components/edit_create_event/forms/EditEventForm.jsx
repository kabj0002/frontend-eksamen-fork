//Matilde
//Brugt AI til at sørge for form henter data og præudfylder form med det fra eventet
//Debug prompt: Hvordan får jeg den til at vise og gemme den valgte dato og lokation fra eventet i mine select komponenter
// gennem value, giver det mening at bruge Controller fra RHF?

import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Input, Select, Textarea } from "./FormFields";
import { EditEvent } from "@/api-mappe/EventsApiKald";
import { formatDate } from "@/utils/formatDate";

const EditEventForm = ({
  eventToEdit,
  dates,
  locations,
  isDateOccupied,
  isLocationOccupied,
  onEditSuccess,
  formId,
  setIsSubmitting,
  onSubmitData,
  onLocationChange,
  selectedDate,
  setSelectedDate,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      date: eventToEdit?.date || "",
      locationId: eventToEdit?.locationId || "",
      title: eventToEdit?.title || "",
      description: eventToEdit?.description || "",
    },
  });

  console.log("EditEventForm selectedDate prop:", selectedDate);

  const selectedLocation = watch("locationId");
  const watchedDate = watch("date");

  //Reset sætter formularen til den seneste data fra eventet
  useEffect(() => {
    if (eventToEdit) {
      reset({
        date: eventToEdit.date,
        locationId: eventToEdit.locationId || "",
        title: eventToEdit.title,
        description: eventToEdit.description,
      });
    }
  }, [eventToEdit, reset]);

  useEffect(() => {
    if (onLocationChange) {
      onLocationChange(selectedLocation);
    }
  }, [selectedLocation, onLocationChange]);

  useEffect(() => {
    if (selectedDate && watchedDate !== selectedDate) {
      setSelectedDate(watchedDate);
    }
  }, [watchedDate, setSelectedDate, selectedDate]);

  // Lav options til select med disabled baseret på optagethed og ikke den nuværende event's data
  const dateOptions = dates.map((date) => ({
    id: date,
    name: formatDate(date),
    disabled:
      selectedLocation &&
      isDateOccupied(date, selectedLocation) &&
      date !== eventToEdit.date,
  }));

  const locationOptions = locations.map((loc) => ({
    id: loc.id,
    name: `${loc.name} (${loc.address})`,
    maxArtworks: loc.maxArtworks,
    disabled:
      selectedDate &&
      isLocationOccupied(loc.id, selectedDate) &&
      loc.id !== eventToEdit.locationId,
  }));

  //   const onSubmit = async (data) => {
  //     setIsSubmitting(true);
  //     try {
  //       const [updatedEvent] = await Promise.all([
  //         EditEvent(eventToEdit.id, data),
  //         wait(1000),
  //       ]);
  //       onEditSuccess(updatedEvent);
  //     } catch (error) {
  //       console.error("Error updating event:", error);
  //     } finally {
  //       setIsSubmitting(false);
  //     }
  //   };

  const onSubmit = (data) => {
    onSubmitData(data); // sender data op til popup
  };

  return (
    <form
      id={formId}
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 w-full p-2 pr-6"
    >
      <Controller
        name="date"
        control={control}
        rules={{ required: "Dato skal vælges" }}
        render={({ field, fieldState }) => (
          <Select
            label="Dato:"
            placeholder="Vælg en dato"
            options={dateOptions}
            error={fieldState.error}
            {...field}
          />
        )}
      />

      <Controller
        name="locationId"
        control={control}
        rules={{ required: "Lokation skal vælges" }}
        render={({ field, fieldState }) => (
          <Select
            label="Lokation:"
            placeholder="Vælg en lokation"
            options={locationOptions}
            error={fieldState.error}
            {...field}
          />
        )}
      />

      <Input
        label="Event Navn:"
        name="title"
        placeholder="Navn på event..."
        register={register}
        required={{ value: true, message: "Navn skal udfyldes" }}
        error={errors.title}
      />

      <Textarea
        label="Beskrivelse:"
        name="description"
        placeholder="Event beskrivelse..."
        register={register}
        required={{ value: true, message: "Beskrivelse skal udfyldes" }}
        error={errors.description}
      />
    </form>
  );
};

export default EditEventForm;
