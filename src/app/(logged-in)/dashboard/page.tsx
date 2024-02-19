"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { v4 as uuid } from "uuid";
import toast from "react-hot-toast";
import { Post } from "@/types/post";
import { useEffect, useState } from "react";
import { Account } from "@/types/user";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import IndeterminateLoader from "@/components/IndeterminateLoader";

const Page = () => {
  const { data: session, status } = useSession();
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const router = useRouter();

  if (status === "unauthenticated") {
    router.replace("/login?from=/dashboard");
  }

  const [posts, setPosts] = useState<Array<Post>>([]);
  const [doubts, setDoubts] = useState<Array<Doubt>>([]);

  useEffect(() => {
    if (!session?.user?.email) return;
    async function getData() {
      const rawAccount = await fetch(
        `/api/accounts?email=${session?.user?.email}`,
      );
      const account = (await rawAccount.json()) as Account;
      setAccount(account);
    }
    getData();
  }, [session?.user?.email]);

  useEffect(() => {
    if (account == null) return;
    async function getPosts() {
      if (!account) return;
      const postIds = account.posts;
      const requests = postIds.map((id) => {
        return fetch(`/api/posts?id=${id}`, { cache: "no-cache" });
      });
      const responses = await Promise.all(requests);
      const parsedResponses = (await Promise.all(
        responses.map((response) => response.json()),
      )) as Post[];
      setPosts(parsedResponses.filter((post) => post != null));
    }
    async function getDoubts() {
      if (!account) return;
      const doubtIds = account.doubts;
      const requests = doubtIds.map((id) => {
        return fetch(`/api/doubts?id=${id}`, { cache: "no-cache" });
      });
      const responses = await Promise.all(requests);
      const parsedResponses = (await Promise.all(
        responses.map((response) => response.json()),
      )) as Doubt[];
      setDoubts(parsedResponses.filter((post) => post != null));
    }
    async function getData() {
      await Promise.all([getPosts(), getDoubts()]);
      setLoading(false);
    }
    getData();
  }, [account]);

  async function newPost() {
    if (session && session.user && session.user.email && account) {
      const newId = uuid();
      const post: Post = {
        author: session.user.email,
        content: "",
        coverImgFull: "",
        discussions: [],
        id: newId,
        published: false,
        tags: [],
        title: "",
      };
      try {
        await fetch("/api/posts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(post),
        });

        const oldPosts = account.posts;
        const new_posts = [...oldPosts, newId];
        await fetch(`/api/accounts?email=${account.email}&field=posts`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ posts: new_posts }),
        });
        router.push(`/post/${newId}/edit`);
      } catch (e) {
        console.log(`An error occurred: ${e}`);
      }
    }
  }

  return (
    <main>
      {loading && <IndeterminateLoader loading={loading} />}
      <div>
        <div className="container mx-auto p-4">
          {posts.length !== 0 && (
            <section>
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold dark:text-slate-200">
                  Posts
                </h2>
                <Button
                  className="text-lg"
                  onClick={() => {
                    toast.promise(newPost(), {
                      loading: "Creating new post",
                      error: "Error occurred, Please try again later",
                      success:
                        "Created post successfully, please wait while we redirect",
                    });
                  }}
                >
                  Create New Post
                </Button>
              </div>

              <div className="mb-5 mt-3 max-h-[45vh] overflow-y-auto overflow-x-hidden rounded-lg border-2 border-slate-300 px-3 pt-2 lg:flex lg:max-h-full lg:justify-start lg:overflow-x-auto dark:border-slate-800">
                {posts &&
                  posts.map((post) => {
                    return (
                      <div
                        key={post.id}
                        className="relative my-5 cursor-pointer overflow-hidden rounded-lg bg-slate-200 p-4 py-5 transition-transform hover:scale-105 lg:mx-3 lg:min-w-[20%] lg:max-w-[40%] lg:flex-1 dark:bg-slate-800"
                        onClick={() => router.push(`/post/${post.id}`)}
                      >
                        {post.published == false && (
                          <Badge
                            variant={"secondary"}
                            className="absolute right-5 top-2"
                          >
                            Draft
                          </Badge>
                        )}
                        <h3 className="mb-2 text-xl font-semibold">
                          {post.title}
                        </h3>
                        <p>{post.content.slice(0, 150)} ...</p>
                      </div>
                    );
                  })}
              </div>
            </section>
          )}

          {doubts.length !== 0 && (
            <section>
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold dark:text-slate-200">
                  Doubts
                </h2>
                <Button
                  className="text-lg"
                  onClick={() => {
                    router.push("/doubt/new");
                  }}
                >
                  Create New Doubt
                </Button>
              </div>

              <div className="mb-5 mt-3 max-h-[45vh] overflow-y-auto overflow-x-hidden rounded-lg border-2 border-slate-300 px-3 pt-2 lg:flex lg:max-h-full lg:justify-start lg:overflow-x-auto dark:border-slate-800">
                {doubts &&
                  doubts.map((doubt) => {
                    return (
                      <div
                        key={doubt.id}
                        className="my-5 cursor-pointer overflow-hidden rounded-lg bg-slate-200 p-4 py-5 transition-transform hover:scale-105 lg:mx-3 lg:min-w-[20%] lg:max-w-[40%] lg:flex-1 dark:bg-slate-800"
                        onClick={() => router.push(`/doubt/${doubt.id}`)}
                      >
                        <h3 className="mb-2 text-xl font-semibold">
                          {doubt.title}
                        </h3>
                        <p>{doubt.content.slice(0, 150)} ...</p>
                      </div>
                    );
                  })}
              </div>
            </section>
          )}
        </div>
      </div>
    </main>
  );
};

export default Page;
