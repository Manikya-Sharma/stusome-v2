"use client";

import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import hljs from "highlight.js";
import "katex/dist/katex.min.css";
import "highlight.js/styles/tomorrow-night-blue.css";
import { useEffect } from "react";
import Script from "next/script";

<link
  rel="stylesheet"
  href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/github-dark.min.css"
></link>;

type Props = {
  data: string;
};

export default function ShowMarkdown(props: Props) {
  useEffect(() => {
    hljs.highlightAll();
  }, []);
  let currentId = 0;
  const generateId = () => {
    currentId += 1;
    return currentId;
  };
  return (
    <>
      <Script
        id="mermaid"
        type="module"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@9/dist/mermaid.esm.min.mjs";
        mermaid.initialize({startOnLoad: true});
        mermaid.contentLoaded();`,
        }}
      />
      <Markdown
        remarkPlugins={[remarkMath, remarkGfm]}
        rehypePlugins={[rehypeKatex, rehypeHighlight, rehypeRaw]}
        components={{
          h1({ ...props }) {
            return <h2 id={generateId().toString()} {...props}></h2>;
          },
          h2: "h3",
          h3: "h4",
        }}
      >
        {props.data}
      </Markdown>
    </>
  );
}
