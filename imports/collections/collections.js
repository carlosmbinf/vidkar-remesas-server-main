import { Mongo } from "meteor/mongo";
import { Meteor } from "meteor/meteor";

import SimpleSchema from 'simpl-schema';


SimpleSchema.extendOptions(['autoform']);
import 'meteor/aldeed:collection2/static'; // Habilita attachSchema


export const OnlineCollection = new Mongo.Collection("online");
export const MensajesCollection = new Mongo.Collection("mensajes");
export const LogsCollection = new Mongo.Collection("Logs");
export const PreciosCollection = new Mongo.Collection("precios");
export const VentasCollection = new Mongo.Collection("ventas");
export const FilesCollection = new Mongo.Collection("files");
export const VersionsCollection = new Mongo.Collection("versions");
export const PaypalCollection = new Mongo.Collection("paypal");
export const CarritoCollection = new Mongo.Collection("carrito");
export const preciosDolarCollection = new Mongo.Collection("preciosDolar");
export const AsignacionRemesaAdminCollection = new Mongo.Collection("asignacionRemesaAdmins");

///////////////////////////////////NUEVOS PARA RECARGAS//////////////

export const ProductosCollection = new Mongo.Collection("productos");
export const ProductosDescriptionsCollection = new Mongo.Collection("productosDescriptions");
export const CountriesCollection = new Mongo.Collection("countries");
export const ProvidersCollection = new Mongo.Collection("providers");
export const RegionsCollection = new Mongo.Collection("regions");
export const ConfigCollection = new Mongo.Collection("config");

////////////////////////////////////////////////////////////////////


Meteor.methods({
  async exportDataTo(urlMongoDB) {
   
    try {
      await mi({
        fields: MensajesCollection.find().fetch(), // {array} data to import
        db: "meteor", // {string} name of db
        collection: "mensajes", // {string|function} name of collection, or use a function to
        //  return a name, accept one param - [fields] the fields to import
        host: urlMongoDB,
        callback: (err, db) => {
          err && console.error(err);
        },
      });
    } catch (error) {
      console.log(error);
    }

    try {
      await mi({
        fields: LogsCollection.find().fetch(), // {array} data to import
        db: "meteor", // {string} name of db
        collection: "Logs", // {string|function} name of collection, or use a function to
        //  return a name, accept one param - [fields] the fields to import
        host: urlMongoDB,
        callback: (err, db) => {
          err && console.error(err);
        },
      });
    } catch (error) {
      console.log(error);
    }

    try {
      await mi({
        fields: PreciosCollection.find().fetch(), // {array} data to import
        db: "meteor", // {string} name of db
        collection: "precios", // {string|function} name of collection, or use a function to
        //  return a name, accept one param - [fields] the fields to import
        host: urlMongoDB,
        callback: (err, db) => {
          err && console.error(err);
        },
      });
    } catch (error) {
      console.log(error);
    }

    try {
      await mi({
        fields: VentasCollection.find().fetch(), // {array} data to import
        db: "meteor", // {string} name of db
        collection: "ventas", // {string|function} name of collection, or use a function to
        //  return a name, accept one param - [fields] the fields to import
        host: urlMongoDB,
        callback: (err, db) => {
          err && console.error(err);
        },
      });
    } catch (error) {
      console.log(error);
    }

    try {
      await mi({
        fields: Meteor.users.find().fetch(), // {array} data to import
        db: "meteor", // {string} name of db
        collection: "users", // {string|function} name of collection, or use a function to
        //  return a name, accept one param - [fields] the fields to import
        host: urlMongoDB,
        callback: (err, db) => {
          err && console.error(err);
        },
      });
    } catch (error) {
      console.log(error);
    }

    try {
      await mi({
        fields: FilesCollection.find().fetch(), // {array} data to import
        db: "meteor", // {string} name of db
        collection: "files", // {string|function} name of collection, or use a function to
        //  return a name, accept one param - [fields] the fields to import
        host: urlMongoDB,
        callback: (err, db) => {
          err && console.error(err);
        },
      });
    } catch (error) {
      console.log(error);
    }

  },
});


export const SchemaAsignacionRemesaAdminCollection = new SimpleSchema({
  adminId:{
    type: String,
    required: true,
  },
  ventaId: {
    type: String,
    required: true,
  },
});

AsignacionRemesaAdminCollection.attachSchema(SchemaAsignacionRemesaAdminCollection);
export const SchemaVentasCollection = new SimpleSchema({
  userId: {
    type: String,
    optional: true,
  },
  estado: {
    type: String,
    optional: false,
    defaultValue: "PENDIENTE_ENTREGA", //puede ser PENDIENTE, ENVIADO, ENTREGADO, CANCELADO
    allowedValues: ['PENDIENTE_ENTREGA', 'ENTREGADO', 'CANCELADO'],
  }, //puede ser PENDIENTE, ENVIADO, ENTREGADO, CANCELADO
  numeroMovilARecargar:{
    type: String,
    optional: true,
  },
  createdAt: {
    type: Date,
    autoValue: function () {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return { $setOnInsert: new Date() };
      } else {
        this.unset(); // Prevent user from supplying their own value
      }
    },
    optional: false,
  },
  isCobrado: {
    type: Boolean,
    defaultValue: false,
    optional: true,
  },
  cobrado: {
    type: Number,
    defaultValue: 0,
    optional: true,
  },
  monedaCobrado: {
    type: String,
    defaultValue: "CUP",
    optional: true,
  },
  recividoEnCuba: {
    type: Number,
    defaultValue: 0,
    optional: true,
  },
  monedaRecividoEnCuba: {
    type: String,
    defaultValue: "CUP",
    optional: true,
  },
  precioOficial: {
    type: Number,
    defaultValue: 0,
    optional: true,
  },
  monedaPrecioOficial: {
    type: String,
    defaultValue: "CUP",
    optional: true,
  },
  comentario: {
    type: String,
    optional: true,
  },
  metodoPago: {
    type: String,
    defaultValue: "",
    optional: false,
    allowedValues: ["PAYPAL", "TRANSFERENCIA", "EFECTIVO"],
  },
  type: {
    type: String,
    optional: false,
    defaultValue: "RECARGA", //puede ser RECARGA o REMESA
    allowedValues: ['RECARGA', 'REMESA']
  },
  producto: {
    type: Object,
    optional: true,
    blackbox: true,
  },
  carrito: {
    type: Array,
    optional: true,
  },
  "carrito.$": {
    type: Object,
    optional: true,
    blackbox: true,
  }
});

VentasCollection.attachSchema(SchemaVentasCollection);

export const SchemaPreciosCollection = new SimpleSchema({
  userId: {
    type: String,
    optional: false,
  },
  createdAt: {
    type: Date,
    autoValue: function () {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return { $setOnInsert: new Date() };
      } else {
        this.unset(); // Prevent user from supplying their own value
      }
    },
    optional: false,
  },
  precio: {
    type: Number,
    defaultValue: 0,
    optional: true,
  },
  type: {
    type: String,
    optional: false,
  },
  megas: {
    type: Number,
    defaultValue: 0,
    optional: true,
  },
  heredaDe: {
    type: String,
    optional: true,
    defaultValue: null,
  },
  comentario: {
    type: String,
    optional: true,
  },
  detalles: {
    type: String,
    optional: true,
  },
});

PreciosCollection.attachSchema(SchemaPreciosCollection);

export const SchemaLogsCollection = new SimpleSchema({
  type: {
    type: String,
  },
  userAdmin: {
    type: String,
  },
  userAfectado: {
    type: String,
  },
  message: {
    type: String,
  },
  createdAt: {
    type: Date,
    autoValue: function () {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return { $setOnInsert: new Date() };
      } else {
        this.unset(); // Prevent user from supplying their own value
      }
    },
  },
});

LogsCollection.attachSchema(SchemaLogsCollection);

export const SchemaOnlineCollection = new SimpleSchema({
  address: {
    type: String,
    optional: true,
  },
  connectionId: {
    type: String,
    optional: true,
  },
  userId: {
    type: String,
    optional: true,
  },
  loginAt: {
    type: Date,
    autoValue: function () {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return { $setOnInsert: new Date() };
      } else {
        this.unset(); // Prevent user from supplying their own value
      }
    },
    optional: true,
  },
  hostname: {
    type: String,
    optional: true,
  },
  megasGastadosinBytes: {
    type: Number,
    defaultValue: 0,
    optional: true,
  },
  megasGastadosinBytesGeneral: {
    type: Number,
    defaultValue: 0,
    optional: true,
  },
});

OnlineCollection.attachSchema(SchemaOnlineCollection);

export const SchemaMensajesCollection = new SimpleSchema({
  from: {
    type: String,
  },
  to: {
    type: String,
  },
  mensaje: {
    type: String,
    optional: true,
  },
  leido: {
    type: Boolean,
    defaultValue: false,
    optional: true,
  },
  createdAt: {
    type: Date,
    autoValue: function () {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return { $setOnInsert: new Date() };
      } else {
        this.unset(); // Prevent user from supplying their own value
      }
    },
  },
  type: {
    type: String,
    defaultValue: "text",
    optional: true,
  },
});

MensajesCollection.attachSchema(SchemaMensajesCollection);

export const SchemaFilesCollection = new SimpleSchema({
  nombre: {
    type: String,
    optional: false,
  },
  url: {
    type: String,
    optional: false,
  },
  details: {
    type: String,
    defaultValue: "",
    optional: true,
  },
  createdAt: {
    type: Date,
    autoValue: function () {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return { $setOnInsert: new Date() };
      } else {
        this.unset(); // Prevent user from supplying their own value
      }
    },
  },
});

FilesCollection.attachSchema(SchemaFilesCollection);
export const SchemaPaypalCollection = new SimpleSchema({
  idOrder: {
    type: String,
    optional: false,
  },
  carritos: {
    type: Object,
    optional: true,
    blackbox: true,
  },
  data: {
    type: Object,
    optional: true,
    blackbox: true,
  },
  status: {
    type: String,
    defaultValue: "CREATED",
    optional: true,
  },
  link: {
    type: String,
    optional: true,
  },
  userId: {
    type: String,
    optional: false,
  },
  createdAt: {
    type: Date,
    autoValue: function () {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return { $setOnInsert: new Date() };
      } else {
        this.unset(); // Prevent user from supplying their own value
      }
    },
    optional: false,
  },
});

PaypalCollection.attachSchema(SchemaPaypalCollection);

export const SchemaCarritoCollection = new SimpleSchema({
  idUser: {
    type: String,
    optional: false,
  },
  createdAt: {
    type: Date,
    autoValue: function () {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return { $setOnInsert: new Date() };
      } else {
        this.unset(); // Prevent user from supplying their own value
      }
    },
    optional: false,
  },
  type:{
    type: String,
    required: true,
    optional: false,
    allowedValues: ['RECARGA', 'REMESA']
  },
  producto: {
    type: Object,
    // defaultValue: {},
    optional: false,
    blackbox: true,
  },
  comentario: {
    type: String,
    defaultValue: "",
    optional: true,
  },
  metodoPago: {
    type: String,
    defaultValue: "PAYPAL",
    required: true,
    optional: false,
    allowedValues: ['PAYPAL', 'TRANSFERENCIA', 'EFECTIVO']
  }
  // recogidaEnLocal:{
  //   type: Boolean,
  //   defaultValue: false,
  //   optional: false,
  // }
});


CarritoCollection.attachSchema(SchemaCarritoCollection);


FilesCollection.allow({
  insert(doc) {
    // The user must be logged in and the document must be owned by the user.
    return true;
  },

  update() {
    // Can only change your own documents.
    return true;
  },

  remove(userId, doc) {
    // Can only remove your own documents.
    return Meteor.users.findOne({ _id: userId }).profile.role == "admin";
  },
});

LogsCollection.allow({
  insert(doc) {
    // The user must be logged in and the document must be owned by the user.
    return true;
  },

  update() {
    // Can only change your own documents.
    return true;
  },

  remove(userId, doc) {
    // Can only remove your own documents.
    return Meteor.users.findOne({ _id: userId }).profile.role == "admin";
  },
});

OnlineCollection.allow({
  insert(doc) {
    // The user must be logged in and the document must be owned by the user.
    return true;
  },

  update() {
    // Can only change your own documents.
    return true;
  },

  remove(userId, doc) {
    // Can only remove your own documents.
    return true;
  },
});

Meteor.users.allow({
  insert(doc) {
    // The user must be logged in and the document must be owned by the user.
    return true;
  },

  update(userId, doc, fields, modifier) {
    // Can only change your own documents.
    return true;
  },

  remove(userId, doc) {
    // Can only remove your own documents.
    return Meteor.users.findOne({ _id: userId }).profile.role == "admin";
  },
});

VentasCollection.allow({
  insert(doc) {
    // The user must be logged in and the document must be owned by the user.
    return true;
  },

  update(userId, doc, fields, modifier) {
    // Can only change your own documents.
    return true;
  },

  remove(userId, doc) {
    // Can only remove your own documents.
    return Meteor.users.findOne({ _id: userId }).profile.role == "admin";
  },
});

MensajesCollection.allow({
  insert(doc) {
    // The user must be logged in and the document must be owned by the user.
    return true;
  },

  update(userId, doc, fields, modifier) {
    // Can only change your own documents.
    return true;
  },

  remove(userId, doc) {
    // Can only remove your own documents.
    return true;
  },
});

PreciosCollection.allow({
  insert(userId, doc) {
    // The user must be logged in and the document must be owned by the user.
    return true;
  },

  update(userId, doc, fields, modifier) {
    // Can only change your own documents.
    return true;
  },

  remove(userId, doc) {
    // Can only remove your own documents.
    return Meteor.users.findOne({ _id: userId }).profile.role == "admin";
  },
});

CountriesCollection.allow({
  insert(userId, doc) {
    // The user must be logged in and the document must be owned by the user.
    return true;
  },

  update(userId, doc, fields, modifier) {
    // Can only change your own documents.
    return true;
  },

  remove(userId, doc) {
    // Can only remove your own documents.
    return Meteor.users.findOne({ _id: userId }).profile.role == "admin";
  },
});

ProvidersCollection.allow({
  insert(userId, doc) {
    // The user must be logged in and the document must be owned by the user.
    return true;
  },

  update(userId, doc, fields, modifier) {
    // Can only change your own documents.
    return true;
  },

  remove(userId, doc) {
    // Can only remove your own documents.
    return Meteor.users.findOne({ _id: userId }).profile.role == "admin";
  },
});

RegionsCollection.allow({
  insert(userId, doc) {
    // The user must be logged in and the document must be owned by the user.
    return true;
  },

  update(userId, doc, fields, modifier) {
    // Can only change your own documents.
    return true;
  },

  remove(userId, doc) {
    // Can only remove your own documents.
    return Meteor.users.findOne({ _id: userId }).profile.role == "admin";
  },
});

ProductosCollection.allow({
  insert(userId, doc) {
    // The user must be logged in and the document must be owned by the user.
    return true;
  },

  update(userId, doc, fields, modifier) {
    // Can only change your own documents.
    return true;
  },

  remove(userId, doc) {
    // Can only remove your own documents.
    return Meteor.users.findOne({ _id: userId }).profile.role == "admin";
  },
});


ProductosDescriptionsCollection.allow({
  insert(userId, doc) {
    // The user must be logged in and the document must be owned by the user.
    return true;
  },

  update(userId, doc, fields, modifier) {
    // Can only change your own documents.
    return true;
  },

  remove(userId, doc) {
    // Can only remove your own documents.
    return Meteor.users.findOne({ _id: userId }).profile.role == "admin";
  },
})

ConfigCollection.allow({
  insert(userId, doc) {
    // The user must be logged in and the document must be owned by the user.
    return true;
  },

  update(userId, doc, fields, modifier) {
    // Can only change your own documents.
    return true;
  },

  remove(userId, doc) {
    // Can only remove your own documents.
    return Meteor.users.findOne({ _id: userId }).profile.role == "admin";
  },
});

AsignacionRemesaAdminCollection.allow({
  insert(userId, doc) {
    // The user must be logged in and the document must be owned by the user.
    return true;
  },

  update(userId, doc, fields, modifier) {
    // Can only change your own documents.
    return true;
  },

  remove(userId, doc) {
    // Can only remove your own documents.
    return Meteor.users.findOne({ _id: userId }).profile.role == "admin";
  },
});


