<script setup lang="ts">
import { useHead, useSeoMeta } from "#imports"
import HomeIntroduction from "~/components/home/HomeIntroduction.vue"
import {
  contactEmailAddress,
  githubProfileUrl,
  ownerName,
  siteOrigin,
} from "~/utils/profile"

const pageTitle = ownerName
const pageDescription = `${ownerName} 的个人主页，GitHub、邮箱与简历。`
const canonicalUrl = `${siteOrigin}/`
const socialImageUrl = new URL("/og-image.png", canonicalUrl).href
const socialImageAlt = `米白色背景上的“你好，我是 ${ownerName}”和域名 ${new URL(siteOrigin).host}`

const personStructuredData = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: ownerName,
  url: canonicalUrl,
  email: `mailto:${contactEmailAddress}`,
  sameAs: [githubProfileUrl],
}

useHead({
  link: [{ rel: "canonical", href: canonicalUrl }],
  script: [
    {
      key: "person-structured-data",
      type: "application/ld+json",
      innerHTML: JSON.stringify(personStructuredData),
    },
  ],
})

useSeoMeta({
  title: pageTitle,
  description: pageDescription,
  ogType: "website",
  ogSiteName: ownerName,
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
