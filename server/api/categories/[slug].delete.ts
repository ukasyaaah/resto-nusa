import { categorySlugSchema } from "~~/shared/utils/categorySchema";

export default defineEventHandler(async (event) => {
  const { admin } = await requireAdmin(event);

  const parsed = categorySlugSchema.safeParse(getRouterParam(event, "slug"));
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: "Invalid slug" });
  }

  const { data, error } = await admin
    .from("categories")
    .delete()
    .eq("slug", parsed.data)
    .select("id");

  if (error) {
    // 23503 = foreign key violation (ON DELETE RESTRICT dari products)
    if (error.code === "23503") {
      throw createError({
        statusCode: 409,
        statusMessage: "Category still has products. Move or delete them first.",
      });
    }
    console.error("categories.delete:", error.code, error.message);
    throw createError({ statusCode: 500, statusMessage: "Failed to delete category" });
  }

  if (data.length === 0) {
    throw createError({ statusCode: 404, statusMessage: "Category not found" });
  }

  return { deleted: true };
});