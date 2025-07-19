import { useMutation, useQueries, useQuery } from "@tanstack/react-query";

export const usePostAnswer = () => {
  return useMutation({
    mutationFn: async (newAnswer: DoubtAnswer) => {
      await fetch("/api/answers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAnswer),
      });
    },
  });
};

const getAnswer = async (id: string | null | undefined) => {
  const rawAnswer = await fetch(`/api/answers?id=${id}`);
  const answer = (await rawAnswer.json()) as DoubtAnswer;
  return answer;
};

export const useGetAnswer = ({ id }: { id: string | null | undefined }) => {
  return useQuery({
    queryFn: async () => await getAnswer(id),
    queryKey: ["getAnswer", id],
    enabled: Boolean(id),
  });
};

export const useGetAnswers = ({
  ids,
}: {
  ids: (string | null | undefined)[];
}) => {
  return useQueries({
    queries: ids.map((id) => ({
      queryFn: async () => await getAnswer(id),
      queryKey: ["getAnswer", id],
    })),
  });
};

export const usePutAnswer = () => {
  return useMutation({
    mutationFn: async ({
      id,
      field,
      newAnswer,
    }: {
      id: string | null | undefined;
      field: "content" | "author" | "replies";
      newAnswer: Partial<DoubtAnswer>;
    }) => {
      await fetch(`/api/answers?id=${id}&field=${field}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAnswer),
      });
    },
  });
};
