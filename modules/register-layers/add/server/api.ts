import consola from "consola"
import type { HttpMethod } from "../../../../../bla/src/lib"
import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs'
import { resolvePath } from "~/src/shared/utils"
import dedent from "dedent"

export function addServerApi(srcDir: string, layerPath: string, templates: { server?: { api?: Record<string, {method: HttpMethod}> } }) {
  if (templates.server?.api) {
    const apiDir = resolvePath(srcDir, layerPath, 'server/api')
    if (!existsSync(apiDir)) {
      mkdirSync(apiDir, { recursive: true })
      consola.info('server/api directory created.')
    }
    for (const [path, { method }] of Object.entries(templates.server.api)) {
      const parts = path.replaceAll('//', '/').split('/') ?? []
      const name = parts.pop()
      const _base = resolvePath(apiDir,  ...parts.filter(part => part !== ''))
 
      if (!existsSync(_base)) {
        mkdirSync(_base, { recursive: true })
      }
     
      const _path = resolvePath(_base,  `${String(name)}.${method.toLowerCase()}.ts`.replaceAll('//', '/'))
      console.log({_path})
      if (!existsSync(_path)) {
        writeFileSync(
          _path,
          dedent(`
export default defineEventHandler(async (event) => {
  return {}
})
`)
        )
        consola.info(`[${method}] ${_base}/${name ?? ''} route added.`)
      }
    }
  }
}
