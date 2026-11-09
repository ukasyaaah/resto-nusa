<script setup lang="ts">
const menus = reactive([
  {
    id: 0,
    image: "",
    title: "Mie Suit",
    description:
      "Mie dengan cita rasa gurih yang lezat tanpa rasa pedas, cocok untuk kamu yang menyukai hidangan ringan.",
    price: 13000,
    category: "Mie",
  },
  {
    id: 1,
    image: "",
    title: "Mie Hompimpa",
    description:
      "Mie dengan perpaduan rasa gurih dan pedas yang menggugah selera, tersedia dalam berbagai pilihan level kepedasan.",
    price: 13000,
    category: "Mie",
  },
  {
    id: 2,
    image: "",
    title: "Mie Gacoan",
    description:
      "Mie dengan perpaduan rasa manis dan pedas yang khas, cocok untuk pecinta makanan pedas.",
    price: 13000,
    category: "Mie",
  },
  {
    id: 3,
    image: "",
    title: "Udang Keju",
    description:
      "Camilan udang dengan isian keju yang creamy, dibalut kulit renyah dan digoreng hingga keemasan.",
    price: 13000,
    category: "Dimsum",
  },
  {
    id: 4,
    image: "",
    title: "Udang Rambutan",
    description:
      "Olahan udang berbentuk unik dengan lapisan kulit renyah yang menyerupai rambutan.",
    price: 13000,
    category: "Dimsum",
  },
  {
    id: 5,
    image: "",
    title: "Siomay",
    description:
      "Dimsum dengan isian lembut dan gurih yang dikukus hingga matang, cocok sebagai teman menikmati mie.",
    price: 13000,
    category: "Dimsum",
  },
  {
    id: 6,
    image: "",
    title: "Lumpia Udang",
    description:
      "Lumpia berisi olahan udang yang gurih, dibungkus kulit tipis dan digoreng hingga renyah.",
    price: 13000,
    category: "Dimsum",
  },
  {
    id: 7,
    image: "",
    title: "Pangsit Goreng",
    description:
      "Pangsit dengan tekstur kulit yang renyah dan isian gurih yang nikmat di setiap gigitan.",
    price: 13000,
    category: "Dimsum",
  },
  {
    id: 8,
    image: "",
    title: "Es Gobak Sodor",
    description:
      "Minuman es buah segar dengan perpaduan rasa manis yang menyegarkan untuk menemani waktu makanmu.",
    price: 13000,
    category: "Es Buah Spesial",
  },
  {
    id: 9,
    image: "",
    title: "Es Petak Umpet",
    description:
      "Minuman segar dengan kombinasi buah dan rasa manis yang pas, cocok dinikmati saat cuaca panas.",
    price: 13000,
    category: "Es Buah Spesial",
  },
  {
    id: 10,
    image: "",
    title: "Es Teklek",
    description:
      "Minuman dingin dengan sensasi manis dan segar yang siap melepas dahaga.",
    price: 13000,
    category: "Es Buah Spesial",
  },
  {
    id: 11,
    image: "",
    title: "Es Sluku Bathok",
    description:
      "Minuman es buah dengan cita rasa manis dan menyegarkan, pilihan tepat untuk melengkapi hidangan favoritmu.",
    price: 13000,
    category: "Es Buah Spesial",
  },
]);

const search = ref("");
const categoryFilter = ref("All");

const categories = computed(() => [
  { label: "Semua", value: "All" },
  ...Array.from(new Set(menus.map((menu) => menu.category))).map(
    (category) => ({
      label: category,
      value: category,
    }), ),]);
const filteredMenu = computed(() => {
  const keyword = search.value.trim().toLowerCase();

  return menus.filter((item) => {
    const matchSearch = item.title.toLowerCase().includes(keyword);

    const matchFilter =
      categoryFilter.value === "All" || item.category === categoryFilter.value;

    return matchSearch && matchFilter;
  });
});
</script>

<template>
  <UContainer>
    <UPageCTA
      title="Resto Ijo"
      description="We've built a strong."
      variant="outline"
      class="my-5"
    >
      <template #links>
        <UInput 
        v-model="search"
         placeholder="Cari menu.." />
        <USelect
          placeholder="Pilih kategori"
          v-model="categoryFilter"
          class="w-35"
          :items="categories"
        />
      </template>
    </UPageCTA>

    <UBlogPosts>
      <UBlogPost
        v-for="menu in filteredMenu"
        :key="menu.id"
        :title="menu.title"
        :description="menu.description"
        :image="menu.image"
      >
        <template #badge>
          <div class="flex gap-x-4">
            <UBadge :label="menu.category" />
            <p class="text-primary font-semibold">Rp.{{ menu.price }}</p>
          </div>
        </template>
      </UBlogPost>
    </UBlogPosts>
  </UContainer>
</template>
