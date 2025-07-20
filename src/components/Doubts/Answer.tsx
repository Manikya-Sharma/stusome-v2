import ShowMarkdown from "../ShowMarkdown";
import ShowProfileImage from "../ShowProfileImage";
import { useGetAccount } from "../queries/accounts";
import Reply from "./Reply";

type Props = {
  authorEmail: string | undefined;
  content: string | undefined;
  replies: Array<DoubtReply>;
};

export default function Answer({ authorEmail, content, replies }: Props) {
  const { data: author } = useGetAccount({ email: authorEmail });
  return (
    <section className="container mx-auto mt-6">
      <div className="relative overflow-hidden rounded-lg border border-blue-200 bg-blue-50 p-4 shadow-md dark:border-blue-700 dark:bg-blue-950">
        <div className="flex items-center gap-2">
          <div>
            <ShowProfileImage authorEmail={author?.email} />
          </div>
          <h2 className="text-xl dark:text-slate-400">{author?.name}</h2>
        </div>
        <div>
          {/*  <!-- Added margin to the text container --> */}
          <div className="markdown-wrapper ml-4 mt-2 items-center justify-center px-3 text-gray-700">
            <ShowMarkdown data={content ?? ""} />
          </div>
        </div>
        <div className="text-gray-700">
          {replies.map((reply) => (
            <Reply reply={reply} />
          ))}
        </div>
      </div>
    </section>
  );
}
