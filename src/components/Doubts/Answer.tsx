import { Account } from "@/types/user";
import ShowMarkdown from "../ShowMarkdown";
import ShowProfileImage from "../ShowProfileImage";

type Props = {
  author?: Account | undefined;
  content: string | undefined;
  replies: Array<DoubtReply>;
  authors?: Map<string, Account>;
};

export default function Answer({ author, content, replies, authors }: Props) {
  return (
    <section className="container mx-auto mt-6">
      <div className="relative overflow-hidden rounded-lg border border-blue-200 bg-blue-50 p-4 shadow-md dark:border-blue-700 dark:bg-blue-950">
        <div className="flex items-center gap-2">
          <div>
            <ShowProfileImage data={author} />
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
          {replies.map((reply) => {
            return (
              <div
                key={reply.id}
                className="mt-3 flex items-center justify-start gap-3"
              >
                <div className="h-5 w-[1px] bg-emerald-400"></div>
                <div>
                  {authors && (
                    <div className="flex items-center gap-2">
                      <div>
                        <ShowProfileImage
                          data={authors.get(reply.author)}
                          small={true}
                        />
                      </div>
                      <h2 className="text-xl dark:text-slate-400">
                        {authors.get(reply.author)?.name}
                      </h2>
                    </div>
                  )}
                  <div className="markdown-wrapper">
                    <ShowMarkdown data={reply.content} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
