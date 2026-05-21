<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import type { StaffMember } from '../types'

  let staff: StaffMember[] = []
  let loading = true
  let fetchError = ''
  let selectedIndex: number | null = null

  // Out dialog state
  let showOutDialog = false
  let outMinutes = 30

  // Late-staff toast
  let lateToast: StaffMember | null = null
  const shownToasts = new Map<string, Date>()
  const dismissedToasts = new Map<string, Date>()
  let lateInterval: ReturnType<typeof setInterval>

  onMount(async () => {
    try {
      const res = await fetch('https://randomuser.me/api/?results=5')
      const data = await res.json()
      staff = data.results.map((r: { name: { first: string; last: string }; picture: { thumbnail: string }; email: string }, i: number) => ({
        id: String(i),
        name: r.name.first,
        surname: r.name.last,
        picture: r.picture.thumbnail,
        email: r.email,
        status: 'In' as const,
        outTime: '—',
        duration: '—',
        expectedReturnTime: '—',
        expectedReturnTimeDate: null,
        lastClockInTime: null,
      }))
    } catch {
      fetchError = 'Could not fetch staff data from API.'
    } finally {
      loading = false
    }
    lateInterval = setInterval(checkLate, 30_000)
  })

  onDestroy(() => clearInterval(lateInterval))

  function toggleSelect(i: number) {
    selectedIndex = selectedIndex === i ? null : i
  }

  function openOutDialog() {
    if (selectedIndex === null) return
    outMinutes = 30
    showOutDialog = true
  }

  function confirmOut() {
    if (selectedIndex === null || outMinutes < 1 || outMinutes > 2880) return
    const now = new Date()
    const returnDate = new Date(now.getTime() + outMinutes * 60_000)
    const s = staff[selectedIndex]
    if (s.status === 'Out') shownToasts.delete(s.email)

    staff[selectedIndex] = {
      ...s,
      status: 'Out',
      outTime: fmt(now),
      duration: outMinutes >= 60 ? `${Math.floor(outMinutes / 60)}h ${outMinutes % 60}m` : `${outMinutes}m`,
      expectedReturnTime: fmt(returnDate),
      expectedReturnTimeDate: returnDate,
    }
    staff = staff
    showOutDialog = false
    selectedIndex = null
  }

  function markIn() {
    if (selectedIndex === null) return
    staff[selectedIndex] = {
      ...staff[selectedIndex],
      status: 'In',
      outTime: '—',
      duration: '—',
      expectedReturnTime: '—',
      expectedReturnTimeDate: null,
      lastClockInTime: new Date(),
    }
    staff = staff
    selectedIndex = null
  }

  function clockInFromToast() {
    if (!lateToast) return
    const idx = staff.findIndex(s => s.email === lateToast!.email)
    if (idx !== -1) {
      staff[idx] = {
        ...staff[idx],
        status: 'In',
        outTime: '—',
        duration: '—',
        expectedReturnTime: '—',
        expectedReturnTimeDate: null,
        lastClockInTime: new Date(),
      }
      staff = staff
      shownToasts.delete(lateToast.email)
      dismissedToasts.delete(lateToast.email)
    }
    lateToast = null
  }

  function dismissToast() {
    if (lateToast) dismissedToasts.set(lateToast.email, new Date())
    lateToast = null
  }

  function checkLate() {
    if (lateToast) return
    const now = new Date()
    for (const s of staff) {
      if (s.status !== 'Out' || !s.expectedReturnTimeDate || s.expectedReturnTimeDate >= now) continue
      const shown = shownToasts.get(s.email)
      const dismissed = dismissedToasts.get(s.email)
      if (shown && (!s.lastClockInTime || shown > s.lastClockInTime)) continue
      if (dismissed && (!s.lastClockInTime || dismissed > s.lastClockInTime)) continue
      lateToast = s
      shownToasts.set(s.email, now)
      break
    }
  }

  function fmt(d: Date) {
    return [d.getHours(), d.getMinutes(), d.getSeconds()].map(n => String(n).padStart(2, '0')).join(':')
  }
</script>

<section class="panel">
  <div class="panel-header">
    <h2>Staff</h2>
    <span class="badge-count">{staff.filter(s => s.status === 'In').length}/{staff.length} in office</span>
  </div>

  {#if loading}
    <div class="state-msg">
      <div class="spinner"></div>
      <span>Fetching staff from API…</span>
    </div>
  {:else if fetchError}
    <div class="state-msg error">{fetchError}</div>
  {:else}
    <div class="table-scroll">
      <table>
        <thead>
          <tr>
            <th>Photo</th>
            <th>Name</th>
            <th>Surname</th>
            <th>Email</th>
            <th>Status</th>
            <th>Out Time</th>
            <th>Duration</th>
            <th>Expected Return</th>
          </tr>
        </thead>
        <tbody>
          {#each staff as member, i (member.id)}
            <tr
              class:selected={selectedIndex === i}
              class:out={member.status === 'Out'}
              on:click={() => toggleSelect(i)}
              aria-selected={selectedIndex === i}
            >
              <td><img src={member.picture} alt="{member.name} {member.surname}" class="avatar" /></td>
              <td class="fw-medium">{member.name}</td>
              <td>{member.surname}</td>
              <td class="email">{member.email}</td>
              <td>
                <span class="status-pill" class:pill-in={member.status === 'In'} class:pill-out={member.status === 'Out'}>
                  {member.status === 'In' ? '● In' : '○ Out'}
                </span>
              </td>
              <td class="mono">{member.outTime}</td>
              <td class="mono">{member.duration}</td>
              <td class="mono">{member.expectedReturnTime}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    <div class="row-actions">
      <span class="hint">{selectedIndex !== null ? `Row ${selectedIndex + 1} selected` : 'Click a row to select'}</span>
      <div class="btn-group">
        <button class="btn btn-danger" on:click={openOutDialog} disabled={selectedIndex === null}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 1v7M3 6l5 5 5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M1 14h14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          Mark Out
        </button>
        <button class="btn btn-success" on:click={markIn} disabled={selectedIndex === null}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 15V8M3 10l5-5 5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M1 2h14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          Mark In
        </button>
      </div>
    </div>
  {/if}
</section>

<!-- Duration dialog -->
{#if showOutDialog}
  <div class="overlay" on:click={() => (showOutDialog = false)} role="presentation">
    <div class="dialog" on:click|stopPropagation on:keydown={() => {}} role="dialog" aria-modal="true" aria-labelledby="dialog-title">
      <h3 id="dialog-title">Set Absence Duration</h3>
      {#if selectedIndex !== null}
        <p class="dialog-sub">
          How long will <strong>{staff[selectedIndex].name} {staff[selectedIndex].surname}</strong> be away?
        </p>
      {/if}
      <label class="field-label">
        Minutes <span class="field-hint">(1 – 2880)</span>
        <input
          type="number"
          bind:value={outMinutes}
          min="1"
          max="2880"
          class="field-input"
          on:keydown={e => e.key === 'Enter' && confirmOut()}
        />
      </label>
      {#if outMinutes >= 60}
        <p class="duration-preview">
          = {Math.floor(outMinutes / 60)}h {outMinutes % 60}m
        </p>
      {/if}
      <div class="dialog-actions">
        <button class="btn btn-ghost" on:click={() => (showOutDialog = false)}>Cancel</button>
        <button
          class="btn btn-primary"
          on:click={confirmOut}
          disabled={outMinutes < 1 || outMinutes > 2880}
        >Confirm</button>
      </div>
    </div>
  </div>
{/if}

<!-- Late staff toast (top-right) -->
{#if lateToast}
  <div class="toast toast-right" role="alert" aria-live="assertive">
    <div class="toast-header">
      <span class="toast-icon warning">⚠</span>
      <strong>Staff Member Late</strong>
      <button class="toast-close" on:click={dismissToast} aria-label="Close">✕</button>
    </div>
    <div class="toast-body">
      <img src={lateToast.picture} alt="{lateToast.name} {lateToast.surname}" class="avatar avatar-lg" />
      <div>
        <div class="fw-medium">{lateToast.name} {lateToast.surname}</div>
        <div class="text-muted text-sm">{lateToast.email}</div>
        <div class="text-sm mt-1">Out for <strong>{lateToast.duration}</strong></div>
      </div>
    </div>
    <div class="toast-actions">
      <button class="btn btn-sm btn-ghost" on:click={dismissToast}>Dismiss</button>
      <button class="btn btn-sm btn-success" on:click={clockInFromToast}>Clock In</button>
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

  .state-msg {
    padding: 2rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    color: var(--text-muted);
  }

  .state-msg.error { color: var(--danger); }

  .spinner {
    width: 18px;
    height: 18px;
    border: 2px solid var(--border);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    flex-shrink: 0;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  .table-scroll {
    overflow-x: auto;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    min-width: 700px;
  }

  thead tr {
    border-bottom: 1px solid var(--border);
  }

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

  tbody tr.out td { color: var(--text-muted); }

  tbody tr:last-child td { border-bottom: none; }

  .avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: block;
    border: 2px solid var(--border);
  }

  .avatar-lg { width: 40px; height: 40px; }

  .email { color: var(--text-muted); font-size: 0.8125rem; }

  .mono { font-family: 'JetBrains Mono', monospace; font-size: 0.8125rem; }

  .fw-medium { font-weight: 500; }

  .status-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.3em;
    font-size: 0.75rem;
    font-weight: 500;
    padding: 0.2em 0.6em;
    border-radius: 999px;
    letter-spacing: 0.02em;
  }

  .pill-in  { color: var(--success); background: var(--success-dim); }
  .pill-out { color: var(--danger);  background: var(--danger-dim);  }

  .row-actions {
    padding: 1rem 1.5rem;
    border-top: 1px solid var(--border-subtle);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  .hint { font-size: 0.75rem; color: var(--text-dim); }

  .btn-group { display: flex; gap: 0.5rem; }

  /* Shared button styles */
  :global(.btn) {
    display: inline-flex;
    align-items: center;
    gap: 0.4em;
    padding: 0.45em 0.9em;
    border-radius: var(--radius-sm);
    font-size: 0.8125rem;
    font-weight: 500;
    border: 1px solid transparent;
    cursor: pointer;
    transition: background var(--transition), color var(--transition), opacity var(--transition);
    line-height: 1.4;
  }

  :global(.btn:disabled) { opacity: 0.35; cursor: not-allowed; }

  :global(.btn-primary) { background: var(--accent); color: #fff; }
  :global(.btn-primary:not(:disabled):hover) { background: var(--accent-hover); }

  :global(.btn-success) { background: var(--success-dim); color: var(--success); border-color: var(--success); }
  :global(.btn-success:not(:disabled):hover) { background: var(--success); color: #0d0f18; }

  :global(.btn-danger) { background: var(--danger-dim); color: var(--danger); border-color: var(--danger); }
  :global(.btn-danger:not(:disabled):hover) { background: var(--danger); color: #fff; }

  :global(.btn-ghost) { background: transparent; color: var(--text-muted); border-color: var(--border); }
  :global(.btn-ghost:not(:disabled):hover) { background: var(--surface-raised); color: var(--text); }

  :global(.btn-sm) { padding: 0.3em 0.65em; font-size: 0.75rem; }

  /* Dialog / overlay */
  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 200;
    backdrop-filter: blur(2px);
  }

  .dialog {
    background: var(--surface-raised);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 1.75rem;
    width: 360px;
    max-width: 90vw;
    box-shadow: var(--shadow);
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .dialog h3 { font-size: 1rem; font-weight: 600; }

  .dialog-sub { font-size: 0.875rem; color: var(--text-muted); }

  .field-label {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    font-size: 0.8125rem;
    font-weight: 500;
  }

  .field-hint { color: var(--text-dim); font-weight: 400; }

  .field-input {
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    color: var(--text);
    padding: 0.5em 0.75em;
    font-size: 0.9375rem;
    width: 100%;
  }

  .field-input:focus { outline: none; border-color: var(--accent); }

  .duration-preview {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.875rem;
    color: var(--accent);
  }

  .dialog-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    margin-top: 0.25rem;
  }

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

  .toast-right { right: 1.5rem; }

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

  .toast-icon { font-size: 1rem; }
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
    align-items: center;
    gap: 0.75rem;
    padding: 0.875rem 1rem;
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
