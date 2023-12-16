"use client";

import { useState, useEffect } from "react";
import MainQuestion from "@/components/Doubts/MainQuestion";
import Answer from "@/components/Doubts/Answer";
import GetAnswer from "@/components/Doubts/GetAnswer";
import { Account } from "@/types/user";
import { Reply } from "lucide-react";
import { notFound } from "next/navigation";
import { v4 as uuid } from "uuid";
import { useSession } from "next-auth/react";

export default function Doubt({ params: { id } }: { params: { id: string } }) {
  const { data: session } = useSession();
  const [data, setData] = useState<Doubt | null>(null);
  const [answers, setAnswers] = useState<Array<DoubtAnswer> | null>(null);
  const [replies, setReplies] = useState<Array<DoubtReply> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [accounts, setAccounts] = useState<Map<string, Account>>();

  async function postReply(id: string, message: string) {
    if (!session || !session.user || !session.user.email) {
      return;
    }

    const newReply: DoubtReply = {
      id: uuid(),
      content: message,
      author: session.user.email,
    };

    await fetch(`/api/doubts/newReply/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newReply),
    });

    if (replies != null) {
      setReplies([...replies, newReply]);
    }
    if (answers != null) {
      answers.filter((ans) => ans.id == id)[0].replies.push(newReply.id);
    }
  }

  async function postAnswer(message: string) {
    if (!session || !session.user || !session.user.email) {
      return;
    }
    const newAnswer: DoubtAnswer = {
      id: uuid(),
      content: message,
      author: session.user.email,
      replies: [],
    };
    await fetch(`/api/doubts/newAnswer/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newAnswer),
    });
    if (answers != null) {
      setAnswers([...answers, newAnswer]);
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
          return notFound();
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

  useEffect(() => {
    async function fetchAuthorData() {
      const authors: Map<string, Account> = new Map();
      if (!data || !answers || !replies) {
        return;
      }

      const emails: Array<string> = [
        ...answers.map((answer) => answer.author),
        ...replies.map((reply) => reply.author),
        data.author,
      ];

      const promises = emails.map((email) =>
        fetch(`/api/accounts?email=${email}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }),
      );

      const rawResponses = await Promise.all(promises);
      const responses = await Promise.all(
        rawResponses.map((response) => response.json()),
      );

      responses.map((value, index) => {
        authors.set(emails[index], value);
      });
      setAccounts(authors);
    }
    // get authors
    fetchAuthorData();
  }, [id, answers, data, replies]);

  return (
    <main>
      {loading ? (
        // <DoubtLoading />
        <></>
      ) : (
        <>
          <nav className="bg-black p-4 text-white dark:bg-slate-950">
            <div className="text-center">
              <h1 className="mb-3 text-2xl font-bold md:text-5xl">
                {data?.title}
              </h1>
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
                  <>
                    <Answer
                      key={answer.id}
                      author={accounts.get(answer.author)}
                      content={answer.content}
                      replies={replies.filter((reply) =>
                        answer.replies.includes(reply.id),
                      )}
                      authors={accounts}
                    />
                    <button
                      className="text-md ml-auto mr-7 mt-2 flex w-fit gap-2 rounded-xl bg-teal-800 px-3 py-2 text-slate-200 transition hover:bg-teal-600 hover:text-white/80 dark:bg-teal-500 dark:hover:bg-teal-300 dark:hover:text-slate-800"
                      onClick={(e) => {
                        const message = prompt("Enter your reply");
                        if (!message) {
                          return;
                        }
                        // toast.promise(postReply(answer.id, message), {
                        //   success: "Posted",
                        //   error: "Could not post your reply",
                        //   loading: "Posting your reply",
                        // });
                      }}
                    >
                      <Reply />
                      Reply
                    </button>
                  </>
                );
              })}

            <section className="container mx-auto mt-6">
              <div className="rounded-lg border border-green-200 bg-green-50 p-4 shadow-md dark:border-green-600 dark:bg-green-950">
                <h2 className="mb-4 text-xl font-semibold dark:text-slate-300">
                  Post Your Answer
                </h2>
                <GetAnswer onPost={postAnswer} />
              </div>
            </section>
          </div>
        </>
      )}
    </main>
  );
}
