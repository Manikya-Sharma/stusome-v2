import { auth } from "@/lib/auth";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

export const multiMediaRouter = {
  multimediaUploader: f(["image", "video", "pdf"])
    .middleware(async () => {
      const session = await auth();

      if (!session || !session.user || !session.user.email)
        throw new UploadThingError("Unauthorized");

      return { email: session.user.email };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log(
        `${file.ufsUrl} uploaded by ${metadata.email} => ${file.size}, ${file.type}`,
      );
      return { url: file.ufsUrl, type: file.type };
    }),
} satisfies FileRouter;

export type MultimediaRouter = typeof multiMediaRouter;
