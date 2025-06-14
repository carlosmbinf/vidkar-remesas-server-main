import { Meteor } from "meteor/meteor";
import {
  OnlineCollection,
  MensajesCollection,
  PreciosCollection,
  VentasCollection,
  FilesCollection,
  VersionsCollection,
  LogsCollection,
  ProductosCollection,
  CountriesCollection,
  RegionsCollection,
  ProvidersCollection,
  ProductosDescriptionsCollection,
  PaypalCollection,
  CarritoCollection,
} from "../imports/collections/collections";

if (Meteor.isServer) {
    console.log("Cargando Publicaciones...");


    Meteor.publish("logs", function (selector,option) {
        return LogsCollection.find(selector?selector:{},option?option:{});
      });
      Meteor.publish("logsId", function (id) {
        return LogsCollection.find({ userAfectado: id });
      });
      Meteor.publish("user", function (selector,option) {
        return Meteor.users.find(selector?selector:{},option?option:{});
      });
      Meteor.publish("userID", function (id,option) {
        return Meteor.users.find(id,option?option:{});
      });
      Meteor.publish("userRole", function (role) {
        return Meteor.users.find({ "profile.role": role });
      });
      Meteor.publish("conexionesUser", function (id) {
        return OnlineCollection.find({ userId: id });
      });
      Meteor.publish("conexiones", function (selector,option) {
        return OnlineCollection.find(selector?selector:{},option?option:{});
      });
      Meteor.publish("mensajes", function (selector,option) {
        return MensajesCollection.find(selector?selector:{},option?option:{});
      });
      Meteor.publish("precios", function (selector,option) {
        return PreciosCollection.find(selector?selector:{},option?option:{});
      });
      Meteor.publish("ventas", function (selector,option) {
        return VentasCollection.find(selector?selector:{},option?option:{});
      });
      Meteor.publish("files", function (selector,option) {
        return FilesCollection.find(selector?selector:{},option?option:{});
      });
      Meteor.publish("versions", function (selector,option) {
        return VersionsCollection.find(selector?selector:{},option?option:{});
      });
      Meteor.publish("productos", function (selector,option) {
        return ProductosCollection.find(selector?selector:{},option?option:{});
      });
      Meteor.publish("productosDescriptions", function (selector,option) {
        return ProductosDescriptionsCollection.find(selector?selector:{},option?option:{});
      });
      Meteor.publish("providers", function (selector,option) {
        return ProvidersCollection.find(selector?selector:{},option?option:{});
      });
      Meteor.publish("regions", function (selector,option) {
        return RegionsCollection.find(selector?selector:{},option?option:{});
      });
      Meteor.publish("countries", function (selector,option) {
        return CountriesCollection.find(selector?selector:{},option?option:{});
      });
      Meteor.publish("carrito", function (selector,option) {
        return CarritoCollection.find(selector?selector:{},option?option:{});
      });
      Meteor.publish("paypal", function (selector,option) {
        return PaypalCollection.find(selector?selector:{},option?option:{});
      });
     
     
}