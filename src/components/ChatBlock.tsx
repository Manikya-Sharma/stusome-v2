export default function ChatBlock({ name }: { name: string }) {
  return (
    <div className="mx-auto my-2 flex w-[80%] min-w-fit max-w-prose items-center justify-between rounded-lg bg-slate-200 px-3 py-4 text-slate-700 dark:bg-slate-700 dark:text-slate-200">
      <div>{name}</div>
    </div>
  );
}
