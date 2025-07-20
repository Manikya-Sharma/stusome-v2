"use client";
import { Reply } from "lucide-react";
import ShowMarkdown from "../ShowMarkdown";
import ShowProfileImage from "../ShowProfileImage";
import { useGetAccounts } from "../queries/accounts";
import { useGetDiscussions } from "../queries/discussions";
import Replies from "./Replies";

type Props = {
  discussionIds: string[];
  discussionHandler: Function;
};

export default function Discussions(props: Props) {
  const discussionsQuery = useGetDiscussions({ ids: props.discussionIds });
  const discussions = discussionsQuery.map((disc) => disc.data);
  const authorsQuery = useGetAccounts({
    emails: (discussions ?? [])
      .filter((disc) => disc?.author)
      .map((disc) => disc?.author as string),
  });
  const authors = authorsQuery.map((auth) => auth.data);
  return (
    <div>
      {discussions?.map((disc, idx) => {
        return (
          <div
            key={disc?.id}
            className="mx-auto my-2 w-full rounded-md border border-slate-400 p-3 sm:max-w-[80%]"
          >
            <cite className="mb-2 mr-auto flex w-fit items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <ShowProfileImage authorEmail={disc?.author} small={true} />
              {authors[idx]?.name.split(" ")[0]}
            </cite>
            <div className="markdown-wrapper">
              <ShowMarkdown data={disc?.content ?? ""} />
            </div>
            <div>
              <Replies replyIds={disc?.replies ?? []} />
            </div>
            <div className="text-md font-semibold text-slate-800">
              <button
                className=" my-2 flex w-fit items-center justify-start gap-2 rounded-lg bg-gradient-to-t from-teal-100 to-teal-300 px-2 py-1 hover:from-teal-300 hover:to-teal-100"
                onClick={() => props.discussionHandler("reply", disc?.id)}
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
