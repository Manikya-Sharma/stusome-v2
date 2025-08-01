"use client";

import { Button } from "@/components/ui/button";
import { z } from "zod";
import { doubtSchema } from "@/types/schemas";
import DoubtEditor from "@/components/DoubtEditor";
import { useState } from "react";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { v4 as uuid } from "uuid";
import { useRouter } from "next/navigation";
import { useGetAccount, usePutAccount } from "@/components/queries/accounts";
import { usePostDoubt } from "@/components/queries/doubts";
import { Doubt } from "@/types/doubt";

type formType = z.infer<typeof doubtSchema>;

const App = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [formState, setFormState] = useState<formType>({
    content: "",
    title: "",
    tags: [],
  });

  const { data: account } = useGetAccount({ email: session?.user?.email });
  const { mutate: updateAccount, isPending: isUpdatingAccount } = usePutAccount(
    {
      email: session?.user?.email,
      onError: () => toast.error("Could not link the doubt to your account"),
    },
  );
  const { mutate: createDoubt, isPending: isCreatingDoubt } = usePostDoubt({
    onError: () =>
      toast.error("Could not post new doubt, please try again later"),
    onSuccess: () => {
      toast.success("New doubt created successfully");
      router.replace("/dashboard");
    },
  });

  function changeContent(newContent: string) {
    setFormState({ ...formState, content: newContent });
  }
  function changeTitle(newTitle: string) {
    setFormState({ ...formState, title: newTitle });
  }

  function changeTags(newTags: Array<string>) {
    setFormState({ ...formState, tags: newTags });
  }

  function postDoubt() {
    if (session && session.user && session.user.email) {
      if (formState.title.trim().length === 0) {
        toast.error("Missing title");
        return;
      }
      if (formState.content.trim().length === 0) {
        toast.error("Missing content");
        return;
      }

      const newId = uuid();
      const doubt: Doubt = {
        ...formState,
        author: session.user.email,
        answers: [],
        id: newId,
      };
      createDoubt(doubt);
      const old_doubts = account?.doubts;
      const new_doubts = [...(old_doubts ?? []), newId];
      updateAccount({
        field: "doubts",
        newAccount: { doubts: new_doubts },
      });
    }
  }

  return (
    <div>
      <DoubtEditor
        state={formState}
        changeContent={changeContent}
        changeTitle={changeTitle}
        changeTags={changeTags}
      />
      <div className="flex items-center justify-center gap-4">
        <Button
          className="my-10 block text-2xl"
          size="lg"
          type="submit"
          onClick={() => postDoubt()}
          disabled={isCreatingDoubt || isUpdatingAccount}
        >
          Post the doubt
        </Button>
      </div>
    </div>
  );
};

export default App;
