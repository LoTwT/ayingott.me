<script setup lang="ts">
const exampleSections = [
  {
    id: "works",
    title: "作品",
    items: [
      { title: "一个小工具", description: "让日常的一件小事，变得简单一点。" },
      {
        title: "一次界面尝试",
        description: "从一个想法开始，慢慢做出它的样子。",
      },
    ],
  },
  {
    id: "writing",
    title: "文章",
    items: [
      { title: "从简单的地方开始", description: "关于取舍，也关于留白。" },
      {
        title: "做东西时的一些笔记",
        description: "留下一点过程，方便以后回看。",
      },
    ],
  },
] as const
</script>

<template>
  <div>
    <section
      v-for="section in exampleSections"
      :key="section.id"
      :aria-labelledby="`${section.id}-title`"
      class="home-content-section flex items-center border-t border-(--border-subtle)"
    >
      <div
        class="grid w-full gap-8 sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-10"
      >
        <div class="flex items-baseline gap-3 sm:block sm:space-y-3">
          <h2
            :id="`${section.id}-title`"
            class="font-display text-xl font-medium"
          >
            {{ section.title }}
          </h2>
          <p class="text-sm text-(--text-muted)">示例 · 待定</p>
        </div>
        <ul class="space-y-9 sm:space-y-10">
          <li v-for="item in section.items" :key="item.title" class="space-y-2">
            <h3 class="text-lg font-medium">{{ item.title }}</h3>
            <p class="text-sm leading-7 text-(--text-secondary)">
              {{ item.description }}
            </p>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-content-section {
  min-block-size: 100dvh;
  padding-block: 3rem calc(3rem + 8dvh);
}
</style>
