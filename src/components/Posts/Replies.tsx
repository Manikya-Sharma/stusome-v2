"use client";
import { Reply } from "@/types/post";
import { useState, useEffect } from "react";
import ShowMarkdown from "../ShowMarkdown";
import { Account } from "@/types/user";
import ShowProfileImage from "../ShowProfileImage";

type Props = {
  replyIds: string[];
};

export default function Replies(props: Props) {
  const [replies, setReplies] = useState<Array<Reply | null> | null>(null);
  const [authors, setAuthors] = useState<Array<{
    email: string;
    data: Account;
  }> | null>(null);
  useEffect(() => {
    async function fetchData() {
      // get replies
      const promises = props.replyIds.map((replyId) => {
        return fetch(`/api/posts/getReplies/${replyId}`);
      });
      const responses = await Promise.all(promises);
      let data = (await Promise.all(
        responses.map((response) => response.json()),
      )) as Array<Reply | null> | null;
      if (data == null) {
        return;
      }
      data = data.filter((elem) => elem != null);
      setReplies(data);

      // get authors
      const authorEmails = data.map((reply) => {
        if (reply == null) {
          return "";
        }
        return reply.author;
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
  }, [props.replyIds]);
  return replies?.map((reply) => {
    return (
      <div
        key={reply?.id}
        className="markdown-wrapper min-w-fit max-w-[80%] border-2 border-transparent border-l-emerald-400 pl-3"
      >
        {reply && <ShowMarkdown data={reply.content} />}
        <cite className="mr-auto flex w-fit items-center gap-2 text-sm text-slate-400">
          <ShowProfileImage
            data={
              authors?.filter((author) => author.email == reply?.author)[0].data
            }
            small={true}
          />

          {authors &&
            authors
              .filter((author) => author.email == reply?.author)[0]
              .data.name.split(" ")[0]}
        </cite>
      </div>
    );
  });
}
