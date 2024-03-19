"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

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

  useEffect(() => {
    // direct loading to explore page
    if (to != "/explore") return;
    if (localStorage.getItem("logged-in") === "true") {
      router.replace("/explore");
    }
  }, [router, to]);

  // if local-storage does'nt contain logged-in somehow
  if (status === when) {
    router.replace(to);
  }

  return <div {...props}>{children}</div>;
};

export default SessionRedirect;
