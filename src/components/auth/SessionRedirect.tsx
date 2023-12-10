"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import PageLoading from "../miscelleneous/PageLoading";

interface SessionRedirectProps {
  children: ReactNode;
  when: "authenticated" | "unauthenticated";
  to: string;
}

const SessionRedirect = ({
  children,
  when,
  to,
  ...props
}: SessionRedirectProps) => {
  const router = useRouter();

  const { status } = useSession();

  if (status === when) {
    router.replace(to);
  }

  return (
    <div {...props}>
      {(status === "loading" || status === "authenticated") && <PageLoading />}

      {children}
    </div>
  );
};

export default SessionRedirect;
