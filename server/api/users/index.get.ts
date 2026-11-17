import { serverSupabaseClient } from "#supabase/server";

export default eventHandler(async (event) => {
  await requireAdmin(event);
  const client = await serverSupabaseClient(event);

  const { data } = await client
    .from("users")
    .select("name, email, role, created_at");

  return data;
});
