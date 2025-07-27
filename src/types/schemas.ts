import { z } from "zod";

export const postSchema = z.object({
  title: z.string().min(1, "title should not be empty"),
  content: z.string().min(1, "content should not be empty"),
  tags: z.array(z.string()),
  coverImgFull: z.url({ message: "Invalid url for 3rd party image" }),
  media: z.array(
    z.object({
      key: z.string(),
      type: z.string(),
    }),
  ),
});

export const doubtSchema = z.object({
  title: z.string().min(1, "title should not be empty"),
  content: z.string().min(1, "content should not be empty"),
  tags: z.array(z.string("Tag needs description")),
});

export const userSchema = z.object({
  name: z.string().min(1, "name should not be empty"),
  email: z.email({ message: "Invalid email" }),
  image: z.string().optional(),
});

export type postSchemaType = z.infer<typeof postSchema>;
export type userSchemaType = z.infer<typeof userSchema>;
export type doubtSchemaType = z.infer<typeof doubtSchema>;
