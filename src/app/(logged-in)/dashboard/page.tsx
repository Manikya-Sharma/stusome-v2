"use client";

import IndeterminateLoader from "@/components/IndeterminateLoader";
import { useGetAccount, usePutAccount } from "@/components/queries/accounts";
import { useGetDoubts } from "@/components/queries/doubts";
import { useGetPosts, usePostPost } from "@/components/queries/posts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Post } from "@/types/post";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { v4 as uuid } from "uuid";

const Page = () => {
  const { data: session, status } = useSession();

  const router = useRouter();
  if (status === "unauthenticated") {
    router.replace("/login?from=/dashboard");
  }

  const { data: account, isLoading: isLoadingAccount } = useGetAccount({
    email: session?.user?.email,
  });
  const { mutate: updateAccount, isPending: isUpdatingAccount } = usePutAccount(
    {
      email: session?.user?.email,
      onError: () => toast.error("Post could not be linked to your account"),
    },
  );

  const postIds = account?.posts;
  const fetchedPosts = useGetPosts({ ids: postIds ?? [] });
  const posts = fetchedPosts.map((post) => post.data);
  const isLoadingPosts = fetchedPosts.some((post) => post.isLoading);

  const doubtIds = account?.doubts;
  const fetchedDoubts = useGetDoubts({ ids: doubtIds ?? [] });
  const doubts = fetchedDoubts.map((doubt) => doubt.data);
  const isLoadingDoubts = fetchedDoubts.some((doubt) => doubt.isLoading);

  const { mutate: createNewPost, isPending: isCreatingNewPost } = usePostPost({
    onError: () =>
      toast.error("Unable to create new post, please try again later"),
    onSuccess: () => {
      toast.success("New post created successfully");
      router.push("/dashboard");
    },
  });

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
      createNewPost(post);
      const oldPosts = account.posts;
      const new_posts = [...oldPosts, newId];
      updateAccount({ field: "posts", newAccount: { posts: new_posts } });
    }
  }

  const isLoading = isLoadingAccount || isLoadingDoubts || isLoadingPosts;

  return (
    <main>
      {isLoading && <IndeterminateLoader loading={isLoading} />}
      <div>
        <div className="container mx-auto p-4">
          {!isLoadingPosts && (
            <section>
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold dark:text-slate-200">
                  Posts
                </h2>
                <Button
                  className="text-lg"
                  onClick={() => newPost()}
                  disabled={isCreatingNewPost || isUpdatingAccount}
                >
                  Create New Post
                </Button>
              </div>

              <div className="mb-5 mt-3 max-h-[45vh] overflow-y-auto overflow-x-hidden rounded-lg border-2 border-slate-300 px-3 pt-2 dark:border-slate-800 lg:flex lg:max-h-full lg:justify-start lg:overflow-x-auto">
                {posts.map((post) => {
                  return (
                    <div
                      key={post?.id}
                      className="relative my-5 cursor-pointer overflow-hidden rounded-lg bg-slate-200 p-4 py-5 transition-transform hover:scale-105 dark:bg-slate-800 lg:mx-3 lg:min-w-[20%] lg:max-w-[40%] lg:flex-1"
                      onClick={() => router.push(`/post/${post?.id}`)}
                    >
                      {post?.published == false && (
                        <Badge
                          variant={"secondary"}
                          className="absolute right-5 top-2"
                        >
                          Draft
                        </Badge>
                      )}
                      <h3 className="mb-2 text-xl font-semibold">
                        {post?.title}
                      </h3>
                      <p>{post?.content.slice(0, 150)} ...</p>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {!isLoadingDoubts && (
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
                  disabled={isUpdatingAccount}
                >
                  Create New Doubt
                </Button>
              </div>

              <div className="mb-5 mt-3 max-h-[45vh] overflow-y-auto overflow-x-hidden rounded-lg border-2 border-slate-300 px-3 pt-2 dark:border-slate-800 lg:flex lg:max-h-full lg:justify-start lg:overflow-x-auto">
                {doubts.map((doubt) => {
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
