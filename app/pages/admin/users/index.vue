<script setup lang="ts">
definePageMeta({
  layout: "admin-resource",
  middleware: "admin",
  title: "Users",
  searchPlaceholder: "Search user's name",
  navItems: [
    { label: "All Users", icon: "i-lucide-users", to: "/admin/users" },
    {
      label: "Create User",
      icon: "i-lucide-plus",
      to: "/admin/users/create",
    },
  ],
});
const { search } = useDashboardSearch();
import { h, resolveComponent } from "vue";
import type { TableColumn } from "@nuxt/ui";
import type { Column, Row } from "@tanstack/vue-table";

const UButton = resolveComponent("UButton");
const UBadge = resolveComponent("UBadge");
const UDropdownMenu = resolveComponent("UDropdownMenu");



const { data, refresh } = await useFetch<User[]>("/api/users", {
  method:'GET',
  query: computed(() => ({ search: search.value })),
});
const { deleteUser } = useUserAction();

const columns: TableColumn<User>[] = [
  {
    accessorKey: "id",
    header: "#",
    enableSorting: true,
    cell: ({ row }) => `#${row.index + 1}`,
  },
  {
    accessorKey: "name",
    header: ({ column }) => getHeader(column, "Name"),
    enableSorting: true,
  },

  {
    accessorKey: "email",
    enableSorting: true,
    header: ({ column }) => getHeader(column, "Email"),
  },
  {
    accessorKey: "role",
    header: ({ column }) => getHeader(column, "Role"),
    enableSorting: true,
    cell: ({ row }) => {
      const color = {
        admin: "primary" as const,
        user: "warning" as const,
      }[row.getValue("role") as string];

      return h(UBadge, { class: "capitalize", variant: "subtle", color }, () =>
        row.getValue("role"),
      );
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => getHeader(column, "Date Created"),
    cell: ({ row }) => {
      return new Date(row.getValue("created_at")).toLocaleString("id-ID", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    },
  },

  {
    id: "actions",
    meta: {
      class: {
        td: "text-right",
      },
    },
    cell: ({ row }) => {
      return h(
        UDropdownMenu,
        {
          content: {
            align: "end",
          },
          items: getRowItems(row),
          "aria-label": "Actions dropdown",
        },
        () =>
          h(UButton, {
            icon: "i-lucide-ellipsis-vertical",
            color: "neutral",
            variant: "ghost",
            "aria-label": "Actions dropdown",
          }),
      );
    },
  },
];

function getRowItems(row: Row<any>) {
  return [
    {
      label: "Edit User",
      icon: "i-lucide-pencil",

      onSelect() {
        navigateTo(`/admin/users/edit/${row.original.id}`);
      },
    },
    {
      label: "Delete User",
      color: "error",
      icon: "i-lucide-trash-2",
      async onSelect() {
        await deleteUser({
          name: row.original.name as string,
          id: row.original.id,
          refreshAction: refresh,
        });
      },
    },
  ];
}

function getHeader(column: Column<User>, label: string) {
  const isSorted = column.getIsSorted();

  return h(
    UDropdownMenu,
    {
      content: {
        align: "start",
      },
      "aria-label": "Actions dropdown",
      items: [
        {
          label: "Asc",
          type: "checkbox",
          icon: "i-lucide-arrow-up-narrow-wide",
          checked: isSorted === "asc",
          onSelect: () => {
            if (isSorted === "asc") {
              column.clearSorting();
            } else {
              column.toggleSorting(false);
            }
          },
        },
        {
          label: "Desc",
          icon: "i-lucide-arrow-down-wide-narrow",
          type: "checkbox",
          checked: isSorted === "desc",
          onSelect: () => {
            if (isSorted === "desc") {
              column.clearSorting();
            } else {
              column.toggleSorting(true);
            }
          },
        },
      ],
    },
    () =>
      h(UButton, {
        color: "neutral",
        variant: "ghost",
        label,
        icon: isSorted
          ? isSorted === "asc"
            ? "i-lucide-arrow-up-narrow-wide"
            : "i-lucide-arrow-down-wide-narrow"
          : "i-lucide-arrow-up-down",
        class: "-mx-2.5 data-[state=open]:bg-elevated",
        "aria-label": `Sort by ${isSorted === "asc" ? "descending" : "ascending"}`,
      }),
  );
}
</script>

<template>
  <UTable :data :columns="columns" class="flex-1" />
</template>
