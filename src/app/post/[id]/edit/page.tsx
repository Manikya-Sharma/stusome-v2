"use client";

import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { z } from "zod";
import { postSchema } from "@/types/schemas";
import Editor from "@/components/Editor";

type formType = z.infer<typeof postSchema>;

const App = () => {
  const formState: formType = {
    content: "",
    title: "",
    coverImgFull: "",
    tags: [],
  };
  function changeContent(newContent: string) {
    formState.content = newContent;
  }
  function changeTitle(newTitle: string) {
    formState.title = newTitle;
  }
  function changeCoverImg(newImage: string) {
    formState.coverImgFull = newImage;
  }
  function changeTags(newTags: Array<string>) {
    formState.tags = newTags;
  }

  return (
    <div>
      <Editor
        changeContent={changeContent}
        changeTitle={changeTitle}
        changeCoverImg={changeCoverImg}
        changeTags={changeTags}
      />
      <Button
        className="mx-auto my-10 block text-2xl"
        size="lg"
        type="submit"
        onClick={() => {
          console.log(formState);
        }}
      >
        Post
      </Button>
    </div>
  );
};

export default App;
