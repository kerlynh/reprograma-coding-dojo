const { connect } = require('./PokemonsApiRepository')
const pokemonsModel = require('./PokemonsSchema')
const LIMITE_NIVEL_POKEMON = 150

connect()

const calcularNivel = (datas, nivelAnterior) => {
  const diff = Math.abs(new Date(datas.dataInicio) - new Date(datas.dataFim)) / 3600000
  const novoNivel = diff / 4 + nivelAnterior;

  return novoNivel >= LIMITE_NIVEL_POKEMON ? LIMITE_NIVEL_POKEMON : novoNivel;
}

const getAll = () => {
  return pokemonsModel.find((error, pokemons) => {
    return pokemons
  })
}

const getById = (id) => {
  return pokemonsModel.findById(id)
}

const add = (pokemon) => {
  const novoPokemon = new pokemonsModel(pokemon)
  return novoPokemon.save()
}

const remove = (id) => {
  return pokemonsModel.findByIdAndDelete(id)
}

const update = (id, pokemon) => {
  return pokemonsModel.findByIdAndUpdate(
    id,
    { $set: pokemon },
    { new: true },
  )
}

const treinar = async (id, datas) => {
  const pokemon = await pokemonsModel.findById(id, 'nivel')
  const nivelPokemon = pokemon.nivel

  if (nivelPokemon >= LIMITE_NIVEL_POKEMON) {
    throw new Error('Seu pokémon já é forte o suficiente!')
  }

  return pokemonsModel.findByIdAndUpdate(
    id,
    { $set: { nivel: calcularNivel(datas, nivelPokemon) } },
    { new: true },
  )
}

module.exports = {
  getAll,
  getById,
  add,
  remove,
  update,
  treinar
}