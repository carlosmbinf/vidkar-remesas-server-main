import { Meteor } from "meteor/meteor";
import { Accounts } from 'meteor/accounts-base'

import "./startup";
import "./metodos";
import "./publicaciones";
// import "./serverproxy3002";
import "./tareas";
import "./rutas";
import "./bot";
// import "./videoCalls";
// import "./observers";

import { OnlineCollection } from "/imports/collections/collections";

Meteor.startup(async () => {


});


if (Meteor.isServer) {

  Meteor.onConnection(function (connection) {
    OnlineCollection.insertAsync({
      _id: connection.id,
      address: connection.clientAddress,
    });

    connection.onClose(function () {
      OnlineCollection.removeAsync(connection.id);
    });
  });

  Accounts.onLogin(function (info) {
    var connectionId = info.connection.id;
    var user = info.user;
    var userId = user._id;

    OnlineCollection.updateAsync(connectionId, {
      $set: {
        userId: userId,
        loginAt: new Date(),
      },
    });
    // Meteor.users.update(userId, {
    //   $set: {
    //     online: true,
    //   },
    // });
  });

  Accounts.onLogout(function (info) {
    var connectionId = info.connection.id;
    OnlineCollection.updateAsync(connectionId, {
      $set: {
        userId: "",
      },
    });
    // Meteor.users.update(info.user._id, {
    //   $set: {
    //     online: false,
    //   },
    // });
  });

  Accounts.onCreateUser( async (options, user) => {
    // console.log("options > " + JSON.stringify(options))
    // console.log("user > " + JSON.stringify(user))
    if (user.services.facebook) {

      //  user.username = user.services.facebook.name;
      // let usuario =  Meteor.users.findOne({ "services.facebook.name": user.services.facebook.name })
      let usuario = user.services.facebook.email ? Meteor.users.findOneAsync({ "emails.address": user.services.facebook.email }) : Meteor.users.findOne({ "services.facebook.first_name": user.services.facebook.first_name, "services.facebook.last_name": user.services.facebook.last_name })

      usuario ?
        (console.log(`Usuario de FACEBOOK ${usuario._id} actualizado`),
          usuario.services.facebook = user.services.facebook,
          user = usuario,
          user.profile = {
            firstName: user.services.facebook.first_name,
            lastName: user.services.facebook.last_name,
            name: user.services.facebook.name,
            role: user.profile.role,
          },
          user.picture = user.services.facebook.picture.data.url,
          Meteor.users.removeAsync(usuario._id)

        )
        : (console.log(`Usuario de FACEBOOK ${user._id} Creado`),
          (user.emails = [{ address: user.services.facebook.email }]),
          (user.profile = {
            firstName: user.services.facebook.first_name,
            lastName: user.services.facebook.last_name,
            name: user.services.facebook.name,
            role: "user",
          }),
          (user.online = false),
          (user.creadoPor = "Facebook"),
          (user.baneado = true),
          (user.picture = user.services.facebook.picture.data.url),
          (user.descuentoproxy = 0),
          (user.descuentovpn = 0),
          (user.contandoProxy = true),
          (user.contandoVPN = true)
        );

      return user;

    } else if (user.services.google) {
      //  user.username = user.services.facebook.name;

      let usuario = user.services.google.email && await Meteor.users.findOneAsync({ "emails.address": user.services.google.email })
      usuario ?
        (console.log(`Usuario de GOOGLE ${usuario._id} actualizado`),
          usuario.services.google = user.services.google,
          user = usuario,
          user.profile = {
            firstName: user.services.google.given_name,
            lastName: user.services.google.family_name,
            name: user.services.google.name,
            role: user.profile.role,
          },
          user.picture = user.services.google.picture,
          await Meteor.users.removeAsync(usuario._id)
        )
        : (console.log(`Usuario de GOOGLE ${user._id} Creado`),
          (user.emails = [{ address: user.services.google.email }]),
          (user.profile = {
            firstName: user.services.google.given_name,
            lastName: user.services.google.family_name,
            name: user.services.google.name,
            role: "user",
          }),
          (user.online = false),
          (user.creadoPor = "Google"),
          (user.baneado = true),
          (user.picture = user.services.google.picture),
          (user.descuentoproxy = 0),
          (user.descuentovpn = 0),
          (user.contandoProxy = true),
          (user.contandoVPN = true));
      return user;

    } else {
      const profile = {
        firstName: options.firstName,
        lastName: options.lastName,
        role: options.role,
      };

      // user.username = options.firstName + options.lastName
      user.profile = profile;
      user.creadoPor = options.creadoPor;
      user.bloqueadoDesbloqueadoPor = options.creadoPor;
      user.edad = options.edad;
      user.online = false;
      user.baneado = true;
      user.descuentoproxy = 0;
      user.descuentovpn = 0;
      user.contandoProxy = true;
      user.contandoVPN = true;
      user.passvpn = options.password;
      console.log(`CREATE - user: \n${JSON.stringify(user)}\n-----------------------\n`)
      console.log(`CREATE - options: \n${JSON.stringify(options)}\n-----------------------\n`)

      return user;
    }

  });

  Meteor.users.after.insert(function (userId, doc) {
    // console.log(userId);
    console.log(`Usuario Creado con id => ${doc._id}`);
  });

}