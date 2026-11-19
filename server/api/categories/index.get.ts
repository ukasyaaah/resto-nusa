import type { Database } from "#build/types/supabase-database";
import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient<Database>(event);
  const { search } = getQuery(event);

  let query = client
    .from("categories")
    .select("id, name, slug, created_at")
    .order("name", { ascending: true });

  if (typeof search === "string" && search.trim()) {
    const term = search.trim().slice(0, 100).replace(/[\\%_]/g, "\\$&");
    query = query.ilike("name", `%${term}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error("categories.list:", error.code, error.message);
    throw createError({ statusCode: 500, statusMessage: "Failed to load categories" });
  }

  return data;
});