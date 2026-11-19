export default defineEventHandler(async (event) => {
  const { admin } = await requireAdmin(event);
  const body = await readValidatedBody(event, storeCategorySchema.parse);

  const slug = slugify(body.name);
  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: "Cannot generate a slug from this name",
    });
  }

  const { data, error } = await admin
    .from("categories")
    .insert({ name: body.name, slug })
    .select("id, name, slug, created_at")
    .single();

  if (error) {
    if (error.code === "23505") {
      throw createError({
        statusCode: 409,
        statusMessage: "Slug already exists",
      });
    }
    console.error("categories.post:", error.code, error.message);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to create category",
    });
  }

  return data;
});
