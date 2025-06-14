import { Meteor } from "meteor/meteor";

import moment from 'moment';
import { CountriesCollection, ProductosCollection, ProductosDescriptionsCollection, ProvidersCollection, RegionsCollection } from "/imports/collections/collections";

var cron = require("node-cron");

///////METODOS//////


const ultimaCompraByUserId = async (userId, type) => {
  return await Meteor.call("ultimaCompraByUserId",userId, type)
}


const buscarDatosDingConnect = async () => {
console.log("INICIANDO BUSQUEDA DE DING CONNECT...");
 await new Promise((resolve, reject) => {
    Meteor.call("getProviders", (error, result) => {
        if (error) reject(error);
        else resolve(result);
    });
}).then((data) => {
    
    console.log("Descripciones de Providers:", data && data.Items && data.Items.length);
    if(data && data.Items && data.Items.length > 0) {
      ProvidersCollection.removeAsync({});
        data.Items.forEach(item => {
          ProvidersCollection.upsertAsync(item, item)
        });
    }
}).catch((error) => {
    console.error("Error fetching productos Descripciones:", error);
});



await new Promise((resolve, reject) => {
  Meteor.call("getProducts", (error, result) => {
      if (error) reject(error);
      else resolve(result);
  });
}).then((data) => {
  console.log("Productos:", data && data.Items && data.Items.length);
  if(data && data.Items && data.Items.length > 0) {
    ProductosCollection.removeAsync({});
    data.Items.forEach(item => {
        ProductosCollection.upsertAsync(item, item)
    });
}
}).catch((error) => {
  console.error("Error fetching productos:", error);
});


await new Promise((resolve, reject) => {
  Meteor.call("getProductsDescriptions", (error, result) => {
      if (error) reject(error);
      else resolve(result);
  });
}).then((data) => {
  console.log("Descripciones de productos:", data && data.Items && data.Items.length);
  if(data && data.Items && data.Items.length > 0) {
    ProductosDescriptionsCollection.removeAsync({});
    data.Items.forEach(item => {
        ProductosDescriptionsCollection.upsertAsync(item, item)
    });
}
}).catch((error) => {
  console.error("Error fetching Descripciones de productos:", error);
});



await new Promise(async (resolve, reject) => {
  Meteor.call("getRegions", (error, result) => {
      if (error) reject(error);
      else resolve(result);
  });
}).then((data) => {
  console.log("Regions:", data && data.Items && data.Items.length);

  if(data && data.Items && data.Items.length > 0) {
    RegionsCollection.removeAsync({});
    data.Items.forEach(item => {
        RegionsCollection.upsertAsync(item, item)
    });
  }

}).catch((error) => {
  console.error("Error fetching Regions:", error);
});




await new Promise((resolve, reject) => {
  Meteor.call("getCountries", (error, result) => {
      if (error) reject(error);
      else resolve(result);
  });
}).then((data) => {
  console.log("Countries:", data && data.Items && data.Items.length);
  if(data && data.Items && data.Items.length > 0) {
    CountriesCollection.removeAsync({});
    data.Items.forEach(item => {
        CountriesCollection.upsertAsync(item, item)
    });
  }
}).catch((error) => {
  console.error("Error fetching Countries:", error);
});
}

////////////////CRONES////////////

if (Meteor.isServer) {
  console.log("Cargando Tareas...");




  //INABILITAR LOS SERVIDORES QUE NO ESTAN CONECTADOS
  try {
    //////////Cerrar proxys a las 12 y 00 //////////////
    cron
      .schedule(
        "*/2 * * * *",
        buscarDatosDingConnect,
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

