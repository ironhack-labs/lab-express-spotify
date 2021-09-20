const mongoose = require("mongoose");

const connectingDB = () => {
  mongoose
    .connect("mongodb://localhost:27017/lab-express-spotify", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Estamos conectados a la base de datos");
    })
    .catch((error) => {
      console.log(error);
      process.exit(1); // DETIENE LA EJECUCIÓN DE MONGODB Y CIERRA SU PUERTO (CONNECTION CLOSED)
    });
};

module.exports = connectingDB;
