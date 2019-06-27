const { connect } = require('./PokemonsApiRepository')
const treinadoresModel = require('./TreinadoresSchema')
const { pokemonsModel } = require('./PokemonsSchema')
const bcrypt = require('bcryptjs')
const LIMITE_NIVEL_POKEMON = 150

connect()

const calcularNivel = (datas, nivelAnterior) => {
  const diff = Math.abs(new Date(datas.dataInicio) - new Date(datas.dataFim)) / 3600000
  const novoNivel = diff / 4 + nivelAnterior;

  return novoNivel >= LIMITE_NIVEL_POKEMON ? LIMITE_NIVEL_POKEMON : novoNivel;
}

const getAll = () => {
  return treinadoresModel.find((error, treinadores) => {
    return treinadores
  })
}

const getById = (id) => {
  return treinadoresModel.findById(id)
}

const add = async (treinador) => {
  const treinadorEncontrado = await treinadoresModel.findOne({ email: treinador.email})
  console.log(treinadorEncontrado, treinador.email)
    
    if (treinadorEncontrado) {
      throw new Error('email já cadastrado')
    }

    const salt = bcrypt.genSalt(10)
    const senhaCriptografada = bcrypt.hashSync(treinador.senha, salt)
    // console.log(senhaEncriptada)
    // treinador.senha = senhaCriptografada

  // const novoTreinador = new treinadoresModel(treinador)
  const novoTreinador = new treinadoresModel({...treinador, senha: senhaCriptografada})

  return novoTreinador.save()
}

const remove = (id) => {
  return treinadoresModel.findByIdAndDelete(id)
}

const update = (id, treinador) => {
  return treinadoresModel.findByIdAndUpdate(
    id,
    { $set: treinador },
    { new: true },
  )
}

const addPokemon = async (treinadorId, pokemon) => {
  const treinador = await getById(treinadorId)
  const novoPokemon = new pokemonsModel(pokemon)

  treinador.pokemons.push(novoPokemon)
  return treinador.save()
}

const treinarPokemon = async (treinadorId, pokemonId, datas) => {
  const treinador = await getById(treinadorId)
  const pokemon = treinador.pokemons.find(pokemon => pokemon._id == pokemonId)

  if (pokemon.nivel >= LIMITE_NIVEL_POKEMON) {
    throw new Error('Seu pokémon já é forte o suficiente!')
  }

  pokemon.nivel = calcularNivel(datas, pokemon.nivel)
  return treinador.save()
}

const getPokemons = async treinadorId => {
  const treinador = await getById(treinadorId)
  return treinador.pokemons
}

const updatePokemon = (treinadorId, pokemonId, pokemon) => {
  return treinadoresModel.findOneAndUpdate(
    { _id: treinadorId, "pokemons._id": pokemonId },
    { $set: { "pokemons.$": { ...pokemon, _id: pokemonId } } },
    { new: true }
  )
}

const getByIdPokemonId = async (treinadorId, pokemonId) => {
  const treinador = await getById(treinadorId)
  return treinador.pokemons.find(pokemon => {
    return pokemon._id == pokemonId
  })
}


const login = (loginData) => {
  const treinadorEncontrado = await treinadoresModel.findOne({ email: treinador.email})

    if(treinadorEncontrado) {
      bcrypt.compareSync(loginData.senha, treinadorEncontrado.senha)
    }
}

module.exports = {
  getAll,
  getById,
  add,
  remove,
  update,
  addPokemon,
  treinarPokemon,
  getPokemons,
  updatePokemon,
  getByIdPokemonId,
  login
}