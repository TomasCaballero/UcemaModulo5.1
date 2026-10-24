<script setup lang="ts">
import { ref } from 'vue'
import ConfirmPanel from '@/components/common/ConfirmPanel.vue'
import { InvalidDataError, type StoredData } from '@/logic/persistence/schema'
import { downloadTextFile } from '@/platform/download'
import { useAuthStore } from '@/stores/auth'
import { useUserDataStore } from '@/stores/userData'

const userData = useUserDataStore()
const auth = useAuthStore()

type Pending = { kind: 'reset' } | { kind: 'import'; data: StoredData }

const pending = ref<Pending | undefined>()
const message = ref('')
const fileInput = ref<HTMLInputElement | null>(null)

function exportProgress(): void {
  const { fileName, text } = userData.exportData()
  downloadTextFile(fileName, text)
  message.value = `Progreso exportado en ${fileName}.`
}

async function chooseFile(event: Event): Promise<void> {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file) return
  try {
    const data = userData.parseImport(await file.text())
    if (!userData.hasContent) {
      applyImport(data)
    } else {
      pending.value = { kind: 'import', data }
    }
  } catch (error) {
    if (!(error instanceof InvalidDataError)) throw error
    message.value = `No se pudo importar: ${error.message}.`
  }
}

function applyImport(data: StoredData): void {
  userData.replaceData(data)
  pending.value = undefined
  message.value = 'Progreso importado.'
}

function confirmPending(): void {
  const action = pending.value
  if (!action) return
  if (action.kind === 'import') {
    applyImport(action.data)
    return
  }
  userData.resetData()
  pending.value = undefined
  message.value = 'Progreso borrado.'
}

function cancelPending(): void {
  pending.value = undefined
}
</script>

<template>
  <section aria-labelledby="datos" class="data-management">
    <h2 id="datos">Tu progreso</h2>
    <p v-if="auth.isAuthenticated">
      Conectado como <strong>{{ auth.userEmail }}</strong>. Tu progreso se sincroniza con la nube y también se guarda en este dispositivo.
    </p>
    <p v-else>
      Se guarda en este dispositivo. Accede con Google para sincronizarlo entre tu computadora y celular, o exportalo para llevarlo a otro equipo.
    </p>
    <div class="data-management__actions">
      <button type="button" class="button" @click="exportProgress">Exportar progreso</button>
      <button type="button" class="button" @click="fileInput?.click()">Importar progreso</button>
      <button type="button" class="button button--danger" @click="pending = { kind: 'reset' }">Borrar progreso</button>
    </div>
    <input ref="fileInput" class="visually-hidden" type="file" accept="application/json,.json" tabindex="-1" aria-label="Archivo de progreso a importar" @change="chooseFile" />

    <ConfirmPanel
      v-if="pending?.kind === 'reset'"
      message="Se borrará todo tu progreso de este dispositivo y de la nube si tienes sesión iniciada. No se puede deshacer."
      confirm-label="Sí, borrar todo"
      @confirm="confirmPending"
      @cancel="cancelPending"
    />
    <ConfirmPanel
      v-else-if="pending?.kind === 'import'"
      message="Importar reemplazará tu progreso actual por el del archivo."
      confirm-label="Sí, reemplazar"
      @confirm="confirmPending"
      @cancel="cancelPending"
    />

    <p v-if="message" role="status">{{ message }}</p>
  </section>
</template>

<style scoped>
.data-management__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
</style>
