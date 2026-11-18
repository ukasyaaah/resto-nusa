import { storeUserSchema } from "~~/shared/utils/userSchema";

export default defineEventHandler(async (event) => {
  const { admin } = await requireAdmin(event);

  const body = await readValidatedBody(event, storeUserSchema.parse);

  // 1. Buat akun di Supabase Auth
  const { data: created, error: authError } = await admin.auth.admin.createUser({
    email: body.email,
    password: body.password,
    email_confirm: true,
    user_metadata: { name: body.name },
  });

  if (authError || !created.user) {
    const exists = authError?.code === "email_exists";
    throw createError({
      statusCode: exists ? 409 : 500,
      statusMessage: exists
        ? "Email already registered"
        : (authError?.message ?? "Failed to create user"),
    });
  }

  // 2. Isi baris profil. Upsert, jaga-jaga kalau ada trigger yang sudah membuatnya
  const { data: user, error: insertError } = await admin
    .from("users")
    .upsert(
      {
        id: created.user.id,
        name: body.name,
        email: body.email,
        role: body.role,
      },
      { onConflict: "id" },
    )
    .select("id, name, email, role, created_at")
    .single();

  if (insertError) {
    // rollback supaya tidak ada akun yatim di Authentication
    await admin.auth.admin.deleteUser(created.user.id);
    throw createError({ statusCode: 500, statusMessage: insertError.message });
  }

  return user;
});