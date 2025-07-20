"use client";

import Answer from "@/components/Doubts/Answer";
import MainQuestion from "@/components/Doubts/MainQuestion";
import GetMarkdownInput from "@/components/GetMarkdownInput";
import IndeterminateLoader from "@/components/IndeterminateLoader";
import {
  useGetAnswers,
  usePostAnswer,
  usePutAnswer,
} from "@/components/queries/answers";
import { useGetDoubt, usePutDoubt } from "@/components/queries/doubts";
import {
  useGetReplies,
  usePostReply,
} from "@/components/queries/doubt_replies";
import { uniq as _uniq } from "lodash";
import { useSession } from "next-auth/react";
import { use, useMemo } from "react";
import { v4 as uuid } from "uuid";

export default function Doubt({ params }: { params: Promise<{ id: string }> }) {
  const { data: session } = useSession();
  const { id } = use(params);

  const { data: doubt, isLoading: isLoadingDoubt } = useGetDoubt({ id });
  const { mutate: updateDoubt, isPending: isUpdatingDoubt } = usePutDoubt();

  const { mutate: createNewAnswer, isPending: isCreatingAnswer } =
    usePostAnswer();
  const { mutate: updateAnswer, isPending: isUpdatingAnswer } = usePutAnswer();

  const { mutate: createNewReply, isPending: usCreatingReply } = usePostReply();

  const answersQuery = useGetAnswers({ ids: doubt?.answers ?? [] });
  const answers = useMemo(
    () => answersQuery.map((ans) => ans.data),
    [answersQuery],
  );
  const isLoadingAnswers = answersQuery.some((ans) => ans.isLoading);

  const replyIds = answers?.flatMap((ans) => ans?.replies);
  const repliesQuery = useGetReplies({ ids: replyIds });
  const replies = useMemo(
    () => repliesQuery.map((rep) => rep.data),
    [repliesQuery],
  );
  const isLoadingReplies = repliesQuery.some((rep) => rep.isLoading);

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

  return (
    <main>
      <nav className="bg-black p-4 text-white dark:bg-slate-950">
        <IndeterminateLoader
          loading={isLoadingAnswers || isLoadingDoubt || isLoadingReplies}
        />
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
        <MainQuestion authorEmail={doubt?.author} content={doubt?.content} />

        {/* <!-- Doubts Section --> */}

        {doubt &&
          answers &&
          replies &&
          answers.map((answer) => {
            return (
              <div key={answer?.id}>
                <Answer
                  key={answer?.id}
                  authorEmail={answer?.author}
                  content={answer?.content}
                  replies={
                    replies.filter(
                      (reply) => answer?.replies.includes(reply?.id ?? ""),
                      // BUG: Are you sure about type inference?
                    ) as DoubtReply[]
                  }
                />
                <div className="text-right lg:mr-10">
                  <GetMarkdownInput
                    disabled={isUpdatingAnswer}
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
            disabled={isCreatingAnswer}
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
