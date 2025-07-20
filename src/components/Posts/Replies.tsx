"use client";
import { Reply } from "@/types/post";
import { useEffect, useState } from "react";
import ShowMarkdown from "../ShowMarkdown";
import ShowProfileImage from "../ShowProfileImage";
import { useGetAccounts } from "../queries/accounts";
import { useGetReplies } from "../queries/doubt_replies";

type Props = {
  replyIds: string[];
};

export default function Replies(props: Props) {
  const repliesQuery = useGetReplies({ ids: props.replyIds });
  const replies = repliesQuery.map((rep) => rep.data);
  const authorsQuery = useGetAccounts({
    emails: (replies ?? [])
      .filter((rep) => rep?.author)
      .map((rep) => rep?.author as string),
  });
  const authors = authorsQuery.map((auth) => auth.data);
  return replies?.map((reply, idx) => {
    return (
      <div
        key={reply?.id}
        className="markdown-wrapper min-w-fit max-w-[80%] border-2 border-transparent border-l-emerald-400 pl-3"
      >
        {reply && <ShowMarkdown data={reply.content} />}
        <cite className="mr-auto flex w-fit items-center gap-2 text-sm text-slate-400">
          <ShowProfileImage authorEmail={reply?.author} small={true} />
          {authors[idx]?.name.split(" ")[0]}
        </cite>
      </div>
    );
  });
}
