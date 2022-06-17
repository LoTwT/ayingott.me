<script setup lang="ts"></script>

<template>
  <MotionAppear flex justify-center mb-10>
    <img src="/mea.jpg" alt="avatar" rounded-full />
  </MotionAppear>
  <MotionAppear :duration="5000" mb-10>
    <span text-5xl opacity-80> Hi! I'm an ordinary FE developer. </span>
  </MotionAppear>
  <MotionAppear :duration="5000">
    <span text-5xl opacity-80>
      Find me on
      <NuxtLink href="https://github.com/lotwt">
        <span class="github" relative>Github</span>
      </NuxtLink>
      .
    </span>
  </MotionAppear>
</template>

<style scoped>
.github::before {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 5px;
  background-color: white;
  z-index: -1;
  transition: all 0.5s;
}

.github:hover::before {
  height: 100%;
}

.github:hover {
  color: black;
}

.github:active:before {
  background: #b9b9b9;
}
</style>
