<script setup lang="ts">
import {
  updateUserSchema,
  type UpdateUserData,
} from "~~/shared/utils/userSchema";

definePageMeta({
  layout: "admin-resource",
  middleware: "admin",
  title: "Edit a User",
  navItems: [
    { label: "All Users", icon: "i-lucide-users", to: "/admin/users" },
    {
      label: "Create User",
      icon: "i-lucide-plus",
      to: "/admin/users/create",
    },
  ],
});
const { createUser, createForm } = useUserAction();
</script>

<template>
  <FormUser
    text-button="Create User"
    :schema="storeUserSchema"
    :form="createForm"
    @submit="createUser"
  />
</template>
