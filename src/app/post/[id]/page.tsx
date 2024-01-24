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
import { Account } from "@/types/user";
import { useSession } from "next-auth/react";
import { notFound, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Pen } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import IndeterminateLoader from "@/components/IndeterminateLoader";

type Params = {
  params: { id: string };
};

export default function Page({ params }: Params) {
  const router = useRouter();
  const { data: session } = useSession();
  const [loadingExtraData, setLoadingExtraData] = useState<boolean>(true);

  // fetching data
  const id = params.id;
  const [accounts, setAccounts] = useState<Map<string, Account>>();
  const [post, setPost] = useState<Post | null>(null);
  const [discussions, setDiscussions] = useState<Array<Discussion> | null>(
    null,
  );
  const [replies, setReplies] = useState<Array<Reply> | null>(null);
  const loading = post === null;
  const [headings, setHeadings] = useState<string[]>([]);
  let author = post && accounts ? accounts.get(post.author) : null;
  useEffect(() => {
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
          notFound();
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
        setLoadingExtraData(false);
      } catch (e) {
        console.log(`Error: ${e}`);
      }
    }
    getData();
  }, [id, router]);

  useEffect(() => {
    async function fetchAuthorData() {
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

  // TODO
  function validUser(email: string | null | undefined): boolean {
    if (!email) {
      return false;
    }
    if (post?.author == email) {
      return true;
    } else {
      return false;
    }
  }

  // TODO
  async function handleChat() {
    if (!session || !session.user || !session.user.email) {
      return;
    }
    const email = session.user.email;
    // get friends
    const rawExistingFriends = await fetch("/api/getFriends", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(email),
    });
    const rawExistingFriendIds = (await rawExistingFriends.json()) as string[];
    let existingFriendEmails = rawExistingFriendIds
      .filter((elem) => elem.includes(email))
      .map((emailBelonging) =>
        emailBelonging
          .split(":")
          .filter((email) => email != email && email != "friend"),
      );
    const existingFriends: Account[] = [];

    const promises = existingFriendEmails.map((email) => {
      return fetch(`/api/getAccountByEmail/${email[0]}`)
        .then((rawData) => rawData.json())
        .then((data) => {
          existingFriends.push(data);
        })
        .catch((error) => console.log(`Error fetching friends data: ${error}`));
    });

    let friends: Array<Account> = [];
    Promise.all(promises)
      .then(() => {
        friends = existingFriends.filter((elem) => elem != null);
      })
      .catch((error) => console.log(`Error occurred: ${error}`));

    const friendsEmails = friends.map((friend) => friend.email);
    if (author == null) {
      return;
    }
    if (friendsEmails.includes(author.email)) {
      router.push(`/chat/${author.email}`);
    } else {
      // we need to create a new friend
      const rawFriendAccount = await fetch(
        `/api/getAccountByEmail/${author.email}`,
      );
      const friendAccount = (await rawFriendAccount.json()) as Account;
      await fetch("/api/addFriend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userEmail: email,
          friendEmail: friendAccount.email,
        }),
      });
      router.push(`/chat/${author.email}`);
    }
  }
  // menu for small screens
  const [openMenu, setOpenMenu] = useState<boolean>(false);

  return loading ? (
    <Skeleton />
  ) : (
    <div className="min-h-screen">
      <IndeterminateLoader loading={loadingExtraData} color="white" />
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
