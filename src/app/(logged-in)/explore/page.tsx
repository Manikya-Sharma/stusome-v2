"use client";

import PostPreview from "@/components/PostPreview";
import DoubtPreview from "@/components/DoubtPreview";

import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

import { Skeleton } from "@/components/ui/skeleton";
import { Post } from "@/types/post";
import { useCallback, useEffect, useState } from "react";
import { useGetAccounts } from "@/components/queries/accounts";
import { uniq as _uniq } from "lodash";
import { useGetAllDoubts } from "@/components/queries/doubts";
import { useGetAllPosts } from "@/components/queries/posts";

const Page = () => {
  const [authors, setAuthors] = useState<Map<
    string,
    string | undefined
  > | null>(null);
  const { data: doubts, isLoading: isLoadingDoubts } = useGetAllDoubts();
  const { data: posts, isLoading: isLoadingPosts } = useGetAllPosts();

  const isLoading = isLoadingPosts || isLoadingDoubts;

  const results: Array<Post | Doubt> = [];

  const shuffle = useCallback(() => {
    if (!doubts || !posts) return;
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
  }, [doubts, posts]);

  shuffle();

  const map: Map<string, string> = new Map();
  const emails = _uniq([
    ...(posts ?? [])
      .filter((post) => post.published && !map.has(post.author))
      .map((post) => post.author),
    ...(doubts ?? [])
      .filter((doubt) => !map.has(doubt.author))
      .map((doubt) => doubt.author),
  ]);
  const _authors = useGetAccounts({
    emails,
  });

  useEffect(() => {
    setAuthors((authors) => {
      const new_authors = new Map(authors);
      emails.forEach((email, index) =>
        new_authors.set(email, _authors[index].data?.name),
      );
      return new_authors;
    });
  }, []);

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
                <PostPreview
                  key={res.id}
                  post={res as Post}
                  authorMap={authors}
                />
              );
            } else {
              return (
                <DoubtPreview
                  key={res.id}
                  doubt={res as Doubt}
                  authorMap={authors}
                />
              );
            }
          })}
        </Masonry>
      </ResponsiveMasonry>

      {isLoading && (
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
