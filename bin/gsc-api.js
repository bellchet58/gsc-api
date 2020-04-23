#!/usr/bin/env node
var init = require('../lib/init')
var program = require('commander')
var chalk = require('chalk')
var package = require('../package.json')
var path = require('path')

program.version('v' + package.version)
  .description('check the tool\'s version')
  .option('-t, --token [token]', 'configure https://my.gsc.cn/ \'s user token')

program.command('upload <relativePath>')
  .alias('u')
  .description('upload the apk/ipa file to gsc')
  .action(function (relativePath, cmd) {
    cmd.token = program.token
    if (!cmd.token) {
      throw new Error('token is required!')
    }
    var gscApi = init({ token: cmd.token })
    var filePath = relativePath
    console.log(chalk.bgGray('ready for upload...'))
    gscApi.upload(filePath).then((shortLink) => {
      console.log(chalk.green('upload success! open: '), chalk.yellowBright(shortLink), chalk.green('to download!'));
    }).catch(err => {
      console.error(chalk.red('upload failed!\n'), chalk.blue(err))
    })
  })

program.parse(process.argv)

if (program.args.length === 0) {
  program.help()
}