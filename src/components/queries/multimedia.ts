import { useQueries, useQuery } from "@tanstack/react-query";

const getMultimedia = async ({ key, type }: { key: string; type: string }) => {
  const data = await fetch(`/api/multimedia?key=${key}&type=${type}`);
  return (await data.json()) as { url: string; type: string };
};

export const useGetMultimedia = ({
  key,
  type,
}: {
  key: string;
  type: string;
}) => {
  return useQuery({
    queryKey: ["getMultimedia", key],
    queryFn: async () => await getMultimedia({ key, type }),
    enabled: Boolean(key),
  });
};

export const useGetAllMultimedia = ({
  items,
}: {
  items: Array<{ key: string; type: string }>;
}) => {
  return useQueries({
    queries: items.map(({ key, type }) => ({
      queryKey: ["getMultimedia", key],
      queryFn: async () => await getMultimedia({ key, type }),
      enabled: Boolean(key),
    })),
  });
};
