import { Database } from "#build/types/supabase-database";
import { serverSupabaseClient } from "#supabase/server";

export default eventHandler(async (event) => {
  const client = await serverSupabaseClient<Database>(event);
  const slug = getRouterParam(event, "slug");

  if (typeof slug !== "string" || !slug.trim()) {
    throw createError({ statusCode: 400, statusMessage: "Invalid slug" });
  }

  const { data, error } = await client
    .from("categories")
    .select("id, name, slug, created_at")
    .eq("slug", slug.trim())
    .maybeSingle();

  if (error) {
    console.error("categories.get:", error.code, error.message);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to load categories",
    });
  }

  return data;
});
