import { z } from "zod";

export const postSchema = z.object({
  title: z
    .string({
      required_error: "Title is required",
    })
    .min(1, "title should not be empty"),
  content: z
    .string({
      required_error: "No content provided!",
    })
    .min(1, "content should not be empty"),
  tags: z.array(z.string()).optional(),
  coverImgFull: z
    .string()
    .url({ message: "Invalid url for 3rd party image" })
    .optional(),
});

export const doubtSchema = z.object({
  title: z
    .string({
      required_error: "Title is required",
    })
    .min(1, "title should not be empty"),
  content: z
    .string({
      required_error: "No content provided!",
    })
    .min(1, "content should not be empty"),
  tags: z
    .array(z.string({ required_error: "Tag needs description" }))
    .optional(),
});

export const userSchema = z.object({
  name: z
    .string({ required_error: "Name needs to be provided" })
    .min(1, "name should not be empty"),
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Invalid email" }),
  image: z.string().optional(),
});

export type postSchemaType = z.infer<typeof postSchema>;
export type userSchemaType = z.infer<typeof userSchema>;
export type doubtSchemaType = z.infer<typeof doubtSchema>;
