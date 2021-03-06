import { ComponentHtml } from '../types'

type HtmlGenerateProps = ComponentHtml & { destination: string }

export async function generate({ head, body, destination }: HtmlGenerateProps): Promise<string> {
  console.log(`generating html for ${destination}`)
  const dist = destination.replace(`${process.cwd()}/build`, '')

  const css = `${dist}.css`
  const js = `${dist}.js`

  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <link rel="icon" href="/favicon.ico" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      ${head.description ? `<meta name="description" content="${head.description}" />` : ''}
      ${head.title ? `<title>${head.title}</title>` : ''}
      <link rel="stylesheet" href="${css}" />
      ${head.raw ?? ''}
    </head>
    <body>
      ${body}
      <noscript>You need to enable JavaScript to run this app.</noscript>
      <script type="module">
        import comp from '${js}'
  
        let app = new comp({
          target: document.body,
          hydrate: true
        })
      </script>
    </body>
  </html>
  `
}
