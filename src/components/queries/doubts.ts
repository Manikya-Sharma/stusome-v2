import { Doubt } from "@/types/doubt";
import { useMutation, useQueries, useQuery } from "@tanstack/react-query";

export const usePostDoubt = ({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: () => void;
} = {}) => {
  return useMutation({
    mutationFn: async (newDoubt: Doubt) => {
      await fetch("/api/doubts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newDoubt),
      });
    },
    onSuccess,
    onError,
  });
};

const getDoubt = async (id: string | null | undefined) => {
  const rawDoubt = await fetch(`/api/doubts?id=${id}`);
  const doubt = (await rawDoubt.json()) as Doubt;
  return doubt;
};

export const useGetDoubt = ({ id }: { id: string | null | undefined }) => {
  return useQuery({
    queryFn: async () => await getDoubt(id),
    queryKey: ["getDoubt", id],
    enabled: Boolean(id),
  });
};

export const useGetDoubts = ({
  ids,
}: {
  ids: (string | null | undefined)[];
}) => {
  return useQueries({
    queries: ids.map((id) => ({
      queryFn: async () => await getDoubt(id),
      queryKey: ["getDoubt", id],
    })),
  });
};

export const usePutDoubt = ({
  onError,
  onSuccess,
}: {
  onSuccess?: () => void;
  onError?: () => void;
}) => {
  return useMutation({
    mutationFn: async ({
      id,
      field,
      newDoubt,
    }: {
      id: string | null | undefined;
      field: "answers" | "title" | "author" | "content" | "tags";
      newDoubt: Partial<Doubt>;
    }) => {
      await fetch(`/api/doubts?id=${id}&field=${field}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newDoubt),
      });
    },
    onSuccess,
    onError,
  });
};

export const useGetAllDoubts = () => {
  return useQuery({
    queryFn: async () => {
      const rawDoubts = await fetch("/api/doubts/all");
      const doubts = (await rawDoubts.json()) as Array<Doubt>;
      return doubts;
    },
    queryKey: ["getAllDoubts"],
  });
};
