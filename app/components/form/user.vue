<script setup lang="ts">
const emit = defineEmits(["submit"]);
defineProps(["schema", "form", "textButton"]);
</script>
<template>
  <UContainer
    class="flex items-center flex-col md:flex-row gap-y-4 justify-center h-fit md:h-screen"
  >
    <NuxtImg
      src="/ups4.png"
      format="webp"
      alt="Face"
      class="w-59 md:w-74 lg:w-74 xl:w-80 md:mr-25"
      preload
      loading="eager"
      quality="100"
    />

    <UCard :ui="{ root: 'w-full max-w-md' }">
      <UForm
        @submit="emit('submit')"
        :schema="schema"
        :state="form"
        class="space-y-7 w-full max-w-xl"
      >
        <UFormField size="xl" name="name" label="Name">
          <UInput
            v-model="form.name"
            size="xl"
            class="w-full"
            placeholder="Input title"
          />
        </UFormField>

        <UFormField label="Email" name="email" size="xl">
          <UInput
            v-model="form.email"
            size="xl"
            name=""
            placeholder="Input Subtitle"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Password" name="password" size="xl">
          <UInput
            v-model="form.password"
            size="xl"
            name=""
            placeholder="Input Password"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Role" name="role" size="xl">
          <USelect
            :items="[...USER_ROLES]"
            v-model="form.role"
            size="xl"
            name=""
            placeholder="Input Password"
            class="w-full"
          />
        </UFormField>
        <UButton type="submit"> {{ textButton }} </UButton>
      </UForm>
    </UCard>
  </UContainer>
</template>
