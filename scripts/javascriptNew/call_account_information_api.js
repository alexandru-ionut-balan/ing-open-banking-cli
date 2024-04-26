import { Authenticator } from './src/auth/Authenticator.js';
import { Configuration } from './src/configuration/Configuration.js';
import { writeConsole } from './src/util/util.js';
import * as readline from 'node:readline';

const configuration = new Configuration('sandbox', true)
const authenticator = new Authenticator(configuration)

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

let authorizationCode = '';
let applicationAccessToken = ''
let clientId = ''

await authenticator.requestAppToken()
  .then(response =>
  {
    applicationAccessToken = response.access_token
    clientId = response.client_id
    return authenticator.requestAuthorizationUrl(response.access_token, response.client_id)
  }
  )
  .then(location => writeConsole(`Authorization URL: ${location}`))


rl.question("Type authorization code: ", code => {
  authorizationCode = code
  rl.close()

  authenticator.requestCustomerToken(applicationAccessToken, clientId, authorizationCode)
    .then(writeConsole)
})