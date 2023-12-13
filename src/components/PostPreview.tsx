"use client";

import { Post } from "@/types/post";
import { useRouter } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import Image from "next/image";

const PostPreview = ({
  post,
  authorMap,
}: {
  post: Post;
  authorMap: Map<string, string> | null;
}) => {
  const router = useRouter();
  return (
    <Card
      className="group mx-auto w-[80%] max-w-prose cursor-pointer transition-all hover:scale-105 hover:border-black/30 hover:bg-black/5 dark:border-white/30"
      onClick={() => router.push(`/post/${post.id}`)}
      aria-roledescription="link"
    >
      <CardHeader>
        <CardTitle className="text-center">{post.title}</CardTitle>
        <CardDescription>
          <ul className="mx-auto flex w-fit flex-wrap items-center justify-center gap-2">
            {post.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-lg bg-muted px-2 py-1 text-muted-foreground group-hover:bg-white group-hover:text-black/80 dark:group-hover:bg-black dark:group-hover:text-white/80"
              >
                {tag}
              </li>
            ))}
          </ul>
        </CardDescription>
      </CardHeader>
      <CardContent>
        {post.coverImgFull !== "" ? (
          <div className="relative mx-auto aspect-video max-w-prose">
            <Image src={post.coverImgFull} fill alt="" className="rounded-md" />
          </div>
        ) : (
          `A popular post with ${post.discussions.length} ` +
          (post.discussions.length === 1 ? "discussion" : "discussions")
        )}
      </CardContent>
      <CardFooter className="ml-auto w-fit pr-5 text-muted-foreground">
        {authorMap !== null && `by ${authorMap.get(post.author)}`}
      </CardFooter>
    </Card>
  );
};

export default PostPreview;
