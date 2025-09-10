import { z } from "zod";

export const loginSchema = z.object({
  email: z.email({ pattern: z.regexes.html5Email, error: "Invalid email" }),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
export const signupSchema = z.object({
  name: z.string().min(2, { error: "Name must be at least 2 characters" }),
  email: z.email({ error: "Invalid email address" }),
  password: z
    .string()
    .min(6, { error: "Password must be at least 6 characters" }),
});
export const habitSchema = z.object({
  title: z
    .string()
    .min(2, { message: "Title must be at least 2 characters" })
    .max(100, { message: "Title must be less than 100 characters" })
    .trim(),

  frequency: z
    .string()
    .min(1, { message: "Please select a frequency" })
    .refine((val) => ["daily", "weekly"].includes(val), {
      message: "Frequency must be either 'daily' or 'weekly'",
    }),

  category: z
    .string()
    .min(1, { message: "Please select a category" })
    .refine(
      (val) =>
        [
          "Health",
          "Fitness",
          "Learning",
          "Productivity",
          "Mindfulness",
          "Social",
          "Other",
        ].includes(val),
      { message: "Please select a valid category" }
    ),
});
