const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const servidor = express()
const controller = require('./PokemonsController')
const PORT = 3000

servidor.use(cors())
servidor.use(bodyParser.json())

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
      if(!pokemon){ // pokemon === null || pokemon === undefined
        response.sendStatus(404) // pokemon nao encontrada
      } else {
        response.send(pokemon) // Status default é 200
      }
    })
    .catch(error => {
      if(error.name === "CastError"){
        response.sendStatus(400) // bad request - tem algum parametro errado
      } else {
        response.sendStatus(500) // deu ruim, e nao sabemos oq foi
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
        response.sendStatus(400) // bad request
      } else {
        response.sendStatus(500)
      }
    })
})


servidor.listen(PORT)
console.info(`Rodando na porta ${PORT}`)
