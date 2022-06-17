<script setup lang="ts"></script>

<template>
  <MotionAppear flex justify-center mb-10>
    <img src="/mea.jpg" alt="avatar" rounded-full />
  </MotionAppear>
  <MotionAppear :duration="5000" mb-10>
    <span text-5xl opacity-80> Hi, I'm an ordinary FE developer</span>
  </MotionAppear>
  <MotionAppear :duration="5000">
    <span text-5xl opacity-80>
      Find me on
      <NuxtLink href="https://github.com/lotwt">
        <span
          relative
          before="content-none w-9 h-1 absolute bg-black bottom-0 left-0 transition-all duration-500"
          before:dark:bg-white
          hover:before="w-100%"
        >
          Github
        </span>
      </NuxtLink>
    </span>
  </MotionAppear>
</template>
