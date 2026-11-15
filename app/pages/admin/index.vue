<script setup lang="ts">
definePageMeta({ middleware: "admin" });

const supabase = useSupabaseClient<any>();

// Hanya admin yang bisa melihat semua user (policy users_select_own_or_admin)
const { data: users, error } = await useAsyncData("admin-users", async () => {
  const { data, error } = await supabase
    .from("users")
    .select("id, name, email, role, created_at")
    .order("created_at");
  if (error) throw error;
  return data;
});
</script>

<template>
  <div>
    <h1>Admin</h1>
    <NuxtLink to="/">Kembali</NuxtLink>
    <p v-if="error" style="color: red">{{ error.message }}</p>
    <table v-else>
      <thead>
        <tr>
          <th>Nama</th>
          <th>Email</th>
          <th>Role</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="u in users" :key="u.id">
          <td>{{ u.name }}</td>
          <td>{{ u.email }}</td>
          <td>{{ u.role }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
