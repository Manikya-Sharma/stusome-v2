import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getChatId(email1: string, email2: string): string {
  return `chat:${[email1, email2].sort().join(":")}`;
}

export function getEmailsFromChatId(id: string): [string, string] {
  return [id.split(":")[1], id.split(":")[2]];
}
