import { useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";

const Title = ({
  changeTitle,
  init,
}: {
  changeTitle: Function;
  init: string;
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = init;
    }
  }, [init]);
  return (
    <div>
      <Input
        ref={inputRef}
        className="mx-auto max-w-80 text-3xl placeholder:transition-all placeholder:duration-1000 focus:placeholder:text-blue-400 focus:placeholder:opacity-0 sm:h-20 sm:text-5xl md:max-w-[80%]"
        placeholder="Title"
        onChange={(e) => {
          changeTitle(e.currentTarget.value);
        }}
        required
      />
    </div>
  );
};

export default Title;
