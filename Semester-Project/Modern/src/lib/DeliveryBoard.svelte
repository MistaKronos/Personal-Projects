<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import type { DeliveryDriver } from '../types'

  let drivers: DeliveryDriver[] = []
  let selectedIndex: number | null = null

  // Form state
  let vehicle: 'Motorcycle' | 'Car' = 'Motorcycle'
  let fname = ''
  let surname = ''
  let phone = ''
  let address = ''
  let returnTime = ''
  let formError = ''

  // Late driver toast — keyed by driver id (UUID), not phone
  let lateToast: DeliveryDriver | null = null
  const shownToasts = new Map<string, Date>()
  const dismissedToasts = new Map<string, Date>()
  let lateInterval: ReturnType<typeof setInterval>

  onMount(() => { lateInterval = setInterval(checkLate, 30_000) })
  onDestroy(() => clearInterval(lateInterval))

  const nameRe = /^[a-zA-ZÀ-ÖØ-öø-ÿ\s'-]+$/
  const phoneRe = /^\+?[0-9]{7,15}$/

  function submitForm() {
    formError = ''
    if (!nameRe.test(fname.trim())) { formError = 'Name must contain only letters.'; return }
    if (!nameRe.test(surname.trim())) { formError = 'Surname must contain only letters.'; return }
    if (!phoneRe.test(phone.trim())) { formError = 'Enter a valid phone number (7–15 digits, optional +).'; return }
    if (!address.trim()) { formError = 'Address is required.'; return }
    if (!returnTime) { formError = 'Return time is required.'; return }

    drivers = [...drivers, {
      id: crypto.randomUUID(),
      name: fname.trim(),
      surname: surname.trim(),
      vehicle,
      phone: phone.trim(),
      deliveryAddress: address.trim(),
      returnTime,
    }]

    fname = ''
    surname = ''
    phone = ''
    address = ''
    returnTime = ''
    vehicle = 'Motorcycle'
  }

  function removeSelected() {
    if (selectedIndex === null) return
    drivers = drivers.filter((_, i) => i !== selectedIndex)
    selectedIndex = null
  }

  function checkLate() {
    if (lateToast) return
    const now = new Date()
    for (const d of drivers) {
      const [h, m] = d.returnTime.split(':').map(Number)
      const ret = new Date(); ret.setHours(h, m, 0, 0)
      if (ret >= now) continue
      const shown = shownToasts.get(d.id)
      const dismissed = dismissedToasts.get(d.id)
      if (shown && shown > ret) continue
      if (dismissed && dismissed > ret) continue
      lateToast = d
      shownToasts.set(d.id, now)
      break
    }
  }

  function dismissToast() {
    if (lateToast) dismissedToasts.set(lateToast.id, new Date())
    lateToast = null
  }

  function clearRowFromToast() {
    if (!lateToast) return
    drivers = drivers.filter(d => d.id !== lateToast!.id)
    lateToast = null
  }

  function vehicleIcon(v: 'Motorcycle' | 'Car') {
    return v === 'Motorcycle'
      ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="17" r="3"/><circle cx="18" cy="17" r="3"/><path d="M6 17h6l-2-7h4l2 4"/><path d="M9 10l-3-4h4"/></svg>`
      : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="8" width="22" height="9" rx="2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/><path d="M5 8V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v2"/></svg>`
  }
</script>

<!-- Schedule Delivery Form -->
<section class="panel">
  <div class="panel-header">
    <h2>Schedule Delivery</h2>
  </div>

  <form class="delivery-form" on:submit|preventDefault={submitForm} novalidate>
    <div class="vehicle-group">
      <span class="form-label">Vehicle</span>
      <div class="radio-cards">
        <label class="radio-card" class:active={vehicle === 'Motorcycle'}>
          <input type="radio" name="vehicle" value="Motorcycle" bind:group={vehicle} />
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="17" r="3"/><circle cx="18" cy="17" r="3"/><path d="M6 17h6l-2-7h4l2 4"/><path d="M9 10l-3-4h4"/></svg>
          Motorcycle
        </label>
        <label class="radio-card" class:active={vehicle === 'Car'}>
          <input type="radio" name="vehicle" value="Car" bind:group={vehicle} />
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="8" width="22" height="9" rx="2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/><path d="M5 8V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v2"/></svg>
          Car
        </label>
      </div>
    </div>

    <div class="form-grid">
      <label class="form-field">
        <span class="form-label">First Name</span>
        <input type="text" bind:value={fname} placeholder="Jane" autocomplete="off" />
      </label>
      <label class="form-field">
        <span class="form-label">Surname</span>
        <input type="text" bind:value={surname} placeholder="Doe" autocomplete="off" />
      </label>
      <label class="form-field">
        <span class="form-label">Phone</span>
        <input type="tel" bind:value={phone} placeholder="+47 123 45 678" autocomplete="off" />
      </label>
      <label class="form-field">
        <span class="form-label">Delivery Address</span>
        <input type="text" bind:value={address} placeholder="123 Main St" autocomplete="off" />
      </label>
      <label class="form-field">
        <span class="form-label">Expected Return</span>
        <input type="time" bind:value={returnTime} />
      </label>
    </div>

    {#if formError}
      <p class="form-error">{formError}</p>
    {/if}

    <div class="form-footer">
      <button type="submit" class="btn btn-primary">
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
        Add Delivery
      </button>
    </div>
  </form>
</section>

<!-- Delivery Board -->
<section class="panel">
  <div class="panel-header">
    <h2>Delivery Board</h2>
    <span class="badge-count">{drivers.length} active</span>
  </div>

  {#if drivers.length === 0}
    <div class="empty-state">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="8" width="22" height="9" rx="2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/><path d="M5 8V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v2"/></svg>
      <p>No active deliveries</p>
    </div>
  {:else}
    <div class="table-scroll">
      <table>
        <thead>
          <tr>
            <th>Vehicle</th>
            <th>Name</th>
            <th>Surname</th>
            <th>Phone</th>
            <th>Delivery Address</th>
            <th>Return Time</th>
          </tr>
        </thead>
        <tbody>
          {#each drivers as driver, i (driver.id)}
            <tr
              class:selected={selectedIndex === i}
              on:click={() => selectedIndex = selectedIndex === i ? null : i}
              aria-selected={selectedIndex === i}
            >
              <td>
                <span class="vehicle-icon">
                  {@html vehicleIcon(driver.vehicle)}
                  {driver.vehicle}
                </span>
              </td>
              <td class="fw-medium">{driver.name}</td>
              <td>{driver.surname}</td>
              <td class="mono">{driver.phone}</td>
              <td>{driver.deliveryAddress}</td>
              <td class="mono">{driver.returnTime}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    <div class="row-actions">
      <span class="hint">{selectedIndex !== null ? `Row ${selectedIndex + 1} selected` : 'Click a row to select'}</span>
      <button class="btn btn-danger" on:click={removeSelected} disabled={selectedIndex === null}>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M2 4h12M5 4V2h6v2M6 7v5M10 7v5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M3 4l1 9h8l1-9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        Remove
      </button>
    </div>
  {/if}
</section>

<!-- Late driver toast (top-left) -->
{#if lateToast}
  <div class="toast toast-left" role="alert" aria-live="assertive">
    <div class="toast-header">
      <span class="toast-icon warning">⚠</span>
      <strong>Delivery Driver Late</strong>
      <button class="toast-close" on:click={dismissToast} aria-label="Close">✕</button>
    </div>
    <div class="toast-body">
      <div class="driver-icon">
        {@html vehicleIcon(lateToast.vehicle)}
      </div>
      <div>
        <div class="fw-medium">{lateToast.name} {lateToast.surname}</div>
        <div class="text-muted text-sm">📞 {lateToast.phone}</div>
        <div class="text-muted text-sm">📍 {lateToast.deliveryAddress}</div>
        <div class="text-sm mt-1">Was due at <strong>{lateToast.returnTime}</strong></div>
      </div>
    </div>
    <div class="toast-actions">
      <button class="btn btn-sm btn-ghost" on:click={dismissToast}>Dismiss</button>
      <button class="btn btn-sm btn-danger" on:click={clearRowFromToast}>Clear Row</button>
    </div>
  </div>
{/if}

<style>
  .panel {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    overflow: hidden;
  }

  .panel-header {
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid var(--border-subtle);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .panel-header h2 {
    font-size: 1rem;
    font-weight: 600;
    letter-spacing: -0.01em;
  }

  .badge-count {
    font-size: 0.75rem;
    color: var(--text-muted);
    background: var(--surface-raised);
    border: 1px solid var(--border);
    border-radius: 999px;
    padding: 0.2em 0.7em;
  }

  /* Form */
  .delivery-form {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .vehicle-group { display: flex; flex-direction: column; gap: 0.5rem; }

  .form-label {
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--text-muted);
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .radio-cards {
    display: flex;
    gap: 0.75rem;
  }

  .radio-card {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    cursor: pointer;
    font-size: 0.875rem;
    color: var(--text-muted);
    transition: all var(--transition);
    user-select: none;
  }

  .radio-card input { display: none; }

  .radio-card:hover { border-color: var(--accent); color: var(--text); }

  .radio-card.active {
    border-color: var(--accent);
    background: var(--accent-dim);
    color: var(--accent-hover);
  }

  .form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
  }

  .form-field {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  .form-field input {
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    color: var(--text);
    padding: 0.45em 0.7em;
    font-size: 0.875rem;
    width: 100%;
  }

  .form-field input:focus { outline: none; border-color: var(--accent); }
  .form-field input::placeholder { color: var(--text-dim); }

  .form-error {
    font-size: 0.8125rem;
    color: var(--danger);
    background: var(--danger-dim);
    border-radius: var(--radius-sm);
    padding: 0.5em 0.75em;
  }

  .form-footer { display: flex; justify-content: flex-end; }

  /* Table */
  .table-scroll { overflow-x: auto; }

  table { width: 100%; border-collapse: collapse; min-width: 600px; }

  thead tr { border-bottom: 1px solid var(--border); }

  th {
    padding: 0.75rem 1rem;
    text-align: left;
    font-size: 0.6875rem;
    font-weight: 600;
    color: var(--text-muted);
    letter-spacing: 0.06em;
    text-transform: uppercase;
    white-space: nowrap;
  }

  td {
    padding: 0.625rem 1rem;
    border-bottom: 1px solid var(--border-subtle);
    vertical-align: middle;
  }

  tbody tr {
    cursor: pointer;
    transition: background var(--transition);
  }

  tbody tr:hover { background: var(--surface-raised); }

  tbody tr.selected {
    background: var(--accent-dim);
    outline: 1px solid var(--accent) inset;
  }

  tbody tr:last-child td { border-bottom: none; }

  .vehicle-icon {
    display: inline-flex;
    align-items: center;
    gap: 0.4em;
    font-size: 0.8125rem;
    color: var(--text-muted);
  }

  .mono { font-family: 'JetBrains Mono', monospace; font-size: 0.8125rem; }
  .fw-medium { font-weight: 500; }

  .empty-state {
    padding: 3rem 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    color: var(--text-dim);
  }

  .empty-state p { font-size: 0.875rem; }

  .row-actions {
    padding: 1rem 1.5rem;
    border-top: 1px solid var(--border-subtle);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  .hint { font-size: 0.75rem; color: var(--text-dim); }

  /* Toast */
  .toast {
    position: fixed;
    top: 1.5rem;
    z-index: 300;
    width: 320px;
    background: var(--surface-raised);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow);
    overflow: hidden;
    animation: slideIn 200ms ease;
  }

  .toast-left { left: 1.5rem; }

  @keyframes slideIn {
    from { opacity: 0; transform: translateY(-12px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .toast-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    border-bottom: 1px solid var(--border-subtle);
  }

  .toast-header strong { flex: 1; font-size: 0.875rem; }

  .toast-icon.warning { color: var(--warning); }

  .toast-close {
    background: none;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    font-size: 0.875rem;
    padding: 0.2em;
    line-height: 1;
    border-radius: 2px;
  }

  .toast-close:hover { color: var(--text); }

  .toast-body {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 0.875rem 1rem;
  }

  .driver-icon {
    width: 40px;
    height: 40px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-muted);
    flex-shrink: 0;
  }

  .toast-actions {
    display: flex;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    border-top: 1px solid var(--border-subtle);
    justify-content: flex-end;
  }

  .text-muted { color: var(--text-muted); }
  .text-sm { font-size: 0.8125rem; }
  .mt-1 { margin-top: 0.25rem; }
</style>
