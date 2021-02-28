import { Command } from 'commander'
import { loadSnowsvexConfig, loadSnowpackConfig } from '../config'
import { startServer } from 'snowpack'
import { createDevRuntime } from './runtime'

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
