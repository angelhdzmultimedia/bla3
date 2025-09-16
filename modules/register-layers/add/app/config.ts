import  {existsSync, mkdirSync, writeFileSync} from 'node:fs'
import consola from 'consola'
import { resolvePath } from '~/src/shared/utils'
import dedent from 'dedent'

export function addNuxtConfig(srcDir: string, layerPath: string) {
  const configPath = resolvePath(srcDir, layerPath, 'nuxt.config.ts')
  if (!existsSync(configPath)) {
    writeFileSync(
      configPath,
      dedent(`export default defineNuxtConfig({})`)
    )
    consola.info('nuxt.config.ts added.')
  }
}

