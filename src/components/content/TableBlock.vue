<script setup lang="ts">
import type { BlockOf } from '@/content/types'
import RichText from './RichText.vue'

defineProps<{ block: BlockOf<'table'> }>()
</script>

<template>
  <div class="table-block">
    <p v-if="block.illustrative" class="table-block__tag">Ilustrativa (cifras inventadas)</p>
    <div class="table-block__scroll">
      <table>
        <thead>
          <tr>
            <template v-for="(header, index) in block.headers" :key="index">
              <!-- Un encabezado vacío (esquina de la tabla) no puede ser un <th> sin texto. -->
              <td v-if="header === ''" />
              <th v-else scope="col"><RichText :text="header" /></th>
            </template>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, rowIndex) in block.rows" :key="rowIndex">
            <td v-for="(cell, cellIndex) in row" :key="cellIndex"><RichText :text="cell" /></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.table-block {
  margin: 1rem 0;
}

.table-block__tag {
  display: inline-block;
  margin: 0 0 0.25rem;
  padding: 0.125rem 0.5rem;
  background: var(--color-advertencia-bg);
  border: 1px solid var(--color-advertencia-border);
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 600;
}

/* La tabla se ajusta al ancho; el scroll queda solo como red de seguridad. */
.table-block__scroll {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9375rem;
}

th,
td {
  padding: 0.4rem 0.5rem;
  border: 1px solid var(--color-border);
  text-align: left;
  vertical-align: top;
  overflow-wrap: anywhere;
}

th {
  background: var(--color-surface);
}

@media (max-width: 480px) {
  table {
    font-size: 0.8125rem;
  }

  th,
  td {
    padding: 0.3rem 0.35rem;
  }
}
</style>
