<script lang="ts">
  import { enhance } from '$app/forms'
  import type { PageData } from './$types'
  export let data: PageData

  const statuses = ['Pending', 'Processing', 'Shipped', 'Completed', 'Cancelled'] as const
  type Status = typeof statuses[number]

  function statusBadge(s: string) {
    if (s === 'Completed') return 'badge-success'
    if (s === 'Cancelled') return 'badge-danger'
    if (s === 'Shipped')   return 'badge-muted'
    return 'badge-warning'
  }
</script>

<svelte:head><title>Orders — WDT Admin</title></svelte:head>

<div class="page-header">
  <div>
    <h1>Orders</h1>
    <p class="sub">{data.orders.length} total</p>
  </div>
</div>

<div class="table-wrap">
  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>Customer</th>
        <th>Items</th>
        <th>Total</th>
        <th>Status</th>
        <th>Date</th>
        <th>Update Status</th>
      </tr>
    </thead>
    <tbody>
      {#each data.orders as o (o.id)}
        <tr>
          <td class="mono text-muted">#{o.id}</td>
          <td>
            <div class="fw-medium">{o.user.firstName} {o.user.lastName}</div>
            <div class="text-muted text-xs">{o.user.email}</div>
          </td>
          <td>
            <div class="items-list">
              {#each o.orderItems as item}
                <div class="text-xs text-muted">{item.product.name} ×{item.quantity}</div>
              {/each}
            </div>
          </td>
          <td class="mono fw-medium">${o.total.toFixed(2)}</td>
          <td><span class="badge {statusBadge(o.status)}">{o.status}</span></td>
          <td class="mono text-xs text-muted">{new Date(o.createdAt).toLocaleDateString()}</td>
          <td>
            <form method="POST" action="?/updateStatus" use:enhance>
              <input type="hidden" name="id" value={o.id} />
              <div class="status-row">
                <select class="form-input select-sm" name="status">
                  {#each statuses as s}
                    <option value={s} selected={o.status === s}>{s}</option>
                  {/each}
                </select>
                <button type="submit" class="btn btn-primary btn-sm">Update</button>
              </div>
            </form>
          </td>
        </tr>
      {/each}
      {#if data.orders.length === 0}
        <tr><td colspan="7" class="empty-cell">No orders yet.</td></tr>
      {/if}
    </tbody>
  </table>
</div>

<style>
  .page-header { display:flex; align-items:flex-start; justify-content:space-between; gap:1rem; margin-bottom:1.5rem; }
  h1 { font-size:1.375rem; font-weight:700; letter-spacing:-0.02em; }
  .sub { font-size:0.8125rem; color:var(--text-muted); margin-top:0.2rem; }
  .table-wrap { overflow-x:auto; background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-lg); }
  table { width:100%; border-collapse:collapse; min-width:800px; }
  thead tr { border-bottom:1px solid var(--border); }
  th { padding:0.75rem 1rem; text-align:left; font-size:0.6875rem; font-weight:600; color:var(--text-muted); letter-spacing:0.06em; text-transform:uppercase; white-space:nowrap; }
  td { padding:0.625rem 1rem; border-bottom:1px solid var(--border-subtle); vertical-align:middle; }
  tbody tr:last-child td { border-bottom:none; }
  .fw-medium { font-weight:500; }
  .text-muted { color:var(--text-muted); }
  .text-xs { font-size:0.75rem; }
  .mono { font-family:'JetBrains Mono',monospace; font-size:0.8125rem; }
  .items-list { display:flex; flex-direction:column; gap:2px; }
  .status-row { display:flex; align-items:center; gap:0.4rem; }
  .select-sm { padding:0.3em 0.5em; font-size:0.75rem; }
  .empty-cell { text-align:center; color:var(--text-dim); padding:2rem; }
</style>
