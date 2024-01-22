"use client";

import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { z } from "zod";
import { postSchema } from "@/types/schemas";
import Editor from "@/components/Editor";
import { useEffect, useState } from "react";
import { Post } from "@/types/post";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import IndeterminateLoader from "@/components/IndeterminateLoader";

type formType = z.infer<typeof postSchema>;

type Params = {
  params: {
    id: string;
  };
};

const App = ({ params }: Params) => {
  const [loading, setLoading] = useState<boolean>(true);
  const id = params.id;
  const { data: session } = useSession();
  const router = useRouter();

  const [formState, setFormState] = useState<formType>({
    content: "",
    title: "",
    coverImgFull: "",
    tags: [],
  });

  // fetch data
  useEffect(() => {
    async function fetchData() {
      try {
        const rawPost = await fetch(`/api/posts?id=${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const post = (await rawPost.json()) as Post;
        if (post == null) {
          throw new Error("Post not found");
        }
        if (post.author !== session?.user?.email) {
          throw new Error("Unauthorized Access");
        }
        setFormState({
          content: post.content,
          title: post.title,
          coverImgFull: post.coverImgFull,
          tags: post.tags,
        });
      } catch (e) {
        console.log("An error ocurred in loading data:", e);
        throw e;
      } finally {
        setLoading(false);
      }
    }
    if (session?.user?.email && id) {
      fetchData().catch((e) => {
        // this situation cannot occur unless user is forcibly going to this url
        toast.error(`${e}`);
        router.back();
      });
    }
  }, [id, session?.user?.email, router]);

  function changeContent(newContent: string) {
    formState.content = newContent;
  }
  function changeTitle(newTitle: string) {
    formState.title = newTitle;
  }
  function changeCoverImg(newImage: string) {
    formState.coverImgFull = newImage;
  }
  function changeTags(newTags: Array<string>) {
    formState.tags = newTags;
  }

  return (
    <div>
      <IndeterminateLoader loading={loading} />
      <Editor
        state={formState}
        changeContent={changeContent}
        changeTitle={changeTitle}
        changeCoverImg={changeCoverImg}
        changeTags={changeTags}
      />
      <Button
        className="mx-auto my-10 block text-2xl"
        size="lg"
        type="submit"
        onClick={() => {
          console.log(formState);
        }}
      >
        Post
      </Button>
    </div>
  );
};

export default App;
