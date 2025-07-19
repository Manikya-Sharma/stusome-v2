import { useGetAccount } from "../queries/account";
import ShowMarkdown from "../ShowMarkdown";
import ShowProfileImage from "../ShowProfileImage";

export default function Reply({ reply }: { reply: DoubtReply }) {
  const { data: author } = useGetAccount({ email: reply.author });
  return (
    <div key={reply.id} className="mt-3 flex items-center justify-start gap-3">
      <div className="h-5 w-[1px] bg-emerald-400"></div>
      <div>
        <div className="flex items-center gap-2">
          <div>
            <ShowProfileImage data={author} small={true} />
          </div>
          <h2 className="text-xl dark:text-slate-400">{author?.name}</h2>
        </div>
        <div className="markdown-wrapper">
          <ShowMarkdown data={reply.content} />
        </div>
      </div>
    </div>
  );
}
