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

servidor.delete('/pokemons/:id', (request, response) => {
  controller.remove(request.params.id)
    .then(pokemon => {
      if(pokemon === null || pokemon === undefined){ // if(!comida) 
        response.sendStatus(404) // not found
      } else {
        response.sendStatus(204)
      }
    })
    .catch(error => {
      if(error.name === "CastError"){
        response.sendStatus(400) //bad request
      } else {
        response.sendStatus(500)
      } 
    })
})

servidor.listen(PORT)
console.info(`Rodando na porta ${PORT}`)