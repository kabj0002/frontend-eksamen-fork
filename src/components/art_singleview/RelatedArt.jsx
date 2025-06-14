//Katinka

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import Skeleton from "react-loading-skeleton";

const RelatedArt = ({ artworkId }) => {
  const [related, setRelated] = useState([]);
  const [hasResults, setHasResults] = useState(true);

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        // Henter værk for at finde similar_images_url
        const res = await fetch(
          `https://api.smk.dk/api/v1/art?object_number=${artworkId}`
        );
        const data = await res.json();
        const artwork = data.items?.[0];

        if (!artwork || !artwork.similar_images_url) {
          console.warn("Ingen similar_images_url fundet.");
          setHasResults(false);
          return;
        }

        // Henter similar værker som object_numbers
        const similarRes = await fetch(artwork.similar_images_url);
        const similarData = await similarRes.json();

        const similarIds = similarData.object_numbers?.filter(
          (id) => id !== artworkId
        );
        if (!similarIds || similarIds.length === 0) {
          setHasResults(false);
          return;
        }

        // Henter data for hver similar id
        const allDetails = await Promise.all(
          similarIds.map(async (id) => {
            const detailRes = await fetch(
              `https://api.smk.dk/api/v1/art?object_number=${id}`
            );
            const detailData = await detailRes.json();
            return detailData.items?.[0]; // Bruger første værk
          })
        );

        // Filtrer gyldige værker
        const filtered = allDetails.filter(Boolean);
        setRelated(filtered);
        setHasResults(filtered.length > 0);
      } catch (error) {
        console.error("Fejl ved hentning af relateret kunst:", error);
        setHasResults(false);
      }
    };

    fetchRelated();
  }, [artworkId]);

  return (
    <div className="pt-10 sm:pt-14 sm:col-[1/4]">
      <h4>Relaterede kunstværker</h4>
      <div className="mt-4">
        {!hasResults ? (
          <p className="text-sm text-gray-500 italic">
            Ingen lignende værker fundet
          </p>
        ) : (
          <div className="flex overflow-x-auto py-2">
            <div className="flex gap-4 shrink-0">
              {related.map((item) => (
                <motion.div
                  onClick={() => {
                    window.location.href = `/artwork/${item.object_number}`;
                  }}
                  key={item.object_number}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="min-w-[160px]"
                >
                  <Image
                    src={item.image_thumbnail}
                    // alt={item.title || "related art"}
                    alt={item.title || <Skeleton />}
                    width={160}
                    height={120}
                    className="object-cover rounded shadow cursor-pointer"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RelatedArt;
