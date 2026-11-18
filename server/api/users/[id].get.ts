import { requireUuidParam } from "~~/server/utils/requireUuidParam";

export default defineEventHandler(async (event) => {
  const { admin } = await requireAdmin(event);
  const id = requireUuidParam(event);

  const { data: user, error } = await admin
    .from("users")
    .select("id, name, email, role, created_at")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message });
  }
  if (!user) {
    throw createError({ statusCode: 404, statusMessage: "User not found" });
  }

  return user;
});