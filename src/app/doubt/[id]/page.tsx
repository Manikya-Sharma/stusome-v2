"use client";

import Answer from "@/components/Doubts/Answer";
import MainQuestion from "@/components/Doubts/MainQuestion";
import GetMarkdownInput from "@/components/GetMarkdownInput";
import IndeterminateLoader from "@/components/IndeterminateLoader";
import { Account } from "@/types/user";
import { useSession } from "next-auth/react";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import { uniq as _uniq } from "lodash";
import { useGetAccounts } from "@/components/queries/account";

export default function Doubt({ params: { id } }: { params: { id: string } }) {
  const { data: session } = useSession();
  const [data, setData] = useState<Doubt | null>(null);
  const [answers, setAnswers] = useState<Array<DoubtAnswer> | null>(null);
  const [replies, setReplies] = useState<Array<DoubtReply> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [accounts, setAccounts] = useState<Map<string, Account>>();

  async function postNewAnswer(content: string) {
    if (!session || !session.user || !session.user.email) return;
    if (!data) return;
    const new_answer: DoubtAnswer = {
      author: session.user.email,
      content,
      id: uuid(),
      replies: [],
    };
    const new_answers = answers ? [...answers, new_answer] : [new_answer];

    setAnswers(() => new_answers);

    try {
      // create new answer
      await fetch(`/api/answers`, {
        method: "POST",
        body: JSON.stringify(new_answer),
        headers: {
          "Content-Type": "application/json",
        },
      });

      // link this answer to the doubt

      await fetch(`/api/doubts?id=${data.id}&field=answers`, {
        method: "PUT",
        body: JSON.stringify({
          answers: new_answers.map((ans) => ans.id),
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (e) {
      console.log(`Error occurred: ${e}`);
    }
  }

  async function postNewReply(content: string, answerId: string) {
    if (!session || !session.user || !session.user.email) return;
    if (!data) return;
    const reply: DoubtReply = {
      author: session.user.email,
      content,
      id: uuid(),
    };

    const answer_replies = replies?.filter((reply) =>
      answers
        ?.filter((ans) => ans.id == answerId)[0]
        .replies.includes(reply.id),
    );
    const new_replies = answer_replies ? [...answer_replies, reply] : [reply];

    replies && setReplies(() => [...replies, reply]);

    if (!answers) return;
    let updated_answer = answers.filter((ans) => ans.id == answerId)[0];
    updated_answer.replies = new_replies.map((rep) => rep.id);
    answers &&
      setAnswers([
        ...answers.filter((ans) => ans.id != answerId),
        updated_answer,
      ]);

    try {
      // create new reply
      await fetch(`/api/doubt_replies`, {
        method: "POST",
        body: JSON.stringify(reply),
        headers: {
          "Content-Type": "application/json",
        },
      });

      // link this reply to the answer

      await fetch(`/api/answers?id=${answerId}&field=replies`, {
        method: "PUT",
        body: JSON.stringify({
          replies: new_replies.map((reply) => reply.id),
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (e) {
      console.log(`Error occurred: ${e}`);
    }
  }

  useEffect(() => {
    async function getData() {
      try {
        // get doubt data
        const rawDoubt = await fetch(`/api/doubts?id=${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const doubt = (await rawDoubt.json()) as Doubt;
        if (doubt == null) {
          notFound();
        }
        setData(doubt);

        // get answer data
        const answers = doubt.answers;
        const answerRequests = answers.map((request) => {
          return fetch(`/api/answers?id=${request}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
        });

        const rawAnswers = await Promise.all(answerRequests);
        const parsedAnswers = (await Promise.all(
          rawAnswers.map((ans) => ans.json()),
        )) as Array<DoubtAnswer>;

        setAnswers(parsedAnswers);

        // get reply data
        const replies = parsedAnswers.flatMap((ans) => ans.replies);

        const replyRequests = replies.map((request) => {
          return fetch(`/api/doubt_replies?id=${request}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
        });

        const rawReplies = await Promise.all(replyRequests);
        const parsedReplies = (await Promise.all(
          rawReplies.map((reply) => reply.json()),
        )) as Array<DoubtAnswer>;
        setReplies(parsedReplies);
      } catch (e) {
        console.log(`Error: ${e}`);
      } finally {
        setLoading(false);
      }
    }
    getData();
  }, [id]);

  const emails: Array<string> = _uniq(
    [
      ...(answers ?? []).map((answer) => answer.author),
      ...(replies ?? []).map((reply) => reply.author),
    ].concat(data?.author ? [data.author] : []),
  );

  const authors = useGetAccounts({ emails });

  useEffect(() => {
    const newAuthors = new Map();
    authors.map((value, index) => {
      newAuthors.set(emails[index], value);
    });
    setAccounts(newAuthors);
  }, [id, answers, data, replies]);

  return (
    <main>
      <nav className="bg-black p-4 text-white dark:bg-slate-950">
        <IndeterminateLoader loading={loading} />
        <div className="text-center">
          <h1 className="mb-3 text-2xl font-bold md:text-5xl">{data?.title}</h1>
          <div className="mx-auto flex w-fit max-w-[80%] flex-wrap items-center justify-center">
            {data &&
              data.tags.map((tag) => {
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
        {data && accounts && (
          <MainQuestion
            author={accounts.get(data.author)}
            content={data.content}
          />
        )}

        {/* <!-- Doubts Section --> */}

        {data &&
          accounts &&
          answers &&
          replies &&
          answers.map((answer) => {
            return (
              <div key={answer.id}>
                <Answer
                  key={answer.id}
                  author={accounts.get(answer.author)}
                  content={answer.content}
                  replies={
                    replies &&
                    replies.filter((reply) => answer.replies.includes(reply.id))
                  }
                  authors={accounts}
                />
                <div className="text-right lg:mr-10">
                  <GetMarkdownInput
                    role="minor"
                    minorId={answer.id}
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
