<template>
  <div class="nicole-cover" aria-hidden="true">
    <div class="nicole-art">
      <div class="markdown-sheet font-mono">
        <span class="paper-tab"></span>
        <span class="markdown-mark">#</span>
        <span class="writing-line"></span>
        <span class="writing-line short"></span>
        <span class="file-extension">.md</span>
      </div>
      <div>
        <p class="nicole-wordmark font-display">Nicole</p>
      </div>
    </div>
    <p class="cover-note">Markdown 写作示意</p>
  </div>
</template>

<style scoped>
.nicole-cover {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: var(--surface-elevated);
  container-type: inline-size;
}

.nicole-art {
  display: flex;
  flex: 1;
  min-height: 0;
  align-items: center;
  justify-content: center;
  gap: 6cqw;
  padding: 6cqw;
}

.markdown-sheet {
  position: relative;
  display: flex;
  width: 22cqw;
  height: 30cqw;
  flex-shrink: 0;
  flex-direction: column;
  padding: 4cqw;
  border: 1px solid var(--border-default);
  background: var(--surface-panel);
  box-shadow: 0.5cqw 0.6cqw 0 var(--brutal-shadow);
  transform: rotate(-6deg);
}

.paper-tab {
  position: absolute;
  top: -1px;
  right: -1px;
  width: 4.5cqw;
  height: 4.5cqw;
  border: 1px solid var(--brutal-sticker-ink);
  background: var(--brutal-yellow);
}

.markdown-mark {
  font-size: 8.5cqw;
  font-weight: 700;
  line-height: 1;
}

.writing-line {
  width: 9cqw;
  height: 1px;
  margin-top: 2cqw;
  background: var(--text-muted);
  opacity: 0.6;
}

.writing-line.short {
  width: 7cqw;
  margin-top: 1.8cqw;
}

.file-extension {
  margin-top: auto;
  font-size: 5cqw;
  line-height: 1;
}

.nicole-wordmark {
  font-size: 11cqw;
  font-weight: 600;
  line-height: 1.1;
}

.cover-note {
  flex-shrink: 0;
  padding: 0 4cqw 3cqw;
  font-size: max(0.6875rem, 3.6cqw);
  text-align: right;
  color: var(--text-muted);
}
</style>
