import { z } from "zod";

export const userSchema = z
  .object({
    first_name: z.string().min(2, "First name must be at least 2 characters"),
    last_name: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    alternate_email: z
      .string()
      .email("Invalid alternate email address")
      .optional(),
    age: z.number().int().min(18, "Must be at least 18 years old"),
    password: z.string().min(8, "Password must be at least 8 characters"),
  })
  .refine((data) => data.alternate_email !== data.email, {
    message: "Alternate email must be different from primary email",
    path: ["alternate_email"], // Specify the path of the error
  });

export type UserFormData = z.infer<typeof userSchema>;
