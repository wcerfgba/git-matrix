import * as Server from './server'

const server = Server.create({
  port: 3000,
  logger: console.log
})

Server.start(server)

console.log('eyeson http://localhost:3000')