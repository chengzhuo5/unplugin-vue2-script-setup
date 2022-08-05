import { describe, expect, it, vi } from 'vitest'
import { transform as t } from '../src'

describe('errors', () => {
  it('langs', async () => {
    expect(() =>
      t(`
<script setup>
const a = 1
</script>

<script lang="ts">
export default {}
</script>
`, 'Lang.vue')).toThrowError('<script setup> language must be the same as <script>')
  })

  it('defineProps', async () => {
    expect(() =>
      t(`
<script setup>
defineProps()
const a = defineProps()
</script>
`, 'DefineProps.vue'))
      .toThrowError('duplicate defineProps() call')
  })

  it('top-level await', async () => {
    expect(() =>
      t(`
<script setup>
defineProps()
await something()
</script>
`, 'TopLevel.vue'))
      .toThrowError('top-level await is not supported in Vue 2')

    expect(() =>
      t(`
<script setup>
defineProps()
const {data} = await something()
</script>
`, 'TopLevel.vue'))
      .toThrowError('top-level await is not supported in Vue 2')
  })

  it('ref sugar', async () => {
    const consoleWarnMock = vi.spyOn(console, 'warn')

    await t(`
<script setup>
defineProps()
const a = async () => {
  await something()
}
</script>
    `, 'App.vue')

    consoleWarnMock.mockRestore()
  })
})
