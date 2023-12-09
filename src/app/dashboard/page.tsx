"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const Page = () => {
  const { data: session, status } = useSession();

  const router = useRouter();

  if (status === "unauthenticated") {
    router.replace("/login");
  }

  return <div>Hello {session?.user?.name}</div>;
};

export default Page;
