"use client";

import { z } from "zod";
import Content from "./EditorComponents/Content";
import Tags from "./EditorComponents/Tags";
import Title from "./EditorComponents/Title";
import { doubtSchema } from "@/types/schemas";

interface Props {
  changeContent: (newContent: string) => void;
  changeTitle: (newTitle: string) => void;
  changeTags: (newTags: Array<string>) => void;
  state: z.infer<typeof doubtSchema>;
}

const Editor = ({ changeContent, changeTags, changeTitle, state }: Props) => {
  return (
    <div>
      <Title changeTitle={changeTitle} title={state.title} />
      <div className="mt-10">
        <Content changeContent={changeContent} content={state.content} />
      </div>
      <div className="mt-10">
        <Tags changeTags={changeTags} tags={state.tags ?? []} />
      </div>
    </div>
  );
};

export default Editor;
