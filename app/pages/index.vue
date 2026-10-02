<script setup lang="ts">
import { useHead, useSeoMeta } from "#imports"
import HomeIntroduction from "~/components/home/HomeIntroduction.vue"

const pageTitle = "Lo"
const pageDescription = "Lo 的个人主页，GitHub、邮箱与简历。"
const canonicalUrl = "https://ayingott.me/"
const socialImageUrl = new URL("/og-image.png", canonicalUrl).href
const socialImageAlt = "米白色背景上的“你好，我是 Lo”和域名 ayingott.me"

useHead({ link: [{ rel: "canonical", href: canonicalUrl }] })

useSeoMeta({
  title: pageTitle,
  description: pageDescription,
  ogType: "website",
  ogSiteName: "Lo",
  ogTitle: pageTitle,
  ogDescription: pageDescription,
  ogUrl: canonicalUrl,
  ogLocale: "zh_CN",
  ogImage: socialImageUrl,
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageType: "image/png",
  ogImageAlt: socialImageAlt,
  twitterCard: "summary_large_image",
  twitterTitle: pageTitle,
  twitterDescription: pageDescription,
  twitterImage: socialImageUrl,
  twitterImageAlt: socialImageAlt,
})
</script>

<template>
  <main id="main-content" tabindex="-1">
    <HomeIntroduction />
  </main>
</template>
