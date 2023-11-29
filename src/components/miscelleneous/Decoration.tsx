"use client";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

export default function Decoration() {
  const [currentPosition, setCurrentPosition] = useState<number>(45);

  useEffect(() => {
    const onScroll = (e: Event) => {
      setCurrentPosition(window.scrollY);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div
        className={cn(
          "absolute -right-16 top-44 h-52 w-52 bg-blue-600 opacity-30 transition-transform sm:-right-12",
          currentPosition > 150
            ? "rotate-90 scale-0 md:rotate-45 md:scale-100"
            : "rotate-45",
        )}
        aria-hidden={true}
      ></div>
      <div
        className={cn(
          "absolute -left-16 top-96 h-52 w-52 bg-blue-600 opacity-30 transition-transform sm:-left-12 md:top-10",
          currentPosition > 150
            ? "rotate-90 scale-0 md:rotate-45 md:scale-100"
            : "rotate-45",
        )}
        aria-hidden={true}
      ></div>
    </>
  );
}
