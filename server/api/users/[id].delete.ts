import { requireUuidParam } from "~~/server/utils/requireUuidParam";

export default defineEventHandler(async (event) => {
  const { adminId, admin } = await requireAdmin(event);

  const id = requireUuidParam(event);

  if (id === adminId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Cannot delete your own account",
    });
  }

  // 1. Hapus baris profil (service role, tidak kena RLS)
  const { data, error } = await admin
    .from("users")
    .delete()
    .eq("id", id)
    .select("id");

  if (error) {
    const inUse = error.code === "23503"; // masih dipakai tabel lain
    throw createError({
      statusCode: inUse ? 409 : 500,
      statusMessage: inUse ? "User is still referenced by other data" : error.message,
    });
  }

  // 2. Hapus akun di Supabase Auth
  const { error: authError } = await admin.auth.admin.deleteUser(id);
  if (authError && authError.code !== "user_not_found") {
    throw createError({ statusCode: 500, statusMessage: authError.message });
  }

  // Tidak ada yang terhapus di kedua tempat: jangan pura-pura sukses
  if (data.length === 0 && authError?.code === "user_not_found") {
    throw createError({ statusCode: 404, statusMessage: "User not found" });
  }

  return { deleted: true };
});