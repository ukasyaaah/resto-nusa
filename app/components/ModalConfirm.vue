<script setup lang="ts">
import type { ButtonProps } from "@nuxt/ui";

const emit = defineEmits<{ close: [boolean] }>();

defineProps<{
  title: string;
  description: string;
  confirmLabel?: string;
  confirmColor?: ButtonProps["color"];
}>();
</script>

<template>
  <UModal
    close-icon="i-lucide-x"
    :close="{ onClick: () => emit('close', false) }"
    :title="title"
    :description="description"
  >
    <slot></slot>
    <template #footer>
      <div class="flex w-full justify-end gap-2">
        <UButton
          color="neutral"
          label="Dismiss"
          @click="emit('close', false)"
        />
        <UButton
          :color="confirmColor ?? 'error'"
          :label="confirmLabel ?? 'Delete'"
          @click="emit('close', true)"
        />
      </div>
    </template>
  </UModal>
</template>
