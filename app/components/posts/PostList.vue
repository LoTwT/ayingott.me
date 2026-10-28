<script setup lang="ts">
import { computed } from "vue"
import DoodleStroke from "~/components/doodle/DoodleStroke.vue"
import PostTagLinks from "~/components/posts/PostTagLinks.vue"

export interface PostListItem {
  path: string
  title: string
  date: string
  tags?: string[]
}

const props = defineProps<{ posts: readonly PostListItem[] }>()

// date is a YYYY-MM-DD string; slice it instead of parsing it with Date to avoid time zone shifts.
// motionOrder counts across years, so the whole list lands as one sequence.
const postsGroupedByYear = computed(() => {
  const groups: {
    year: string
    posts: (PostListItem & { motionOrder: number })[]
  }[] = []
  props.posts.forEach((post, motionOrder) => {
    const year = post.date.slice(0, 4)
    const lastGroup = groups.at(-1)
    const orderedPost = { ...post, motionOrder }
    if (lastGroup?.year === year) lastGroup.posts.push(orderedPost)
    else groups.push({ year, posts: [orderedPost] })
  })
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
        class="font-mono text-sm text-(--text-muted)"
      >
        {{ group.year }}
      </h2>
      <ul class="mt-5 flex flex-col gap-5">
        <li
          v-for="post in group.posts"
          :key="post.path"
          class="post-list-item flex items-baseline justify-between gap-6"
          :style="{ '--motion-order': post.motionOrder }"
        >
          <div class="min-w-0">
            <NuxtLink
              :to="post.path"
              class="post-list-title relative inline-block rounded-(--radius-control) text-lg text-(--text-primary) focus-ring"
            >
              {{ post.title }}
              <DoodleStroke shape="wave" class="post-list-title-underline" />
            </NuxtLink>
            <PostTagLinks :tags="post.tags ?? []" class="mt-1" />
          </div>
          <time
            :datetime="post.date"
            class="shrink-0 font-mono text-sm text-(--text-muted)"
          >
            {{ post.date.slice(5) }}
          </time>
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.post-list-title-underline {
  /* Sits just under the glyphs, clear of the tags below. */
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 6px;
  stroke-width: 1.8;
  color: var(--text-muted);
}

.post-list-title:hover .post-list-title-underline,
.post-list-title:focus-visible .post-list-title-underline {
  --doodle-offset: 0;
}

/* Items drop in tilted one way, then the other; past the first screen they all land together. */
@media (prefers-reduced-motion: no-preference) {
  .post-list-item {
    --placed-rotation: -1.2deg;
    animation: dropped 520ms var(--ease-sticker) both;
    animation-delay: calc(min(var(--motion-order), 8) * 60ms + 120ms);
  }

  .post-list-item:nth-child(even) {
    --placed-rotation: 0.9deg;
  }
}
</style>
