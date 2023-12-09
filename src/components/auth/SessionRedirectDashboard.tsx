"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { PropsWithChildren } from "react";
import PageLoading from "../miscelleneous/PageLoading";

const SessionRedirectDashboard = ({
  children,
  ...props
}: PropsWithChildren) => {
  const router = useRouter();

  const { status } = useSession();

  if (status === "authenticated") {
    router.replace("/dashboard");
  }

  return (
    <div {...props}>
      {(status === "loading" || status === "authenticated") && <PageLoading />}

      {children}
    </div>
  );
};

export default SessionRedirectDashboard;
