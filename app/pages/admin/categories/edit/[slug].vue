<script setup lang="ts">
import { updateCategorySchema, type UpdateCategoryData } from "~~/shared/utils/categorySchema";
import type { Category } from "~~/shared/types/category";

definePageMeta({
  layout: "admin-resource",
  middleware: "admin",
  title: "Edit a Category",
  navItems: [
    { label: "All Categories", icon: "i-lucide-tags", to: "/admin/categories" },
    { label: "Create Category", icon: "i-lucide-plus", to: "/admin/categories/create" },
  ],
});

const slug = useRoute().params.slug?.toString();

const { data: category } = await useFetch<Category>(`/api/categories/${slug}`);
if (!category.value) {
  throw createError({ statusCode: 404, statusMessage: "Category not found", fatal: true });
}

const { editCategory } = useCategoryAction();

const state = reactive<UpdateCategoryData>({ name: category.value.name });
</script>

<template>
  <FormCategory
    text-button="Update Category"
    :schema="updateCategorySchema"
    :form="state"
    @submit="editCategory({ slug, updateForm: state })"
  />
</template>