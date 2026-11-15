<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent, AuthFormField } from "@nuxt/ui";

const toast = useToast();
const { fetchProfile } = useProfile();
const supabase = useSupabaseClient();
const user = useSupabaseUser();
const redirectInfo = useSupabaseCookieRedirect();

const loading = ref(false);
const errorMsg = ref("");

const fields: AuthFormField[] = [
  {
    name: "email",
    type: "email",
    label: "Email",
    placeholder: "Enter your email",
    required: true,
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "Enter your password",
    required: true,
  },
];

const schema = z.object({
  email: z.email("Invalid email"),
  password: z
    .string("Password is required")
    .min(6, "Must be at least 6 characters"),
});

type Schema = z.output<typeof schema>;

watch(
  user,
  () => {
    if (user.value) return navigateTo(redirectInfo.pluck() || "/");
  },
  { immediate: true },
);

async function onSubmit(payload: FormSubmitEvent<Schema>) {
  loading.value = true;
  errorMsg.value = "";

  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: payload.data.email,
      password: payload.data.password,
    });

    if (error) {
      toast.add({
        title: error.message ?? "Something went wrong",
        color: "error",
      });
      return;
    }

    toast.add({
      title: "Login Successfully",
      color: "primary",
      icon: "iconoir:thumbs-up",
    });
    return await navigateTo("/");
  } catch (error: any) {
    toast.add({
      title: error.message ?? "Something went wrong",
      color: "error",
    });
  } finally {
    loading.value = false;
    await fetchProfile();
  }

  // if (error) {
  //   toast.add({ title: error.message, color: "error" });
  // } else {
  //   toast.add({ title: "Login Successfully", color: "primary" });
  // }

  return navigateTo("/");
}
</script>

<template>
  <div class="flex justify-center items-center h-screen">
    <UPageCard class="w-full h-fit max-w-md">
      <UAuthForm
        :schema="schema"
        title="Login"
        description="Enter your credentials to access your account."
        icon="i-lucide-user"
        :fields="fields"
        @submit="onSubmit"
      />
    </UPageCard>
  </div>
</template>
