"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const Page = () => {
  const { data: session, status } = useSession();

  const router = useRouter();

  if (status === "unauthenticated") {
    router.replace("/login");
  }

  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="mx-auto h-80 w-80" />
      <Skeleton className="mx-auto h-80 w-80" />
      <Skeleton className="mx-auto h-80 w-80" />
      <Skeleton className="mx-auto h-80 w-80" />
      <Skeleton className="mx-auto h-80 w-80" />
    </div>
  );
};

export default Page;
