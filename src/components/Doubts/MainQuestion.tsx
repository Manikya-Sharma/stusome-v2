import { Account } from "@/types/user";
import ShowMarkdown from "../ShowMarkdown";
import ShowProfileImage from "../ShowProfileImage";

type Props = {
  author?: Account;
  content: string;
};

export default function MainQuestion({ author, content }: Props) {
  return (
    <section className="container mx-auto mt-6">
      <div className="relative overflow-hidden rounded-lg border border-indigo-200 bg-indigo-100 p-4 shadow-md dark:border-indigo-600 dark:bg-indigo-950">
        <div className="flex items-center gap-2">
          <div>
            <ShowProfileImage data={author} />
          </div>
          <h2 className="text-xl dark:text-slate-300">{author?.name}</h2>
        </div>
        <div className="mt-4 flex items-center gap-2 md:mt-0">
          <div className="h-16 w-3 bg-emerald-600"></div>
          {/*  <!-- Added margin to the text container --> */}
          <div className="markdown-wrapper ml-4 mt-2 flex min-h-[6rem] flex-col items-center justify-center px-3 font-semibold leading-relaxed text-gray-700">
            <ShowMarkdown data={content} />
          </div>
        </div>
      </div>
    </section>
  );
}
