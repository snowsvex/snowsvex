import { existsSync } from 'fs'
import { mkdir } from 'fs/promises'

export const SRC_ROOT = `${process.cwd()}/src`
export const BUILD_ROOT = `${process.cwd()}/build`

export function stripExts(file: string) {
  if (file.includes('.proxy.js')) return file
  return file.replace('.svelte', '').replace('.svx', '')
}

export async function createDirs(directories: string[]) {
  await Promise.all(
    directories.map(async dir => {
      if (!existsSync(`${BUILD_ROOT}/${dir}`)) {
        await mkdir(`${BUILD_ROOT}/${dir}`, { recursive: true })
      }
    })
  )
}
