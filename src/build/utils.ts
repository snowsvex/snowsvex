import fs from 'fs/promises'

const BUILD_ROOT = './build'

function stripExts(file: string) {
  if (file.includes('.proxy.js')) return file
  return file.replace('.svelte', '').replace('.svx', '')
}

export async function renameFiles(dir: string) {
  const files = await fs.readdir(`${BUILD_ROOT}/${dir}`)
  await Promise.all(
    files.map(async file => {
      await fs.rename(`${BUILD_ROOT}/${dir}/${file}`, `${BUILD_ROOT}/${dir}/${stripExts(file)}`)
    })
  )
}

export async function moveToRoot(files: string[]) {
  await Promise.all(
    files.map(async file => {
      await fs.rename(`${BUILD_ROOT}/pages/${file}`, `${BUILD_ROOT}/${stripExts(file)}`)
    })
  )
}
