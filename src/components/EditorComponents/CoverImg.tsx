import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Image } from "lucide-react";
import { useEffect, useRef } from "react";

const CoverImg = ({ init }: { init: string }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = init;
    }
  }, [init]);
  return (
    <div className="mx-auto flex w-[80%] max-w-prose items-center justify-center gap-2 lg:mx-32">
      <Input ref={inputRef} placeholder="url for cover image (optional)" />
      <Button className="block">
        {/* This image is not next/image and it already accessible */}
        {/*eslint-disable-next-line */}
        <Image />
      </Button>
    </div>
  );
};

export default CoverImg;
