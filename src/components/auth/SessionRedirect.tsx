"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import PageLoading from "../miscelleneous/PageLoading";

interface SessionRedirectProps {
  children: ReactNode;
  when: "authenticated" | "unauthenticated";
  notwhen?: "authenticated" | "unauthenticated";
  to: string;
}

const SessionRedirect = ({
  children,
  when,
  to,
  notwhen,
  ...props
}: SessionRedirectProps) => {
  const router = useRouter();

  const { status } = useSession();

  if (status === when) {
    router.replace(to);
  }

  return (
    <div {...props}>
      {status !== when && status != notwhen && <PageLoading />}

      {children}
    </div>
  );
};

export default SessionRedirect;
