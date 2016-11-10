import inquirer from 'inquirer'
import isIp from 'is-ip'
import path from 'path'
import fs from 'fs'

const questions = [
  {
    type: 'input',
    name: 'username',
    message: 'Cual es tu username del Iaas'
  },
  {
    type: 'input',
    name: 'privateKey',
    default: '~/.ssh/id_rsa',
    message: 'Cual es la ruta de tu clave privada',
    validate: ruta => {
      if (ruta[0] === '~') ruta = `${process.env.HOME}${ruta.substr(1)}`
      try {
        fs.accessSync(path.resolve(ruta))
        return true
      } catch(err) {
        return err.message
      }
    }
  },
  {
    type: 'input',
    name: 'directorioIaas',
    message: 'Cual es el directorio del Iaas',
    validate: ruta => {
      if(ruta.match(/^(\/.+?)+$/)) return true
      return 'Introduce una ruta absoluta hasta el directorio, ejemplo: /home/usuario/servidorGitbook'
    }
  },
  {
    type: 'input',
    name: 'host',
    message: 'Cual es tu direccion ip',
    validate: value => {
      if(isIp(value)) return true
      return 'Introduce una ip correcta';
    }
  },
  {
    type: 'input',
    name: 'creaApp',
    message: 'Entre en esta direccion para crear una OauthApplication en Github https://github.com/settings/developers y escribe "confirmar" para continuar',
    validate: conf => conf === 'confirmar'
  },
  {
    type: 'input',
    name: 'clientID',
    message: 'Cual es el clientID',
    validate: ruta => {
      if(ruta.match(/^[0-9A-F]+$/i)) return true
      return 'El clientID no tiene un formato correcto, revisalo'
    }
  },
  {
    type: 'input',
    name: 'clientSecret',
    message: 'Cual es el clientSecret',
    validate: ruta => {
      if(ruta.match(/^[0-9A-F]+$/i)) return true
      return 'El clientSecret no tiene un formato correcto, revísalo'
    }
  },
  {
    type: 'input',
    name: 'organizacion',
    message: 'Cual es la organizacion a la que perteneces',
    default: 'ULL-ESIT-GRADOII-DSI'
  }
]

export default async function config () {
  let cfg = await inquirer.prompt(questions)
  if (config.privateKey[0] === '~') cfg.privateKey = `${process.env.HOME}${config.privateKey.substr(1)}`
  return cfg
}