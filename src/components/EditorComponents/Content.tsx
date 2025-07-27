"use client";

import { useRef } from "react";
import TextAreaAutoSize from "react-textarea-autosize";
import ShowMarkdown from "../ShowMarkdown";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

export default function Content({
  changeContent,
  content,
}: {
  changeContent: (newContent: string) => void;
  content: string;
}) {
  let textAreaRef = useRef<HTMLTextAreaElement>(null);
  return (
    <Tabs defaultValue="input" className="mx-auto max-w-[80%] md:mx-24">
      <TabsList className="grid w-full max-w-[400px] grid-cols-2">
        <TabsTrigger value="input">Input</TabsTrigger>
        <TabsTrigger value="preview">Preview</TabsTrigger>
      </TabsList>
      <TabsContent value="input">
        <TextAreaAutoSize
          maxRows={10}
          minRows={4}
          className="w-full rounded-md border border-black bg-white px-3 py-2 text-black dark:border-white"
          ref={textAreaRef}
          value={content ?? ""}
          onChange={() => {
            textAreaRef.current && changeContent(textAreaRef.current.value);
          }}
        />
      </TabsContent>
      <TabsContent value="preview">
        <div className="markdown-wrapper max-h-[263px] min-h-[119px] overflow-y-auto rounded-md border border-black p-2 dark:border-white">
          {content ? (
            <ShowMarkdown data={content} />
          ) : (
            <div className="text-muted-foreground">Nothing to preview</div>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}
