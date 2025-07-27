"use client";

import { useEffect, useState } from "react";
import { useGetAllMultimedia } from "./queries/multimedia";
import Image from "next/image";

export default function DisplayMedia({
  mediaIds,
}: {
  mediaIds: Array<{ key: string; type: string }>;
}) {
  const [width, setWidth] = useState<number>(0);
  useEffect(() => {
    setWidth(window.innerWidth);
  }, []);
  const multimediaQuery = useGetAllMultimedia({
    items: mediaIds,
  });
  const data = multimediaQuery.map((res) => res.data);

  const isLoading = multimediaQuery.some((res) => res.isLoading);
  return (
    <div className="relative flex flex-col items-center justify-center gap-2 space-y-2 md:mx-auto md:block md:w-fit">
      {isLoading
        ? Array(2)
            .fill(0)
            .map((_, idx) => (
              <div
                className="relative aspect-video animate-pulse bg-gray-600"
                style={{ width: width < 768 ? width - 100 : width / 5 }}
                key={idx}
              />
            ))
        : data.map((row) => {
            if (!row) return null;
            const { type, url } = row;
            if (type.match("image/*")) {
              return (
                <div
                  key={url}
                  className="relative aspect-video"
                  style={{ width: width < 768 ? width - 100 : width / 5 }}
                >
                  <Image
                    src={url}
                    alt=""
                    fill
                    className="aspect-square rounded-md"
                  />
                </div>
              );
            } else if (type.match("video/*")) {
              return (
                <div key={url}>
                  <video
                    src={url}
                    controls
                    width={width < 768 ? width - 100 : width / 5}
                    className="aspect-video rounded-lg"
                  >
                    Videos not supported
                  </video>
                </div>
              );
            } else if (type.match("application/pdf")) {
              return (
                <div key={url}>
                  <embed
                    src={url}
                    width={width < 768 ? width - 100 : width / 5}
                    height={width < 768 ? width - 100 : width / 5}
                    type="application/pdf"
                  />
                </div>
              );
            }
          })}
    </div>
  );
}
