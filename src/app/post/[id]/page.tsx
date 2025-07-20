"use client";

import ShowMarkdown from "@/components/ShowMarkdown";
import Image from "next/image";

import { Cross as Hamburger } from "hamburger-react";
import { use, useEffect, useState } from "react";

import { v4 as uuid } from "uuid";

import DisplayMedia from "@/components/DisplayMedia";
import Answer from "@/components/Doubts/Answer";
import GetMarkdownInput from "@/components/GetMarkdownInput";
import IndeterminateLoader from "@/components/IndeterminateLoader";
import Headings from "@/components/Posts/Headings";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getChatId } from "@/lib/utils";
import { Discussion, Reply } from "@/types/post";
import { ChatAccount } from "@/types/user";
import { MessageCircle, Pen } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { useGetAccount } from "@/components/queries/accounts";
import {
  useGetDiscussions,
  usePostDiscussion,
  usePutDiscussion,
} from "@/components/queries/discussions";
import {
  useGetReplies,
  usePostReply,
} from "@/components/queries/doubt_replies";
import { useGetPost, usePutPost } from "@/components/queries/posts";
import { DoubtReply } from "@/types/doubt";

type Params = {
  params: Promise<{ id: string }>;
};

export default function Page({ params }: Params) {
  const router = useRouter();
  const { data: session, status } = useSession();

  // fetching data
  const { id } = use(params);
  const [media, setMedia] = useState<Array<string>>([]);
  const [headings, setHeadings] = useState<string[]>([]);

  const { data: post, isLoading: isLoadingPost } = useGetPost({ id });
  const { mutate: updatePost, isPending: isUpdatingPost } = usePutPost({
    onError: () => toast.error("Could not update the relevant post"),
  });
  const discussionIds = post?.discussions;

  const discussionsQuery = useGetDiscussions({ ids: discussionIds ?? [] });
  const discussions = discussionsQuery.map((disc) => disc.data);
  const isLoadingDiscussions = discussionsQuery.some((disc) => disc.isLoading);
  const { mutate: updateDiscussion, isPending: isUpdatingDiscussion } =
    usePutDiscussion({
      onError: () => toast.error("Could not update the relevant discussion"),
    });
  const { mutate: createNewDiscussion, isPending: isCreatingDiscussion } =
    usePostDiscussion({
      onSuccess: () => toast.success("Discussion created successfully"),
      onError: () => toast.error("Could not create new discussion"),
    });

  const replyIds = discussions.flatMap((disc) => disc?.replies);
  const repliesQuery = useGetReplies({ ids: replyIds });
  const replies = repliesQuery.map((reply) => reply.data);
  const isLoadingReplies = repliesQuery.some((rep) => rep.isLoading);
  const { mutate: createNewReply, isPending: isCreatingReply } = usePostReply({
    onSuccess: () => toast.success("Reply created successfully"),
    onError: () => toast.error("Reply could not be created"),
  });

  let { data: author, isLoading: isLoadingAuthor } = useGetAccount({
    email: post?.author,
  });

  useEffect(() => {
    if (status === "loading") return;
    async function getData() {
      try {
        // get media
        const mediaIds = post?.media;
        const mediaRequests = mediaIds?.map((request) => {
          return fetch(`/api/multimedia?id=${request}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
        });

        const rawMedia = await Promise.all(mediaRequests ?? []);
        const parsedMedia = (await Promise.all(
          rawMedia.map((ans) => ans.json()),
        )) as Array<string>;
        setMedia(parsedMedia);
      } catch (e) {
        console.log(`Error: ${e}`);
      }
    }
    getData();
  }, [id, router, status, post?.media]);

  // finding headings from data
  useEffect(() => {
    const arr = post?.content
      .replaceAll(/```(.|\n)+```/gm, "")
      .split("\n")
      .filter((line) => line.startsWith("# "))
      .map((line) => line.replace(/#{1}/, "").trim());
    if (arr != null) {
      setHeadings(Array.from(arr));
    }
  }, [post]);

  async function postNewDiscussion(content: string | null) {
    if (!session || !session.user || !session.user.email || !post) return;
    const new_discussion: Discussion = {
      author: session.user.email,
      content: content ?? "",
      id: uuid(),
      replies: [],
    };
    const new_discussions = discussions
      ? [...discussions, new_discussion]
      : [new_discussion];

    createNewDiscussion(new_discussion);

    // link this discussion to the post
    updatePost({
      id: post.id,
      field: "discussions",
      newPost: {
        discussions: new_discussions
          .filter((disc) => disc?.id)
          .map((disc) => disc?.id as string),
      },
    });
  }

  async function postNewReply(content: string | null, discussionId?: string) {
    if (!session || !session.user || !session.user.email) return;
    const reply: Reply = {
      author: session.user.email,
      content: content ?? "",
      id: uuid(),
    };

    const discussion_replies = replies?.filter((reply) =>
      discussions
        ?.filter((disc) => disc?.id == discussionId)[0]
        ?.replies.includes(reply?.id ?? ""),
    );
    const new_replies = discussion_replies
      ? [...discussion_replies, reply]
      : [reply];

    createNewReply(reply);

    // link this reply to the discussion
    updateDiscussion({
      id: discussionId,
      field: "replies",
      newDiscussion: {
        replies: new_replies
          .filter((reply) => reply?.id)
          .map((reply) => reply?.id as string),
      },
    });
  }

  async function handleChat() {
    if (!session || !session.user || !session.user.email || !post) {
      return;
    }
    const rawAccount = await fetch(
      `/api/chat/user?email=${session.user.email}`,
    );
    const rawAccount2 = await fetch(`/api/chat/user?email=${post.author}`);
    if (!rawAccount.ok) {
      toast.error("You have not opted in for chats yet!");
      return;
    }
    if (!rawAccount2.ok) {
      toast.error("The post author does not accept chats");
      return;
    }

    const sender_account = (await rawAccount.json()) as ChatAccount;
    const receiver_account = (await rawAccount2.json()) as ChatAccount;

    if (sender_account)
      if (
        sender_account.chats.includes(receiver_account.email) &&
        receiver_account.chats.includes(sender_account.email)
      ) {
        // if user is already a friend
        router.push(
          `/mychat/${getChatId(sender_account.email, receiver_account.email)}`,
        );
      } else {
        // send a request
        try {
          await fetch("/api/chat/request", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: session.user.email,
              to: post.author,
            }),
          });
          toast.success(
            "Sent a chat request, you will be able to chat once the author approves",
          );
        } catch (e) {
          toast.error("Could not begin your chat with author");
        }
      }
  }
  // menu for small screens
  const [openMenu, setOpenMenu] = useState<boolean>(false);

  return isLoadingPost ? (
    <Skeleton />
  ) : (
    <div className="min-h-screen">
      <IndeterminateLoader
        loading={isLoadingAuthor || isLoadingDiscussions || isLoadingReplies}
      />
      <div className="scroll-smooth p-4 transition-colors duration-200">
        <nav className="fixed left-2 top-2 z-[100] flex h-fit max-h-[50px] items-center justify-start rounded-lg backdrop-blur-md">
          <div className="py-1 pl-3 md:hidden">
            <Hamburger
              toggled={openMenu}
              onToggle={() => setOpenMenu(!openMenu)}
              size={18}
            />
          </div>
          {post?.author == session?.user?.email && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={"ghost"}
                    onClick={() => {
                      router.push(`/post/${id}/edit`);
                    }}
                    disabled={
                      isCreatingDiscussion ||
                      isUpdatingDiscussion ||
                      isCreatingReply ||
                      isUpdatingPost
                    }
                  >
                    <Pen />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Edit the post</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          {post?.author != session?.user?.email && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={"ghost"}
                    onClick={() => {
                      handleChat();
                    }}
                    disabled={
                      isCreatingDiscussion ||
                      isUpdatingDiscussion ||
                      isCreatingReply ||
                      isUpdatingPost
                    }
                  >
                    <MessageCircle />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Chat with author</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </nav>
        {/* Title */}
        <div className="relative mb-5 mt-10 dark:z-10 md:mt-0">
          <h1 className="text-center text-5xl">{post?.title}</h1>
          {!isLoadingAuthor && (
            <cite className="mt-3 block text-center text-lg text-muted-foreground">
              - {author && author.name}
            </cite>
          )}
        </div>
        {/* Background Image */}
        {post?.coverImgFull && (
          <div className="absolute left-0 top-0 -z-[100] h-[55vh] w-[100vw] dark:z-0">
            <div className="relative h-full w-full blur-sm filter">
              <Image src={post.coverImgFull} alt="" fill />
              <div className="fixed z-0 h-full w-full bg-[rgba(255,255,255,0.7)] dark:bg-[rgba(0,0,0,0.7)]"></div>
            </div>
          </div>
        )}
        <div className="relative">
          {/* Headings */}
          <Headings headings={headings} openMenu={openMenu} />

          <div className="sm:inline-flex md:max-w-[75vw]">
            <div className="flex-[3]">
              <div
                className={"markdown-wrapper transition-colors duration-200 "}
              >
                <ShowMarkdown data={post?.content ?? ""} />
              </div>
            </div>
            <div className="my-3 flex flex-[1] flex-wrap items-center justify-center text-center text-slate-200 sm:flex-col sm:justify-start">
              {post?.tags?.map((tag) => {
                return (
                  <div
                    key={tag}
                    className="mx-[2px] my-[2px] rounded-xl bg-slate-600 px-[4px] py-[2px] dark:text-slate-300 sm:w-[80%]"
                  >
                    {tag}
                  </div>
                );
              })}
            </div>
            <div>
              {post?.media.length != 0 && <h2 className="text-2xl">Media</h2>}
              {post?.media.length === 0 ? (
                ""
              ) : (
                <DisplayMedia mediaIds={post?.media ?? []} />
              )}
            </div>
          </div>
        </div>
        <div>
          <div className="mx-auto my-5 h-[2px] w-[90%] bg-slate-600"></div>
          <h2 className="mb-3 mt-6 text-4xl sm:text-center">Discussions:-</h2>
          {discussions.map((discussion, index) => {
            return (
              <div key={discussion?.id ?? index}>
                <Answer
                  authorEmail={discussion?.author}
                  content={discussion?.content}
                  replies={
                    replies &&
                    (replies.filter(
                      (reply) => discussion?.replies.includes(reply?.id ?? ""),
                      // TODO: Are you sure?
                    ) as DoubtReply[])
                  }
                />
                <div className="text-right lg:mr-10">
                  <GetMarkdownInput
                    role="minor"
                    minorId={discussion?.id}
                    onUpload={postNewReply}
                    triggerMessage="Reply"
                    header="Replying to a discussion"
                    disabled={
                      isCreatingDiscussion ||
                      isUpdatingDiscussion ||
                      isCreatingReply ||
                      isUpdatingPost
                    }
                    markdown
                  />
                </div>
              </div>
            );
          })}
        </div>
        <div className="mx-auto w-fit">
          <GetMarkdownInput
            role="major"
            triggerMessage="Post a new discussion"
            header="Enter your new discussion"
            markdown
            onUpload={postNewDiscussion}
            disabled={
              isCreatingDiscussion ||
              isUpdatingDiscussion ||
              isCreatingReply ||
              isUpdatingPost
            }
          />
        </div>
      </div>
    </div>
  );
}
