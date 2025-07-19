"use client";

import Answer from "@/components/Doubts/Answer";
import MainQuestion from "@/components/Doubts/MainQuestion";
import GetMarkdownInput from "@/components/GetMarkdownInput";
import IndeterminateLoader from "@/components/IndeterminateLoader";
import { Account } from "@/types/user";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import { uniq as _uniq } from "lodash";
import { useGetAccounts } from "@/components/queries/account";
import {
  useGetAnswers,
  usePostAnswer,
  usePutAnswer,
} from "@/components/queries/answers";
import { useGetDoubt, usePutDoubt } from "@/components/queries/doubts";
import { useGetReplies, usePostReply } from "@/components/queries/replies";

export default function Doubt({ params: { id } }: { params: { id: string } }) {
  const { data: session } = useSession();

  const { data: doubt } = useGetDoubt({ id });
  const { mutate: updateDoubt } = usePutDoubt();

  const [loading, setLoading] = useState<boolean>(true);
  const [accounts, setAccounts] = useState<Map<string, Account>>();

  const { mutate: createNewAnswer } = usePostAnswer();
  const { mutate: updateAnswer } = usePutAnswer();

  const { mutate: createNewReply } = usePostReply();

  const answers = useGetAnswers({ ids: doubt?.answers ?? [] }).map(
    (ans) => ans.data,
  );

  const replyIds = answers?.flatMap((ans) => ans?.replies);
  const replies = useGetReplies({ ids: replyIds }).map((rep) => rep.data);

  async function postNewAnswer(content: string | null) {
    if (!session || !session.user || !session.user.email || !content) return;
    if (!doubt) return;
    const new_answer: DoubtAnswer = {
      author: session.user.email,
      content,
      id: uuid(),
      replies: [],
    };
    const new_answers = answers ? [...answers, new_answer] : [new_answer];

    try {
      // create new answer
      createNewAnswer(new_answer);

      // link this answer to the doubt
      updateDoubt({
        id: doubt.id,
        field: "answers",
        newDoubt: {
          answers: new_answers.filter((ans) => ans).map((ans) => ans?.id ?? ""),
        },
      });
    } catch (e) {
      console.log(`Error occurred: ${e}`);
    }
  }

  async function postNewReply(
    content: string | null,
    answerId: string | undefined,
  ) {
    if (!session || !session.user || !session.user.email || !content) return;
    if (!doubt) return;
    const reply: DoubtReply = {
      author: session.user.email,
      content,
      id: uuid(),
    };

    const answer_replies = replies?.filter((reply) =>
      answers
        .filter((ans) => ans?.id == answerId)[0]
        ?.replies.includes(reply?.id ?? ""),
    );
    const new_replies = answer_replies ? [...answer_replies, reply] : [reply];

    if (!answers) return;
    let updated_answer = answers.filter((ans) => ans?.id == answerId)[0];
    if (updated_answer) {
      updated_answer.replies = new_replies
        .map((rep) => rep?.id ?? null)
        .filter((rep) => rep) as string[];
    }

    try {
      // create new reply
      createNewReply(reply);

      // link this reply to the answer
      updateAnswer({
        id: answerId,
        field: "replies",
        newAnswer: {
          replies: new_replies
            .map((reply) => reply?.id ?? null)
            .filter((rep) => rep) as string[],
        },
      });
    } catch (e) {
      console.log(`Error occurred: ${e}`);
    }
  }

  const emails: Array<string> = _uniq(
    [
      ...((answers ?? [])
        .map((answer) => answer?.author ?? null)
        .filter((answer) => answer) as string[]),
      ...((replies ?? [])
        .map((reply) => reply?.author ?? null)
        .filter((rep) => rep) as string[]),
    ].concat(doubt?.author ? [doubt.author] : []),
  );

  const authors = useGetAccounts({ emails });

  useEffect(() => {
    const newAuthors = new Map();
    authors.map((value, index) => {
      newAuthors.set(emails[index], value);
    });
    setAccounts(newAuthors);
  }, [id, answers, doubt, replies]);

  return (
    <main>
      <nav className="bg-black p-4 text-white dark:bg-slate-950">
        <IndeterminateLoader loading={loading} />
        <div className="text-center">
          <h1 className="mb-3 text-2xl font-bold md:text-5xl">
            {doubt?.title}
          </h1>
          <div className="mx-auto flex w-fit max-w-[80%] flex-wrap items-center justify-center">
            {doubt &&
              doubt.tags.map((tag) => {
                return (
                  <p
                    key={tag}
                    className="mx-1 block w-fit rounded-xl bg-slate-300 px-2 py-1 text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-200 md:text-sm"
                  >
                    {tag}
                  </p>
                );
              })}
          </div>
        </div>
      </nav>
      <div className="px-4 sm:px-8">
        {doubt && accounts && (
          <MainQuestion
            author={accounts.get(doubt.author)}
            content={doubt.content}
          />
        )}

        {/* <!-- Doubts Section --> */}

        {doubt &&
          accounts &&
          answers &&
          replies &&
          answers.map((answer) => {
            return (
              <div key={answer?.id}>
                <Answer
                  key={answer?.id}
                  author={accounts.get(answer?.author ?? "")}
                  content={answer?.content}
                  replies={
                    replies.filter(
                      (reply) => answer?.replies.includes(reply?.id ?? ""),
                      // BUG: Are you sure about type inference?
                    ) as DoubtReply[]
                  }
                  authors={accounts}
                />
                <div className="text-right lg:mr-10">
                  <GetMarkdownInput
                    role="minor"
                    minorId={answer?.id}
                    onUpload={postNewReply}
                    triggerMessage="Reply"
                    header="Replying to an answer"
                    markdown
                  />
                </div>
              </div>
            );
          })}

        <div className="mx-auto my-5 w-fit">
          <GetMarkdownInput
            onUpload={postNewAnswer}
            role="major"
            triggerMessage="New Answer"
            header="Posting new answer"
            markdown
          />
        </div>
      </div>
    </main>
  );
}
