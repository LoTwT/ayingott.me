<script setup lang="ts">
import { computed } from "vue"
import PostTagLinks from "~/components/posts/PostTagLinks.vue"

export interface PostListItem {
  path: string
  title: string
  date: string
  tags?: string[]
}

const props = defineProps<{ posts: readonly PostListItem[] }>()

// date is a YYYY-MM-DD string; slice it instead of parsing it with Date to avoid time zone shifts.
const postsGroupedByYear = computed(() => {
  const groups: { year: string; posts: PostListItem[] }[] = []
  for (const post of props.posts) {
    const year = post.date.slice(0, 4)
    const lastGroup = groups.at(-1)
    if (lastGroup?.year === year) lastGroup.posts.push(post)
    else groups.push({ year, posts: [post] })
  }
  return groups
})
</script>

<template>
  <div class="flex flex-col gap-12">
    <section
      v-for="group in postsGroupedByYear"
      :key="group.year"
      :aria-labelledby="`posts-${group.year}`"
    >
      <h2
        :id="`posts-${group.year}`"
        class="theme-color-transition font-mono text-sm text-(--text-muted)"
      >
        {{ group.year }}
      </h2>
      <ul class="mt-5 flex flex-col gap-5">
        <li
          v-for="post in group.posts"
          :key="post.path"
          class="flex items-baseline justify-between gap-6"
        >
          <div class="min-w-0">
            <NuxtLink
              :to="post.path"
              class="rounded-(--radius-control) text-lg text-(--text-primary) decoration-(--text-muted) underline-offset-4 focus-ring hover:underline"
            >
              {{ post.title }}
            </NuxtLink>
            <PostTagLinks :tags="post.tags ?? []" class="mt-1" />
          </div>
          <time
            :datetime="post.date"
            class="theme-color-transition shrink-0 font-mono text-sm text-(--text-muted)"
          >
            {{ post.date.slice(5) }}
          </time>
        </li>
      </ul>
    </section>
  </div>
</template>
