#!/usr/bin/env node

import program from 'commander'
import figlet from 'figlet'
import clear from 'clear'
import chalk from 'chalk'
import { version, description } from '../package.json'

clear()
console.log(chalk.cyan(figlet.textSync('Snowsvex', { horizontalLayout: 'full' })))

program
  .version(version)
  .description(description)
  .command('dev')
  .description('Start Dev Mode!')
  .action(() => {
    console.log('dev mode')
  })
  .command('build')
  .description('Build static assets!')
  .action(() => {
    console.log('build mode')
  })
  .parse(process.argv)

if (!process.argv.slice(2).length) {
  program.outputHelp()
}
