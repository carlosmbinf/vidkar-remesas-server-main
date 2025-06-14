import { Meteor } from 'meteor/meteor';
import { CarritoCollection, VentasCollection } from '/imports/collections/collections';

Meteor.methods({
  async "insertarRemesaAlCarrito"(carrito) {
   return CarritoCollection.insertAsync(carrito);
  },
});