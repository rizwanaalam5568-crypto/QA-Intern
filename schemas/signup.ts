import { z } from "zod";

export const signupSchema = z
  .object({
    firstName: z
      .string()
      .min(2, "First name must be at least 2 characters")
      .trim(),
    lastName: z
      .string()
      .min(2, "Last name must be at least 2 characters")
      .trim(),
    email: z
      .string()
      .email("Invalid email address")
      .trim()
      .toLowerCase(),
    countryCode: z.string().default("+977"),
    phoneNumber: z
      .string()
      .min(8, "Phone number must be at least 8 digits")
      .regex(/^\d+$/, "Phone number must contain only numbers"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters"),
    agreeToTerms: z
      .boolean()
      .refine((val) => val === true, "You must agree to the Terms & Privacy Policy"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignupFormData = z.infer<typeof signupSchema>;
