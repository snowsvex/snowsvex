import { readFile, writeFile, rm } from 'fs/promises'
import yaml from 'js-yaml'
import * as md from 'mdsvex'
import * as svelte from './svelte'
import 'svelte/register'
import { SRC_ROOT } from './utils'

/**
 *
 * @param str -- string of file to get frontmatter from
 */
export async function getFrontmatter(str: string): Promise<Record<string, unknown>> {
  const pre = str.split('---\n')[1]
  const frontmatter = yaml.load(pre) as Record<string, unknown>
  return frontmatter
}

/**
 *
 * @param file -- filepath
 * @param layout -- svelte file path for layout
 */
export async function compile(file: string, layout: string) {
  const str = await readFile(file, 'utf-8')
  const mdOut = await md.compile(str, {
    layout
  })
  if (!mdOut) return ''
  const tmp = `${SRC_ROOT}/snowsvex-tmp.svelte`
  await writeFile(tmp, mdOut.code, 'utf-8')
  const output = await svelte.render(tmp)
  await rm(tmp)
  return output
}
