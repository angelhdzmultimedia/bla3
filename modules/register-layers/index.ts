import { useNuxtApp } from "nuxt/app"
import {consola} from 'consola'
import { defineNuxtModule, useNuxt,  createResolver,  } from "nuxt/kit"
import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs'

let firstRun = true

import type { OptionalDeep } from "ts-toolbelt/out/Object/Optional"
import { updateConfig } from "c12/update"
import { resolvePath, type Layer } from "../../src/shared/utils"
import { addServerApi } from "./add/server/api"
import { addAppFiles } from "./add/app"
import { addStore } from "./add/app/store"
import { addNuxtConfig } from "./add/app/config"


function addLayer(layer: Layer) {
  const rootDir = useNuxt().options.rootDir ?? process.cwd()
  const {resolve} = createResolver(rootDir)
    const srcDir = resolve('src')
  if (layer.group) {
     if (!existsSync(resolve(`${srcDir}/${layer.group}`))) {
    mkdirSync(resolve(`${srcDir}/${layer.group}`))
    consola.info(`${layer.group} layer group created.`)
  }
  }

  const layerName = `${layer.group ? `${layer.group}/` : ''}${layer.name}`
  const layerPath = resolvePath(srcDir, layerName)
   if (!existsSync(layerPath)) {
    mkdirSync(layerPath, { recursive: true })
    consola.info(`${layer.name}${layer.group ? ` (${layer.group})` : ''} layer added.`)
  }
                  
  addNuxtConfig(srcDir, layerPath)

  if (layer.name === 'app') {
    addAppFiles(srcDir, layerPath)
  }
  
  addStore(srcDir, layer.name, layerPath)
  
  addServerApi(srcDir, layerPath, layer.templates)
}

export default defineNuxtModule({
  meta: {
    name: 'init-layers',

  },

  async setup(config, nuxt) {
   
      
    const rootDir = nuxt.options.rootDir ?? process.cwd()
    const {resolve} = createResolver(rootDir)
    const srcDir = resolve('src')
    const layersPath = resolve('layers.config.ts')
    if (!existsSync(layersPath)) {
      consola.error('layers.ts not found')
    } else {
      const layers = await import(layersPath)
 
      for (const layer of layers) {
      
        await addLayer(layer)
     
      }

     if (firstRun) {
      await updateConfig({
      cwd: rootDir,
      configFile: 'nuxt.config.ts',
      onUpdate(config) {
        config.extends = [...config.extends ?? [], ...layers
          .sort((a: Layer, b: Layer) => a.name.localeCompare(b.name) && a.group?.localeCompare(b.group ?? ''))
          
          .map((layer: Layer) => `${srcDir}/${layer.group ? `${layer.group}/` : ''}${layer.name}`)
          .filter((layer: string) => ! config.extends.includes(layer))]
        return config
      }
     })
     firstRun = false
     }
          
      
    }
   

    
  },
});