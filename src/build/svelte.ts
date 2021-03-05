export async function render(src: string) {
  const Component = await import(src)
  const output = await Component.default.default.render()
  return output.html
}
