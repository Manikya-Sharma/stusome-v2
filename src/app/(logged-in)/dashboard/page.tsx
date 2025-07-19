"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { v4 as uuid } from "uuid";
import toast from "react-hot-toast";
import { Post } from "@/types/post";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import IndeterminateLoader from "@/components/IndeterminateLoader";
import { useGetAccount, usePutAccount } from "@/components/queries/account";
import { useGetDoubts } from "@/components/queries/doubts";

const Page = () => {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState<boolean>(true);

  const { data: account } = useGetAccount({ email: session?.user?.email });
  const { mutate: updateAccount } = usePutAccount({
    email: session?.user?.email,
  });

  const router = useRouter();

  if (status === "unauthenticated") {
    router.replace("/login?from=/dashboard");
  }

  const [posts, setPosts] = useState<Array<Post>>([]);
  const doubtIds = account?.doubts;
  const fetchedDoubts = useGetDoubts({ ids: doubtIds ?? [] });
  const doubts = fetchedDoubts.map((doubt) => doubt.data);

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

    async function getData() {
      await Promise.all([getPosts()]);
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
        media: [],
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
        updateAccount({ field: "posts", newAccount: { posts: new_posts } });
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

              <div className="mb-5 mt-3 max-h-[45vh] overflow-y-auto overflow-x-hidden rounded-lg border-2 border-slate-300 px-3 pt-2 dark:border-slate-800 lg:flex lg:max-h-full lg:justify-start lg:overflow-x-auto">
                {posts &&
                  posts.map((post) => {
                    return (
                      <div
                        key={post.id}
                        className="relative my-5 cursor-pointer overflow-hidden rounded-lg bg-slate-200 p-4 py-5 transition-transform hover:scale-105 dark:bg-slate-800 lg:mx-3 lg:min-w-[20%] lg:max-w-[40%] lg:flex-1"
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

              <div className="mb-5 mt-3 max-h-[45vh] overflow-y-auto overflow-x-hidden rounded-lg border-2 border-slate-300 px-3 pt-2 dark:border-slate-800 lg:flex lg:max-h-full lg:justify-start lg:overflow-x-auto">
                {doubts &&
                  doubts.map((doubt) => {
                    return (
                      <div
                        key={doubt?.id}
                        className="my-5 cursor-pointer overflow-hidden rounded-lg bg-slate-200 p-4 py-5 transition-transform hover:scale-105 dark:bg-slate-800 lg:mx-3 lg:min-w-[20%] lg:max-w-[40%] lg:flex-1"
                        onClick={() => router.push(`/doubt/${doubt?.id}`)}
                      >
                        <h3 className="mb-2 text-xl font-semibold">
                          {doubt?.title}
                        </h3>
                        <p>{doubt?.content.slice(0, 150)} ...</p>
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
