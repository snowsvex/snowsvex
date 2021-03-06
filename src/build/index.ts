import { Command } from 'commander'
import { loadSnowsvexConfig } from '../file/config'
import { build } from './build'

const program = new Command()

program.name('build').description('Build static assets!').action(buildAssets)

export default program

async function buildAssets() {
  try {
    const snowsvexConfig = await loadSnowsvexConfig()
    const directories = snowsvexConfig?.directories || ['pages']  
    await build({ directories })
    console.log('🔥 Successful Snowsvex!')
  } catch (e) {
    console.error(e)
  } 
  process.exit(0)
}
