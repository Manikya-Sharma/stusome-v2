"use client";

import { Button } from "@/components/ui/button";
import { z } from "zod";
import { postSchema } from "@/types/schemas";
import DoubtEditor from "@/components/DoubtEditor";
import { useState } from "react";

type formType = z.infer<typeof postSchema>;

const App = () => {
  const [formState, setFormState] = useState<formType>({
    content: "",
    title: "",
    tags: [],
  });

  function changeContent(newContent: string) {
    formState.content = newContent;
  }
  function changeTitle(newTitle: string) {
    formState.title = newTitle;
  }

  function changeTags(newTags: Array<string>) {
    formState.tags = newTags;
  }

  return (
    <div>
      <DoubtEditor
        state={formState}
        changeContent={changeContent}
        changeTitle={changeTitle}
        changeTags={changeTags}
      />
      <div className="flex items-center justify-center gap-4">
        <Button
          className="my-10 block text-2xl"
          size="lg"
          type="submit"
          onClick={() => {
            console.log(formState);
          }}
        >
          Post the doubt
        </Button>
      </div>
    </div>
  );
};

export default App;
