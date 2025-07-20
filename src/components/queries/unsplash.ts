import { useQuery } from "@tanstack/react-query";

export const useGetUnsplash = ({ query }: { query: string | null }) => {
  return useQuery({
    queryFn: async () => {
      const rawData = await fetch(`/api/unsplash?query=${query}`);
      return (await rawData.json()) as UnsplashSearchResult;
    },
    queryKey: ["unsplashResults", query],
    enabled: Boolean(query),
  });
};

type UnsplashSearchResult = {
  total: number;
  total_pages: number;
  results: Array<{
    id: string;
    created_at: string;
    width: number;
    height: number;
    color: string;
    blur_hash: string;
    likes: number;
    liked_by_user: boolean;
    description: string;
    user: any;
    current_user_collections: [];
    urls: {
      raw: string;
      full: string;
      regular: string;
      small: string;
      thumb: string;
    };
    links: {
      self: string;
      html: string;
      download: string;
    };
  }>;
};
