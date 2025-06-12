"use client";

//Matilde
//Her ligger 3 komponenter: input, textarea og select

import React from "react";

export const Input = ({
  label,
  register,
  required,
  placeholder,
  name,
  error,
}) => (
  <div className="flex flex-col">
    <label>{label}</label>
    <input
      placeholder={placeholder}
      {...register(name || label, { required })}
      className={`w-full rounded-md p-2 shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-red focus:primary-red ${
        error ? "animate-shake" : ""
      }`}
    />
    {error && (
      <p className="!text-sm !text-red-500 mt-1">
        {error.message || "Påkrævet felt"}
      </p>
    )}
  </div>
);

//Debug prompt: Når jeg har fetchet datoer og lokationer, viser den datoerne som tomme, hvor ligger problemet og hvordan kan jeg fikse det
//Prompt: Hvordan tilpasser jeg mit select komponent til at bruge controller fra react hook form
export const Select = ({
  onChange,
  onBlur,
  name,
  label,
  placeholder,
  error,
  options,
  value,
  ref,
}) => (
  <div className="flex flex-col">
    <label>{label}</label>
    <select
      aria-label={label}
      name={name}
      ref={ref}
      onChange={onChange}
      value={value}
      onBlur={onBlur}
      className={`w-full rounded-md p-2 shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-red focus:primary-red ${
        error ? "animate-shake" : ""
      }`}
    >
      <option value="" disabled>
        {placeholder || "Vælg en mulighed"}
      </option>
      {options?.map((option) => {
        const value = typeof option === "string" ? option : option.id;
        const label =
          typeof option === "string"
            ? option
            : option.name || option.label || option.title;
        return (
          <option key={value} value={value} disabled={option.disabled}>
            {label}
          </option>
        );
      })}
    </select>
    {error && (
      <p className="!text-sm !text-red-500 mt-1">
        {error.message || "Påkrævet felt"}
      </p>
    )}
  </div>
);

export const Textarea = ({
  label,
  register,
  required,
  placeholder,
  name,
  error,
}) => (
  <div className="flex flex-col mb-4">
    <label htmlFor={name}>{label}</label>
    <textarea
      id={name}
      name={name}
      placeholder={placeholder}
      {...register(name, { required })}
      rows="4"
      className={`w-full rounded-md p-2 shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-red focus:primary-red ${
        error ? "animate-shake" : ""
      }`}
    />
    {error && (
      <p className="!text-sm !text-red-500 mt-1">
        {error.message || "Påkrævet felt"}
      </p>
    )}
  </div>
);
