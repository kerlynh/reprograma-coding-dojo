const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const servidor = express()
const controller = require('./PokemonsController')
const PORT = 3000
const logger = (request, response, next) => {
  console.log(`Request type: ${request.method} to ${request.originalUrl}`)

  response.on('finish', () => {
    console.log(`${response.statusCode} ${response.statusMessage};`)
  })

  next()
}

servidor.use(cors())
servidor.use(bodyParser.json())
servidor.use(logger)

servidor.get('/', (request, response) => {
  response.send('Olá, mundo!')
})

servidor.get('/pokemons', async (request, response) => {
  controller.getAll()
    .then(pokemons => response.send(pokemons))
})

servidor.get('/pokemons/:pokemonId', (request, response) => {
  const pokemonId = request.params.pokemonId
  controller.getById(pokemonId)
    .then(pokemon => {
      if(!pokemon){
        response.sendStatus(404)
      } else {
        response.send(pokemon)
      }
    })
    .catch(error => {
      if(error.name === "CastError"){
        response.sendStatus(400)
      } else {
        response.sendStatus(500)
      }
    })
})

servidor.patch('/pokemons/:id', (request, response) => {
  const id = request.params.id
  controller.update(id, request.body)
    .then(pokemon => {
      if(!pokemon) { response.sendStatus(404) }
      else { response.send(pokemon) }
    })
    .catch(error => {
      if(error.name === "MongoError" || error.name === "CastError"){
        response.sendStatus(400)
      } else {
        response.sendStatus(500)
      }
    })
})

servidor.patch('/pokemons/treinar/:id', (request, response) => {
  const id = request.params.id
  controller.treinar(id, request.body)
    .then(pokemon => {
      if(!pokemon) { response.sendStatus(404) }
      else { response.send(pokemon) }
    })
    .catch(error => {
      if(error.name === "MongoError" || error.name === "CastError"){
        response.sendStatus(400)
      } else {
        response.sendStatus(500)
      }
    })
})

servidor.post('/pokemons', (request, response) => {
  controller.add(request.body)
    .then(pokemon => {
      const _id = pokemon._id
      response.send(_id)
    })
    .catch(error => {
      if(error.name === "ValidationError"){
        response.sendStatus(400)
      } else {
        response.sendStatus(500)
      }
    })
})


servidor.listen(PORT)
console.info(`Rodando na porta ${PORT}`)