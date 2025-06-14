import { Meteor } from 'meteor/meteor';
import { CarritoCollection } from '/imports/collections/collections';


Meteor.methods({
    async "eliminarElementoCarrito"(idCarrito) {
    CarritoCollection.removeAsync(idCarrito);
    }
});
