"use client";

import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { z } from "zod";
import { postSchema } from "@/types/schemas";
import Editor from "@/components/Editor";
import { use, useEffect, useState } from "react";
import { Post } from "@/types/post";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import IndeterminateLoader from "@/components/IndeterminateLoader";
import Media from "@/components/Media";
import DisplayMedia from "@/components/DisplayMedia";

type formType = z.infer<typeof postSchema>;

type Params = {
  params: Promise<{
    id: string;
  }>;
};

const App = ({ params }: Params) => {
  const [loading, setLoading] = useState<boolean>(true);
  const { id } = use(params);
  const { data: session } = useSession();
  const router = useRouter();

  const [formState, setFormState] = useState<formType>({
    content: "",
    title: "",
    coverImgFull: "",
    tags: [],
    media: [],
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
          media: post.media,
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
  function changeMedia(newMedia: string) {
    formState.media.push(newMedia);
  }

  function validate() {
    if (formState.title.trim().length === 0) {
      toast.error("Missing title");
      return false;
    }
    if (formState.content.trim().length === 0) {
      toast.error("Missing content");
      return false;
    }
    if (formState.coverImgFull?.trim().length === 0) {
      toast("Note: you have not provided any cover image");
    }
    return true;
  }

  async function post() {
    if (!validate() || !session?.user?.email) {
      return;
    }

    const newPost: Post = {
      ...formState,
      author: session.user.email,
      discussions: [],
      published: true,
      id,
    };

    await fetch(`/api/posts?id=${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPost),
    });
  }

  async function draft() {
    if (!validate() || !session?.user?.email) {
      return;
    }

    const newPost: Post = {
      ...formState,
      author: session.user.email,
      discussions: [],
      published: false,
      id,
    };

    await fetch(`/api/posts?id=${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPost),
    });
  }
  async function del() {
    if (!session?.user?.email) {
      return;
    }

    await fetch(`/api/posts?id=${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
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
      <Media changeMedia={changeMedia} />
      <DisplayMedia mediaIds={formState.media} />
      <div className="flex items-center justify-center gap-4">
        <Button
          className="my-10 block text-2xl"
          size="lg"
          type="submit"
          onClick={() => {
            toast.promise(post(), {
              error: "Unable to post, please try again later",
              loading: "Posting...",
              success: "Posted successfully",
            });
          }}
        >
          Post
        </Button>
        <Button
          variant={"secondary"}
          className="my-10 block text-2xl"
          size="lg"
          type="submit"
          onClick={() => {
            toast.promise(draft(), {
              error: "Unable to save your draft, please try again later",
              loading: "Saving draft...",
              success: "Draft saved successfully",
            });
          }}
        >
          Save as Draft
        </Button>
        <Button
          variant={"destructive"}
          className="my-10 block text-2xl"
          size="lg"
          type="submit"
          onClick={() => {
            toast.promise(del(), {
              error: "Unable to delete the post",
              loading: "Deleting...",
              success: "Deleted successfully",
            });
            router.back();
          }}
        >
          Delete
        </Button>
      </div>
    </div>
  );
};

export default App;
