import * as z from "zod";

export const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const nameField = z
  .string()
  .trim()
  .min(1, "Name is required")
  .max(100, "Maximum 100 characters allowed");

const slugField = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, "Slug is required")
  .max(100, "Maximum 100 characters allowed")
  .regex(SLUG_RE, "Use lowercase letters, numbers, and hyphens only");

// Create: slug boleh kosong, nanti dibuat otomatis dari name
export const storeCategorySchema = z.object({
  name: nameField,
});

// Edit: keduanya wajib (form sudah terisi data lama)
export const updateCategorySchema = z.object({
  name: nameField,
});

// Untuk route param /api/categories/[slug]
export const categorySlugSchema = slugField;

export type StoreCategoryData = z.input<typeof storeCategorySchema>;
export type UpdateCategoryData = z.infer<typeof updateCategorySchema>;
