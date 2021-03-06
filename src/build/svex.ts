import { readFile, writeFile, rm } from 'fs/promises'
import yaml from 'js-yaml'
import * as md from 'mdsvex'
import * as svelte from './svelte'
import 'svelte/register'
import { CompiledFile, CompileMap } from '../types'

/**
 *
 * @param str -- string of file to get frontmatter from
 */
export async function getFrontmatter(str: string): Promise<Record<string, unknown>> {
  const pre = str.split('---\n')[1]
  const frontmatter = yaml.load(pre) as Record<string, unknown>
  return frontmatter
}

type SvexCompileMap = CompileMap & { layout: string }

export async function compile({
  src,
  destination,
  layout
}: SvexCompileMap): Promise<CompiledFile | null> {
  const str = await readFile(src, 'utf-8')
  const frontmatter = await getFrontmatter(str)
  const mdOut = await md.compile(str, {
    layout
  })
  if (!mdOut) return null
  const tmp = `${src}.tmp.svelte`
  await writeFile(tmp, mdOut.code, 'utf-8')
  const output = await svelte.render({ src: tmp, destination })
  await rm(tmp)
  return {
    ...output,
    html: {
      ...output.html,
      head: {
        raw: output.html.head?.raw,
        title: frontmatter.title as string | undefined,
        description: frontmatter.description as string | undefined
      }
    }
  }
}
