<script setup lang="ts"></script>

<template>
  <div relative w-full h-full flex md:flex-row flex-col>
    <div flex-1>
      <div text-12 border-b-1>
        Hi!
      </div>
      <div text-6 pt-8>
        <div>I'm Ayingott, you can also call me LoTwT.</div>
        <br>

        <div>
          I'm just an ordinary developer interested in JavaScript / TypeScript.
        </div>
        <br>

        <div>
          Find me on
          <FindLink title="Github" href="https://github.com/lotwt" />,
          <FindLink title="Twitter" href="https://twitter.com/ayingott319" />.
        </div>
        <br>

        <div>Mail me at <span border-b-1>l709937065@gmail.com</span> .</div>
        <br>

        <div>Hope and looking for a remote job.</div>
      </div>
    </div>

    <div flex justify-center items-center text-center>
      <Squares />
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: intro
</route>

