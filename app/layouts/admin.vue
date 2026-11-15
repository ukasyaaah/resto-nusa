<script setup lang="ts">
const titles = reactive([
  {
    path: "/admin",
    title: "Admin",
  },
  {
    path: "/admin/products",
    title: "Products",
  },

  {
    path: "/admin/users",
    title: "Users",
  },
]);

const route = useRoute();

const navbarTitle = computed(() => {
  return titles.find((item: any) => item.path === route.path)?.title ?? "";
});
</script>

<template>
  <UDashboardGroup>
    <Sidebar />

    <UDashboardPanel>
      <template #header>
        <UDashboardNavbar :title="navbarTitle" icon="i-lucide-house" />
      </template>

      <template #body>
        <slot />
      </template>
    </UDashboardPanel>
  </UDashboardGroup>
</template>
