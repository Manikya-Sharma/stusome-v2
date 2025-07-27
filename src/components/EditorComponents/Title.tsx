import { useRef } from "react";
import { Input } from "../ui/input";

const Title = ({
  changeTitle,
  title,
}: {
  changeTitle: (newTitle: string) => void;
  title: string;
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  return (
    <div>
      <Input
        ref={inputRef}
        className="mx-auto max-w-80 text-3xl placeholder:transition-all placeholder:duration-1000 focus:placeholder:text-blue-400 focus:placeholder:opacity-0 sm:h-20 sm:text-5xl md:max-w-[80%]"
        placeholder="Title"
        onChange={(e) => {
          changeTitle(e.currentTarget.value);
        }}
        value={title}
        required
      />
    </div>
  );
};

export default Title;
