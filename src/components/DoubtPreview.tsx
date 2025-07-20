"use client";

import { useRouter } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Doubt } from "@/types/doubt";
import { useGetAccount } from "./queries/accounts";

const DoubtPreview = ({ doubt }: { doubt: Doubt }) => {
  const router = useRouter();
  const { data: author } = useGetAccount({ email: doubt.author });
  return (
    <Card
      className="group mx-auto w-[80%] max-w-prose cursor-pointer transition-all hover:scale-105 hover:border-black/30 hover:bg-black/5 dark:border-white/30 md:w-full"
      onClick={() => router.push(`/doubt/${doubt.id}`)}
      aria-roledescription="link"
    >
      <CardHeader>
        <CardTitle className="text-center">
          <h2>{doubt.title}</h2>
        </CardTitle>
        <CardDescription>
          <ul className="mx-auto flex w-fit flex-wrap items-center justify-center gap-2">
            {doubt.tags.map((tag) => (
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
      <CardContent>{doubt.content.substring(0, 500)}</CardContent>
      <CardFooter className="flex items-center justify-end gap-1 pr-5 text-muted-foreground">
        <Badge variant={"secondary"}>Doubt</Badge>
        by {author?.name}
      </CardFooter>
    </Card>
  );
};

export default DoubtPreview;
