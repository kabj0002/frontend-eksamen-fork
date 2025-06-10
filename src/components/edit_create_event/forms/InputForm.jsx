//Matilde
//Brugt AI til at få hele formularen til at hænge sammen efter det meste fra RHF var blevet sat op
//Prompt: Jeg har sat min RHF op således, hvordan får jeg den til at hente dato og lokation fra min database

//Også gjort brug af AI til at håndtere om dato og lokation er tilgengængelig afhængigt af hinanden

//Debug prompt: Hvordan får jeg den til at vise min placeholder som defaultValue i mine Select komponenter

"use client";

import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useEventFormLogic } from "../../../utils/eventFormsLogic";
import Button from "../../Button";
import { Input, Select, Textarea } from "./FormFields";
import { formatDate } from "@/utils/formatDate";

const EventForm = ({
  formRef,
  onNext,
  selectedArtworks,
  selectedDate,
  setSelectedDate,
  selectedLocation,
  setSelectedLocation,
  createNewEvent,
}) => {
  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    getValues,
  } = useForm({
    defaultValues: {
      //Sætter default values til tomme, så placeholder tekst vises
      date: "",
      locationId: "",
    },
  });

  const { dates, locations, isLocationOccupied, isDateOccupied } =
    useEventFormLogic();

  //Prompt: Hvordan sørger jeg for at man ikke kan vælge en lokation hvis den allerede er optaget
  //  på den valgte dato (og omvendt), så de bliver disabled
  const watchedDate = watch("date");
  const watchedLocation = watch("locationId");

  // Hvis dato ændres, opdater state i page
  useEffect(() => {
    setSelectedDate(watchedDate);
  }, [watchedDate, setSelectedDate]);

  // Hvis lokation ændres, opdater state i page
  useEffect(() => {
    setSelectedLocation(watchedLocation);
  }, [watchedLocation, setSelectedLocation]);

  //dates og locations kommer fra vores eventFormsLogic fil som states

  // Laver/mapper over options til datovalg. Hvis en lokation er valgt, disables datoer der er optaget.
  const dateOptions = dates.map((date) => ({
    id: date,
    name: formatDate(date),
    disabled: selectedLocation ? isDateOccupied(date, selectedLocation) : false,
  }));

  // Laver/mapper over options til lokationsvalg. Hvis en dato er valgt, disables lokationer der er optaget.
  const locationOptions = locations.map((loc) => ({
    id: loc.id,
    name: `${loc.name} (${loc.address})`,
    maxArtworks: loc.maxArtworks, //Sørger for at maxArtworks baseres på lokation
    disabled: selectedDate ? isLocationOccupied(loc.id, selectedDate) : false,
  }));

  //Kalder onNext med formdata ved submit af form
  const onSubmit = (data) => {
    onNext(data);
  };

  //Henter den nyeste og opdaterede data fra formularen
  //Prompt: Hvordan får jeg min form til at sende den seneste data med når man opretter et event,
  // hvis man har ændret i den, efter man er gået videre til næste step (vælg værker)
  useEffect(() => {
    if (formRef) {
      //får formRef fra page som propAdd commentMore actions
      // formRef.current sættes til et objekt med funktionerne getValues og reset fra useForm
      // Det gør det muligt for page(parent) at tilgå disse funktioner via formRef.current
      formRef.current = { getValues, reset };
    }
  }, [formRef, getValues, reset]);

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 w-fit"
      >
        <Controller
          name="date"
          control={control}
          rules={{ required: "Dato skal vælges" }}
          render={({ field }) => (
            <Select
              label="Dato:"
              {...field}
              options={dateOptions}
              placeholder="Vælg en dato"
              error={errors.date}
            />
          )}
        />

        <Controller
          name="locationId"
          control={control}
          rules={{ required: "Lokation skal vælges" }}
          render={({ field }) => (
            <Select
              label="Lokation:"
              {...field}
              options={locationOptions}
              placeholder="Vælg en lokation"
              error={errors.locationId}
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
        <Button variant="transparent" type="submit">
          Gå til vælg værker
        </Button>
      </form>
    </>
  );
};

export default EventForm;
