import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const { adminId } = await requireAdmin(event);
  const supabase = await serverSupabaseClient(event);
  const id = event.context.params!.id?.toString();

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "User ID is required",
    });
  }

  if (id === adminId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Cannot delete your own account",
    });
  }

  const { data, error } = await supabase.auth.admin.deleteUser(id);
  // .from("User")
  // .delete()
  // .eq("id", id)
  // .select("id");


return data
});
