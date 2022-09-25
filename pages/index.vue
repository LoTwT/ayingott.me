<script setup lang="ts">
definePageMeta({
  layout: "default",
})

const router = useRouter()
const onBtnClick = () => router.push("/intro")
</script>

<template>
  <Button @click="onBtnClick"> Ayingott </Button>
</template>
