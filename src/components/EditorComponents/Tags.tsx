"use client";

import { Plus, X } from "lucide-react";
import { useRef } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export default function Tags({
  changeTags,
  tags,
}: {
  changeTags: Function;
  tags: Array<string>;
}) {
  const tagRef = useRef<HTMLInputElement | null>(null);

  function addTag() {
    if (!tagRef || !tagRef.current || !tagRef.current.value) {
      return;
    }
    const value = tagRef.current.value.toLowerCase();
    if (value) {
      if (value.trim() === "") {
        return;
      }
      if (tags.includes(value)) {
        return;
      }
      tagRef.current.value = "";
      changeTags([...tags, value]);
    }
  }

  function removeTag(tag: string) {
    changeTags(tags.filter((old_tag) => old_tag !== tag));
  }

  return (
    <div className="ml-16 mr-auto max-w-80 sm:ml-20 md:ml-28 md:max-w-[80%] lg:ml-32">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Tag"
          ref={tagRef}
          className="text-md block w-fit max-w-20"
          onKeyUp={(e) => {
            if (e.key == "Enter") {
              addTag();
            }
          }}
        />
        <Button variant={"ghost"} className="px-2 py-2" onClick={addTag}>
          <Plus />
        </Button>
      </div>
      <div className="mt-3 flex max-w-prose flex-wrap md:w-full md:max-w-[80%]">
        {tags.map((tag) => {
          return (
            <div
              key={tag}
              className="group relative cursor-pointer rounded-lg py-2 pl-2 pr-5 hover:bg-muted"
              onClick={() => removeTag(tag)}
            >
              <Badge
                className="absolute right-0 top-0 hidden px-1 py-1 group-hover:block"
                variant="secondary"
              >
                <X className="h-3 w-3" />
              </Badge>
              {tag}
            </div>
          );
        })}
      </div>
    </div>
  );
}
