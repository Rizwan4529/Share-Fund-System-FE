import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  remember: z.boolean().optional(),
});

export const signupSchema = z.object({
  fullName: z.string().min(2, "Enter your full name"),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Use at least 8 characters"),
});

export const forgotEmailSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Use at least 8 characters"),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });

export const profileSchema = z.object({
  name: z.string().min(2, "Enter your full name"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().optional(),
  location: z.string().optional(),
});

export const securitySchema = z
  .object({
    currentPassword: z.string().optional(),
    newPassword: z.string().optional(),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (d) => {
      if (!d.newPassword) return true;
      return d.newPassword.length >= 8;
    },
    { message: "Use at least 8 characters", path: ["newPassword"] },
  )
  .refine(
    (d) => {
      if (!d.newPassword) return true;
      return d.newPassword === d.confirmPassword;
    },
    { message: "Passwords do not match", path: ["confirmPassword"] },
  );

export const activateSchema = z.object({
  goalName: z.string().min(2, "Give your goal a name"),
  target: z.number().min(500).max(50000),
  timeline: z.string(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type SignupFormValues = z.infer<typeof signupSchema>;
export type ProfileFormValues = z.infer<typeof profileSchema>;
export type SecurityFormValues = z.infer<typeof securitySchema>;
export type ActivateFormValues = z.infer<typeof activateSchema>;
