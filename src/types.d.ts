export type Destination = string

export type ComponentHtml = {
  body: string
  head: {
    raw?: string
    title?: string
    description?: string
  }
}

export type CompiledFile = {
  html: ComponentHtml
  css?: string
  js?: string
  src: string
  /**
   * destination filepath, stripped of extension
   */
  destination: Destination
}

export type CompileMap = Pick<CompiledFile, 'src' | 'destination'>

export type BuildProps = {
  directories: string[]
}

export type AllowedFiletypes = 'svelte' | 'svx' | 'js' | 'ts'

export type BuildFile = {
  directory: string,
  filename: string,
  filetype: AllowedFiletypes,
}