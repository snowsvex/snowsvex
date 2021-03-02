import { createConfiguration, SnowpackConfig } from 'snowpack'

export interface SnowsvexConfig {
  pagesDirs: string[]
}

export async function loadSnowsvexConfig(): Promise<SnowsvexConfig | null> {
  try {
    const raw = await import(`${process.cwd()}/snowsvex.config.js`)
    return raw as SnowsvexConfig
  } catch (err) {
    console.log('No snowsvex config found')
  }
  const snowpackConfig = await loadSnowpackConfig()

  //@ts-ignore
  const snowsvexPlugin = snowpackConfig.raw.plugins.find(plugin => {
    if (Array.isArray(plugin) && plugin[0].includes('snowsvex-plugin')) {
      return true
    }
    return false
  })
  if (snowsvexPlugin) {
    return snowsvexPlugin[1]
  }
  return { pagesDirs: ['pages'] }
}

export async function loadSnowpackConfig(): Promise<SnowpackConfig & { raw: unknown }> {
  const defaultConfig = {
    mount: {
      public: { url: '/', static: true },
      src: { url: '/' }
    },
    routes: [{ match: 'routes', src: '.*', dest: '/index.html' }],
    plugins: ['@snowsvex/snowsvex-plugin']
  }
  try {
    const snowpackConfig = (await import(`${process.cwd()}/snowpack.config.js`)) || defaultConfig
    const newConfig = createConfiguration(snowpackConfig)
    return { ...newConfig, raw: snowpackConfig }
  } catch (e) {
    //@ts-ignore
    return { ...createConfiguration(defaultConfig), raw: defaultConfig }
  }
}
