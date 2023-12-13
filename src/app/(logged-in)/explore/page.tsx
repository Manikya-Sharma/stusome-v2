"use client";

import PostPreview from "@/components/PostPreview";
import { Skeleton } from "@/components/ui/skeleton";
import { Post } from "@/types/post";
import { Account } from "@/types/user";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Page = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [posts, setPosts] = useState<Array<Post>>([]);
  const [authors, setAuthors] = useState<Map<string, string> | null>(null);
  const loading = posts.length === 0;

  useEffect(() => {
    async function fetchData() {
      const rawPosts = await fetch(`/api/posts/all`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const allPosts = (await rawPosts.json()) as Array<Post>;
      const posts = allPosts.filter((post) => post.published);
      setPosts(posts);
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function getAuthors(posts: Array<Post>) {
      if (posts.length == 0) {
        return;
      }
      const map: Map<string, string> = new Map();
      for (const post of posts.filter((post) => post.published)) {
        const rawAuthor = await fetch(`/api/accounts?email=${post.author}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const author = (await rawAuthor.json()) as Account;

        map.set(post.author, author.name);
      }

      setAuthors(map);
    }
    getAuthors(posts);
  }, [posts]);

  if (status === "unauthenticated") {
    router.replace("/login");
  }

  return (
    <div className="flex flex-col gap-3">
      {posts.map((post) => {
        return <PostPreview key={post.id} post={post} authorMap={authors} />;
      })}
      {loading && (
        <>
          <Skeleton className="mx-auto aspect-video w-[80%] max-w-prose" />
          <Skeleton className="mx-auto aspect-video w-[80%] max-w-prose" />
          <Skeleton className="mx-auto aspect-video w-[80%] max-w-prose" />
          <Skeleton className="mx-auto aspect-video w-[80%] max-w-prose" />
        </>
      )}
    </div>
  );
};

export default Page;
