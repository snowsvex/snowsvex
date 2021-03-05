import { readdir, rename, readFile, writeFile } from 'fs/promises'
import * as svex from './svex'
import * as svelte from './svelte'
import 'svelte/register'

export const SRC_ROOT = `${process.cwd()}/src`
export const BUILD_ROOT = `${process.cwd()}/build`

function stripExts(file: string) {
  if (file.includes('.proxy.js')) return file
  return file.replace('.svelte', '').replace('.svx', '')
}

export async function prerender(dir: string) {
  try {
    const destFiles = await readdir(`${BUILD_ROOT}/${dir}`)
    await Promise.all(
      destFiles.map(async file => {
        const destination =
          dir === 'pages' && file.endsWith('.html') ? BUILD_ROOT : `${BUILD_ROOT}/${dir}`
        const outpath = `${destination}/${stripExts(file)}`
        await rename(`${BUILD_ROOT}/${dir}/${file}`, outpath).catch(console.error)
        return outpath
      })
    )

    const srcFiles = await readdir(`${SRC_ROOT}/${dir}`)
    const compiled = await Promise.all(
      srcFiles.map(async file => {
        let html: string | undefined
        const src = `${SRC_ROOT}/${dir}/${file}`
        if (file.includes('.svx')) {
          const layout = `${SRC_ROOT}/Layout.svelte` //TODO make this customizable
          const output = await svex.compile(src, layout)
          html = output
        }
        if (file.includes('.svelte')) {
          html = await svelte.render(src)
        }
        if (html) {
          const destination = dir === 'pages' ? BUILD_ROOT : `${BUILD_ROOT}/${dir}`
          const outpath = `${destination}/${stripExts(file)}.html`
          const current = await readFile(outpath, 'utf-8')
          const output = current.replace('<!-- [PRERENDER] -->', html)
          await writeFile(outpath, output)
        }
      })
    )

    return compiled
  } catch (e) {
    console.log(e)
    return []
  }
}
