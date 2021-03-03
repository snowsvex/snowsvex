import { readdir, rename } from 'fs/promises'

const BUILD_ROOT = `${process.cwd()}/build`

function stripExts(file: string) {
  if (file.includes('.proxy.js')) return file
  return file.replace('.svelte', '').replace('.svx', '')
}

export async function renameFiles(dir: string) {
  try {
    const files = await readdir(`${BUILD_ROOT}/${dir}`)
    await Promise.all(
      files.map(async file => {
        const destination =
          dir === 'pages' && file.endsWith('.html') ? BUILD_ROOT : `${BUILD_ROOT}/${dir}`
        await rename(`${BUILD_ROOT}/${dir}/${file}`, `${destination}/${stripExts(file)}`).catch(
          console.error
        )
      })
    )
  } catch (e) {
    console.log(e)
  }
}
