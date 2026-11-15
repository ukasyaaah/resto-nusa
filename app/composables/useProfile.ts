export type UserRole = "admin" | "user";

export interface Profile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

/**
 * Profil + role diambil dari public.users (bukan dari JWT).
 * Di @nuxtjs/supabase v2, useSupabaseUser() hanya mengembalikan JWT claims,
 * jadi id user ada di `sub`, dan role tidak ada di sana.
 */
export const useProfile = () => {
  const supabase = useSupabaseClient();
  const user = useSupabaseUser();

  // useState: di-cache & ikut terkirim dari server ke client (tanpa fetch ulang)
  const profile = useState<Profile | null>("profile", () => null);

  const fetchProfile = async (force = false): Promise<Profile | null> => {
    const id = user.value?.sub;
    if (!id) {
      profile.value = null;
      return null;
    }
    if (!force && profile.value?.id === id) return profile.value;

    // RLS: user hanya bisa select baris miliknya sendiri (admin: semua)
    const { data, error } = await supabase
      .from("users")
      .select("id, name, email, role")
      .eq("id", id)
      .single();

    if (error) {
      console.error("fetchProfile:", error.message);
      profile.value = null;
      return null;
    }
    profile.value = data as Profile;
    return profile.value;
  };

  const isAdmin = computed(() => profile.value?.role === "admin");

  return { profile, isAdmin, fetchProfile };
};
