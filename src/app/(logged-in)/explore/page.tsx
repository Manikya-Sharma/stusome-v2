"use client";

import PostPreview from "@/components/PostPreview";
import DoubtPreview from "@/components/DoubtPreview";

import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

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

  const results: Array<Post | Doubt> = [];

  // shuffle results
  for (let i = 0; i < Math.max(posts.length, doubts.length); i += 1) {
    if (i % 3 == 0) {
      if (i < doubts.length) {
        results.push(doubts[i]);
      }
      if (i < posts.length) {
        results.push(posts[i]);
      }
    } else {
      if (i < posts.length) {
        results.push(posts[i]);
      }
      if (i < doubts.length) {
        results.push(doubts[i]);
      }
    }
  }

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

  // if (status === "unauthenticated") {
  //   router.replace("/login");
  // }

  return (
    <div className="mx-auto max-w-6xl">
      <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2 }}>
        <Masonry gutter="16px">
          {results.map((res) => {
            if (Object.hasOwn(res, "coverImgFull")) {
              return (
                //@ts-ignore
                <PostPreview key={res.id} post={res} authorMap={authors} />
              );
            } else {
              return (
                //@ts-ignore
                <DoubtPreview key={res.id} doubt={res} authorMap={authors} />
              );
            }
          })}
        </Masonry>
      </ResponsiveMasonry>

      {loading && (
        <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2 }}>
          <Masonry gutter="10px">
            <Skeleton className="mx-auto h-60 w-[80%] max-w-prose" />
            <Skeleton className="mx-auto aspect-video w-[80%] max-w-prose" />
            <Skeleton className="mx-auto aspect-video w-[80%] max-w-prose" />
            <Skeleton className="mx-auto aspect-video w-[80%] max-w-prose" />
            <Skeleton className="mx-auto h-60 w-[80%] max-w-prose" />
            <Skeleton className="mx-auto h-60 w-[80%] max-w-prose" />
            <Skeleton className="mx-auto aspect-video w-[80%] max-w-prose" />
            <Skeleton className="mx-auto aspect-video w-[80%] max-w-prose" />
          </Masonry>
        </ResponsiveMasonry>
      )}
    </div>
  );
};

export default Page;
