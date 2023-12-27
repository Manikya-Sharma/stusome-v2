"use client";

import Content from "./EditorComponents/Content";
import Tags from "./EditorComponents/Tags";
import Title from "./EditorComponents/Title";

const Editor = () => {
  return (
    <div>
      <Title />
      <div className="mt-10">
        <Content />
      </div>
      <div className="mt-10">
        <Tags />
      </div>
    </div>
  );
};

export default Editor;
