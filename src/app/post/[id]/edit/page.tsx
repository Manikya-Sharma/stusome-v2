"use client";

import DisplayMedia from "@/components/DisplayMedia";
import Editor from "@/components/Editor";
import IndeterminateLoader from "@/components/IndeterminateLoader";
import Media from "@/components/Media";
import {
  useDeletePost,
  useGetPost,
  usePutPost,
} from "@/components/queries/posts";
import { Button } from "@/components/ui/button";
import { Post } from "@/types/post";
import { postSchema } from "@/types/schemas";
import { useSession } from "next-auth/react";
import { notFound, useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { z } from "zod";

type formType = z.infer<typeof postSchema>;

type Params = {
  params: Promise<{
    id: string;
  }>;
};

const App = ({ params }: Params) => {
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

  const { data: postData, isLoading, isError } = useGetPost({ id });
  const { mutate: updatePost, isPending: isUpdatingPost } = usePutPost({
    onError: () => toast.error("Could not update, please try again later"),
    onSuccess: () => {
      toast.success("Operation executed successfully");
      router.push(`/post/${id}`);
    },
  });
  const { mutate: deletePost, isPending: isDeletingPost } = useDeletePost({
    onSuccess: () => {
      toast.success("Post deleted successfully");
      router.replace("/dashboard");
    },
    onError: () => toast.error("Could not delete post, please try again later"),
  });

  useEffect(() => {
    if (isLoading) return;
    if (isError) {
      return notFound();
    }
    if (!postData) return;
    setFormState(postData);
  }, [postData, isLoading, isError, setFormState]);

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

    updatePost({ id, newPost });
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

    updatePost({ id, newPost });
  }
  async function del() {
    if (!session?.user?.email) {
      return;
    }
    deletePost({ id });
  }

  return (
    <div>
      <IndeterminateLoader loading={isLoading} />
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
          disabled={isUpdatingPost || isDeletingPost}
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
          disabled={isUpdatingPost || isDeletingPost}
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
          disabled={isUpdatingPost || isDeletingPost}
        >
          Delete
        </Button>
      </div>
    </div>
  );
};

export default App;
