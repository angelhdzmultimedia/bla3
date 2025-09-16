import consola from 'consola'
import dedent from 'dedent'
import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs'
import { resolvePath } from '~/src/shared/utils'


export function addAppFiles(srcDir: string, layerPath: string) {
  const appVuePath = resolvePath(srcDir, layerPath, 'app.vue')
  if (!existsSync(appVuePath)) {
    writeFileSync(
      appVuePath,
      dedent(`
<template>
  <nuxt-layout>
    <nuxt-page />
  </nuxt-layout>
</template>
`)
    )
    consola.info('app.vue added.')
  }

  const assetsDir = resolvePath(srcDir, layerPath, 'assets')
  if (!existsSync(assetsDir)) {
    mkdirSync(assetsDir, { recursive: true })
    consola.info('assets directory created.')
  }

  const appCssPath = resolvePath(assetsDir, 'app.css')
  if (!existsSync(appCssPath)) {
    writeFileSync(
      appCssPath,
      `
@import "tailwindcss";
@plugin "daisyui";
`
    )
    consola.info('app.css asset added.')
  }
}