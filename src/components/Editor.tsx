"use client";

import Content from "./EditorComponents/Content";
import Tags from "./EditorComponents/Tags";
import Title from "./EditorComponents/Title";

interface Props {
  changeContent: Function;
  changeTitle: Function;
  changeCoverImg: Function;
  changeTags: Function;
}

const Editor = ({
  changeContent,
  changeCoverImg,
  changeTags,
  changeTitle,
}: Props) => {
  return (
    <div>
      <Title changeTitle={changeTitle} />
      <div className="mt-10">
        <Content changeContent={changeContent} />
      </div>
      <div className="mt-10">
        <Tags changeTags={changeTags} />
      </div>
    </div>
  );
};

export default Editor;
