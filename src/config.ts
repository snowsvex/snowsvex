import { createConfiguration, loadConfiguration, SnowpackConfig } from 'snowpack'

export interface SnowsvexConfig {
  pagesDirs: string[]
}

export async function loadSnowsvexConfig(): Promise<SnowsvexConfig | null> {
  try {
    const raw = //@ts-ignore
    (await import('../snowsvex.config.js')) as SnowsvexConfig
    return raw
  } catch (err) {
    console.log('No snowsvex config found')
  }
  // const snowpackConfig = await loadConfiguration()
  // const snowsvexPlugin = snowpackConfig.plugins.find(
  //   ({ name }) => name === '@snowsvex/snowsvex-plugin'
  // )
  // if (!snowsvexPlugin) {
  //   throw new Error(
  //     'The snowsvex plugin was not found! Install it: `yarn add -D @snowsvex/snowsvex-plugin`'
  //   )
  // }
  // const opts = snowsvexPlugin?.config
  // console.log({ opts })

  // .find(plugin => plugin.name === '@snowsvex/snowsvex-plugin')
  // ?.config
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
