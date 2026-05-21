<script lang="ts">
  import { enhance } from '$app/forms'
  import type { PageData, ActionData } from './$types'
  export let data: PageData
  export let form: ActionData

  type Brand = PageData['brands'][number]
  let showModal = false
  let editing: Brand | null = null
  function openCreate() { editing = null; showModal = true }
  function openEdit(b: Brand) { editing = b; showModal = true }
  function closeModal() { showModal = false; editing = null }
</script>

<svelte:head><title>Brands — WDT Admin</title></svelte:head>

<div class="page-header">
  <div>
    <h1>Brands</h1>
    <p class="sub">{data.brands.length} total</p>
  </div>
  <button class="btn btn-primary" on:click={openCreate}>+ Add Brand</button>
</div>

{#if form?.error}
  <p class="form-error" style="margin-bottom:1rem">{form.error}</p>
{/if}

<div class="table-wrap">
  <table>
    <thead><tr><th>ID</th><th>Name</th><th>Products</th><th>Actions</th></tr></thead>
    <tbody>
      {#each data.brands as b (b.id)}
        <tr>
          <td class="mono text-muted">{b.id}</td>
          <td class="fw-medium">{b.name}</td>
          <td><span class="badge badge-muted">{b._count.products}</span></td>
          <td>
            <div class="row-actions">
              <button class="btn btn-ghost btn-sm" on:click={() => openEdit(b)}>Edit</button>
              <form method="POST" action="?/delete" use:enhance style="display:inline"
                on:submit={e => { if (!confirm('Delete brand?')) e.preventDefault() }}>
                <input type="hidden" name="id" value={b.id} />
                <button type="submit" class="btn btn-danger btn-sm" disabled={b._count.products > 0}>Delete</button>
              </form>
            </div>
          </td>
        </tr>
      {/each}
      {#if data.brands.length === 0}
        <tr><td colspan="4" class="empty-cell">No brands yet.</td></tr>
      {/if}
    </tbody>
  </table>
</div>

{#if showModal}
  <div class="overlay" on:click={closeModal} role="presentation">
    <div class="modal" on:click|stopPropagation on:keydown={() => {}} role="dialog" aria-modal="true">
      <div class="modal-header">
        <h2>{editing ? 'Edit Brand' : 'New Brand'}</h2>
        <button class="modal-close" on:click={closeModal}>✕</button>
      </div>
      <form method="POST" action={editing ? '?/update' : '?/create'}
        use:enhance={() => { return ({ result }) => { if (result.type !== 'failure') closeModal() } }}>
        {#if editing}<input type="hidden" name="id" value={editing.id} />{/if}
        <label class="form-field">
          <span class="form-label">Brand Name *</span>
          <input class="form-input" name="name" required value={editing?.name ?? ''} />
        </label>
        <div class="modal-actions">
          <button type="button" class="btn btn-ghost" on:click={closeModal}>Cancel</button>
          <button type="submit" class="btn btn-primary">{editing ? 'Save' : 'Create'}</button>
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
  table { width:100%; border-collapse:collapse; }
  thead tr { border-bottom:1px solid var(--border); }
  th { padding:0.75rem 1rem; text-align:left; font-size:0.6875rem; font-weight:600; color:var(--text-muted); letter-spacing:0.06em; text-transform:uppercase; }
  td { padding:0.625rem 1rem; border-bottom:1px solid var(--border-subtle); vertical-align:middle; }
  tbody tr:last-child td { border-bottom:none; }
  .fw-medium { font-weight:500; }
  .text-muted { color:var(--text-muted); }
  .mono { font-family:'JetBrains Mono',monospace; font-size:0.8125rem; }
  .row-actions { display:flex; gap:0.4rem; }
  .empty-cell { text-align:center; color:var(--text-dim); padding:2rem; }
  .overlay { position:fixed; inset:0; background:rgba(0,0,0,0.6); display:flex; align-items:center; justify-content:center; z-index:200; backdrop-filter:blur(2px); padding:1rem; }
  .modal { background:var(--surface-raised); border:1px solid var(--border); border-radius:var(--radius-lg); width:100%; max-width:380px; box-shadow:var(--shadow); }
  .modal-header { display:flex; align-items:center; justify-content:space-between; padding:1.25rem 1.5rem; border-bottom:1px solid var(--border-subtle); }
  .modal-header h2 { font-size:1rem; font-weight:600; }
  .modal-close { background:none; border:none; color:var(--text-muted); cursor:pointer; font-size:1rem; padding:0.25rem; line-height:1; border-radius:2px; }
  .modal-close:hover { color:var(--text); }
  form { padding:1.5rem; display:flex; flex-direction:column; gap:1rem; }
  .modal-actions { display:flex; justify-content:flex-end; gap:0.5rem; }
</style>
