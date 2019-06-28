require('dotenv-safe').load()
const { connect } = require('./PokemonsApiRepository')
const treinadoresModel = require('./TreinadoresSchema')
const { pokemonsModel } = require('./PokemonsSchema')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
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
  const treinadorEncontrado = await treinadoresModel.findOne({ email: treinador.email })

  if (treinadorEncontrado) {
    throw new Error('Email já cadastrado')
  }

  const salt = bcrypt.genSaltSync(10)
  const senhaCriptografada = bcrypt.hashSync(treinador.senha, salt)
  treinador.senha = senhaCriptografada

  const novoTreinador = new treinadoresModel(treinador)
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
    { $set: { "pokemons.$": { ...pokemon, _id: pokemonId } } }, // sem usar o spread operator (...), obteremos um objeto dentro de outro (ao invés de vários atributos para alterar o pokemon)
    { new: true } // precisamos disso para retornar uma nova instância do pokemon que encontramos, para podermos vê-lo atualizado
  )
}

const getByPokemonId = async (treinadorId, pokemonId) => {
  const treinador = await getById(treinadorId)
  return treinador.pokemons.find(pokemon => {
    return pokemon._id == pokemonId
  })
}

const login = async (loginData) => {
  const treinadorEncontrado = await treinadoresModel.findOne(
    { email: loginData.email }
  )

  if (treinadorEncontrado) {
    const senhaCorreta = bcrypt.compareSync(loginData.senha, treinadorEncontrado.senha)

    if (senhaCorreta) {
      const token = jwt.sign(
        { email: treinadorEncontrado.email, id: treinadorEncontrado._id },
        process.env.PRIVATE_KEY
      )
      return { auth: true, token };
    } else {
      throw new Error('Senha incorreta, prestenção parça')
    }
  } else {
    throw new Error('Email não está cadastrado')
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
  getByPokemonId,
  login
}
