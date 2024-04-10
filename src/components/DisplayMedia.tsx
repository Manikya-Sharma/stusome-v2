"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function DisplayMedia({
  mediaIds,
}: {
  mediaIds: Array<string>;
}) {
  const [width, setWidth] = useState<number>(0);
  useEffect(() => {
    setWidth(window.innerWidth);
  }, []);
  const [data, setData] = useState<
    Array<{
      id: string;
      datas: string;
      media_type: string;
    }>
  >([]);
  useEffect(() => {
    mediaIds.map((id) => {
      for (const existing of data) {
        if (existing.id === id) {
          return;
        }
      }
      fetch(`/api/multimedia?id=${id}`, {
        cache: "force-cache",
      }).then((raw_data) => {
        raw_data.json().then((datas) => {
          setData([...data, datas.rows[0]]);
        });
      });
    });
  }, [mediaIds, data]);
  return (
    <div className="relative flex flex-col items-center justify-center gap-2 space-y-2 md:mx-auto md:block md:w-fit">
      {data.length != 0 &&
        data.map((row) => {
          if (row.media_type.match("image/*")) {
            return (
              <div
                key={row.id}
                className="relative aspect-video"
                style={{ width: width < 768 ? width - 100 : width / 5 }}
              >
                <Image
                  src={`data:${row.media_type};base64,${row.datas}`}
                  alt=""
                  fill
                  className="aspect-square rounded-md"
                />
              </div>
            );
          } else if (row.media_type.match("video/*")) {
            return (
              <div key={row.id}>
                <video
                  src={`data:${row.media_type};base64,${row.datas}`}
                  controls
                  width={width < 768 ? width - 100 : width / 5}
                  className="aspect-video rounded-lg"
                >
                  Videos not supported
                </video>
              </div>
            );
          } else if (row.media_type.match("application/pdf")) {
            return (
              <div key={row.id}>
                <object
                  width={width < 768 ? width - 100 : width / 5}
                  height={width < 768 ? width - 100 : width / 5}
                  data={`data:${row.media_type};base64,${row.datas}`}
                >
                  <embed
                    src={`data:${row.media_type};base64,${row.datas}`}
                    type="application/pdf"
                  />
                </object>
              </div>
            );
          }
        })}
    </div>
  );
}
