<script lang="ts">
  import { onMount, onDestroy } from 'svelte'

  let display = ''
  let interval: ReturnType<typeof setInterval>

  function tick() {
    const now = new Date()
    const pad = (n: number) => String(n).padStart(2, '0')
    display = `${pad(now.getDate())}.${pad(now.getMonth() + 1)}.${now.getFullYear()}  /  ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
  }

  onMount(() => { tick(); interval = setInterval(tick, 1000) })
  onDestroy(() => clearInterval(interval))
</script>

<time class="clock">{display}</time>

<style>
  .clock {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 0.875rem;
    color: var(--text-muted);
    letter-spacing: 0.04em;
    white-space: nowrap;
  }
</style>
