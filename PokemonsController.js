const { connect } = require('./PokemonsRepository')
const pokemonsModel = require('./PokemonsSchema')

connect()

const calcularNivel = (datas, nivelAnterior) => {
  const diff = Math.abs(new Date(datas.dataInicio) - new Date(datas.dataFim)) / 3600000
  return diff / 4 + nivelAnterior;
}

const getAll = async () => {
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
  const nivelAnterior = pokemon.nivel
  return pokemonsModel.findByIdAndUpdate(
    id,
    { $set: { nivel: calcularNivel(datas, nivelAnterior)} },
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