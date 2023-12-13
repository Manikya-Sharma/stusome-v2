"use client";

import Image from "next/image";

import Discussions from "@/components/Posts/Discussions";
import ShowMarkdown from "@/components/ShowMarkdown";

import { useState, useEffect } from "react";
import { Turn as Hamburger } from "hamburger-react";

import { v4 as uuid } from "uuid";

import { useSession } from "next-auth/react";
import { notFound, useRouter } from "next/navigation";
import { LogIn } from "lucide-react";
import Headings from "@/components/Posts/Headings";
import { Account } from "@/types/user";
import { Discussion, Post, Reply } from "@/types/post";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

type Params = {
  params: { id: string };
};

export default function Page({ params }: Params) {
  const router = useRouter();
  const { data: session } = useSession();

  // fetching data
  const id = params.id;
  const [post, setPost] = useState<Post | null>(null);
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

        // get author info
        const rawAuthorInfo = await fetch(
          `/api/accounts/?email=${post.author}`,
        );
        const authorInfo = (await rawAuthorInfo.json()) as Account;
        setAuthor(authorInfo);
      } catch (e) {
        console.log(`Error: ${e}`);
      }
    }
    getData();
  }, [id, router]);

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
    <div className="dark:bg-slate-900 dark:text-slate-100">
      <div className="font-fancy scroll-smooth p-4 transition-colors duration-200">
        <nav className="fixed left-0 top-0 z-[100] flex h-fit max-h-[50px] w-[100vw] items-center justify-start overflow-hidden bg-[rgba(50,50,50,0.1)] backdrop-blur-md md:hidden">
          <div className="py-1 pl-3">
            <Hamburger
              toggled={openMenu}
              onToggle={() => setOpenMenu(!openMenu)}
              size={20}
            />
          </div>
        </nav>

        {session && session.user && session.user.email ? (
          validUser(session.user.email) ? (
            <div className="fixed right-20 top-1 z-[150] w-fit cursor-pointer rounded-3xl bg-slate-100 px-3 py-2 transition-all duration-200 hover:bg-slate-400 hover:text-slate-100 dark:bg-slate-400 dark:hover:bg-slate-100 dark:hover:text-slate-800 sm:absolute">
              <Link
                href={`/posts/${post?.id}/edit`}
                className="flex w-fit items-center justify-center gap-2"
              >
                <p>Edit</p>
              </Link>
            </div>
          ) : (
            <div className="fixed right-20 top-1 z-[150] w-fit cursor-pointer rounded-3xl bg-slate-100 px-3 py-2 transition-all duration-200 hover:bg-slate-400 hover:text-slate-100 dark:bg-slate-400 dark:hover:bg-slate-100 dark:hover:text-slate-800 sm:absolute">
              <button
                onClick={() => {
                  /* toast.promise(handleChat(), {
                    loading: "Please wait while we redirect",
                    error: "Could not start chat, please try again later",
                    success: "redirecting...",
                  }); */
                }}
                className="flex w-fit items-center justify-center gap-2"
              >
                <p>Chat</p>
              </button>
            </div>
          )
        ) : (
          <div className="fixed right-20 top-1 z-[150] w-fit cursor-pointer rounded-3xl bg-slate-100 px-3 py-2 transition-all duration-200 hover:bg-slate-400 dark:bg-slate-400 dark:hover:bg-slate-100 sm:absolute">
            <Link href="/login">{/* <LuLogIn /> */}</Link>
          </div>
        )}

        <div
          className="fixed right-2 top-1 z-[200] w-fit cursor-pointer rounded-3xl bg-slate-100 px-3 py-2 dark:bg-slate-400 sm:absolute"
          onClick={(e) => {
            e.stopPropagation();
            // handleTheme(theme == "dark" ? "light" : "dark");
          }}
        >
          <div>
            {/* <DarkModeSwitch
              checked={theme == "dark"}
              onChange={() => handleTheme(theme == "dark" ? "light" : "dark")}
              size={25} */}
            {/* /> */}
          </div>
        </div>
        {/* Title */}
        <div className="relative mb-5 mt-10 dark:z-10 md:mt-0">
          <h1 className="text-center text-5xl">{post?.title}</h1>
          {!loading && (
            <cite className="mt-3 block text-center text-lg text-slate-400">
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
