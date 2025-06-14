import { Meteor } from 'meteor/meteor';
import { CarritoCollection, PaypalCollection, VentasCollection } from '/imports/collections/collections';
import axios from 'axios';
import { type } from 'jquery';

const environment = process.env.ENVIRONMENT || 'sandbox';
const client_id = "AbjQ-Z9p5vQaaShPBQBnsknEEuheNALn1TdvpO2F3xR33pZQPGroW3yG9M6DLIrjw-gQl_vrUm-j7uvQ";
const client_secret = "EAozjCCyTLZ9aN1tVMhIle_a-IjzmzjH5HwdUSxZskqbv1j5mM-dFbkoCiVuDiX6is0OR-icI6pJhk1z";
const endpoint_url = environment === 'sandbox' ? 'https://api-m.sandbox.paypal.com' : 'https://api-m.paypal.com';

function replaceUrl(url, newUrl) {
    const regex = /http?:\/\/localhost:3000/;
    return url.replace(regex, newUrl);
  }

function get_access_token() {
    const auth = `${client_id}:${client_secret}`
    const data = 'grant_type=client_credentials'
    return fetch(endpoint_url + '/v1/oauth2/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${Buffer.from(auth).toString('base64')}`
            },
            body: data
        })
        .then(res => res.json())
        .then(json => {
            console.log(json.access_token);
            return json.access_token;
        })
}


Meteor.methods({
  async "venta.insert"(venta) {
   return VentasCollection.insertAsync(venta);
  },
  creandoOrden: async (idUser, value, description) => {
    return get_access_token()
      .then((access_token) => {
        let order_data_json = {
          intent: "CAPTURE".toUpperCase(),
          purchase_units: [
            {
              amount: {
                currency_code: "USD",
                value: value
              },
              description: description,
            },
          ],
          application_context: {
            brand_name: "VidKar",
            landing_page: "LOGIN",
            user_action: "PAY_NOW",
            return_url: replaceUrl("http://localhost:3000/capture-order", Meteor.settings.public.ROOT_URL),
            cancel_url: replaceUrl("http://localhost:3000/cancel-order", Meteor.settings.public.ROOT_URL),
          },
        };

        //   {
        //     'intent': "CAPTURE".toUpperCase(),
        //     'purchase_units': [{
        //         'amount': {
        //             'currency_code': 'USD',
        //             'value': '95.00'
        //         },
        //         "description":"pizza"
        //     }],
        //     application_context:{
        //         brand_name:"VidKar",
        //         landing_page:"LOGIN",
        //         user_action:"PAY_NOW",
        //         return_url:"http://localhost:3000/capture-order",
        //         cancel_url:"http://localhost:3000/cancel-order"
        //     }
        // }
        const data = JSON.stringify(order_data_json);

        return fetch(endpoint_url + "/v2/checkout/orders", {
          //https://developer.paypal.com/docs/api/orders/v2/#orders_create
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
          body: data,
        })
          .then((res) => res.json())
          .then(async (json) => {
            console.log(json);
            const { id, status, links } = json;
            let carritos = await CarritoCollection.find({
              idUser: idUser,
            }).map((carrito) => {
              return carrito._id;
            });

            console.log("carritos", carritos);
            let paypal = {
              userId: idUser,
              idOrder: id,
              status: status,
              link: links && links[1] && links[1].href,
            //   carritos: carritos, //AQUI VA LOS ID DEL CARRITO
            };
            let pay = await PaypalCollection.findOneAsync({
              userId: idUser,
              status: { $nin: ['COMPLETED', 'CANCELLED'] },
            });

            if (!pay) {
              id && status && links && PaypalCollection.insertAsync(paypal);
            } else {
              PaypalCollection.updateAsync(pay._id, { $set: paypal });
            }

            return paypal;
          }); //Send minimal data to client
      })
      .catch((err) => {
        console.log(err);
        // res.status(500).send(err)
      });
  },
  obteniendoDatosDeOrdenPaypal: async (id) => {
    return get_access_token()
      .then((access_token) => {
        return fetch(endpoint_url + `/v2/checkout/orders/${id}`, {
          //https://developer.paypal.com/docs/api/orders/v2/#orders_create
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
        })
          .then((res) => res.json())
          .then((json) => {
            // console.log(json);
            return json;
          })
          .catch((err) => {
            console.log(err);
            // res.status(500).send(err)
          }); //Send minimal data to client
      })
      .catch((err) => {
        console.log(err);
        // res.status(500).send(err)
      });
  },
  captureOrder: async (id) => {
    // console.log(req)
    // console.log(req.query)
    const response = await axios
      .post(
        // `https://api.sandbox.paypal.com/v2/checkout/orders/${id}`,
        `https://api-m.sandbox.paypal.com/v2/checkout/orders/${id}/capture`,
        {},
        {
          auth: {
            username:
              "AbjQ-Z9p5vQaaShPBQBnsknEEuheNALn1TdvpO2F3xR33pZQPGroW3yG9M6DLIrjw-gQl_vrUm-j7uvQ",
            password:
              "EAozjCCyTLZ9aN1tVMhIle_a-IjzmzjH5HwdUSxZskqbv1j5mM-dFbkoCiVuDiX6is0OR-icI6pJhk1z",
          },
        }
      )
      .catch((error) => console.log(error));
    // console.log(token,PayerID);
    const { data } = response;
    const { status } = data;
    let pay = await PaypalCollection.findOneAsync({ idOrder: id });
    let userId = pay.userId;
    await PaypalCollection.updateAsync(pay._id, {
      $set: { status: status, data },
    });
    const carritos = await CarritoCollection.find({ idUser: userId}).fetch();

    const calcularTotal = () => {
      if (!Array.isArray(carritos)) return "0.00";
    
      const total = carritos.reduce((acc, pedido) => {
        const { cobrarUSD } = pedido.producto || {};
        const metodoPago = pedido.metodoPago;
    
        let monto = Number(cobrarUSD);
        if (isNaN(monto)) monto = 0;
    
        if (metodoPago === 'PAYPAL' && monto > 0) {
          monto = monto + (monto * 0.054) + 0.30;
        }
    
        return acc + monto;
      }, 0);
    
      return total.toFixed(2);
    };
    

    const calcularTotalSinComisionPaypal = () => {
      if (!Array.isArray(carritos)) return "0.00";
    
      const total = carritos.reduce((acc, pedido) => {
        const { cobrarUSD } = pedido.producto || {};
        let monto = Number(cobrarUSD);
        if (isNaN(monto)) monto = 0;
    
        return acc + monto;
      }, 0);
    
      return total.toFixed(2);
    };
    
    

    // console.log("pay", pay);
    // console.log("compras", carritos);

    let venta = {
      estado:"PENDIENTE_ENTREGA",
      userId:userId,
      isCobrado : true,
      cobrado : calcularTotal(),
      monedaCobrado: 'USD',
      comentario: "PRUEBAS DE VENTA PAYPAL",
      type: "REMESA",
      metodoPago:"PAYPAL",
      producto: await PaypalCollection.findOneAsync({ idOrder: id }),
      carrito: carritos,
      precioOficial: calcularTotalSinComisionPaypal(),
    }

    await VentasCollection.insertAsync(venta)

    await CarritoCollection.removeAsync({ idUser: userId,"metodoPago" : "PAYPAL"});
    return data;
  },
  refundVenta: async (captureId, amount = null) => {
    try {
      const access_token = await get_access_token();

      const url = `${endpoint_url}/v2/payments/captures/${captureId}/refund`;
      const body = amount
        ? JSON.stringify({ amount: { value: amount.toFixed(2), currency_code: 'USD' } })
        : null;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        body: body,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Meteor.Error('paypal-refund-failed', errorText);
      }

      const data = await response.json();

      // Puedes actualizar el estado de la colección si deseas
      const paypalRecord = await PaypalCollection.findOneAsync({ "data.purchase_units.payments.captures.id": captureId });
      if (paypalRecord) {
        await PaypalCollection.updateAsync(paypalRecord._id, {
          $set: { refund: data },
        });
      }

      console.log("Refund exitoso:", data);
      return data;
    } catch (err) {
      console.error("Error al hacer refund:", err);
      throw new Meteor.Error("refund-failed", err.message || "Error desconocido al hacer el reembolso");
    }
  },
  conversionDolaresACUP: async (dolares) => {
    try {
        console.log("Convirtiendo dólares a CUP:", dolares);
    } catch (error) {
      console.error('Error al convertir dólares a CUP:', error);
      throw new Meteor.Error('conversion-error', 'Error al convertir dólares a CUP');
    }
  },
  cancelOrder: async (idOrder) => {
    if (!idOrder) throw new Meteor.Error("missing-order-id", "ID de orden requerido");
  
    const order = await PaypalCollection.findOneAsync({ idOrder });
  
    if (!order) {
      throw new Meteor.Error("order-not-found", "Orden no encontrada en la base de datos");
    }
  
    // Actualizar el estado de la orden como cancelada
    await PaypalCollection.updateAsync(order._id, {
      $set: { status: "CANCELLED", cancelledAt: new Date() }
    });
  
    console.log(`Orden ${idOrder} cancelada exitosamente`);
    return true;
  },
  cancelarOrdenesPaypalIncompletas(userId) {
    console.log("Se cancelan todas las órdenes PayPal incompletas del usuario:", userId);
    PaypalCollection.updateAsync(
      { userId, status: { $nin: ['COMPLETED', 'CANCELLED'] } },
      { $set: { status: 'CANCELLED' } },
      { multi: true }
    );
  },
  'ventas.marcarItemEntregado': async ({ ventaId, itemIndex }) => {
    const venta = await VentasCollection.findOneAsync({ _id: ventaId });
    if (!venta) throw new Meteor.Error('not-found', 'Venta no encontrada');
    const carrito = venta.carrito || [];
    if (!carrito[itemIndex]) throw new Meteor.Error('not-found', 'Item no encontrado');

    carrito[itemIndex].entregado = true;

    VentasCollection.updateAsync(ventaId, {
      $set: { carrito },
    });
  },
  'ventas.marcarItemNoEntregado' : async ({ ventaId, itemIndex }) =>{
    const venta = await VentasCollection.findOneAsync({ _id: ventaId });
    if (!venta) throw new Meteor.Error('not-found', 'Venta no encontrada');
    const carrito = venta.carrito || [];
    if (!carrito[itemIndex]) throw new Meteor.Error('not-found', 'Item no encontrado');

    carrito[itemIndex].entregado = false;

    VentasCollection.updateAsync(ventaId, {
      $set: { carrito },
    });
  },
  'ventas.actualizarEstado': async ({ ventaId, estado }) => {
    const venta = await VentasCollection.findOneAsync({ _id: ventaId });
    if (!venta) throw new Meteor.Error('not-found', 'Venta no encontrada');
    VentasCollection.updateAsync(ventaId, {
      $set: { estado },
    });
  }

  
});
