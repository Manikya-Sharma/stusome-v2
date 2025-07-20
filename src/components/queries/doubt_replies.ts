import { DoubtReply } from "@/types/doubt";
import { useMutation, useQueries, useQuery } from "@tanstack/react-query";

export const usePostReply = () => {
  return useMutation({
    mutationFn: async (newReply: DoubtReply) => {
      await fetch("/api/doubt_replies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newReply),
      });
    },
  });
};

const getReply = async (id: string | null | undefined) => {
  const rawReply = await fetch(`/api/doubt_replies?id=${id}`);
  const reply = (await rawReply.json()) as DoubtReply;
  return reply;
};

export const useGetReply = ({ id }: { id: string | null | undefined }) => {
  return useQuery({
    queryFn: async () => await getReply(id),
    queryKey: ["getDoubtReply", id],
    enabled: Boolean(id),
  });
};

export const useGetReplies = ({
  ids,
}: {
  ids: (string | null | undefined)[];
}) => {
  return useQueries({
    queries: ids.map((id) => ({
      queryFn: async () => await getReply(id),
      queryKey: ["getDoubtReply", id],
    })),
  });
};
