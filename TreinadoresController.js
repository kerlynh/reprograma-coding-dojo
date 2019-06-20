const { connect } = require('./PokemonsApiRepository')
const treinadoresModel = require('./TreinadoresSchema')
const { pokemonsModel } = require('./PokemonsSchema')

connect()

const getAll = () => {
  return treinadoresModel.find((error, treinadores) => {
    return treinadores
  })
}

const getById = (id) => {
  return treinadoresModel.findById(id)
}

const add = (treinador) => {
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

module.exports = {
  getAll,
  getById,
  add,
  remove,
  update,
  addPokemon
}