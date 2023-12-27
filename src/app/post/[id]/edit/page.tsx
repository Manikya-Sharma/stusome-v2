"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { z } from "zod";
import { postSchema } from "@/types/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import Editor from "@/components/Editor";

type formType = z.infer<typeof postSchema>;

const App = () => {
  const { register, handleSubmit } = useForm<formType>({
    resolver: zodResolver(postSchema),
  });
  const onFormSubmit = (data: any) => console.log(data);

  const onErrors = (errors: any) => {
    if (errors.content) {
      toast.error(errors.content.message);
    }
    if (errors.title) {
      toast.error(errors.title.message);
    }
    if (errors.tags) {
      toast.error(errors.tags.message);
    }
    if (errors.coverImgFull) {
      toast.error(errors.coverImgFull.message);
    }
  };
  return (
    <div>
      <Editor />
      <Button className="mx-auto my-10 block text-2xl" size="lg">
        Post
      </Button>
    </div>
  );
};

export default App;
