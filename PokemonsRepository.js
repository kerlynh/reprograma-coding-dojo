const mongoose = require("mongoose");
// string de conexão:
// mongodb://dominio:porta/nome_database
const MONGO_URL = "mongodb://localhost:27017/pokemons";

function connect () {
  mongoose.connect(MONGO_URL,
    { useNewUrlParser: true },
    function (error) {
      if(error) {
        console.error("Algo de errado não está certo: ", error)
      } else {
        console.log("Conectado no mongoDB.")
      }
    }
  );
}

module.exports = { connect }
