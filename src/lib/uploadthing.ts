import { generateReactHelpers } from "@uploadthing/react";

import type { MultimediaRouter } from "@/app/api/uploadthing/core";

export const { useUploadThing, uploadFiles } =
  generateReactHelpers<MultimediaRouter>();
