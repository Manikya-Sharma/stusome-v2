import { Input } from "../ui/input";

const Title = () => {
  return (
    <div>
      <Input
        className="mx-auto max-w-80 text-3xl placeholder:transition-all placeholder:duration-1000 focus:placeholder:text-blue-400 focus:placeholder:opacity-0 sm:h-20 sm:text-5xl md:max-w-[80%]"
        placeholder="Title"
        required
      />
    </div>
  );
};

export default Title;
