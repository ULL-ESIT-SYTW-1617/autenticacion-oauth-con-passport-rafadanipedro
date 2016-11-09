import inquirer from 'inquirer'
import isIp from 'is-ip'

const questions = [
  {
    type: 'input',
    name: 'username',
    message: 'Cual es tu nombre de usuario'
  },
  {
    type: 'input',
    name: 'apellidos',
    message: 'Cual es el directorio del Iaas',
    validate: ruta => {
      if(ruta.match(/^(\/.+?)+$/)) return true
      return 'Introduce una ruta absoluta hasta el directorio, ejemplo: /home/usuario/servidorGitbook'
    }
  },
  {
    type: 'input',
    name: 'Dirección Ip',
    message: 'Cual es tu direccion ip',
    validate: value => {
      if(isIp(value)) return true
      return 'Introduce una ip correcta';
    }
  }
]

export default function ask() {
  return inquirer.prompt(questions)
}