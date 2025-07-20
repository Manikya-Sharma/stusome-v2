import { Account } from "@/types/user";
import { useMutation, useQueries, useQuery } from "@tanstack/react-query";

export const usePostAccount = ({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: () => void;
} = {}) => {
  return useMutation({
    mutationFn: async (newAccount: Account) => {
      await fetch("/api/accounts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAccount),
      });
    },
    onSuccess,
    onError,
  });
};

const getAccount = async (email: string | null | undefined) => {
  const rawAccount = await fetch(`/api/accounts?email=${email}`);
  const account = (await rawAccount.json()) as Account;
  return account;
};

export const useGetAccount = ({
  email,
}: {
  email: string | null | undefined;
}) => {
  return useQuery({
    queryFn: async () => await getAccount(email),
    queryKey: ["getAccount", email],
    enabled: Boolean(email),
  });
};

export const useGetAccounts = ({ emails }: { emails: string[] }) => {
  return useQueries({
    queries: emails.map((email) => ({
      queryFn: async () => await getAccount(email),
      queryKey: ["getAccount", email],
    })),
  });
};

export const usePutAccount = ({
  email,
  onSuccess,
  onError,
}: {
  email: string | null | undefined;
  onSuccess?: () => void;
  onError?: () => void;
}) => {
  return useMutation({
    mutationFn: async ({
      field,
      newAccount,
    }: {
      field: "name" | "image" | "image_third_party" | "posts" | "doubts";
      newAccount: Partial<Account>;
    }) => {
      await fetch(`/api/accounts?email=${email}&field=${field}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAccount),
      });
    },
    onSuccess,
    onError,
  });
};
