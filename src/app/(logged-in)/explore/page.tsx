"use client";

import PostPreview from "@/components/PostPreview";
import DoubtPreview from "@/components/DoubtPreview";

import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

import { Skeleton } from "@/components/ui/skeleton";
import type { Post } from "@/types/post";
import { useGetAllDoubts } from "@/components/queries/doubts";
import { useGetAllPosts } from "@/components/queries/posts";
import { Doubt } from "@/types/doubt";

function shuffle<T>(array: Array<T>) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
}

const Page = () => {
  const { data: doubts, isLoading: isLoadingDoubts } = useGetAllDoubts();
  const { data: posts, isLoading: isLoadingPosts } = useGetAllPosts();

  const isLoading = isLoadingPosts || isLoadingDoubts;

  const _results: Array<Post | Doubt> = [...(doubts ?? []), ...(posts ?? [])];
  const results = shuffle(_results);

  return (
    <div className="mx-auto max-w-6xl">
      <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2 }}>
        <Masonry gutter="16px">
          {results.map((res) => {
            if (Object.hasOwn(res, "coverImgFull")) {
              return <PostPreview key={res.id} post={res as Post} />;
            } else {
              return <DoubtPreview key={res.id} doubt={res as Doubt} />;
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
