const mongoose = require("mongoose");
// cada schema equivale collection
const Schema = mongoose.Schema;
const PokemonsSchema = new Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  nome: { type: String, required: true },
  foto: { type: String, required: true },
  nivel: { type: Number },
})

const pokemonsModel = mongoose.model("pokemons", PokemonsSchema);

module.exports = pokemonsModel;
