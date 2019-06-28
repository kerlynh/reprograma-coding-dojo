const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const servidor = express()
const treinadoresController = require('./TreinadoresController')
const params = require('params')
const parametrosPermitidos = require('./parametrosPermitidos')
const PORT = 3000
const logger = (request, response, next) => {
  console.log(`${new Date().toISOString()} Request type: ${request.method} to ${request.originalUrl}`)

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

// Rotas TREINADORES

servidor.get('/treinadores', async (request, response) => {
  treinadoresController.getAll()
    .then(treinadores => response.send(treinadores))
})

servidor.get('/treinadores/:treinadorId', (request, response) => {
  const treinadorId = request.params.treinadorId
  treinadoresController.getById(treinadorId)
    .then(treinador => {
      if(!treinador){
        response.sendStatus(404)
      } else {
        response.send(treinador)
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

servidor.patch('/treinadores/:id', (request, response) => {
  const id = request.params.id
  treinadoresController.update(id, request.body)
    .then(treinador => {
      if(!treinador) { response.sendStatus(404) }
      else { response.send(treinador) }
    })
    .catch(error => {
      if(error.name === "MongoError" || error.name === "CastError"){
        response.sendStatus(400)
      } else {
        response.sendStatus(500)
      }
    })
})

servidor.post('/treinadores', (request, response) => {
  treinadoresController.add(request.body)
    .then(treinador => {
      const _id = treinador._id
      response.send(_id)
    })
    .catch(error => {
      if(error.name === "ValidationError"){
        response.sendStatus(400)
      } else {
        console.log(error)
        response.sendStatus(500)
      }
    })
})

servidor.post('/treinadores/adicionar-pokemon/:treinadorId', (request, response) => {
  const treinadorId = request.params.treinadorId
  treinadoresController.addPokemon(treinadorId, request.body)
    .then(treinador => {
      const _id = treinador._id
      response.send(_id)
    })
    .catch(error => {
      if(error.name === "ValidationError"){
        response.sendStatus(400)
      } else {
        console.log(error)
        response.sendStatus(500)
      }
    })
})

servidor.patch('/treinadores/:treinadorId/treinar/:pokemonId', (request, response) => {
  const treinadorId = request.params.treinadorId
  const pokemonId = request.params.pokemonId
  treinadoresController.treinarPokemon(treinadorId, pokemonId, request.body)
    .then(treinador => {
      const _id = treinador._id
      response.send(_id)
    })
    .catch(error => {
      if(error.name === "ValidationError"){
        response.sendStatus(400)
      } else {
        console.log(error)
        response.sendStatus(500)
      }
    })
})

servidor.get('/treinadores/:treinadorId/pokemons', async (request, response) => {
  const treinadorId = request.params.treinadorId
  treinadoresController.getPokemons(treinadorId)
    .then(pokemons => response.send(pokemons))
})

servidor.patch('/treinadores/:treinadorId/pokemon/:pokemonId', (request, response) => {
  const treinadorId = request.params.treinadorId
  const pokemonId = request.params.pokemonId
  treinadoresController.updatePokemon(treinadorId, pokemonId, request.body)
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

servidor.get('/treinadores/:treinadorId/pokemons/:pokemonId', (request, response) => {
  const treinadorId = request.params.treinadorId
  const pokemonId = request.params.pokemonId
  treinadoresController.getByPokemonId(treinadorId, pokemonId)
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

servidor.post('/treinadores/login', (request, response) => {
  treinadoresController.login(request.body)
    .then(loginResponse => {
      response.send(loginResponse)
    })
    .catch(error => {
      if(error.name === "ValidationError"){
        console.log(error)
        response.sendStatus(400)
      } else {
        console.log(error)
        response.sendStatus(500)
      }
    })
})

servidor.listen(PORT)
console.info(`Rodando na porta ${PORT}`)
