<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";
const route = useRoute();
const { profile } = useProfile();

async function logout() {
  await useSupabaseClient().auth.signOut();
  await navigateTo("/");
}

const items = computed<NavigationMenuItem[][]>(() => [
  [
    {
      label: "Home",
      icon: "i-lucide-house",
      to: "/admin",
    },
    {
      label: "Products",
      icon: "eos-icons:product-subscriptions",
      to: "/admin/products",
      active: route.path.includes("/products") ? true : false,
      //   badge: stats.value?.blogs,
    },
    {
      label: "Categories",
      icon: "ion:pricetags",
      to: "/admin/categories",
      active: route.path.includes("/categories") ? true : false,
      //   badge: stats.value?.categories,
    },
    {
      label: "Users",
      icon: "i-lucide-users",
      to: "/admin/users",
      active: route.path.includes("/users") ? true : false,
      //   badge: stats.value?.users,
    },
  ],
  [
    {
      label: "Logout",
      icon: "i-lucide-log-out",
      onSelect() {
        logout();
      },
    },

    // {
    //   label: "Help & Support",
    //   icon: "i-lucide-info",
    //   to: "https://github.com/nuxt/ui",
    //   target: "_blank",
    // },
  ],
]);

const open = ref(true);

defineShortcuts({
  o: () => (open.value = !open.value),
});
</script>

<template>
  <UDashboardSidebar
    v-model:open="open"
    collapsible
    resizable
    :ui="{ footer: 'border-t border-default' }"
  >
    <template #header="{ collapsed }">
      <NuxtLink
        v-if="!collapsed"
        to="/"
        class="h-5 inline-flex items-center text-2xl font-bold w-auto shrink-0"
      >
        <NuxtImg src="/profile.png" class="size-7 mr-2 text-primary mx-auto" />
        Resto Nusa
      </NuxtLink>
      <NuxtImg v-else src="/profile.png" class="size-7 text-primary mx-auto" />
    </template>

    <template #default="{ collapsed }">
      <!-- <UButton
        :label="collapsed ? undefined : 'Search...'"
        icon="i-lucide-search"
        color="neutral"
        variant="outline"
        block
        :square="collapsed"
      >
        <template v-if="!collapsed" #trailing>
          <div class="flex items-center gap-0.5 ms-auto">
            <UKbd value="meta" variant="subtle" />
            <UKbd value="K" variant="subtle" />
          </div>
        </template>
      </UButton> -->

      <UNavigationMenu
        :collapsed="collapsed"
        :items="items[0]"
        orientation="vertical"
        :ui="{
          item: ' my-2.5',
        }"
      />

      <UNavigationMenu
        :collapsed="collapsed"
        :items="items[1]"
        orientation="vertical"
        class="mt-auto"
        :ui="{
          item: ' my-2.5',
        }"
      />
    </template>

    <template #footer="{ collapsed }">
      <UButton
        :avatar="{
          src: '/profile.png',
          loading: 'lazy' as const,
        }"
        :label="collapsed ? undefined : profile?.name"
        color="neutral"
        variant="ghost"
        class="w-full"
        :block="collapsed"
      />
    </template>
  </UDashboardSidebar>
</template>
