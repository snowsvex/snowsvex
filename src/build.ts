import { Command } from 'commander'

const program = new Command()

program
  .name('build')
  .description('Build static assets!')
  .action(() => {
    console.log('build mode')
  })

export default program
