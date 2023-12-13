"use client";

import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

type Props = {
  data: string;
};

export default function ShowMarkdown(props: Props) {
  let currentId = 0;
  const generateId = () => {
    currentId += 1;
    return currentId;
  };
  return (
    <Markdown
      remarkPlugins={[remarkMath]}
      rehypePlugins={[rehypeKatex, rehypeHighlight]}
      components={{
        h1({ node, ...props }) {
          return (
            <h2
              className="cursor-pointer pb-3 pt-10 underline-offset-1 after:ml-2 after:text-slate-300 hover:underline hover:after:content-['\00A7'] md:pb-0 md:pt-2"
              id={generateId().toString()}
              {...props}
            ></h2>
          );
        },
        h2: "h3",
        h3: "h4",
      }}
    >
      {props.data}
    </Markdown>
  );
}
