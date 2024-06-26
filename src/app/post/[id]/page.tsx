"use client";

import ShowMarkdown from "@/components/ShowMarkdown";
import Image from "next/image";

import { Cross as Hamburger } from "hamburger-react";
import { useEffect, useState } from "react";

import { v4 as uuid } from "uuid";

import Answer from "@/components/Doubts/Answer";
import GetMarkdownInput from "@/components/GetMarkdownInput";
import Headings from "@/components/Posts/Headings";
import { Skeleton } from "@/components/ui/skeleton";
import { Discussion, Post, Reply } from "@/types/post";
import { Account, ChatAccount } from "@/types/user";
import { useSession } from "next-auth/react";
import { notFound, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MessageCircle, Pen } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import IndeterminateLoader from "@/components/IndeterminateLoader";
import { getChatId } from "@/lib/utils";
import toast from "react-hot-toast";
import DisplayMedia from "@/components/DisplayMedia";

type Params = {
  params: { id: string };
};

export default function Page({ params }: Params) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loadingExtraData, setLoadingExtraData] = useState<boolean>(true);

  // fetching data
  const id = params.id;
  const [accounts, setAccounts] = useState<Map<string, Account>>();
  const [post, setPost] = useState<Post | null>(null);
  const [discussions, setDiscussions] = useState<Array<Discussion> | null>(
    null,
  );
  const [replies, setReplies] = useState<Array<Reply> | null>(null);
  const [media, setMedia] = useState<Array<string>>([]);
  const loading = post === null;
  const [headings, setHeadings] = useState<string[]>([]);
  let author = post && accounts ? accounts.get(post.author) : null;
  useEffect(() => {
    if (status === "loading") return;
    async function getData() {
      try {
        // get post data
        const rawPost = await fetch(`/api/posts?id=${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const post = (await rawPost.json()) as Post;
        if (post == null) {
          notFound();
        }
        if (!post.published) {
          if (status === "authenticated") {
            // TODO: the edit route will handle unauthorized access
            router.replace(`/post/${id}/edit`);
          }
          return notFound();
        }
        setPost(post);

        // get discussions

        const discussionIds = post.discussions;
        const discussionRequests = discussionIds.map((request) => {
          return fetch(`/api/discussions?id=${request}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
        });

        const rawDiscussions = await Promise.all(discussionRequests);
        const parsedDiscussions = (await Promise.all(
          rawDiscussions.map((ans) => ans.json()),
        )) as Array<Discussion>;
        setDiscussions(parsedDiscussions);

        // get replies
        const replyIds = parsedDiscussions.flatMap((disc) => disc.replies);
        const replyRequests = replyIds.map((request) => {
          return fetch(`/api/replies?id=${request}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
        });

        const rawReplies = await Promise.all(replyRequests);
        const parsedReplies = (await Promise.all(
          rawReplies.map((ans) => ans.json()),
        )) as Array<Reply>;
        setReplies(parsedReplies);

        // get media
        const mediaIds = post.media;
        const mediaRequests = mediaIds.map((request) => {
          return fetch(`/api/multimedia?id=${request}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
        });

        const rawMedia = await Promise.all(mediaRequests);
        const parsedMedia = (await Promise.all(
          rawMedia.map((ans) => ans.json()),
        )) as Array<string>;
        setMedia(parsedMedia);

        setLoadingExtraData(false);
      } catch (e) {
        console.log(`Error: ${e}`);
      }
    }
    getData();
  }, [id, router, status]);

  useEffect(() => {
    async function fetchAuthorData() {
      setLoadingExtraData(true);
      const authors: Map<string, Account> = new Map();
      if (!post || !replies || !discussions) {
        return;
      }

      const emails: Array<string> = [
        ...discussions.map((discussion) => discussion.author),
        ...replies.map((reply) => reply.author),
        post.author,
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
      setLoadingExtraData(false);
    }
    // get authors
    fetchAuthorData();
  }, [id, discussions, post, replies]);

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

  // post new discussion

  async function postNewDiscussion(content: string) {
    setLoadingExtraData(true);
    if (!session || !session.user || !session.user.email) return;
    if (!post) return;
    const new_discussion: Discussion = {
      author: session.user.email,
      content,
      id: uuid(),
      replies: [],
    };
    const new_discussions = discussions
      ? [...discussions, new_discussion]
      : [new_discussion];

    setDiscussions(() => new_discussions);

    try {
      // create new discussion
      await fetch(`/api/discussions`, {
        method: "POST",
        body: JSON.stringify(new_discussion),
        headers: {
          "Content-Type": "application/json",
        },
      });

      // link this discussion to the post

      await fetch(`/api/posts?id=${post.id}&field=discussions`, {
        method: "PUT",
        body: JSON.stringify({
          discussions: new_discussions.map((disc) => disc.id),
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      setLoadingExtraData(false);
    } catch (e) {
      console.log(`Error occurred: ${e}`);
    }
  }

  async function postNewReply(content: string, discussionId: string) {
    setLoadingExtraData(true);
    if (!session || !session.user || !session.user.email) return;
    if (!post) return;
    const reply: Reply = {
      author: session.user.email,
      content,
      id: uuid(),
    };

    const discussion_replies = replies?.filter(
      (reply) =>
        discussions
          ?.filter((disc) => disc.id == discussionId)[0]
          .replies.includes(reply.id),
    );
    const new_replies = discussion_replies
      ? [...discussion_replies, reply]
      : [reply];

    replies && setReplies(() => [...replies, reply]);

    if (!discussions) return;
    let updated_discussion = discussions.filter(
      (disc) => disc.id == discussionId,
    )[0];
    updated_discussion.replies = new_replies.map((rep) => rep.id);
    discussions &&
      setDiscussions([
        ...discussions.filter((disc) => disc.id != discussionId),
        updated_discussion,
      ]);

    try {
      // create new reply
      await fetch(`/api/replies`, {
        method: "POST",
        body: JSON.stringify(reply),
        headers: {
          "Content-Type": "application/json",
        },
      });

      // link this reply to the discussion

      await fetch(`/api/discussions?id=${discussionId}&field=replies`, {
        method: "PUT",
        body: JSON.stringify({
          replies: new_replies.map((reply) => reply.id),
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      setLoadingExtraData(false);
    } catch (e) {
      console.log(`Error occurred: ${e}`);
    }
  }

  async function handleChat() {
    if (!session || !session.user || !session.user.email || !post) {
      return;
    }
    setLoadingExtraData(true);
    const rawAccount = await fetch(
      `/api/chat/user?email=${session.user.email}`,
    );
    const rawAccount2 = await fetch(`/api/chat/user?email=${post.author}`);
    if (!rawAccount.ok) {
      toast.error("You have not opted in for chats yet!");
      setLoadingExtraData(false);
      return;
    }
    if (!rawAccount2.ok) {
      toast.error("The post author does not accept chats");
      setLoadingExtraData(false);
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
    setLoadingExtraData(false);
  }
  // menu for small screens
  const [openMenu, setOpenMenu] = useState<boolean>(false);

  return loading ? (
    <Skeleton />
  ) : (
    <div className="min-h-screen">
      <IndeterminateLoader loading={loadingExtraData} />
      <div className="scroll-smooth p-4 transition-colors duration-200">
        <nav className="fixed left-2 top-2 z-[100] flex h-fit max-h-[50px] items-center justify-start rounded-lg backdrop-blur-md">
          <div className="py-1 pl-3 md:hidden">
            <Hamburger
              toggled={openMenu}
              onToggle={() => setOpenMenu(!openMenu)}
              size={18}
            />
          </div>
          {post.author == session?.user?.email && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={"ghost"}
                    onClick={() => {
                      router.push(`/post/${id}/edit`);
                    }}
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
          {post.author != session?.user?.email && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={"ghost"}
                    onClick={() => {
                      handleChat();
                    }}
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
        <div className="relative mb-5 mt-10 md:mt-0 dark:z-10">
          <h1 className="text-center text-5xl">{post?.title}</h1>
          {!loading && (
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
                {post && <ShowMarkdown data={post.content} />}
              </div>
            </div>
            <div className="my-3 flex flex-[1] flex-wrap items-center justify-center text-center text-slate-200 sm:flex-col sm:justify-start">
              {post.tags?.map((tag) => {
                return (
                  <div
                    key={tag}
                    className="mx-[2px] my-[2px] rounded-xl bg-slate-600 px-[4px] py-[2px] sm:w-[80%] dark:text-slate-300"
                  >
                    {tag}
                  </div>
                );
              })}
            </div>
            <div>
              {post.media.length != 0 && <h2 className="text-2xl">Media</h2>}
              {post.media.length === 0 ? (
                ""
              ) : (
                <DisplayMedia mediaIds={post.media} />
              )}
            </div>
          </div>
        </div>
        <div>
          <div className="mx-auto my-5 h-[2px] w-[90%] bg-slate-600"></div>
          <h2 className="mb-3 mt-6 text-4xl sm:text-center">Discussions:-</h2>
          {post &&
            accounts &&
            discussions &&
            replies &&
            discussions.map((discussion) => {
              return (
                <div key={discussion.id}>
                  <Answer
                    key={discussion.id}
                    author={accounts.get(discussion.author)}
                    content={discussion.content}
                    replies={
                      replies &&
                      replies.filter((reply) =>
                        discussion.replies.includes(reply.id),
                      )
                    }
                    authors={accounts}
                  />
                  <div className="text-right lg:mr-10">
                    <GetMarkdownInput
                      role="minor"
                      minorId={discussion.id}
                      onUpload={postNewReply}
                      triggerMessage="Reply"
                      header="Replying to a discussion"
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
          />
        </div>
      </div>
    </div>
  );
}
