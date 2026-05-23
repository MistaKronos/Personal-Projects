<script lang="ts">
  import Clock from './lib/Clock.svelte'
  import StaffTable from './lib/StaffTable.svelte'
  import DeliveryBoard from './lib/DeliveryBoard.svelte'
</script>

<div class="shell">
  <header class="topbar">
    <div class="topbar-left">
      <a href="../../../index.html" class="back-link">&#8592; Portfolio</a>
      <div class="brand">
        <div class="brand-logo">WDT</div>
        <div class="brand-text">
          <span class="brand-name">WeDeliverTech</span>
          <span class="brand-sub">Reception Dashboard</span>
        </div>
      </div>
    </div>
    <Clock />
  </header>

  <main class="content">
    <StaffTable />
    <DeliveryBoard />
  </main>

  <footer class="footer">
    <span>WeDeliverTech &mdash; Reception Management Dashboard</span>
    <span class="footer-tag">Modern Stack &bull; Svelte &bull; TypeScript &bull; Vite</span>
  </footer>
</div>

<style>
  .shell {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .topbar {
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    padding: 0.875rem 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 100;
    gap: 1rem;
  }

  .topbar-left {
    display: flex;
    align-items: center;
    gap: 1.25rem;
  }

  .back-link {
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--text-muted);
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    transition: color 150ms;
    white-space: nowrap;
  }
  .back-link:hover { color: var(--text); }

  .brand {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .brand-logo {
    width: 36px;
    height: 36px;
    background: var(--accent);
    border-radius: var(--radius-sm);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 0.75rem;
    letter-spacing: 0.08em;
    flex-shrink: 0;
  }

  .brand-text {
    display: flex;
    flex-direction: column;
    gap: 0;
    line-height: 1.2;
  }

  .brand-name {
    font-weight: 700;
    font-size: 0.9375rem;
  }

  .brand-sub {
    font-size: 0.6875rem;
    color: var(--text-muted);
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .content {
    flex: 1;
    padding: 2rem;
    max-width: 1280px;
    width: 100%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .footer {
    border-top: 1px solid var(--border-subtle);
    padding: 1rem 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 0.75rem;
    color: var(--text-dim);
  }

  .footer-tag {
    color: var(--text-dim);
    letter-spacing: 0.02em;
  }

  @media (max-width: 600px) {
    .content { padding: 1rem; }
    .footer { flex-direction: column; gap: 0.25rem; text-align: center; }
  }
</style>
