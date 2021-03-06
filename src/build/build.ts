import { readdir, writeFile } from 'fs/promises'
import { BUILD_ROOT, SRC_ROOT, stripExts, createDirs } from '../file/utils'
import * as svex from './svex'
import * as svelte from './svelte'
import * as Html from './html'
import { BuildFile, BuildProps, CompiledFile } from '../types'
import { isAllowedFiletype, isCompiledFile } from '../types/guards'

export async function build({ directories }: BuildProps) {
  const files = await pickFiles(directories)
  const compiled = await Promise.all(files.map(compile)).then(c => c.flat().filter(isCompiledFile))
  await createDirs(directories)
  await svelte.compile(compiled.map(({ src }) => src))
  await writeFiles(compiled)
}

async function writeFiles(compiled: CompiledFile[]) {
  return Promise.all(
    compiled.map(async ({ destination, html, css, js }) => {
      // console.log(`writing file to disk`, { destination, html, css, js })
      const htmlDestination = `${destination.replace('/pages', '')}.html`
      await writeFile(htmlDestination, await Html.generate({ ...html, destination }), 'utf-8')
      if (js) await writeFile(`${destination}.js`, js, 'utf-8')
      if (css) await writeFile(`${destination}.css`, css, 'utf-8')
    })
  )
}

async function compile(file: BuildFile): Promise<CompiledFile | undefined> {
  const { directory, filename, filetype } = file
  const src = `${SRC_ROOT}/${directory}/${filename}`
  const destination = `${BUILD_ROOT}/${directory}/${stripExts(filename)}`

  if (filetype === 'svx') {
    const layout = `${SRC_ROOT}/_layout.svelte`
    const compiled = await svex.compile({ src, destination, layout })
    if (!compiled) return
    return {
      ...compiled,
      src,
      destination
    }
  }
  if (filetype === 'svelte') {
    const compiled = await svelte.render({ src, destination })
    return {
      ...compiled,
      src,
      destination
    }
  }
  return
}

/**
 * Search given directories for source files
 * @param directories -- to process
 */
async function pickFiles(directories: string[]): Promise<BuildFile[]> {
  const initialAcc: Promise<BuildFile[]> = Promise.resolve([])
  return await directories.reduce(async (acc, directory) => {
    const files = await readdir(`${SRC_ROOT}/${directory}`)
    return acc.then(a => [...a, ...pickBuildables(files, directory)])
  }, initialAcc)
}

function pickBuildables(files: string[], directory: string): BuildFile[] {
  return files.reduce((buildFiles, filename) => {
    const splitByDot = filename.split('.')
    const filetype = splitByDot[splitByDot.length - 1]
    if (isAllowedFiletype(filetype)) {
      return [
        ...buildFiles,
        {
          directory,
          filename,
          filetype
        }
      ]
    }
    return buildFiles
  }, [] as BuildFile[])
}
