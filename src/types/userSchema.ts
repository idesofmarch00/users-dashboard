import { z } from "zod";

export const userSchema = z.object({
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  last_name: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  age: z.number().int().min(18, "Must be at least 18 years old"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type UserFormData = z.infer<typeof userSchema>;
