import { Discussion } from "@/types/post";
import { useMutation, useQueries, useQuery } from "@tanstack/react-query";

export const usePostDiscussion = () => {
  return useMutation({
    mutationFn: async (newDiscussion: Discussion) => {
      await fetch("/api/discussions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newDiscussion),
      });
    },
  });
};

const getDiscussion = async (id: string | null | undefined) => {
  const rawDiscussion = await fetch(`/api/discussions?id=${id}`);
  const discussion = (await rawDiscussion.json()) as Discussion;
  return discussion;
};

export const useGetDiscussion = ({ id }: { id: string | null | undefined }) => {
  return useQuery({
    queryFn: async () => await getDiscussion(id),
    queryKey: ["getDiscussion", id],
    enabled: Boolean(id),
  });
};

export const useGetDiscussions = ({
  ids,
}: {
  ids: (string | null | undefined)[];
}) => {
  return useQueries({
    queries: ids.map((id) => ({
      queryFn: async () => await getDiscussion(id),
      queryKey: ["getDiscussion", id],
    })),
  });
};

export const usePutDiscussion = () => {
  return useMutation({
    mutationFn: async ({
      id,
      field,
      newDiscussion,
    }: {
      id: string | null | undefined;
      field: "content" | "author" | "replies";
      newDiscussion: Partial<Discussion>;
    }) => {
      await fetch(`/api/discussions?id=${id}&field=${field}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newDiscussion),
      });
    },
  });
};
