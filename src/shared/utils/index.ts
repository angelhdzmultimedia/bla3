import { defineNuxtModule, useNuxt,  createResolver,  } from "nuxt/kit"






export function defineLayer(layer: Layer) {
  return layer
}

export function getRootDir() {
  return useNuxt().options.rootDir ?? process.cwd()
}

export function getSrcDir(rootDir: string) {
  const { resolve } = createResolver(rootDir)
  return resolve('src')
}

export function resolvePath(srcDir: string, ...paths: string[]) {
  const { resolve } = createResolver(srcDir)
  return resolve(...paths)
}

const HttpMethods = ['GET', 'POST', 'PUT', 
  'DELETE', 'PATCH', 'OPTIONS', 'HEAD', 'TRACE', 'CONNECT' ] as const

export type HttpMethod = typeof HttpMethods[number]

export type Templates = {
  server?: {
    api?:  Record<string, {method: HttpMethod}>,
    routes?:  Record<string, {method: HttpMethod}>
    middleware?:  Record<string, {}>
  }
}

export type Layer = {
  name: string
  group?: string
  templates: Templates
}
