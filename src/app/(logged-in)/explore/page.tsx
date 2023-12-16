"use client";

import PostPreview from "@/components/PostPreview";
import DoubtPreview from "@/components/DoubtPreview";
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
  const [doubts, setDoubts] = useState<Array<Doubt>>([]);
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
    async function fetchData() {
      const rawPosts = await fetch(`/api/doubts/all`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const doubts = (await rawPosts.json()) as Array<Doubt>;
      setDoubts(doubts);
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function getAuthors(posts: Array<Post>, doubts: Array<Doubt>) {
      if (posts.length == 0) {
        return;
      }
      const map: Map<string, string> = new Map();
      for (const post of posts.filter((post) => post.published)) {
        if (map.has(post.author)) continue;
        const rawAuthor = await fetch(`/api/accounts?email=${post.author}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "force-cache",
        });
        const author = (await rawAuthor.json()) as Account;

        setAuthors((authors) => {
          const new_authors = new Map(authors);
          new_authors?.set(post.author, author.name);
          return new_authors;
        });
      }
      for (const doubt of doubts) {
        if (map.has(doubt.author)) continue;
        const rawAuthor = await fetch(`/api/accounts?email=${doubt.author}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "force-cache",
        });
        const author = (await rawAuthor.json()) as Account;

        setAuthors((authors) => {
          const new_authors = new Map(authors);
          new_authors?.set(doubt.author, author.name);
          return new_authors;
        });
      }
    }
    getAuthors(posts, doubts);
  }, [posts, doubts]);

  if (status === "unauthenticated") {
    router.replace("/login");
  }

  return (
    <div className="flex flex-col gap-7">
      <div className="lg:flex lg:justify-center lg:gap-7">
        <div className="mb-7 flex flex-col gap-5 lg:mb-0 lg:gap-7">
          {posts.map((post) => {
            return (
              <PostPreview key={post.id} post={post} authorMap={authors} />
            );
          })}
        </div>

        <div className="flex flex-col gap-5 lg:gap-7">
          {doubts.map((doubt) => {
            return (
              <DoubtPreview key={doubt.id} doubt={doubt} authorMap={authors} />
            );
          })}
        </div>
      </div>

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
