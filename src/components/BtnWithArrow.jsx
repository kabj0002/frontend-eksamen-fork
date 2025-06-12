//Matilde
//bruges til "se event" (på event card) og "læs mere" (på art card)
//pilen og animationen er udarbejdet med hjælp fra AI
//Prompt: Hvordan laver jeg en pil der går til højre, og som bliver længere når man hover over den
//Jeg startede med at se om man kunne gøre et ikon længere, men ChatGPT foreslog at lave pilen via span

// const BtnWithArrow = ({ children }) => {
//   return (
//     <>
//       <div className="text-sm sm:text-md md:text-lg group inline-flex items-center gap-2 text-primary-red transform">
//         {children}
//         <div className="relative h-1 w-6 transition-all duration-300 group-hover:w-10">
//           <span className="absolute top-1/2 left-0 h-0.5 w-full bg-primary-red transform -translate-y-1/2" />
//           <span className="absolute top-1/2 right-0 w-2 h-2 border-t-2 border-r-2 border-primary-red transform rotate-45 translate-y-[-50%]" />
//         </div>
//       </div>
//     </>
//   );
// };

// export default BtnWithArrow;

//Katinka - lavet variants til singleArt page
// "use client";
// import { useState } from "react";

// const BtnWithArrow = ({
//   children,
//   direction = "right",
//   toggleable = false,
//   onClick,
// }) => {
//   const [toggled, setToggled] = useState(false);

//   const isLeft = direction === "left" || (toggleable && toggled);

//   const handleClick = (e) => {
//     if (toggleable) setToggled((prev) => !prev);
//     if (onClick) onClick(e); // <-- Kalder den eksterne onClick
//   };

//   return (
//     <button
//       onClick={handleClick}
//       className="text-sm sm:text-md md:text-lg group inline-flex gap-2 text-primary-red transform"
//     >
//       {isLeft && (
//         <div className="relative translate-y-[0.5em] h-1 w-6 transition-all duration-300 group-hover:w-10">
//           <span className="absolute top-1/2 right-0 h-0.5 w-full bg-primary-red transform -translate-y-1/2" />
//           <span className="absolute top-1/2 left-0 w-2 h-2 border-t-2 border-l-2 border-primary-red transform -rotate-45 translate-y-[-50%]" />
//         </div>
//       )}

//       <span className="text-left leading-tight">{children}</span>

//       {!isLeft && (
//         <div className="relative translate-y-[0.5em] h-1 w-6 transition-all duration-300 group-hover:w-10">
//           <span className="absolute top-1/2 left-0 h-0.5 w-full bg-primary-red transform -translate-y-1/2" />
//           <span className="absolute top-1/2 right-0 w-2 h-2 border-t-2 border-r-2 border-primary-red transform rotate-45 translate-y-[-50%]" />
//         </div>
//       )}
//     </button>
//   );
// };
// export default BtnWithArrow;

//Matilde
//bruges til "se event" (på event card) og "læs mere" (på art card)
//pilen og animationen er udarbejdet med hjælp fra AI
//Prompt: Hvordan laver jeg en pil der går til højre, og som bliver længere når man hover over den
//Jeg startede med at se om man kunne gøre et ikon længere, men ChatGPT foreslog at lave pilen via span

// const BtnWithArrow = ({ children }) => {
//   return (
//     <>
//       <div className="text-sm sm:text-md md:text-lg group inline-flex items-center gap-2 text-primary-red transform">
//         {children}
//         <div className="relative h-1 w-6 transition-all duration-300 group-hover:w-10">
//           <span className="absolute top-1/2 left-0 h-0.5 w-full bg-primary-red transform -translate-y-1/2" />
//           <span className="absolute top-1/2 right-0 w-2 h-2 border-t-2 border-r-2 border-primary-red transform rotate-45 translate-y-[-50%]" />
//         </div>
//       </div>
//     </>
//   );
// };

// export default BtnWithArrow;

//Katinka - lavet variants til singleArt page
//Opdateret version af button af Maja (til forside)
"use client";
import { useState } from "react";

const BtnWithArrow = ({
  children,
  direction = "right",
  toggleable = false,
  onClick,
  size = "normal",
}) => {
  const [toggled, setToggled] = useState(false);

  const isLeft = direction === "left" || (toggleable && toggled);

  const handleClick = (e) => {
    if (toggleable) setToggled((prev) => !prev);
    if (onClick) onClick(e);
  };

  // Vælg størrelser baseret på size-prop
  const arrowHeight = size === "large" ? "h-2" : "h-1";
  const arrowWidth = size === "large" ? "w-12" : "w-6";
  const arrowHead = size === "large" ? "w-4 h-4" : "w-2 h-2";
  const hoverWidth = size === "large" ? "group-hover:w-16" : "group-hover:w-10";

  return (
    <button
      onClick={handleClick}
      className={`text-sm sm:text-md md:text-lg group inline-flex gap-2 text-primary-red transform`}
    >
      {isLeft && (
        <div
          className={`relative translate-y-[0.5em] ${arrowHeight} ${arrowWidth} transition-all duration-300 ${hoverWidth}`}
        >
          <span
            className={`absolute top-1/2 right-0 h-0.5 w-full bg-primary-red transform -translate-y-1/2`}
          />
          <span
            className={`absolute top-1/2 left-0 ${arrowHead} border-t-2 border-l-2 border-primary-red transform -rotate-45 translate-y-[-50%]`}
          />
        </div>
      )}

      <span className="text-left leading-tight">{children}</span>

      {!isLeft && (
        <div
          className={`relative translate-y-[0.5em] ${arrowHeight} ${arrowWidth} transition-all duration-300 ${hoverWidth}`}
        >
          <span
            className={`absolute top-1/2 left-0 h-0.5 w-full bg-primary-red transform -translate-y-1/2`}
          />
          <span
            className={`absolute top-1/2 right-0 ${arrowHead} border-t-2 border-r-2 border-primary-red transform rotate-45 translate-y-[-50%]`}
          />
        </div>
      )}
    </button>
  );
};
export default BtnWithArrow;
