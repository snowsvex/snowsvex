import { Command } from 'commander'
import fs from 'fs/promises'
import { loadSnowsvexConfig, SnowsvexConfig, loadSnowpackConfig } from '../config'
import { startServer } from 'snowpack'

const program = new Command()

program.name('dev').description('Start Dev Mode!').action(dev)

export default program

async function dev() {
  console.log('Snowsvex time!')
  const config = await loadSnowsvexConfig()
  const pagesDirs = config?.pageDirs || ['pages']
  const devRuntimeFile = await createDevRuntime({ pagesDirs })
  if (!devRuntimeFile) {
    throw new Error('Runtime file was not created!')
  }
  const snowpackConfig = await loadSnowpackConfig()
  await startServer({ config: snowpackConfig, lockfile: null })
}

type DevRuntimeProps = {
  pagesDirs: SnowsvexConfig['pageDirs']
}
async function createDevRuntime({ pagesDirs }: DevRuntimeProps): Promise<string | null> {
  const paths: Paths = (
    await Promise.all(pagesDirs.map(async dir => ({ list: await fs.readdir(dir), dir })))
  ).map(({ list, dir }) => ({
    dir,
    list: list.map(s => (isPathString(s) ? getPrettyPath(s) : {}))
  }))
  const template = genHtml(paths)
  const current = await getDevRuntimeFile()
  if (current) {
    if (current === template) {
      return current
    }
  }
  await fs.writeFile('src/dev-runtime.js', template)
  return template
}

async function getDevRuntimeFile() {
  const js = await fs.readFile('src/dev-runtime.js', 'utf-8')
  if (js) {
    return js
  }
  const ts = await fs.readFile('src/dev-runtime.ts', 'utf-8')
  if (ts) {
    return ts
  }
  return null
}

type PathString = `${string}.${'svelte' | 'svx'}`
function isPathString(s: string): s is PathString {
  return s.endsWith('.svekte') || s.endsWith('.svx')
}

function getPrettyPath(path: PathString): { extension?: string; filename?: string } {
  const splitByDots = path.split('.')
  const extension = splitByDots[splitByDots.length - 1] as 'svelte' | 'svx'
  const splitBySlashes = splitByDots[splitByDots.length - 2].split('/')
  const filename = splitBySlashes[splitBySlashes.length - 1]

  return {
    extension,
    filename
  }
}

type Paths = {
  dir: string
  list: {
    extension?: string | undefined
    filename?: string | undefined
  }[]
}[]
function genHtml(paths: Paths) {
  return `
  let app
  ;(async () => {
    try {
      const route = pickRoute()
      const comp = await import(route)
  
      app = new comp.default({
        target: document.body,
        hydrate: true
      })
    } catch (err) {
      console.error(err)
      const comp = await import('./pages/404.svelte.js')
      app = new comp.default({
        target: document.body,
        hydrate: true
      })
    }
  })()
  
  function pickRoute() {
    const { pathname } = window.location
    if (pathname === '/') {
      return './pages/index.svelte.js'
    }
    ${paths.map(
      ({ dir, list }) => ` 
      if (pathname.includes('${dir}')) {
        ${list.map(
          ({ filename, extension }) => `
          if (pathname.includes('${filename}')) {
            return \`.\${pathname}.${extension}.js\`
          }
        `,
          ''
        )}
      }
    `
    )}
    return \`./pages\${pathname}.svelte.js\`
  }
  
    `
}