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
const route = useRoute();
const id = route.params.id?.toString();

const { data: user } = await useFetch<User>(`/api/users/${id}`);
const { editUser } = useUserAction();

const state = reactive<UpdateUserData>({
  name: user.value?.name!,
  email: user.value?.email!,
  password: "",
  role: user.value?.role!,
});
</script>

<template>
  <FormUser
    text-button="Update User"
    :schema="updateUserSchema"
    :form="state"
    @submit="editUser({ id, updateForm: state })"
  />
</template>
