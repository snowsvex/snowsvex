import { Command } from 'commander'
import { build } from 'snowpack'
import fs from 'fs/promises'
import { moveToRoot, renameFiles } from './utils'
import { loadSnowsvexConfig, loadSnowpackConfig } from '../config'

const BUILD_ROOT = './build'

const program = new Command()

program.name('build').description('Build static assets!').action(buildAssets)

export default program

async function buildAssets() {
  const snowsvexConfig = await loadSnowsvexConfig()
  const snowpackConfig = await loadSnowpackConfig()
  const { result } = await build({ config: snowpackConfig, lockfile: null })

  const pagesDirs = snowsvexConfig?.pagesDirs || ['pages']

  await Promise.all(
    pagesDirs.map(async dir => {
      await renameFiles(dir)
      if (dir === 'pages') {
        // move all of them to root of the build
        const files = await fs.readdir(`${BUILD_ROOT}/pages`)
        const html = files.filter(f => f.includes('.html'))
        await moveToRoot(html)
      }
    })
  )
  console.log(`🕶️  Wrote ${Object.keys(result).length} files 🕶️`)

  console.log('🔥 Successful Snowsvex!')
  process.exit(0)
}
