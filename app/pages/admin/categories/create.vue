<script setup lang="ts">
definePageMeta({
  layout: "admin-resource",
  middleware: "admin",
  title: "Create a Category",
  navItems: [
    { label: "All Categories", icon: "i-lucide-tags", to: "/admin/categories" },
    {
      label: "Create Category",
      icon: "i-lucide-plus",
      to: "/admin/categories/create",
    },
  ],
});

const { createForm, createCategory } = useCategoryAction();
</script>

<template>
  <FormCategory
    text-button="Create Category"
    :schema="storeCategorySchema"
    :form="createForm"
    @submit="createCategory"
  />
</template>
