"use client";

import { z } from "zod";
import Content from "./EditorComponents/Content";
import Tags from "./EditorComponents/Tags";
import Title from "./EditorComponents/Title";
import { postSchema } from "@/types/schemas";
import CoverImg from "./EditorComponents/CoverImg";

interface Props {
  changeContent: (newContent: string) => void;
  changeTitle: (newTitle: string) => void;
  changeCoverImg: (newImage: string) => void;
  changeTags: (newTags: Array<string>) => void;
  state: z.infer<typeof postSchema>;
}

const Editor = ({
  changeContent,
  changeCoverImg,
  changeTags,
  changeTitle,
  state,
}: Props) => {
  return (
    <div>
      <Title changeTitle={changeTitle} title={state.title} />
      <div className="mt-10">
        <Content changeContent={changeContent} content={state.content} />
      </div>
      <div className="mt-10">
        <Tags changeTags={changeTags} tags={state.tags ?? []} />
      </div>
      <div className="mt-10">
        <CoverImg
          coverImage={state.coverImgFull ?? ""}
          setCoverImage={changeCoverImg}
        />
      </div>
    </div>
  );
};

export default Editor;
