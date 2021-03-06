import { AllowedFiletypes, CompiledFile } from "../types";

export function isAllowedFiletype(f: string): f is AllowedFiletypes {
  return ['svelte', 'svx', 'ts', 'js'].includes(f)
}

export function isCompiledFile(f: (CompiledFile | undefined)): f is CompiledFile {
  return f !== undefined
}