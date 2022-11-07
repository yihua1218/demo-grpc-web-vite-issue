const grpc = require('@grpc/grpc-js')

const messages = require('./echo_pb')
const services = require('./echo_grpc_pb')


function doEcho (call, callback) {
  let res = new messages.EchoResponse()
  console.log(
    'echo_server|doEcho|receive query from client:', call.request.getQuery()
  )
  res.setReply('echo: ' + call.request.getQuery())
  callback(null, res)
}


function createEchoServer () {
  let server = new grpc.Server()
  server.addService(
    services.EchoServiceService, {
      echo: doEcho
    }
  )
  return server
}


if (require.main === module) {
  let server = createEchoServer()
  server.bindAsync(
    '127.0.0.1:50051', grpc.ServerCredentials.createInsecure(), (error, port) => {
      console.log('error:', error);
      console.log('port:', port);
      server.start()
    }
  )
  
}


module.exports.createEchoServer = createEchoServer
