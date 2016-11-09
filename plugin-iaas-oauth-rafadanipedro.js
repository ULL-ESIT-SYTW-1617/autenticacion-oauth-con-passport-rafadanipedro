import gulp from 'gulp'
import GulpSSH from 'gulp-ssh'
import fs from 'fs-promise'
import prompt from 'prompt'
import tutu from 'gulp-debug'

let config = require('./config.json')

prompt.start();

export function config() {
  return config;
}

function pedirTeclado (chuchu, hidden) {
  return new Promise((resolve, reject) => {
      prompt.get([{
        name: chuchu,
        hidden,
        required: true
      }], function (err, result) {
        if(err) return reject(err)
        resolve(result[chuchu])
      });
    })
}

export async function deploy(args = {}) {
  config = args;

  if (!config.host) {
    config.host = await pedirTeclado("host")
  }

  if (!config.username) {
    config.username = await pedirTeclado("username")
  }

  if (!config.path) {
    config.path = await pedirTeclado("path")
  }

  config.password = await pedirTeclado("password", true);

  var gulpSSH = new GulpSSH({
    ignoreErrors: false,
    sshConfig: config
  })

  return gulpSSH
    .shell(['cd ' + config.host, 'git pull'], {filePath: 'shell.log'})
    .pipe(gulp.dest('logs'))
    .on('end', function(){config = null; console.log(fs.readFileSync('./logs/shell.log').toString())})
}