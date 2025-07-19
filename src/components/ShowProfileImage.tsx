import { cn } from "@/lib/utils";
import { Account } from "@/types/user";
import { User2 } from "lucide-react";
import Image from "next/image";

type Props = {
  data?: Account;
  small?: boolean;
};

export default function ShowProfileImage({ data, small }: Props) {
  return (
    <div
      className={
        "flex flex-col items-center justify-center overflow-hidden rounded-full bg-slate-300 align-middle dark:border-2 dark:border-slate-400 " +
        (small ? "h-7 w-7" : "h-10 w-10 ")
      }
    >
      {data &&
        (data.image_third_party ? (
          <Image src={data.image} alt="" width={50} height={50} />
        ) : data.image ? (
          <Image
            src={`data:image/png;base64,${data.image}`}
            alt=""
            width={50}
            height={50}
          />
        ) : (
          <User2 className={cn("text-black", small ? "size-4" : "size-5")} />
        ))}
    </div>
  );
}
