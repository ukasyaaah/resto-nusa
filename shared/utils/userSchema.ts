import * as z from "zod";

export const USER_ROLES = ["admin", "user"] as const;

const nameField = z.string().trim().min(1, { message: "Invalid name" });
const emailField = z.string().trim().toLowerCase().email("Invalid Email");
const roleField = z.enum(USER_ROLES, { message: "Invalid role" });

export const storeUserSchema = z.object({
  name: nameField,
  email: emailField,
  password: z
    .string()
    .min(6, "Minimum 6 characters required")
    .max(100, "Maximum 100 characters allowed"),
  role: roleField.default("user"),
});

export const updateUserSchema = z.object({
  name: nameField,
  email: emailField,
  password: z
    .string()
    .min(6, "Minimum 6 characters required")
    .max(100, "Maximum 100 characters allowed")
    .or(z.literal(""))
    .optional(),
  role: roleField,
});

export type StoreUserData = z.input<typeof storeUserSchema>;
export type UpdateUserData = z.infer<typeof updateUserSchema>;
export type UserRole = (typeof USER_ROLES)[number];