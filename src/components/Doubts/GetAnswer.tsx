"use client";

import { useState } from "react";

import ShowMarkdown from "../ShowMarkdown";
// import TextArea from "react-textarea-autosize";
// import toast from "react-hot-toast";

export default function Answer({ onPost }: { onPost: Function }) {
  const [currentTab, setCurrentTab] = useState<number>(0);
  const [data, setData] = useState<string>("");

  return (
    <section>
      <div className="mb-4">
        <label
          htmlFor="doubts"
          className="block text-gray-600 dark:text-slate-300"
        >
          Your Answer:
        </label>
        <div className="mx-auto mb-2 flex w-fit items-center gap-2 text-lg">
          <button
            className={
              "block w-fit rounded-lg px-2 py-1 transition-colors duration-200 " +
              (currentTab == 0
                ? "bg-teal-600 text-teal-100 dark:bg-teal-100 dark:text-teal-700"
                : "bg-teal-300 dark:bg-teal-500 dark:text-teal-100")
            }
            onClick={() => {
              setCurrentTab(0);
            }}
          >
            Input
          </button>
          <button
            className={
              "block w-fit rounded-lg px-2 py-1 transition-colors duration-200 " +
              (currentTab == 1
                ? "bg-teal-600 text-teal-100 dark:bg-teal-100 dark:text-teal-700"
                : "bg-teal-300 dark:bg-teal-500 dark:text-teal-100")
            }
            onClick={() => {
              setCurrentTab(1);
            }}
          >
            Preview
          </button>
        </div>
        {/* <div className={currentTab == 1 ? "hidden" : "block"}>
          <TextArea
            id="doubts"
            name="doubts"
            className="w-full rounded-lg border px-3 py-2"
            rows={5}
            onChange={(e) => setData(e.currentTarget.value)}
          ></TextArea>
        </div> */}

        <div
          className={
            "markdown-wrapper min-h-[30px] rounded-lg bg-slate-200 px-2 py-2 " +
            (currentTab == 0 ? "hidden" : "block")
          }
        >
          <ShowMarkdown data={data} />
        </div>
      </div>
      <button
        className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        onClick={() => {
          // toast.promise(onPost(data), {
          //   error: "Could not post your answer",
          //   loading: "Posting your answer",
          //   success: "Answer posted successfully",
          // });
        }}
      >
        Post
      </button>
    </section>
  );
}
