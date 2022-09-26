<script setup lang="ts">
const router = useRouter()
const onBtnClick = () => router.push('/intro')
</script>

<template>
  <Button text="Ayingott" @click="onBtnClick" />
</template>

<route lang="yaml">
meta:
  layout: default
</route>
