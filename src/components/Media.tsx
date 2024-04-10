"use client";

import { Upload } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useRef, useState } from "react";
import { Tooltip, TooltipProvider } from "./ui/tooltip";
import { TooltipContent, TooltipTrigger } from "@radix-ui/react-tooltip";
import { v4 as uuid } from "uuid";
import toast from "react-hot-toast";

export default function Media({ changeMedia }: { changeMedia: Function }) {
  const inpRef = useRef<HTMLInputElement | null>(null);
  const [data, setData] = useState<Array<string>>([]);
  async function handleSubmit() {
    if (inpRef.current == null || inpRef.current.files == null) return;
    for (let i = 0; i < inpRef.current.files.length; i += 1) {
      const file = inpRef.current.files[i];
      const reader = new FileReader();
      reader.onloadend = () => {
        const raw_data = reader.result;
        if (typeof raw_data === "string") {
          const base64 = raw_data.replace("data:", "").replace(/^.+,/, "");
          const id = uuid();
          try {
            fetch("/api/multimedia", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                id: id,
                data: base64,
                type: file.type,
              }),
            }).then(() => {
              setData([...data, base64]);
              changeMedia(id);
            });
          } catch (e) {
            console.error(e);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  }
  return (
    <section className="mx-5 my-10">
      <h2 className="my-5 text-center text-2xl">Media</h2>
      <div className="mx-auto flex max-w-prose items-center gap-2">
        <Input type="file" multiple ref={inpRef} />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Button
                onClick={() => {
                  toast.promise(handleSubmit(), {
                    error: "Unable to upload media",
                    loading: "Uploaded new media",
                    success:
                      "Uploaded media successfully, please post again to make changes",
                  });
                }}
              >
                <Upload />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Upload</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </section>
  );
}
