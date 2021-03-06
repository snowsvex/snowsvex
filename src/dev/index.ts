import { Command } from 'commander'
import { loadSnowsvexConfig, loadSnowpackConfig } from '../file/config'
import { startServer } from 'snowpack'
import { createDevRuntime } from './runtime'

const program = new Command()

program.name('dev').description('Start Dev Mode!').action(dev)

export default program

async function dev() {
  console.log('Snowsvex time!')
  const config = await loadSnowsvexConfig()
  const directories = config?.directories || ['pages']
  const devRuntimeFile = await createDevRuntime({ directories })
  if (!devRuntimeFile) {
    throw new Error('Runtime file was not created!')
  }
  const snowpackConfig = await loadSnowpackConfig()
  await startServer({ config: snowpackConfig, lockfile: null })
}
