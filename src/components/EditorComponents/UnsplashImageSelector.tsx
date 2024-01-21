"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";
import { Search } from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { DialogClose } from "@radix-ui/react-dialog";

type UnsplashImage = {
  id: string;
  urls: {
    raw: string;
    full: string;
    small: string;
  };
  alt: string;
  likes: number;
  color: string;
  width: number;
  height: number;
};

const UnsplashImageSelector = ({ setCover }: { setCover: Function }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [search, setSearch] = useState<string | null>(null);
  const [images, setImages] = useState<Array<UnsplashImage>>([]);
  function searchImages() {
    if (!inputRef || !inputRef.current) return;
    const query = inputRef.current.value;
    if (query.trim().length !== 0) {
      setSearch(query);
    }
  }
  useEffect(() => {
    async function getData() {
      const rawData = await fetch(
        `/api/unsplash${search ? `?query=${search}` : ""}`,
      );
      const data = await rawData.json();
      setImages(data.results);
    }
    getData();
  }, [search]);
  return (
    <div>
      <div className="flex items-center justify-center gap-2">
        <Input
          ref={inputRef}
          placeholder="Search images"
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              searchImages();
            }
          }}
        />
        <Button variant="ghost" onClick={searchImages}>
          <Search />
        </Button>
      </div>

      <div className="my-3 max-h-60 w-full overflow-y-auto">
        <ResponsiveMasonry columnsCountBreakPoints={{ 300: 2 }}>
          <Masonry gutter="6px">
            {images.map((image) => {
              return (
                <DialogClose
                  key={image.id}
                  onClick={() => setCover(image.urls.full)}
                >
                  <div className="relative m-2 overflow-auto rounded-lg">
                    <Image
                      className="block rounded-lg"
                      src={image.urls.small}
                      alt={image.alt}
                      width={image.width}
                      height={image.height}
                    />
                  </div>
                </DialogClose>
              );
            })}
          </Masonry>
        </ResponsiveMasonry>
      </div>
    </div>
  );
};

export default UnsplashImageSelector;
