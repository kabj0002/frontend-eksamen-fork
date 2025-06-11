//Katinka
//Index page

"use client";

import { useEffect, useState } from "react";
import Button from "@/components/Button";
import { IoIosArrowDown } from "react-icons/io";
import IndexTextContent from "@/components/IndexTextContent";
import { useClerk, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { useScroll, useTransform, motion } from "motion/react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "./custom-skeleton.css"; // Min egen skeleton CSS

// Random modernistisk billede hentes fra SMK's API
async function fetchRandomImage() {
  try {
    //simulere en langsom server for at se skeleton loading funktion
    await new Promise((resolve) => setTimeout(resolve, 3000)); // 3 sekunders delay

    const res = await fetch(
      "https://api.smk.dk/api/v1/art/search?keys=modernisme&offset=0&rows=100",
      { cache: "no-store" }
    );
    const data = await res.json();

    const images = data.items
      .map((item) => item.image_thumbnail)
      .filter((url) => url);

    if (images.length > 0) {
      return images[Math.floor(Math.random() * images.length)];
    }
  } catch (err) {
    console.error("Fejl ved hentning af billede:", err);
  }

  return "/imgs/placeholder.jpg";
}

export default function Home() {
  const [imageUrl, setImageUrl] = useState("/imgs/placeholder.jpg");

  // useEffect(() => {
  //   // Hent første billede ved load
  //   fetchRandomImage().then((url) => setImageUrl(url));
  // }, []);

  //Loading tilstand (skeleton loading)
  const [loading, setLoading] = useState(true);
  //Håndterer loading state
  useEffect(() => {
    setLoading(true); // starter med loading
    fetchRandomImage().then((url) => {
      setImageUrl(url);
      setLoading(false); // slutter når billedet er klar
    });
  }, []);

  // const handleNewImage = async () => {
  //   const newImage = await fetchRandomImage();
  //   setImageUrl(newImage);
  // };

  //Håndterer handleNewImage state
  const handleNewImage = async () => {
    setLoading(true);
    const newImage = await fetchRandomImage();
    setImageUrl(newImage);
    setLoading(false);
  };

  //Scroll effects
  const { scrollY } = useScroll();
  const topButtonOpacity = useTransform(scrollY, [0, 150, 350], [1, 1, 0]);
  const topButtonTranslateY = useTransform(scrollY, [0, 400], [0, -50]);
  const contentOpacity = useTransform(scrollY, [400, 800, 1300], [0, 1, 0]);
  const contentTranslateY = useTransform(scrollY, [400, 800], [50, 0]);

  const { openSignIn } = useClerk();

  //Gør at man kan bruge motion direkte på Image
  const MotionImage = motion(Image);

  return (
    <div className="mt-50 mb-150">
      {/* Implementerer skeleton loading  */}
      {loading ? (
        <div className="fixed top-0 left-0 w-full h-screen z-[-1]">
          <Skeleton
            // baseColor="#c9c9c9"
            // highlightColor="#fdfdfd"
            className="react-loading-skeleton block h-full w-full"
            // borderRadius={0}
          />
        </div>
      ) : (
        <MotionImage
          src={imageUrl}
          alt="Tilfældigt kunstværk fra SMK's API"
          height={1033}
          width={1440}
          initial={{ scale: 1 }}
          animate={{ scale: 1.1 }}
          transition={{
            duration: 6,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="fixed top-0 left-0 w-full h-screen object-cover z-[-1]"
          onLoad={() => setLoading(false)}
        />
      )}

      <div className="flex flex-col items-center ">
        <motion.div
          style={{ opacity: topButtonOpacity, y: topButtonTranslateY }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.4,
              scale: { type: "spring", visualDuration: 0.4, bounce: 0.5 },
            }}
            className="flex flex-col sm:flex-row items-center sm:gap-8 text-lg sm:text-xl md:text-2xl"
          >
            <Button variant="transparent" onClick={handleNewImage}>
              UDFORSK MODERNISMENS VÆRKER
            </Button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: 1,
              scale: [1, 1.1, 1],
            }}
            transition={{
              opacity: { duration: 0.4 },
              scale: {
                duration: 1.5,
                repeat: Infinity,
                repeatType: "loop",
                ease: "easeInOut",
              },
            }}
            className="my-60"
          >
            <div className="flex justify-center items-center gap-3 text-primary-red font-semibold text-2xl">
              Læs mere <IoIosArrowDown />
            </div>
          </motion.div>
        </motion.div>
      </div>
      <motion.div
        style={{ opacity: contentOpacity, y: contentTranslateY }}
        className="flex justify-center items-center w-full mt-20"
      >
        <IndexTextContent>
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 text-lg sm:text-xl md:text-2xl mt-5 sm:mt-8 justify-center">
            <Link href="/events">
              <Button variant="transparent">SE EVENTS</Button>
            </Link>
            <SignedOut>
              <Button variant="CTA" onClick={() => openSignIn()}>
                LOG IND
              </Button>
            </SignedOut>
            <SignedIn>
              <Link href="/create-event">
                <Button variant="CTA">OPRET EVENT</Button>
              </Link>
            </SignedIn>
          </div>
        </IndexTextContent>
      </motion.div>
    </div>
  );
}
