<script setup lang="ts">
import { h, resolveComponent } from "vue";
import { refDebounced } from "@vueuse/core";
import type { DropdownMenuItem, TableColumn } from "@nuxt/ui";
import type { Column, Row } from "@tanstack/vue-table";
import type { Category } from "~~/shared/types/category";

definePageMeta({
  layout: "admin-resource",
  middleware: "admin",
  title: "Categories",
  searchPlaceholder: "Search category's name",
  navItems: [
    { label: "All Categories", icon: "i-lucide-tags", to: "/admin/categories" },
    {
      label: "Create Category",
      icon: "i-lucide-plus",
      to: "/admin/categories/create",
    },
  ],
});

const UButton = resolveComponent("UButton");
const UDropdownMenu = resolveComponent("UDropdownMenu");

const { search } = useDashboardSearch();
const debouncedSearch = refDebounced(search, 300);

const { data, refresh } = await useFetch<Category[]>("/api/categories", {
  query: computed(() => ({ search: debouncedSearch.value || undefined })),
});
const { deleteCategory } = useCategoryAction();

const sortHeader =
  (label: string) =>
  ({ column }: { column: Column<Category> }) => {
    const sorted = column.getIsSorted();
    return h(UButton, {
      color: "neutral",
      variant: "ghost",
      label,
      icon: sorted
        ? sorted === "asc"
          ? "i-lucide-arrow-up-narrow-wide"
          : "i-lucide-arrow-down-wide-narrow"
        : "i-lucide-arrow-up-down",
      class: "-mx-2.5",
      onClick: () => column.toggleSorting(sorted === "asc"),
    });
  };

const rowItems = (row: Row<Category>): DropdownMenuItem[] => {
  const { name, slug } = row.original;
  return [
    {
      label: "Edit Category",
      icon: "i-lucide-pencil",
      onSelect: () => navigateTo(`/admin/categories/edit/${slug}`),
    },
    {
      label: "Delete Category",
      icon: "i-lucide-trash-2",
      color: "error",
      onSelect: () => deleteCategory({ name, slug, refreshAction: refresh }),
    },
  ];
};

const columns: TableColumn<Category>[] = [
  { id: "no", header: "#", cell: ({ row }) => `#${row.index + 1}` },
  { accessorKey: "name", header: sortHeader("Name") },
  { accessorKey: "slug", header: sortHeader("Slug") },
  {
    accessorKey: "created_at",
    header: sortHeader("Date Created"),
    cell: ({ row }) =>
      new Date(row.original.created_at).toLocaleString("id-ID", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
  },
  {
    id: "actions",
    meta: { class: { td: "text-right" } },
    cell: ({ row }) =>
      h(
        UDropdownMenu,
        {
          content: { align: "end" },
          items: rowItems(row),
          "aria-label": "Actions",
        },
        () =>
          h(UButton, {
            icon: "i-lucide-ellipsis-vertical",
            color: "neutral",
            variant: "ghost",
            "aria-label": "Actions",
          }),
      ),
  },
];
</script>

<template>
  <UTable :data :columns class="flex-1" />
</template>
