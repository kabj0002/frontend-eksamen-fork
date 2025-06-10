//Katinka
//Listen over kunstværker i create og edit event

"use client";
import Image from "next/image";
import { IoCheckmark } from "react-icons/io5";
import { LuTrash2 } from "react-icons/lu";
import Button from "../Button";
import FilterBtn from "./FilterBtn";
import { motion } from "motion/react";
import { useArtworksLogic } from "@/utils/artworksLogic";
// import SearchBar from "./SearchBar";

const ArtworkList = ({
  blurred = false,
  selectedArtworks,
  setSelectedArtworks,
  selectedDate,
  maxSelection,
}) => {
  //Henter alle funktioner vi skal bruge fra useArtworksLogic
  const {
    displayedArtworks,
    currentPage,
    setCurrentPage,
    totalPages,
    selectedArtists,
    selectedTechniques,
    selectedMaterials,
    selectedTitles,
    handleSelectArtist,
    handleSelectTechnique,
    handleSelectMaterial,
    handleSelectTitle,
    toggleSelect,
    selectedArtworksPage,
    setSelectedArtworksPage,
    selectedTotalPages,
    displayedSelectedArtworks,
    handleClearFilters,
    // handleSearchResult,
    isArtworkBooked,
    artists,
    techniques,
    materials,
    titles,
    artworks,
  } = useArtworksLogic(selectedDate, selectedArtworks, setSelectedArtworks);

  const MAX_SELECTION = maxSelection || 15;

  return (
    <div
      className={`flex flex-col sm:flex-row gap-8 ${
        blurred ? "filter blur-sm pointer-events-none select-none" : ""
      }`}
    >
      {/* Venstre kolonne - Kunstværker */}
      <div className="flex-1 max-w-[600px]">
        <h5>Vælg op til {MAX_SELECTION} værker:</h5>
        <p>
          Du kan vælge {MAX_SELECTION - selectedArtworks.length} værker mere
        </p>

        {/* <SearchBar onLiveSearch={handleSearchResult} onSelectSuggestion={handleSearchResult} /> */}

        {/* Filtrerings buttons */}
        <FilterBtn
          artists={artists}
          techniques={techniques}
          materials={materials}
          titles={titles}
          selectedArtists={selectedArtists}
          selectedTechniques={selectedTechniques}
          selectedMaterials={selectedMaterials}
          selectedTitles={selectedTitles}
          onSelectArtist={handleSelectArtist}
          onSelectTechnique={handleSelectTechnique}
          onSelectMaterial={handleSelectMaterial}
          onSelectTitle={handleSelectTitle}
          onClearFilters={handleClearFilters}
        />

        <div className="columns-2 sm:columns-3 gap-2 my-5">
          {displayedArtworks.length === 0 && <p>Ingen billeder fundet</p>}

          {displayedArtworks.map((artwork) => {
            const isSelected = selectedArtworks.includes(artwork.object_number);
            const isBooked = isArtworkBooked(artwork.object_number);
            const imageUrl = artwork.image_thumbnail || "/imgs/placeholder.jpg";
            const title = artwork.titles?.[0]?.title || "Uden titel";

            console.log(`Artwork ${artwork.object_number} booked?`, isBooked);

            return (
              <div key={artwork.object_number}>
                <div
                  onClick={() => {
                    if (isBooked) return; //ikke klikbar hvis booket på valgte dato
                    if (
                      selectedArtworks.includes(artwork.object_number) ||
                      selectedArtworks.length < MAX_SELECTION
                    ) {
                      toggleSelect(artwork.object_number);
                    }
                  }}
                  className="relative cursor-pointer group w-fit justify-center"
                >
                  {/* Checkbox-hjørne – vises kun hvis ikke booket */}
                  {!isBooked && (
                    <div
                      className={`absolute top-1 right-1 w-5 h-5 rounded-sm flex items-center justify-center border-1 border-white z-8 ${
                        isSelected ? "bg-white" : "bg-transparent"
                      }`}
                    >
                      {isSelected && (
                        <IoCheckmark className="text-primary-red text-xl" />
                      )}
                    </div>
                  )}

                  {/* Billede */}
                  <Image
                    src={imageUrl}
                    alt={title}
                    width={200}
                    height={200}
                    className="rounded mb-2"
                  />

                  {/* Overlay med titel — vises både ved hover og når valgt */}
                  {!isBooked && (
                    <div
                      className={`absolute inset-0 text-white transition-opacity flex items-center justify-center text-xs text-center px-2 ${
                        isSelected
                          ? "bg-black/50 opacity-100"
                          : selectedArtworks.length >= MAX_SELECTION
                          ? "opacity-0"
                          : "bg-black/50 opacity-0 group-hover:opacity-100"
                      }`}
                    >
                      <span className="text-wrap truncate">{title}</span>
                    </div>
                  )}

                  {/* Blokering hvis max er nået og billedet ikke er valgt */}
                  {!isSelected && selectedArtworks.length >= MAX_SELECTION && (
                    <div className="absolute inset-0 bg-white/40 flex items-center justify-center text-xs text-text-p font-semibold cursor-not-allowed text-center p-2">
                      Maks antal værker valgt
                    </div>
                  )}

                  {/* Booket overlay */}
                  {isBooked && (
                    <div className="absolute inset-0 bg-gray-700/60 flex items-center justify-center text-white font-semibold text-center text-xs cursor-not-allowed">
                      Allerede booket på valgte dato
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {/* Pagination */}
        <div className="flex justify-center mt-3 gap-3">
          {Array.from({ length: totalPages }).map((_, i) => (
            <motion.button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.1 }}
              className={`px-2 py-1 mb-5 border rounded ${
                currentPage === i + 1
                  ? "bg-primary-red text-white border-primary-red"
                  : "border-primary-red text-primary-red hover:bg-[var(--color-primary-red-hover2)] hover:border-[var(--color-primary-red-hover2)] hover:text-white"
              }`}
            >
              {i + 1}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Højre kolonne - Valgte værker */}
      <div className="w-full sm:w-[300px]">
        <h5 className="mb-2">
          Valgte værker ({selectedArtworks.length} / {MAX_SELECTION})
        </h5>

        {selectedArtworks.length === 0 && <p>Ingen valgte værker endnu</p>}

        <motion.div className="columns-3 gap-2">
          {displayedSelectedArtworks.map((id) => {
            const artwork = artworks.find((a) => a.object_number === id);

            if (!artwork) return null;

            const imageUrl = artwork.image_thumbnail || "/imgs/placeholder.jpg";
            const title = artwork.titles?.[0]?.title || "Uden titel";

            return (
              <div
                key={id}
                className="relative text-sm cursor-pointer break-inside-avoid mb-4"
                onClick={() => toggleSelect(id)}
              >
                <Image
                  src={imageUrl}
                  alt={title}
                  width={100}
                  height={100}
                  className="rounded w-full h-auto"
                />
                <LuTrash2 className="absolute right-1 top-1 text-lg text-primary-red stroke-2 fill-white m-1 w-7 h-auto" />
                <p className="truncate !text-sm">{title}</p>
              </div>
            );
          })}
        </motion.div>

        {/* Pagination */}
        {selectedTotalPages > 1 && (
          <div className="flex justify-center gap-2 my-4">
            {Array.from({ length: selectedTotalPages }, (_, i) => (
              <motion.button
                key={i}
                onClick={() => setSelectedArtworksPage(i + 1)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.1 }}
                className={`px-2 py-1 mb-2 border rounded ${
                  selectedArtworksPage === i + 1
                    ? "bg-primary-red text-white border-primary-red"
                    : "border-primary-red text-primary-red hover:bg-[var(--color-primary-red-hover2)] hover:border-[var(--color-primary-red-hover2)] hover:text-white"
                }`}
              >
                {i + 1}
              </motion.button>
            ))}
          </div>
        )}
        <div className="flex justify-between mt-4">
          {selectedArtworks.length > 0 && (
            <Button
              onClick={() => {
                setSelectedArtworks([]);
                setSelectedArtworksPage(1);
              }}
              variant="transparent_w_icon"
            >
              <LuTrash2 />
              Ryd valg
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArtworkList;
