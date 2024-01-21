"use client";

import TextAreaAutoSize from "react-textarea-autosize";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import ShowMarkdown from "../ShowMarkdown";
import { useEffect, useRef, useState } from "react";

export default function Content({
  changeContent,
  init,
}: {
  changeContent: Function;
  init: string;
}) {
  let textAreaRef = useRef<HTMLTextAreaElement>(null);
  let [content, setContent] = useState<string>("");
  useEffect(() => {
    setContent(init);
  }, [init]);
  return (
    <Tabs defaultValue="input" className="mx-auto max-w-[80%] lg:max-w-prose">
      <TabsList className="grid w-full max-w-[400px] grid-cols-2">
        <TabsTrigger value="input">Input</TabsTrigger>
        <TabsTrigger value="preview">Preview</TabsTrigger>
      </TabsList>
      <TabsContent value="input">
        <TextAreaAutoSize
          maxRows={10}
          minRows={4}
          className="w-full rounded-md border border-black px-3 py-2 lg:max-w-prose dark:border-white"
          ref={textAreaRef}
          value={content ?? ""}
          onChange={() => {
            textAreaRef.current && setContent(textAreaRef.current.value);
            textAreaRef.current && changeContent(textAreaRef.current.value);
          }}
        />
      </TabsContent>
      <TabsContent value="preview">
        <div className="markdown-wrapper max-h-[263px] min-h-[119px] overflow-y-auto rounded-md border border-black p-2 lg:max-w-prose dark:border-white">
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
