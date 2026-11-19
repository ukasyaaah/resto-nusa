import { categorySlugSchema, updateCategorySchema } from "~~/shared/utils/categorySchema";

export default defineEventHandler(async (event) => {
  const { admin } = await requireAdmin(event);

  const parsed = categorySlugSchema.safeParse(getRouterParam(event, "slug"));
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: "Invalid slug" });
  }
  const currentSlug = parsed.data;

  const body = await readValidatedBody(event, updateCategorySchema.parse);

  const { data, error } = await admin
    .from("categories")
    .update({
      name: body.name,
      slug: slugify(body.name),
      updated_at: new Date().toISOString(),
    })
    .eq("slug", currentSlug)
    .select("id, name, slug, created_at, updated_at")
    .maybeSingle();

  if (error) {
    if (error.code === "23505") {
      throw createError({ statusCode: 409, statusMessage: "Slug already exists" });
    }
    console.error("categories.put:", error.code, error.message);
    throw createError({ statusCode: 500, statusMessage: "Failed to update category" });
  }

  if (!data) {
    throw createError({ statusCode: 404, statusMessage: "Category not found" });
  }

  return data;
});