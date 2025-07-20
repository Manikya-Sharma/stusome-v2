"use client";

import { DialogClose } from "@radix-ui/react-dialog";
import { Search } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { useGetUnsplash } from "../queries/unsplash";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const UnsplashImageSelector = ({ setCover }: { setCover: Function }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [search, setSearch] = useState<string | null>(null);
  function searchImages() {
    if (!inputRef || !inputRef.current) return;
    const query = inputRef.current.value;
    if (query.trim().length !== 0) {
      setSearch(query);
    }
  }
  const { data: images } = useGetUnsplash({ query: search });

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
            {images?.results.map((image) => {
              return (
                <DialogClose
                  key={image.id}
                  onClick={() => setCover(image.urls.full)}
                >
                  <div className="relative m-2 overflow-auto rounded-lg">
                    <Image
                      className="block rounded-lg"
                      src={image.urls.small}
                      alt={image.description ?? `Image related to ${search}`}
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
