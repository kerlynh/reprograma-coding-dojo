const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const servidor = express()
const PORT = 3000

servidor.use(cors())
servidor.use(bodyParser.json())

servidor.get('/', async (request, response) => {
  response.send('Olá, mundo!')
})


servidor.listen(PORT)
console.info(`Rodando na porta ${PORT}`)
