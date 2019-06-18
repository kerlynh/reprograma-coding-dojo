const { connect } = require('./PokemonsRepository')
const pokemonsModel = require('./PokemonsSchema')

connect() // para conectar no mongoDB

const calcularNivel = dates => {
  const diff = date.dataInicio.valueOf() - dataFim.valueOf();
  const horas = diff / 1000 / 60 / 60;
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

module.exports = {
  getAll,
  getById,
  add,
  remove,
  update
}
