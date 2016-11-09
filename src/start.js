// Copiar el contenido del servidor de express y ssubirlo al Iaas.

import Client from 'ssh2-sftp-client'
import path from 'path'
import fs from 'fs'

async function start (dirRemoto) {
  let sftp = new Client();
  let dirLocal = path.resolve(__dirname, '../iaasserver')

  try {
    await sftp.connect({
      host: '95.122.54.178',
      port: '22',
      username: 'rafa',
      password: 'pruebecita'
  })

  await upload(sftp, dirLocal, dirRemoto)

  console.log('He terminado el uploaddd!!!')

  // await upload(sftp, dirLocal, dirRemoto)

  await sftp.end()
  } catch(err) {
    console.log('Catcheé un error!! :(')
    await sftp.end()
    throw err
  }
}

async function upload (sftp, pathLocal, pathRemoto) {
  // Funcion que actualiza el servidor remoto con los archivos locales.
  process.stdout.write(`${pathLocal} -> ${pathRemoto}`)

  if (fs.lstatSync(path.join(pathLocal)).isDirectory()) {
    console.log(' Creando directorio...')
    await sftp.mkdir(pathRemoto)
    let files = fs.readdirSync(pathLocal)
    for (let file of files) {
      await upload(sftp, path.join(pathLocal, file), path.join(pathRemoto, file))
    }
    return
  }

  await sftp.put(path.resolve(pathLocal), path.resolve(pathRemoto))
  console.log(' OK!')
}

// Pruebas!!
// start('/home/rafa/proyecto').then(() => console.log('He terminado de hacer todo')).catch(console.error)

