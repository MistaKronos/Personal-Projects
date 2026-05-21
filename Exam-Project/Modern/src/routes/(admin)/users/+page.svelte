<script lang="ts">
  import { enhance } from '$app/forms'
  import type { PageData, ActionData } from './$types'
  export let data: PageData
  export let form: ActionData

  type User = PageData['users'][number]
  let showModal = false
  let editing: User | null = null
  function openEdit(u: User) { editing = u; showModal = true }
  function closeModal() { showModal = false; editing = null }
</script>

<svelte:head><title>Users — WDT Admin</title></svelte:head>

<div class="page-header">
  <div>
    <h1>Users</h1>
    <p class="sub">{data.users.length} registered</p>
  </div>
</div>

{#if form?.error}
  <p class="form-error" style="margin-bottom:1rem">{form.error}</p>
{/if}

<div class="table-wrap">
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Email</th>
        <th>Username</th>
        <th>Role</th>
        <th>Membership</th>
        <th>Orders</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {#each data.users as u (u.id)}
        <tr>
          <td class="fw-medium">{u.firstName} {u.lastName}</td>
          <td class="text-muted text-sm">{u.email}</td>
          <td class="mono text-sm">{u.username}</td>
          <td>
            <span class="badge" class:badge-warning={u.role.name === 'Admin'} class:badge-muted={u.role.name !== 'Admin'}>
              {u.role.name}
            </span>
          </td>
          <td>
            <span class="badge badge-muted">{u.membership.name}</span>
          </td>
          <td class="mono">{u._count.orders}</td>
          <td>
            <button class="btn btn-ghost btn-sm" on:click={() => openEdit(u)}>Edit Role</button>
          </td>
        </tr>
      {/each}
      {#if data.users.length === 0}
        <tr><td colspan="7" class="empty-cell">No users found.</td></tr>
      {/if}
    </tbody>
  </table>
</div>

{#if showModal && editing}
  <div class="overlay" on:click={closeModal} role="presentation">
    <div class="modal" on:click|stopPropagation on:keydown={() => {}} role="dialog" aria-modal="true">
      <div class="modal-header">
        <h2>Edit User — {editing.firstName} {editing.lastName}</h2>
        <button class="modal-close" on:click={closeModal}>✕</button>
      </div>
      <form method="POST" action="?/update"
        use:enhance={() => { return ({ result }) => { if (result.type !== 'failure') closeModal() } }}>
        <input type="hidden" name="id" value={editing.id} />
        <label class="form-field">
          <span class="form-label">Role</span>
          <select class="form-input" name="roleId">
            {#each data.roles as r}
              <option value={r.id} selected={editing.roleId === r.id}>{r.name}</option>
            {/each}
          </select>
        </label>
        <label class="form-field">
          <span class="form-label">Membership</span>
          <select class="form-input" name="membershipId">
            {#each data.memberships as m}
              <option value={m.id} selected={editing.membershipId === m.id}>{m.name} ({(m.discountRate * 100).toFixed(0)}% discount)</option>
            {/each}
          </select>
        </label>
        <div class="modal-actions">
          <button type="button" class="btn btn-ghost" on:click={closeModal}>Cancel</button>
          <button type="submit" class="btn btn-primary">Save Changes</button>
        </div>
      </form>
    </div>
  </div>
{/if}

<style>
  .page-header { display:flex; align-items:flex-start; justify-content:space-between; gap:1rem; margin-bottom:1.5rem; }
  h1 { font-size:1.375rem; font-weight:700; letter-spacing:-0.02em; }
  .sub { font-size:0.8125rem; color:var(--text-muted); margin-top:0.2rem; }
  .table-wrap { overflow-x:auto; background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-lg); }
  table { width:100%; border-collapse:collapse; min-width:700px; }
  thead tr { border-bottom:1px solid var(--border); }
  th { padding:0.75rem 1rem; text-align:left; font-size:0.6875rem; font-weight:600; color:var(--text-muted); letter-spacing:0.06em; text-transform:uppercase; white-space:nowrap; }
  td { padding:0.625rem 1rem; border-bottom:1px solid var(--border-subtle); vertical-align:middle; }
  tbody tr:last-child td { border-bottom:none; }
  .fw-medium { font-weight:500; }
  .text-muted { color:var(--text-muted); }
  .text-sm { font-size:0.8125rem; }
  .mono { font-family:'JetBrains Mono',monospace; font-size:0.8125rem; }
  .empty-cell { text-align:center; color:var(--text-dim); padding:2rem; }
  .overlay { position:fixed; inset:0; background:rgba(0,0,0,0.6); display:flex; align-items:center; justify-content:center; z-index:200; backdrop-filter:blur(2px); padding:1rem; }
  .modal { background:var(--surface-raised); border:1px solid var(--border); border-radius:var(--radius-lg); width:100%; max-width:420px; box-shadow:var(--shadow); }
  .modal-header { display:flex; align-items:center; justify-content:space-between; padding:1.25rem 1.5rem; border-bottom:1px solid var(--border-subtle); }
  .modal-header h2 { font-size:1rem; font-weight:600; }
  .modal-close { background:none; border:none; color:var(--text-muted); cursor:pointer; font-size:1rem; padding:0.25rem; line-height:1; border-radius:2px; }
  .modal-close:hover { color:var(--text); }
  form { padding:1.5rem; display:flex; flex-direction:column; gap:1rem; }
  .modal-actions { display:flex; justify-content:flex-end; gap:0.5rem; }
</style>
