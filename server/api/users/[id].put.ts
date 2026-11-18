import { requireUuidParam } from "~~/server/utils/requireUuidParam";
import { updateUserSchema } from "~~/shared/utils/userSchema";

export default defineEventHandler(async (event) => {
  const { adminId, admin } = await requireAdmin(event);
  const id = requireUuidParam(event);

  const { name, email, password, role } = await readValidatedBody(
    event,
    updateUserSchema.parse,
  );

  // Cegah admin mengunci dirinya sendiri
  if (id === adminId && role && role !== "admin") {
    throw createError({
      statusCode: 400,
      statusMessage: "You cannot remove your own admin role",
    });
  }

  const { data: existing, error: findError } = await admin
    .from("users")
    .select("id")
    .eq("id", id)
    .maybeSingle();

  if (findError) {
    throw createError({ statusCode: 500, statusMessage: findError.message });
  }
  if (!existing) {
    throw createError({ statusCode: 404, statusMessage: "User not found" });
  }

  // 1. Akun Auth: email, password, nama
  if (name || email || password) {
    const { error: authError } = await admin.auth.admin.updateUserById(id, {
      ...(email && { email, email_confirm: true }),
      ...(password && { password }),
      ...(name && { user_metadata: { name } }),
    });

    if (authError) {
      const exists = authError.code === "email_exists";
      throw createError({
        statusCode: exists ? 409 : 500,
        statusMessage: exists ? "Email already registered" : authError.message,
      });
    }
  }

  // 2. Baris profil: hanya kolom yang dikirim
  const patch = {
    ...(name && { name }),
    ...(email && { email }),
    ...(role && { role }),
  };

  if (Object.keys(patch).length > 0) {
    const { error } = await admin.from("users").update(patch).eq("id", id);
    if (error) {
      throw createError({ statusCode: 500, statusMessage: error.message });
    }
  }

  const { data: user, error: readError } = await admin
    .from("users")
    .select("id, name, email, role, created_at")
    .eq("id", id)
    .single();

  if (readError) {
    throw createError({ statusCode: 500, statusMessage: readError.message });
  }

  return user;
});