<script lang="ts">
  import { enhance } from '$app/forms'
  import type { ActionData } from './$types'
  export let form: ActionData

  const DEMO_EMAIL = 'admin@noroff.no'
  const DEMO_PASSWORD = 'P@ssword2023'

  let email = ''
  let password = ''

  function fillCredentials() { email = DEMO_EMAIL; password = DEMO_PASSWORD }
  function clearCredentials() { email = ''; password = '' }
</script>

<svelte:head><title>Login — WDT Admin</title></svelte:head>

<a href="https://mistakronos.github.io/Personal-Projects/" class="portfolio-back">&#8592; Portfolio</a>

<div class="shell">
  <div class="card">
    <div class="brand">
      <div class="brand-logo">WDT</div>
      <div>
        <div class="brand-name">WeDeliverTech</div>
        <div class="brand-sub">Admin Panel</div>
      </div>
    </div>

    <h1>Sign in</h1>
    <p class="sub">Admin access only</p>

    <form method="POST" use:enhance>
      {#if form?.error}
        <p class="form-error">{form.error}</p>
      {/if}

      <label class="form-field">
        <span class="form-label">Email</span>
        <input class="form-input" type="email" name="email" placeholder="admin@noroff.no" required bind:value={email} />
      </label>

      <label class="form-field" style="margin-top:1rem">
        <span class="form-label">Password</span>
        <input class="form-input" type="password" name="password" placeholder="••••••••" required bind:value={password} />
      </label>

      <button class="btn btn-primary" style="width:100%;margin-top:1.5rem;justify-content:center;padding:.65em 1em">
        Sign in
      </button>
    </form>

    <div class="cred-actions">
      <button class="btn btn-ghost btn-sm" type="button" on:click={fillCredentials}>Add credentials</button>
      <button class="btn btn-ghost btn-sm" type="button" on:click={clearCredentials}>Clear credentials</button>
    </div>
  </div>
</div>

<style>
  .shell {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    background: radial-gradient(circle at 30% 20%, rgba(99,102,241,0.08) 0%, transparent 50%);
  }

  .card {
    width: 100%;
    max-width: 380px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 2rem;
    box-shadow: var(--shadow);
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 2rem;
  }

  .brand-logo {
    width: 36px; height: 36px;
    background: var(--accent);
    border-radius: var(--radius-sm);
    display: flex; align-items: center; justify-content: center;
    font-weight: 700; font-size: 0.75rem; letter-spacing: 0.08em;
    flex-shrink: 0;
  }

  .brand-name { font-weight: 700; font-size: 0.9375rem; }
  .brand-sub  { font-size: 0.6875rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.04em; }

  h1   { font-size: 1.375rem; font-weight: 700; letter-spacing: -0.02em; }
  .sub { font-size: 0.8125rem; color: var(--text-muted); margin-top: 0.25rem; margin-bottom: 1.5rem; }

  .cred-actions {
    display: flex;
    gap: 0.5rem;
    margin-top: 1rem;
    justify-content: center;
  }

  .portfolio-back {
    position: fixed;
    top: 1rem;
    left: 1rem;
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--text-muted);
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.35rem 0.75rem;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    transition: color 150ms;
    z-index: 10;
  }
  .portfolio-back:hover { color: var(--text); }
</style>
