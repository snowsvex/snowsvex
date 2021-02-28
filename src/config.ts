import { createConfiguration, loadConfiguration, SnowpackConfig } from 'snowpack'

export interface SnowsvexConfig {
  pageDirs: string[]
}

export async function loadSnowsvexConfig(): Promise<SnowsvexConfig | null> {
  try {
    const raw = (await import('../snowsvex.config.js')) as SnowsvexConfig
    return raw
  } catch (err) {
    console.log('No snowsvex config found')
  }
  return null
}

export async function loadSnowpackConfig(): Promise<SnowpackConfig> {
  const snowpackConfig = await loadConfiguration()
  if (snowpackConfig) {
    return snowpackConfig
  }
  const newConfig = await createConfiguration({
    mount: {
      public: { url: '/', static: true },
      src: { url: '/' }
    },
    plugins: ['@snowpack/plugin-dotenv', '@snowsvex/snowsvex-plugin'],
    routes: [{ match: 'routes', src: '.*', dest: '/index.html' }]
  })
  return newConfig
}
