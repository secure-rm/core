import chalk from 'chalk'
import Table from 'tty-table'

process.on('exit', () => {
  const rows = [[`The use of the secure-rm CLI is ${chalk.red.bold('deprecated')}.
Migrate over ➜ ${chalk.green('secure-rm-cli')}. Run:
${chalk.cyan('npm un secure-rm -g')}
${chalk.cyan('npm i secure-rm-cli -g')}`]]

    const t1 = Table([], rows, {
      borderStyle: 1,
      borderColor: 'yellow',
      paddingBottom: 0,
      headerAlign: 'center',
      headerColor: 'yellow',
      align: 'center',
      color: 'white'
      // truncate: "..."
    })

    const str1 = t1.render()
    console.log(str1)
})

