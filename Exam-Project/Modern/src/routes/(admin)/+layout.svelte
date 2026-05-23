<script lang="ts">
  import { onMount } from 'svelte'
  import { page } from '$app/stores'
  import type { LayoutData } from './$types'
  export let data: LayoutData

  onMount(() => {
    const handler = (e: PageTransitionEvent) => { if (e.persisted) window.location.reload() }
    window.addEventListener('pageshow', handler)
    return () => window.removeEventListener('pageshow', handler)
  })

  const nav = [
    { href: '/products',   label: 'Products',   icon: '🛍' },
    { href: '/brands',     label: 'Brands',     icon: '🏷' },
    { href: '/categories', label: 'Categories', icon: '📂' },
    { href: '/users',      label: 'Users',      icon: '👥' },
    { href: '/orders',     label: 'Orders',     icon: '📦' },
  ]
</script>

<div class="shell">
  <aside class="sidebar">
    <div class="sidebar-brand">
      <div class="brand-logo">WDT</div>
      <div>
        <div class="brand-name">WeDeliverTech</div>
        <div class="brand-sub">Admin Panel</div>
      </div>
    </div>

    <nav class="sidebar-nav">
      {#each nav as item}
        <a
          href={item.href}
          class="nav-item"
          class:active={$page.url.pathname.startsWith(item.href)}
        >
          <span class="nav-icon">{item.icon}</span>
          {item.label}
        </a>
      {/each}
    </nav>

    <div class="sidebar-footer">
      <div class="user-info">
        <div class="user-avatar">{data.user.email[0].toUpperCase()}</div>
        <div>
          <div class="user-email">{data.user.email}</div>
          <div class="user-role">{data.user.role}</div>
        </div>
      </div>
      <a href="/logout" data-sveltekit-reload class="btn btn-ghost btn-sm signout-link">Sign out</a>
    </div>
  </aside>

  <main class="content">
    <slot />
  </main>
</div>

<style>
  .shell {
    display: flex;
    min-height: 100vh;
  }

  .sidebar {
    width: var(--sidebar-w);
    flex-shrink: 0;
    background: var(--surface);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    position: sticky;
    top: 0;
    height: 100vh;
    overflow-y: auto;
  }

  .sidebar-brand {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1.25rem 1rem;
    border-bottom: 1px solid var(--border-subtle);
  }

  .brand-logo {
    width: 32px; height: 32px;
    background: var(--accent);
    border-radius: var(--radius-sm);
    display: flex; align-items: center; justify-content: center;
    font-weight: 700; font-size: 0.7rem; letter-spacing: 0.08em;
    flex-shrink: 0;
  }

  .brand-name { font-weight: 700; font-size: 0.875rem; }
  .brand-sub  { font-size: 0.625rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; }

  .sidebar-nav {
    flex: 1;
    padding: 0.75rem 0.5rem;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0.55rem 0.75rem;
    border-radius: var(--radius-sm);
    color: var(--text-muted);
    text-decoration: none;
    font-size: 0.875rem;
    font-weight: 500;
    transition: all 150ms;
  }

  .nav-item:hover { background: var(--surface-raised); color: var(--text); }
  .nav-item.active { background: var(--accent-dim); color: var(--accent-hover); }

  .nav-icon { font-size: 1rem; width: 1.25rem; text-align: center; }

  .sidebar-footer {
    padding: 1rem;
    border-top: 1px solid var(--border-subtle);
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }

  .user-avatar {
    width: 28px; height: 28px;
    background: var(--accent-dim);
    border: 1px solid var(--accent);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.75rem; font-weight: 600; color: var(--accent-hover);
    flex-shrink: 0;
  }

  .user-email { font-size: 0.75rem; font-weight: 500; }
  .user-role  { font-size: 0.6875rem; color: var(--text-muted); }
  .signout-link { width:100%; justify-content:center; text-align:center; text-decoration:none; }

  .content {
    flex: 1;
    padding: 2rem;
    min-width: 0;
  }

  @media (max-width: 768px) {
    .shell { flex-direction: column; }
    .sidebar { width: 100%; height: auto; position: static; }
    .sidebar-nav { flex-direction: row; flex-wrap: wrap; }
    .content { padding: 1rem; }
  }
</style>
