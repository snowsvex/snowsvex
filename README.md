# Snowsvex

> Build svex-y static sites with svelte

Compile Svelte and svelte-scented markdown _(aka MDSvex)_ into static pages using Snowpack.

## Installation

📦 Install with your favourite package manager

```sh
npm i -D @snowsvex/snowsvex
yarn add -D @snowsvex/snowsvex
pnpm i -D @snowsvex/snowsvex
```

❄️ And then add the scripts to your `package.json`

```json
  "scripts": {
    "start": "snowsvex dev",
    "build": "snowsvex build",
  },
```

## Configuration

By default any `.svelte` or `.svx` files in your `src/pages` directory will generate html files.

You can add more directories to watch by adding them to a `snowsvex.config.js` file.

```js
module.exports = {
  pagesDirs: ['pages', 'articles', 'foo', 'superfoo']
}
```

`pagesDirs` expects a `string[]` of directory names to look in for files to generate static pages from.

Snowsvex is built on top of the _great and mighty_ Snowpack! You add a `snowpack.config.js` to extend the configuration Snowsvex uses.

## Output Files

The `pages` directory is special and if present will generate html files at the root of your build directory. This is so no special routing needs to take place when your awesome new static site hits the server. All other directories will be placed in `[DIR]/[FILE_NAME]` in your build directory.

### Dev Mode

Working with multiple output files in Snowpack causes some interesting path issues when in dev mode. We circumvent this by adding a very _very_ basic router to your source code. So when you slam down that `yarn dev` command, don't freak out when the `src/dev-runtime.js` file appears. This file is generated using your `pagesDirs` configuration.

Need a new directory to watch and generate pages from? Add it to your `snowsvex.config.js` > `pagesDirs` config and rerun `yarn dev`

## TODO

- [ ] Setup Github action to autodeploy to npm
- [ ] gif showing build command
- [ ] fix config file
