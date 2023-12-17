"use client";

import Image from "next/image";
import ShowMarkdown from "@/components/ShowMarkdown";

import { useState, useEffect } from "react";
import { Cross as Hamburger } from "hamburger-react";

import { v4 as uuid } from "uuid";

import { useSession } from "next-auth/react";
import { notFound, useRouter } from "next/navigation";
import { LogIn, Reply as LuReply } from "lucide-react";
import Headings from "@/components/Posts/Headings";
import { Account } from "@/types/user";
import { Discussion, Post, Reply } from "@/types/post";
import { Skeleton } from "@/components/ui/skeleton";
import Answer from "@/components/Doubts/Answer";

type Params = {
  params: { id: string };
};

export default function Page({ params }: Params) {
  const router = useRouter();
  const { data: session } = useSession();

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
  const [author, setAuthor] = useState<Account | null>(null);
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
          return notFound();
        }
        // TODO
        /* if (post.published == false) {
          router.replace(`/posts/${id}/edit`);
        } */
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
  const [takeNewMarkdownInput, setTakeNewMarkdownInput] = useState(false);
  const [inputValueStatus, setInputValueStatus] = useState<
    string | { discussion: string; reply: string }
  >("");

  function handleInput(type: "discussion" | "reply", replyId?: string) {
    if (type == "discussion") {
      setTakeNewMarkdownInput(true);
      setInputValueStatus(id);
    } else if (type == "reply" && replyId != null) {
      setTakeNewMarkdownInput(true);
      setInputValueStatus({ discussion: id, reply: replyId });
    }
  }

  function submitData(inputValue: string) {
    if (!session || !session.user || !session.user.email) {
      return;
    }
    // new discussion
    // TODO
    async function uploadDiscussionData(newDiscussion: Discussion) {
      await fetch(`/api/posts/newDiscussion/${inputValueStatus}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newDiscussion),
      });
    }

    // TODO - better form handling needed
    async function uploadReplyData(newReply: Reply) {
      if (typeof inputValueStatus == "string") {
        return;
      }
      await fetch(`/api/posts/newReply/${inputValueStatus.reply}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newReply),
      });
    }

    if (typeof inputValueStatus == "string") {
      const newId = uuid();
      const newDiscussion: Discussion = {
        author: session.user.email,
        content: inputValue,
        id: newId,
        replies: [],
      };
      // toast.promise(uploadDiscussionData(newDiscussion), {
      //   loading: "Uploading the discussion",
      //   success: "Posted",
      //   error: "Could not post your discussion",
      // });
    }
    // new reply
    else {
      const newId = uuid();
      const newReply: Reply = {
        author: session.user.email,
        content: inputValue,
        id: newId,
      };
      // toast.promise(uploadReplyData(newReply), {
      //   loading: "Uploading the reply",
      //   success: "Posted",
      //   error: "Could not post your reply",
      // });
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
      <div className="scroll-smooth p-4 transition-colors duration-200">
        <nav className="fixed left-0 top-0 z-[100] flex h-fit max-h-[50px] w-fit items-center justify-start md:hidden">
          <div className="py-1 pl-3">
            <Hamburger
              toggled={openMenu}
              onToggle={() => setOpenMenu(!openMenu)}
              size={18}
            />
          </div>
        </nav>

        {/* Title */}
        <div className="relative mb-5 mt-10 dark:z-10 md:mt-0">
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
                    className="mx-[2px] my-[2px] rounded-xl bg-slate-600 px-[4px] py-[2px] dark:text-slate-300 sm:w-[80%]"
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
                <>
                  <Answer
                    key={discussion.id}
                    author={accounts.get(discussion.author)}
                    content={discussion.content}
                    replies={replies.filter((reply) =>
                      discussion.replies.includes(reply.id),
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
                    <LuReply />
                    Reply
                  </button>
                </>
              );
            })}
          {/*
          {postData && (
            <Discussions
              discussionIds={postData.discussions}
              discussionHandler={handleInput}
            />
          )}

          {takeNewMarkdownInput ? (
            <Markdown
              rows={10}
              cols={30}
              uploadMarkdown={submitData}
              discussionHandler={setTakeNewMarkdownInput}
            />
          ) : null} */}
        </div>
      </div>
    </div>
  );
}