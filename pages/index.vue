<template>
  <div>
    <Suspense>
      <div h-full flex flex-col justify-center items-center>
        <div text-4xl>Hi, I'm Lo.</div>
        <Loader mt-10 />
      </div>
      <template #fallback>
        <div op50 italic>
          <span animate-pulse>Loading...</span>
        </div>
      </template>
    </Suspense>
  </div>
</template>
