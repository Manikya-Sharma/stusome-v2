"use client";

import { z } from "zod";
import Content from "./EditorComponents/Content";
import Tags from "./EditorComponents/Tags";
import Title from "./EditorComponents/Title";
import { postSchema } from "@/types/schemas";
import CoverImg from "./EditorComponents/CoverImg";

interface Props {
  changeContent: Function;
  changeTitle: Function;
  changeTags: Function;
  state: z.infer<typeof postSchema>;
}

const Editor = ({ changeContent, changeTags, changeTitle, state }: Props) => {
  return (
    <div>
      <Title changeTitle={changeTitle} init={state.title} />
      <div className="mt-10">
        <Content changeContent={changeContent} init={state.content} />
      </div>
      <div className="mt-10">
        <Tags changeTags={changeTags} init={state.tags ?? []} />
      </div>
    </div>
  );
};

export default Editor;
