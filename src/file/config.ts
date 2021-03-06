import { createConfiguration, SnowpackConfig } from 'snowpack'
import { cosmiconfig } from 'cosmiconfig'

export interface SnowsvexConfig {
  directories: string[]
}

export async function loadSnowsvexConfig(): Promise<SnowsvexConfig> {
  const config = await getConfig('snowsvex')
  if (config) {
    return config
  }
  return { directories: ['pages'] }
}

export async function loadSnowpackConfig(): Promise<SnowpackConfig> {
  const defaultConfig = {
    mount: {
      public: { url: '/', static: true },
      src: { url: '/' }
    },
    routes: [{ match: 'routes', src: '.*', dest: '/index.html' }],
  }
  try {
    const config = await getConfig('snowpack')
    return createConfiguration(config)
  } catch (e) {
    console.log(e)
  }
  //@ts-ignore
  return createConfiguration(defaultConfig)
}

async function getConfig(name: 'snowpack' | 'snowsvex') {
  const explorer = cosmiconfig(name)
  const file = `${name}.config.js`
  const config = await explorer.load(file)
  if (config?.config && !config.isEmpty) {
    console.log(`found ${name} config `, config)
    return config.config
  }
  console.log(`no ${name} config found`)
  return null
}
