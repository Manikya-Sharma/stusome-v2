import { useQuery, useMutation } from "@tanstack/react-query";
import { ChatAccount } from "@/types/user";

export const useGetChat = ({ id }: { id: string }) => {
  return useQuery({
    queryKey: ["getChat", id],
    queryFn: async () => {
      const response = await fetch(`/api/chat?id=${id}`);
      return (await response.json()) as Array<{
        id: string;
        message: string;
        to: string;
        time: number;
      }>;
    },
    // TODO: enabled only when valid id is given
  });
};

export const usePostChat = ({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: () => void;
} = {}) => {
  return useMutation({
    mutationFn: async ({
      from_email,
      to_email,
      message,
    }: {
      from_email: string;
      to_email: string;
      message: {
        id: string;
        message: string;
        to: string;
        time: number;
      };
    }) => {
      await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ from_email, to_email, message }),
      });
    },
    onSuccess,
    onError,
  });
};

export const useGetChatUser = ({ email }: { email?: string | null }) => {
  return useQuery({
    queryKey: ["getChatUser", email],
    queryFn: async () => {
      const data = await fetch(`/api/chat/user?email=${email}`);
      return (await data.json()) as ChatAccount | null;
    },
    // we very often get 404 error
    retry: false,
  });
};

export const usePostChatUser = ({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: () => void;
} = {}) => {
  return useMutation({
    mutationFn: async (account: ChatAccount | undefined) => {
      await fetch("/api/chat/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(account),
      });
    },
    onSuccess,
    onError,
  });
};

export const useGetChatRequest = ({ email }: { email?: string | null }) => {
  return useQuery({
    queryKey: ["getChatRequest", email],
    queryFn: async () => {
      const data = await fetch(`/api/chat/request?email=${email}`);
      return (await data.json()) as string[];
    },
    enabled: Boolean(email),
  });
};

export const usePostChatRequest = ({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: () => void;
} = {}) => {
  return useMutation({
    mutationFn: async ({ from, to }: { from: string; to: string }) => {
      await fetch("/api/chat/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ from, to }),
      });
    },
    onSuccess,
    onError,
  });
};

export const usePostChatRequestResponse = ({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: () => void;
} = {}) => {
  return useMutation({
    mutationFn: async ({
      from,
      to,
      how,
    }: {
      from: string;
      to: string;
      how: "accept" | "reject" | "block";
    }) => {
      await fetch("/api/chat/request/respond", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ from, to, how }),
      });
    },
    onSuccess,
    onError,
  });
};
