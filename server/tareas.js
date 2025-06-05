import { Meteor } from "meteor/meteor";
import { LogsCollection, PelisCollection, RegisterDataUsersCollection, SeriesCollection, ServersCollection, TemporadasCollection, VentasCollection } from "../imports/ui/pages/collections/collections";
import moment from 'moment';

var cron = require("node-cron");

///////METODOS//////

const inabilitarServerSiNoEstaConectadoElServer = async () => {
  const servidores = await ServersCollection.find({}).fetch();

  await servidores.forEach(async (server) => {
    const serverId = server._id;
    const isConnected = server.lastUpdate > moment().subtract(1, "minutes").toDate();
    if (!isConnected && server.estado !== "INACTIVO") {
      await ServersCollection.update(serverId, { $set: { estado: "INACTIVO" } });
    }
  }
  );
}

const ultimaCompraByUserId = async (userId, type) => {
  return await Meteor.call("ultimaCompraByUserId",userId, type)
}

const guardarDatosConsumidosAll = async () => {
  let users = await Meteor.users.find({
    $or: [
      { megasGastadosinBytes: { $gte: 1 } },
      { vpnMbGastados: { $gte: 1 } },
    ],
  });
  await console.log("Count User Diarios " + users.count());
  // await console.log("running every minute to 1 from 5");

  users.fetch().forEach( async user => {
   await Meteor.call("guardarDatosConsumidosByUserHoras",user)
  })
}

const guardarDatosConsumidosAllMensual = async () => {
  let users = await Meteor.users.find({
    $or: [
      { megasGastadosinBytes: { $gte: 1 } },
      { vpnMbGastados: { $gte: 1 } },
    ],
  });
  await console.log("Count user Mensual" + users.count());
  // await console.log("running every minute to 1 from 5");

  await users.forEach(async (user) => {
    await Meteor.call("guardarDatosConsumidosByUserMensual",user)
  });
}


const actualizarSeries = async () => {
//ACTUALIZANDO LAS SERIES Y LOS CAPITULOS
TemporadasCollection.find({actualizar:true}).forEach(async (temporada) => {

  let serie = await SeriesCollection.findOne({ _id: temporada.idSerie })

   Meteor.call(
     "insertSeriesByTemporadasURL",
     { urlSerie: temporada.url, year: serie.anoLanzamiento, seriesName: serie.nombre },
     (error, result) => {
       error && console.log(error);
       !error &&
         console.log(
           "Se Actualizo la Serie: " +
             serie.nombre +
             " Temporada: " +
             temporada.numeroTemporada
         );
     }
   );

});

}


////////////////CRONES////////////

if (Meteor.isServer) {
  console.log("Cargando Tareas...");


  try {
    cron
      .schedule(
        // "1-59 * * * *",
        "35 * * 1-12 *", // cambio para que actualice segun la fecha de uruguay 11:55 de montevideo
        actualizarSeries,
        {
          scheduled: true,
          // timezone: "America/Havana",
        }
      )
      .start();


  } catch (error) {
    console.log(error);
  }

  try {
    cron
      .schedule(
        // "1-59 * * * *",
        "55 * * 1-12 *", // cambio para que actualice segun la fecha de uruguay 11:55 de montevideo
        guardarDatosConsumidosAll,
        {
          scheduled: true,
          timezone: "America/Havana",
        }
      )
      .start();


  } catch (error) {
    console.log(error);
  }
  // try {
  //   cron
  //     .schedule(
  //       // "1-59 * * * *",
  //       "0 0 1 1-12 *",
  //       guardarDatosConsumidosAllMensual,
  //       {
  //         scheduled: true,
  //         timezone: "America/Havana",
  //       }
  //     )
  //     .start();


  // } catch (error) {
  //   console.log(error);
  // }

  try {
    //////////////////Banear proxy ///////////////////
    cron
      .schedule(
        "*/10 * * * *",
        async () => {
          let users = await Meteor.users.find({ baneado: false }, {
            fields: {
              _id: 1,
              profile: 1,
              isIlimitado: 1,
              fechaSubscripcion: 1,
              megasGastadosinBytes: 1,
              megas: 1,
              baneado: 1,
              bloqueadoDesbloqueadoPor: 1,
              emails: 1,
            }
          });

          await users.forEach(async (user) => {
            const ultimaVentaProxy = await ultimaCompraByUserId(user._id, 'PROXY'); // Función para obtener la última compra de proxy            
            const haceUnMes = ultimaVentaProxy ? moment(ultimaVentaProxy.createdAt).add(1, 'months') < moment(new Date()) : false;
            // console.log("PROXY HACE UN MES? " + haceUnMes + " ultimaVentaProxy" + ultimaVentaProxy)
            if (user.isIlimitado) {
              if (user.fechaSubscripcion && new Date() >= new Date(user.fechaSubscripcion))
                await bloquearUsuarioProxy(user, "porque llegó a la fecha límite");
            } else {
              const megasGastados = user.megasGastadosinBytes ? user.megasGastadosinBytes / 1024000 : 0;
              const megasContratados = user.megas ? Number(user.megas) : 0;
              if ((megasGastados >= megasContratados || haceUnMes) && !user.baneado) {
                let motivo = "";
                if (megasGastados >= megasContratados) {
                  motivo = `porque consumió ${megasContratados} MB`;
                }
                if (haceUnMes) {
                  motivo += motivo ? " y " : "";
                  motivo += `hace más de un mes desde la última compra.\nULTIMA COMPRA:\n${moment(ultimaVentaProxy.createdAt)}`;
                }
                await bloquearUsuarioProxy(user, motivo);
              }
            }
          });


          async function bloquearUsuarioProxy(user, motivo) {
            if (!user) return; // Validación contra null

            try {
              await Meteor.users.update(user._id, { $set: { baneado: true } });
              await Meteor.call("registrarLog", "Bloqueo Proxy", user._id, "SERVER", `El servidor ${process.env.ROOT_URL} bloqueó automáticamente el proxy ${motivo}`);
              await Meteor.call("sendMensaje", user, {
                text: `El servidor ${process.env.ROOT_URL} bloqueó automáticamente el proxy de ${user.profile.firstName} ${user.profile.lastName} ${motivo}`,
              }, 'VidKar Bloqueo de Proxy');
            } catch (error) {
              console.log("Error al enviar el mensaje: ", error);
            }
            await Meteor.call("guardarDatosConsumidosByUserPROXYHoras",user)
            await Meteor.call("reiniciarConsumoDeDatosPROXY",user)
          }

        },
        {
          scheduled: true,
          timezone: "America/Havana",
        }
      )
      .start();


  } catch (error) {
    console.log(error);
  }

  try {
    //////////Banear VPN //////////////
    cron
      .schedule(
        "*/10 * * * *",
        async () => {
          let users = await Meteor.users.find({ vpn: true }, {
            fields: {
              _id: 1,
              profile: 1,
              vpnisIlimitado: 1,
              vpnfechaSubscripcion: 1,
              vpnMbGastados: 1,
              vpnmegas: 1,
              vpn: 1,
              bloqueadoDesbloqueadoPor: 1,
              emails: 1,
            }
          });

          await users.forEach(async (user) => {
            const ultimaVentaVPN = await ultimaCompraByUserId(user._id, 'VPN'); // Función para obtener la última compra de VPN
            const haceUnMes = ultimaVentaVPN ? moment(ultimaVentaVPN.createdAt).add(1, 'months') < moment(new Date()) : false;
            // console.log("VPN HACE UN MES? " + haceUnMes + " ultimaVentaVPN: " + ultimaVentaVPN)
            if (user.vpnisIlimitado) {
              if (user.vpnfechaSubscripcion && new Date() > user.vpnfechaSubscripcion)
                await bloquearUsuarioVPN(user, "porque llegó a la fecha límite");
            } else {
              if ((user.vpnMbGastados ? user.vpnMbGastados : 0) >= ((user.vpnmegas ? Number(user.vpnmegas) : 0) * 1024000)) {
                await bloquearUsuarioVPN(user, `porque consumió ${user.vpnmegas} MB`);
              } else if (haceUnMes) {
                await bloquearUsuarioVPN(user, ` porque hace más de un mes desde la última compra\nULTIMA COMPRA:\n${moment(ultimaVentaVPN.createdAt)}`);
              }
            }
          });


    async function bloquearUsuarioVPN(user, motivo) {
      if (!user) return; // Validación contra null
      if (!user.vpn) return; // Si esta bloqueada la VPN que no actualice nada
  
      try {
        await Meteor.users.update(user._id, { $set: { vpn: false } });
        await Meteor.call("registrarLog", "Bloqueo VPN", user._id, "SERVER", `El servidor ${process.env.ROOT_URL} bloqueó automáticamente la VPN ${motivo}`);
       await Meteor.call("sendMensaje", user, {
          text: `El servidor ${process.env.ROOT_URL} bloqueó automáticamente la VPN de ${user.profile.firstName} ${user.profile.lastName} ${motivo}`,
        }, 'VidKar Bloqueo de VPN');
      } catch (error) {
        console.log("Error al enviar el mensaje: ", error);
      }
      await Meteor.call("guardarDatosConsumidosByUserVPNHoras", user)
      await Meteor.call("reiniciarConsumoDeDatosVPN", user)
    }

  },
  {
    scheduled: true,
      timezone: "America/Havana",
        }
      )
      .start();


} catch (error) {
  console.log(error);
}

  try {
    //////////ACTUALIZAR TRAILERS //////////////
    cron
      .schedule(
        "35 * * * *",
        async () => {
          try {
            const IMDb = await require('imdb-light');

            await PelisCollection.find({}, { fields: { _id: 1, nombrePeli: 1, idimdb: 1 } }).forEach(async (peli) => {

              await console.log(`Actualizando a ${peli.nombrePeli}`)
              !peli.urlTrailer && await Meteor.call("movieTrailer", peli.idimdb, peli._id,)

            })

          } catch (error) {

          }

        },
        {
          scheduled: true,
          timezone: "America/Havana",
        }
      )
      // .start();


  } catch (error) {
    console.log(error);
  }

  try {
    //////////Cerrar proxys a las 12 y 00 //////////////
    cron
      .schedule(
        "0 * * * *",
        async () => {
          try {
            await Meteor.call('closeproxy', function (error, result) {
              console.log(`${result} a las ${new Date()}`)
            });

            await Meteor.call('listenproxy', function (error, result) {
              console.log(`${result} a las ${new Date()}`)
            });

          } catch (error) {
            console.log(error)
          }

        },
        {
          scheduled: true,
          timezone: "America/Havana",
        }
      )
      .start();


  } catch (error) {
    console.log(error);
  }

  //INABILITAR LOS SERVIDORES QUE NO ESTAN CONECTADOS
  try {
    //////////Cerrar proxys a las 12 y 00 //////////////
    cron
      .schedule(
        "* * * * *",
       inabilitarServerSiNoEstaConectadoElServer,
        {
          scheduled: true,
          timezone: "America/Havana",
        }
      )
      .start();


  } catch (error) {
    console.log(error);
  }

}

