<script setup lang="ts">
import type { ZodType } from "zod";

defineProps<{
  schema: ZodType;
  form: { name: string };
  textButton: string;
}>();

const emit = defineEmits<{ submit: [] }>();
</script>

<template>
  <UPageCard class="w-full max-w-md mx-auto">
    <UForm :schema :state="form" class="space-y-4" @submit="emit('submit')">
      <UFormField label="Name" name="name" required>
        <UInput v-model="form.name" placeholder="e.g. Minuman Dingin" class="w-full" autofocus />
      </UFormField>

      <p v-if="form.name.trim()" class="text-sm text-muted">
        URL: <span class="font-mono">{{ slugify(form.name) || "-" }}</span>
      </p>

      <UButton type="submit" :label="textButton" />
    </UForm>
  </UPageCard>
</template>