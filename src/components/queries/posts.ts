import { Post } from "@/types/post";
import { useMutation, useQueries, useQuery } from "@tanstack/react-query";

export const usePostPost = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (data?: void, variables?: Post) => void;
  onError?: () => void;
} = {}) => {
  return useMutation({
    mutationFn: async (newPost: Post) => {
      await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPost),
      });
    },
    onSuccess,
    onError,
  });
};

const getPost = async (id: string | null | undefined) => {
  const rawPost = await fetch(`/api/posts?id=${id}`);
  const post = (await rawPost.json()) as Post;
  return post;
};

export const useGetPost = ({ id }: { id: string | null | undefined }) => {
  return useQuery({
    queryFn: async () => await getPost(id),
    queryKey: ["getPost", id],
    enabled: Boolean(id),
  });
};

export const useGetPosts = ({
  ids,
}: {
  ids: (string | null | undefined)[];
}) => {
  return useQueries({
    queries: ids.map((id) => ({
      queryFn: async () => await getPost(id),
      queryKey: ["getPost", id],
    })),
  });
};

export const usePutPost = ({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: () => void;
} = {}) => {
  return useMutation({
    mutationFn: async ({
      id,
      field,
      newPost,
    }: {
      id: string | null | undefined;
      field?:
        | "discussions"
        | "title"
        | "author"
        | "content"
        | "tags"
        | "coverImgFull"
        | "published";
      newPost: Partial<Post>;
    }) => {
      await fetch(`/api/posts?id=${id}${field ? `&field=${field}` : ""}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPost),
      });
    },
    onSuccess,
    onError,
  });
};

export const useDeletePost = ({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: () => void;
} = {}) => {
  return useMutation({
    mutationFn: async ({
      id,
      userEmail,
    }: {
      id: string | null | undefined;
      userEmail: string;
    }) => {
      await fetch(`/api/posts/?id=${id}&email=${userEmail}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
    onSuccess,
    onError,
  });
};

export const useGetAllPosts = () => {
  return useQuery({
    queryFn: async () => {
      const rawPosts = await fetch("/api/posts/all");
      const posts = (await rawPosts.json()) as Array<Post>;
      return posts;
    },
    queryKey: ["getAllPosts"],
  });
};
