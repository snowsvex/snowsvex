import { Command } from 'commander'
import { build } from 'snowpack'
import { renameFiles } from './utils'
import { loadSnowsvexConfig, loadSnowpackConfig } from '../config'

const program = new Command()

program.name('build').description('Build static assets!').action(buildAssets)

export default program

async function buildAssets() {
  const snowsvexConfig = await loadSnowsvexConfig()
  const snowpackConfig = await loadSnowpackConfig()
  const { result } = await build({ config: snowpackConfig, lockfile: null })
  const pagesDirs = snowsvexConfig?.pagesDirs || ['pages']

  await Promise.all(pagesDirs.map(renameFiles))

  console.log(`🕶️  Wrote ${Object.keys(result).length} files 🕶️`)

  console.log('🔥 Successful Snowsvex!')
  process.exit(0)
}
