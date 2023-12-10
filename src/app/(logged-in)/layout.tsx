import UserBar from "@/components/UserBar";
import { PropsWithChildren } from "react";

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div className="min-h-[91.8vh]">
      <UserBar />
      <div className="md:pl-20">{children}</div>
    </div>
  );
};

export default Layout;
