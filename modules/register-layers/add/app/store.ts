import { useChangeCase } from '@vueuse/integrations/useChangeCase.mjs'
import consola from 'consola'
import dedent from 'dedent'
import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs'
import { resolvePath } from '~/src/shared/utils'


export function addStore(srcDir: string, layerName: string, layerPath: string) {
  const storePath = resolvePath(srcDir, layerPath, `${layerName}.store.ts`)
  if (!existsSync(storePath)) {
    const storeName = useChangeCase(`${layerName}Store`, 'pascalCase')
    const useStore = useChangeCase(`use ${layerName}`, 'camelCase')
    
    writeFileSync(
      storePath,
      dedent(`
import {cls} from 'hardwired'

export class ${storeName.value} {
  static providers = cls.singleton(this)
}
`)
    )
    
    const composablesDir = resolvePath(srcDir, layerPath, 'composables')
    mkdirSync(composablesDir, { recursive: true })
    
    writeFileSync(
      resolvePath(composablesDir, `use-${layerName}.ts`),
      `
import {container} from 'hardwired'
import {${storeName.value}} from '../${layerName}.store'

export const ${useStore.value} = () => container.use(${storeName.value}.providers) 
`
    )
    consola.info('Store added.')
  }
}