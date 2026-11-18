<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

const route = useRoute();
const title = computed(() => (route.meta.title as string) ?? "Dashboard");
const items = computed<NavigationMenuItem[][]>(() => [
  (route.meta.navItems as NavigationMenuItem[]) ?? [],
]);
const searchPlaceholder = computed(
  () => (route.meta.searchPlaceholder as string) ?? "Search..",
);
const showSearch = computed(() =>
  ["/admin/products", "/admin/users", "/admin/categories"].includes(
    route.path,
  ),
);
const { search } = useDashboardSearch();
</script>

<template>
  <UDashboardGroup>
    <Sidebar />

    <UDashboardPanel resizable>
      <template #header>
        <UDashboardNavbar :title="title" icon="i-lucide-house" />
        <UDashboardToolbar>
          <div class="flex justify-center gap-2 md:justify-between flex-wrap w-full items-center">
            <UNavigationMenu :items="items" hightlight class="sm:flex-1" />
            <div v-if="showSearch">
              <UInput
                icon="i-lucide-search"
                size="lg"
                v-model="search"
                name="title"
                class="mb-4 md:mb-0"
                variant="subtle"
                :placeholder="searchPlaceholder"
              />
            </div>
          </div>
        </UDashboardToolbar>
      </template>

      <template #body>
        <slot />
      </template>
    </UDashboardPanel>
  </UDashboardGroup>
</template>
