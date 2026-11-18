export default defineEventHandler(async (event) => {
  const { admin } = await requireAdmin(event);

  const { search } = getQuery(event);

  let query = admin
    .from("users")
    .select("id, name, email, role, created_at")
    .order("created_at", { ascending: false });

  if (typeof search === "string" && search.trim()) {
    query = query.ilike("name", `%${search.trim()}%`);
  }

  const { data: users, error } = await query;

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message });
  }

  return users;
});