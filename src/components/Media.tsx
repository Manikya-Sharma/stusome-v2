"use client";

import { Upload } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useRef } from "react";
import { Tooltip, TooltipProvider } from "./ui/tooltip";
import { TooltipContent, TooltipTrigger } from "@radix-ui/react-tooltip";
import { uploadFiles } from "@/lib/uploadthing";
import toast from "react-hot-toast";

export default function Media({
  changeMedia,
}: {
  changeMedia: (data: Array<{ key: string; type: string }>) => void;
}) {
  const inpRef = useRef<HTMLInputElement | null>(null);
  async function handleSubmit() {
    if (inpRef.current == null || inpRef.current.files == null) return;
    const files = [];
    for (let i = 0; i < inpRef.current.files.length; i += 1) {
      const file = inpRef.current.files[i];
      files.push(file);
    }
    const response = await uploadFiles("multimediaUploader", { files });
    const fileKeys = response.map((res) => ({
      key: res.key,
      type: res.type,
    }));
    changeMedia(fileKeys);
  }
  return (
    <section className="mx-5 my-10">
      <h2 className="my-5 text-center text-2xl">Media</h2>
      <div className="mx-auto flex max-w-prose items-center gap-2">
        <Input type="file" multiple ref={inpRef} />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => {
                  toast.promise(handleSubmit(), {
                    error: "Unable to upload media",
                    loading: "Uploading new media",
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
