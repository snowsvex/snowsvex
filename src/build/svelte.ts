import * as esbuild from 'esbuild'
import svelte from 'esbuild-svelte'
// import preprocess from 'svelte-preprocess'
import { CompiledFile, CompileMap } from '../types'
import 'svelte/register'

export async function render({ src, destination }: CompileMap): Promise<CompiledFile> {
  const Component = await import(src)
  const rendered = await Component.default.default.render()

  return {
    src,
    destination,
    html: {
      body: rendered.html,
      head: {
        raw: rendered.head
      }
    }
  }
}

export async function compile(files: string[]) {
  try {
    const res = await esbuild.build({
      entryPoints: files,
      bundle: true,
      outdir: './build',
      plugins: [
        svelte({
          // preprocess: preprocess()
        })
      ]
    })
    console.log('esbuild success', res)
  } catch (e) {
    console.log(`esbuild failed`, e)
  }
}
