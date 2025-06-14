import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import execute from "./Ejecutar";
import {
  MensajesCollection,
} from "../imports/collections/collections";
import moment from "moment";

if (Meteor.isServer) {
  console.log("Cargando Métodos...");

  Meteor.methods({
    execute: async function (command) {
      try {
        let result = await execute(command);
        return result;
      } catch (error) {
        console.log(error.message);
        return error.message;
      }
    },

    sendMensaje: function (user, text, subject) {
      MensajesCollection.insert({
        from: user.bloqueadoDesbloqueadoPor
          ? user.bloqueadoDesbloqueadoPor
          : Meteor.users.findOne({
              username: Array(Meteor.settings.public.administradores)[0][0],
            })._id,
        to: user._id,
        mensaje: text.text,
      });
      // console.log(text);
    },
  });
}

//importar todos los .js de la carpeta metodos
// import "./metodos/audio.js";
// import "./metodos/logs.js";
// import "./metodos/peliculas.js";
// import "./metodos/series.js";
// import "./metodos/proxy.js";
// import "./metodos/usuarios.js";
import "./metodos/ventas";
import "./metodos/carrito";
import "./metodos/remesas";
// import "./metodos/vpn.js";
import "./metodos/productos.js";

