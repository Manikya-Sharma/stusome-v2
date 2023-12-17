"use client";
import { cn } from "@/lib/utils";
import { User, Settings2, Lock, LogOut } from "lucide-react";

type Props = {
  description: string;
  type: "normal" | "danger" | "warning";
  logo?:
    | "user"
    | "settings"
    | "lock"
    | "logout"
    | "addPhoto"
    | "rename"
    | "password";
};

export default function Tile(props: Props) {
  return (
    <section
      className={cn(
        "mx-auto my-3 flex w-[90%] min-w-fit cursor-pointer justify-between rounded-lg border px-3  py-5 font-[450] transition-all duration-200 sm:w-full ",
        {
          "bg-slate-200 text-slate-700 hover:bg-slate-100 hover:text-black dark:border-slate-700 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600 dark:hover:text-slate-200":
            props.type == "normal",

          "border-orange-500 bg-slate-200 dark:bg-slate-700 ":
            props.type == "warning",

          "border-red-500 bg-slate-200 text-red-700 hover:bg-red-700 hover:text-white dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-600 dark:hover:text-red-200 ":
            props.type == "danger",
        },
      )}
    >
      <div className="flex items-center justify-start gap-3">
        {props.logo == "user" && (
          <div className="">
            <User />
          </div>
        )}
        {props.logo == "settings" && (
          <div className="">
            <Settings2 />
          </div>
        )}
        {props.logo == "lock" && (
          <div className="">
            <Lock />
          </div>
        )}
        {props.logo == "logout" && (
          <div className="">
            <LogOut />
          </div>
        )}
        {props.logo == "addPhoto" && (
          <div className="">{/* <MdAddAPhoto /> */}</div>
        )}
        {props.logo == "rename" && (
          <div className="">{/* <MdDriveFileRenameOutline /> */}</div>
        )}
        {props.logo == "password" && (
          <div className="">{/* <MdPassword /> */}</div>
        )}
        <p>{props.description}</p>
      </div>
      <div>&gt;</div>
    </section>
  );
}
