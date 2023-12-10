"use client";

import Image from "next/image";
import { Progress } from "../ui/progress";
import { useEffect, useState } from "react";

interface PageLoadingProps {
  toName?: string;
}

const PageLoading = ({ toName }: PageLoadingProps) => {
  let [value, setValue] = useState<number>(0);
  useEffect(() => {
    function incrementTime() {
      setValue((val) => val + (100 - val) / 60);
    }
    const timer = setTimeout(incrementTime, 30);
    return () => clearTimeout(timer);
  }, [value]);
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-inherit">
      <Image
        src={"/rocket-tx.png"}
        width={150}
        height={150}
        alt="waiting"
        className="animate-pulse"
      />
      <div className="mt-5">
        {toName ? `Next Stop - ${toName}` : "Gear-up, we are ready to launch!"}
      </div>
      <Progress value={value} className="mt-10 h-1 w-[80%] max-w-prose" />
    </div>
  );
};

export default PageLoading;
