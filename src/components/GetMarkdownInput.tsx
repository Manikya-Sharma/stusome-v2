"use client";
import TextAreaAutoSize from "react-textarea-autosize";
import { useRef, useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ShowMarkdown from "./ShowMarkdown";

interface Props {
  triggerMessage: string;
  role: "major" | "minor";
  header?: string;
  markdown?: boolean;
  minorId?: string;
  onUpload: (_content: string | null, _minorId?: string) => void;
  disabled?: boolean;
}

const GetMarkdownInput = ({
  triggerMessage,
  header,
  markdown,
  role,
  onUpload,
  minorId,
  disabled,
}: Props) => {
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const [content, setContent] = useState<string | null>(null);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className={cn({
            "text-md ml-auto mr-7 mt-2 flex w-fit gap-2 rounded-xl bg-teal-800 px-3 py-2 text-slate-200 transition hover:bg-teal-600 hover:text-white/80 dark:bg-teal-500 dark:hover:bg-teal-300 dark:hover:text-slate-800":
              role === "minor",
          })}
        >
          {triggerMessage}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{header ?? "Enter the content"}</DialogTitle>
          {markdown && (
            <DialogDescription>
              This supports markdown. Make sure you follow community guidelines.
            </DialogDescription>
          )}
        </DialogHeader>

        <div>
          <Tabs defaultValue="account" className="mx-auto max-w-[400px]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="input">Input</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
            <TabsContent value="input">
              <TextAreaAutoSize
                maxRows={10}
                minRows={4}
                autoFocus
                className="w-full rounded-md bg-white px-3 py-2 text-black"
                ref={textAreaRef}
                value={content ?? ""}
                onChange={() =>
                  textAreaRef.current && setContent(textAreaRef.current.value)
                }
              />
            </TabsContent>
            <TabsContent value="preview">
              <div className="markdown-wrapper max-h-[263px] min-h-[119px] overflow-y-auto">
                <ShowMarkdown data={content ?? ""} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={"secondary"}>Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              disabled={disabled}
              onClick={() =>
                minorId ? onUpload(content, minorId) : onUpload(content)
              }
            >
              Upload
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GetMarkdownInput;
