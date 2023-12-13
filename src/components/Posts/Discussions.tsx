"use client";
import ShowMarkdown from "../ShowMarkdown";
import { Reply } from "lucide-react";
import { Discussion } from "@/types/post";
import { useEffect, useState } from "react";
import Replies from "./Replies";
import { Account } from "@/types/user";
import ShowProfileImage from "../ShowProfileImage";

type Props = {
  discussionIds: string[];
  discussionHandler: Function;
};

export default function Discussions(props: Props) {
  const [discussions, SetDiscussions] = useState<Discussion[] | null>(null);
  const [authors, setAuthors] = useState<Array<{
    email: string;
    data: Account;
  }> | null>(null);
  useEffect(() => {
    async function fetchData() {
      // get discussion
      const promises = props.discussionIds.map((discussionId) => {
        return fetch(`/api/posts/getDiscussion/${discussionId}`);
      });
      const responses = await Promise.all(promises);
      const data = (await Promise.all(
        responses.map((response) => response.json()),
      )) as Discussion[];
      SetDiscussions(data);

      // get author
      const authorEmails = data.map((discussion) => {
        return discussion.author;
      });
      const authorPromises = authorEmails.map((author) => {
        return fetch(`/api/getAccountByEmail/${author}`);
      });
      const authorResponses = await Promise.all(authorPromises);
      const authors = (await Promise.all(
        authorResponses.map((author) => author.json()),
      )) as Array<Account>;

      const authorsArray: Array<{ email: string; data: Account }> = [];
      for (let i = 0; i < authorEmails.length; i++) {
        authorsArray.push({ email: authorEmails[i], data: authors[i] });
      }
      setAuthors(authorsArray);
    }
    fetchData();
  }, [props.discussionIds]);
  return (
    <div>
      {discussions?.map((elem) => {
        return (
          <div
            key={elem.id}
            className="mx-auto my-2 w-full rounded-md border border-slate-400 p-3 sm:max-w-[80%]"
          >
            <cite className="mb-2 mr-auto flex w-fit items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <ShowProfileImage
                data={
                  authors?.filter((author) => author.email == elem.author)[0]
                    .data
                }
                small={true}
              />

              {authors &&
                authors
                  .filter((author) => author.email == elem.author)[0]
                  .data.name.split(" ")[0]}
            </cite>
            <div className="markdown-wrapper">
              <ShowMarkdown data={elem.content} />
            </div>
            <div>
              <Replies replyIds={elem.replies} />
            </div>
            <div className="text-md font-semibold text-slate-800">
              <button
                className=" my-2 flex w-fit items-center justify-start gap-2 rounded-lg bg-gradient-to-t from-teal-100 to-teal-300 px-2 py-1 hover:from-teal-300 hover:to-teal-100"
                onClick={() => props.discussionHandler("reply", elem.id)}
              >
                <Reply />
                Reply
              </button>
            </div>
          </div>
        );
      })}

      <button
        className="mx-auto my-5 flex w-fit items-center justify-around gap-2 rounded-md bg-gradient-to-tr from-rose-200 to-pink-300 px-3 py-2 text-pink-800 transition-all duration-200 hover:from-purple-200 hover:to-rose-300 hover:text-rose-950"
        onClick={() => {
          props.discussionHandler("discussion");
        }}
      >
        {/* // TODO */} PLUS ICON New discussion
      </button>
    </div>
  );
}
