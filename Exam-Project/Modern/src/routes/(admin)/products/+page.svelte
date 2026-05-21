<script lang="ts">
  import { enhance } from '$app/forms'
  import type { PageData, ActionData } from './$types'
  export let data: PageData
  export let form: ActionData

  type Product = PageData['products'][number]

  let showModal = false
  let editing: Product | null = null
  let showDeleted = false

  function openCreate() { editing = null; showModal = true }
  function openEdit(p: Product) { editing = p; showModal = true }
  function closeModal() { showModal = false; editing = null }

  $: visible = showDeleted ? data.products : data.products.filter(p => !p.isDeleted)
</script>

<svelte:head><title>Products — WDT Admin</title></svelte:head>

<div class="page-header">
  <div>
    <h1>Products</h1>
    <p class="sub">{data.products.filter(p => !p.isDeleted).length} active · {data.products.filter(p => p.isDeleted).length} archived</p>
  </div>
  <div class="header-actions">
    <label class="toggle-label">
      <input type="checkbox" bind:checked={showDeleted} />
      Show archived
    </label>
    <button class="btn btn-primary" on:click={openCreate}>+ Add Product</button>
  </div>
</div>

{#if form?.error}
  <p class="form-error" style="margin-bottom:1rem">{form.error}</p>
{/if}

<div class="table-wrap">
  <table>
    <thead>
      <tr>
        <th>Image</th>
        <th>Name</th>
        <th>Brand</th>
        <th>Category</th>
        <th>Price</th>
        <th>Qty</th>
        <th>Status</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {#each visible as p (p.id)}
        <tr class:deleted={p.isDeleted}>
          <td>
            {#if p.imageUrl}
              <img src={p.imageUrl} alt={p.name} class="thumb" />
            {:else}
              <div class="thumb-placeholder">—</div>
            {/if}
          </td>
          <td>
            <div class="fw-medium">{p.name}</div>
            <div class="text-muted text-xs">{p.description.slice(0,60)}{p.description.length>60?'…':''}</div>
          </td>
          <td>{p.brand.name}</td>
          <td>{p.category.name}</td>
          <td class="mono">${p.price.toFixed(2)}</td>
          <td class="mono">{p.quantity}</td>
          <td>
            {#if p.isDeleted}
              <span class="badge badge-danger">Archived</span>
            {:else}
              <span class="badge badge-success">Active</span>
            {/if}
          </td>
          <td>
            <div class="row-actions">
              {#if !p.isDeleted}
                <button class="btn btn-ghost btn-sm" on:click={() => openEdit(p)}>Edit</button>
                <form method="POST" action="?/softDelete" use:enhance style="display:inline">
                  <input type="hidden" name="id" value={p.id} />
                  <button type="submit" class="btn btn-danger btn-sm">Archive</button>
                </form>
              {:else}
                <form method="POST" action="?/restore" use:enhance style="display:inline">
                  <input type="hidden" name="id" value={p.id} />
                  <button type="submit" class="btn btn-success btn-sm">Restore</button>
                </form>
                <form method="POST" action="?/hardDelete" use:enhance style="display:inline"
                  on:submit={e => { if (!confirm('Permanently delete?')) e.preventDefault() }}>
                  <input type="hidden" name="id" value={p.id} />
                  <button type="submit" class="btn btn-danger btn-sm">Delete</button>
                </form>
              {/if}
            </div>
          </td>
        </tr>
      {/each}
      {#if visible.length === 0}
        <tr><td colspan="8" class="empty-cell">No products found.</td></tr>
      {/if}
    </tbody>
  </table>
</div>

<!-- Modal -->
{#if showModal}
  <div class="overlay" on:click={closeModal} role="presentation">
    <div class="modal" on:click|stopPropagation on:keydown={() => {}} role="dialog" aria-modal="true">
      <div class="modal-header">
        <h2>{editing ? 'Edit Product' : 'New Product'}</h2>
        <button class="modal-close" on:click={closeModal}>✕</button>
      </div>
      <form
        method="POST"
        action={editing ? '?/update' : '?/create'}
        use:enhance={() => { return ({ result }) => { if (result.type !== 'failure') closeModal() } }}
      >
        {#if editing}<input type="hidden" name="id" value={editing.id} />{/if}

        <div class="form-grid">
          <label class="form-field">
            <span class="form-label">Name *</span>
            <input class="form-input" name="name" required value={editing?.name ?? ''} />
          </label>
          <label class="form-field">
            <span class="form-label">Price *</span>
            <input class="form-input" name="price" type="number" step="0.01" min="0" required value={editing?.price ?? ''} />
          </label>
          <label class="form-field">
            <span class="form-label">Quantity *</span>
            <input class="form-input" name="quantity" type="number" min="0" required value={editing?.quantity ?? ''} />
          </label>
          <label class="form-field">
            <span class="form-label">Image URL</span>
            <input class="form-input" name="imageUrl" type="url" value={editing?.imageUrl ?? ''} />
          </label>
          <label class="form-field">
            <span class="form-label">Brand *</span>
            <select class="form-input" name="brandId" required>
              {#each data.brands as b}
                <option value={b.id} selected={editing?.brandId === b.id}>{b.name}</option>
              {/each}
            </select>
          </label>
          <label class="form-field">
            <span class="form-label">Category *</span>
            <select class="form-input" name="categoryId" required>
              {#each data.categories as c}
                <option value={c.id} selected={editing?.categoryId === c.id}>{c.name}</option>
              {/each}
            </select>
          </label>
          <label class="form-field" style="grid-column:1/-1">
            <span class="form-label">Description *</span>
            <textarea class="form-input" name="description" rows="3" required>{editing?.description ?? ''}</textarea>
          </label>
        </div>

        <div class="modal-actions">
          <button type="button" class="btn btn-ghost" on:click={closeModal}>Cancel</button>
          <button type="submit" class="btn btn-primary">{editing ? 'Save Changes' : 'Create Product'}</button>
        </div>
      </form>
    </div>
  </div>
{/if}

<style>
  .page-header {
    display: flex; align-items: flex-start; justify-content: space-between;
    gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap;
  }
  h1 { font-size: 1.375rem; font-weight: 700; letter-spacing: -0.02em; }
  .sub { font-size: 0.8125rem; color: var(--text-muted); margin-top: 0.2rem; }
  .header-actions { display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; }

  .toggle-label {
    display: flex; align-items: center; gap: 0.4rem;
    font-size: 0.8125rem; color: var(--text-muted); cursor: pointer;
  }

  .table-wrap { overflow-x: auto; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); }
  table { width: 100%; border-collapse: collapse; min-width: 800px; }
  thead tr { border-bottom: 1px solid var(--border); }
  th { padding: 0.75rem 1rem; text-align: left; font-size: 0.6875rem; font-weight: 600; color: var(--text-muted); letter-spacing: 0.06em; text-transform: uppercase; white-space: nowrap; }
  td { padding: 0.625rem 1rem; border-bottom: 1px solid var(--border-subtle); vertical-align: middle; }
  tbody tr:last-child td { border-bottom: none; }
  tbody tr.deleted { opacity: 0.55; }
  .thumb { width: 40px; height: 40px; object-fit: cover; border-radius: var(--radius-sm); border: 1px solid var(--border); display: block; }
  .thumb-placeholder { width: 40px; height: 40px; background: var(--surface-raised); border: 1px solid var(--border); border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center; color: var(--text-dim); font-size: 0.75rem; }
  .fw-medium { font-weight: 500; }
  .text-muted { color: var(--text-muted); }
  .text-xs { font-size: 0.75rem; }
  .mono { font-family: 'JetBrains Mono', monospace; font-size: 0.8125rem; }
  .row-actions { display: flex; gap: 0.4rem; }
  .empty-cell { text-align: center; color: var(--text-dim); padding: 2rem; }

  .overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 200; backdrop-filter: blur(2px); padding: 1rem; }
  .modal { background: var(--surface-raised); border: 1px solid var(--border); border-radius: var(--radius-lg); width: 100%; max-width: 560px; box-shadow: var(--shadow); max-height: 90vh; overflow-y: auto; }
  .modal-header { display: flex; align-items: center; justify-content: space-between; padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--border-subtle); }
  .modal-header h2 { font-size: 1rem; font-weight: 600; }
  .modal-close { background: none; border: none; color: var(--text-muted); cursor: pointer; font-size: 1rem; padding: 0.25rem; line-height: 1; border-radius: 2px; }
  .modal-close:hover { color: var(--text); }
  form { padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; }
  .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
  .modal-actions { display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 0.5rem; }

  @media (max-width: 500px) { .form-grid { grid-template-columns: 1fr; } }
</style>
