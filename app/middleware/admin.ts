// Pakai di halaman: definePageMeta({ middleware: 'admin' })

import { useProfile } from "~/composables/useProfile";

// Ini hanya UX guard. Pengaman sesungguhnya adalah RLS di database.
export default defineNuxtRouteMiddleware(async () => {
  const user = useSupabaseUser();

  // Belum login: normalnya sudah di-redirect oleh middleware global module.
  // Ini hanya jaring pengaman.
  if (!user.value) return navigateTo("/auth/login");

  const { fetchProfile } = useProfile();
  const profile = await fetchProfile();

  if (profile?.role !== "admin") {
    return createError({
      status: 404,
      statusText: "Page not found",
      fatal: true,
    });
  }
});
