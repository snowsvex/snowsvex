#!/usr/bin/env node

import program from 'commander'
import figlet from 'figlet'
import clear from 'clear'
import chalk from 'chalk'
import { version, description } from '../package.json'
import dev from './dev'
import build from './build'

clear()
console.log(chalk.cyan(figlet.textSync('Snowsvex', { horizontalLayout: 'full' })))

program
  .version(version)
  .description(description)
  .addCommand(dev)
  .addCommand(build)
  .parse(process.argv)

if (!process.argv.slice(2).length) {
  program.outputHelp()
}
