<script setup lang="ts">
const user = useSupabaseUser();
const supabase = useSupabaseClient();
const { isAdmin, profile, fetchProfile } = useProfile();

await fetchProfile();
const logout = async () => {
  await supabase.auth.signOut();
  await navigateTo("/");
};
</script>

<template>
  <div>
    <UHeader title="Resto Ijo">
      <template #right>
        <div v-if="!user" class="flex gap-2">
          <UButton to="/auth/register" label="Daftar" />
          <UButton
            icon="iconoir:log-in"
            to="/auth/login"
            variant="outline"
            label="Masuk"
          />
        </div>

        <div v-else class="flex gap-3">
          <UButton
            label="Logout"
            color="error"
            variant="soft"
            @click="logout"
          />
          <UButton
            v-if="isAdmin"
            label="Admin Dashboard"
            to="/admin"
          />

          <UButton
            v-else
            icon="iconoir:profile-circle"
            :label="profile?.name"
          />
        </div>

        <USeparator type="solid" class="h-5" orientation="vertical" />
        <UColorModeButton />
      </template>
    </UHeader>
    <slot />
  </div>
</template>
