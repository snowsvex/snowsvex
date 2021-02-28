import { Command } from 'commander'

const program = new Command()

program
  .name('dev')
  .description('Start Dev Mode!')
  .action(() => {
    console.log('dev mode')
  })

export default program
