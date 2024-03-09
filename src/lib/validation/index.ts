import * as z from "zod";

export const signupValidation = z.object({
  name: z.string().min(2, { message: "Name is too short" }),
  username: z.string().min(2).max(50),
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Password must be atleast 8 characters" }),
});
