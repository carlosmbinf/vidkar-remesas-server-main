import React, { useEffect } from 'react';
import {
  Box, Stepper, Step, StepLabel, Typography, Paper, Chip, Divider,
  AccordionSummary,
  AccordionDetails,
  Accordion
} from '@mui/material';
import { useTracker } from 'meteor/react-meteor-data';
import { VentasCollection } from '/imports/collections/collections';
import { Meteor } from 'meteor/meteor';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
const estados = ['Pago Confirmado', 'Pendiente de Entrega', 'Entregado'];

const obtenerPasoDesdeEstado = (venta) => {
  console.log("Estado de la venta:", venta);
  switch (venta.estado) {
    case "PENDIENTE_ENTREGA":
      return 1; // Pendiente de Entrega
    case "ENTREGADO":
      return 3; // Entregado
  }
  return 0;
};

const VentasStepper = () => {
  const userId = Meteor.userId();

  useEffect(() => {
    let readyVenta = Meteor.subscribe('ventas', { userId });

    return () => {
      readyVenta && readyVenta.stop();
    }
  }, [])



  const marcarItemEntregado = (ventaId, itemIndex) => {

    console.log("Marcar item entregado:", ventaId, itemIndex);
    Meteor.call('ventas.marcarItemEntregado', { ventaId, itemIndex }, (err) => {
      if (err) {
        alert('Error al actualizar el estado: ' + err.reason);
      }
    });
  };
  const marcarItemNoEntregado = (ventaId, itemIndex) => {
    Meteor.call('ventas.marcarItemNoEntregado', { ventaId, itemIndex }, (err) => {
      if (err) {
        alert('Error al actualizar el estado: ' + err.reason);
      }
    });
  };
  const { ventas } = useTracker(() => {
    const ventas = VentasCollection.find({ userId, estado: { $nin: ['ENTREGADO'] }, type: "REMESA" }, { sort: { createdAt: -1, } }).fetch();
    return { ventas };
  });

  const { ventasEntregadas } = useTracker(() => {
    const ventas = VentasCollection.find({ userId, estado: { $in: ['ENTREGADO'] }, type: "REMESA" }, { sort: { createdAt: -1, } }).fetch();
    return { ventasEntregadas: ventas };
  });

  useEffect(() => {

    ventas && ventas.forEach(vent => {
      console.log("revisando si todos los items estan entregados:", vent);
      if (vent.carrito && vent.carrito.every(item => item.entregado)) {
        Meteor.call('ventas.actualizarEstado', { ventaId: vent._id, estado: 'ENTREGADO' }, (err) => {
          if (err) {
            console.error('Error al actualizar el estado:', err.reason);
          }
        });
      }
    })

  }, [ventas])

  useEffect(() => {

    ventasEntregadas && ventasEntregadas.forEach(vent => {
      console.log("revisando si todos los items estan entregados:", vent);
      if (vent.carrito && vent.carrito.every(item => item.entregado)) {
        Meteor.call('ventas.actualizarEstado', { ventaId: vent._id, estado: 'ENTREGADO' }, (err) => {
          if (err) {
            console.error('Error al actualizar el estado:', err.reason);
          }
        });
      } else {
        Meteor.call('ventas.actualizarEstado', { ventaId: vent._id, estado: 'PENDIENTE_ENTREGA' }, (err) => {
          if (err) {
            console.error('Error al actualizar el estado:', err.reason);
          }
        });
      }
    })

  }, [ventasEntregadas])

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>Seguimiento de tus Remesas sin Entregar</Typography>
      {ventas.length === 0 && (
        <Typography variant="body1">No tienes remesas registradas sin Entregar.</Typography>
      )}

      {ventas.map((venta, index) => (
        <Paper key={venta._id} elevation={3} sx={{ p: 2, my: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Remesa #{index + 1} - {venta.createdAt?.toLocaleString()}
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Stepper activeStep={obtenerPasoDesdeEstado(venta)} alternativeLabel>
            {estados.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box sx={{ mt: 2 }}>
            <Chip label={`Precio con Comisión: ${venta.cobrado} ${venta.monedaCobrado || 'USD'}`} sx={{ mr: 1, mb: 1 }} />
            <Chip label={`Precio sin Comisión: ${venta.precioOficial || 'N/A'}`} sx={{ mr: 1, mb: 1 }} />
            <Chip label={`Tipo: ${venta.type}`} sx={{ mb: 1 }} />

            {venta.comentario && (
              <Typography mt={2}>📝 Comentario general: {venta.comentario}</Typography>
            )}

            <Divider sx={{ my: 2 }} />
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="carrito-content" id={`carrito-header-${venta._id}`}>
                <Typography variant="subtitle2">📦 Detalle del Carrito</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {venta.carrito?.map((item, i) => (
                  <Box key={i} sx={{ position: 'relative', mb: 2, ml: 2 }}>
                    <Paper
                      elevation={6}
                      sx={{
                        p: 2,
                        ...(item.entregado && {
                          backgroundImage: 'url(/entregado.png)',
                          backgroundSize: 'contain',
                          backgroundPosition: 'right',
                          backgroundRepeat: 'no-repeat',
                          backgroundBlendMode: 'difference',
                        })
                      }}
                    >
                      <Typography sx={{ mr: 1, mb: 1 }}>
                        Nombre: <Chip color='primary' label={item.producto?.nombre || 'N/A'} sx={{ mr: 1 }} />
                      </Typography>
                      <Typography sx={{ mr: 1, mb: 1 }}>
                        Tarjeta CUP: <Chip color='primary' label={item.producto?.tarjetaCUP || 'N/A'} sx={{ mr: 1 }} />
                      </Typography>
                      <Typography sx={{ mr: 1, mb: 1 }}>
                        Entregar en Cuba: <Chip color='primary' label={`${item.producto?.recividoCUP || '0'} CUP`} sx={{ mr: 1 }} />
                      </Typography>
                      <Typography sx={{ mr: 1, mb: 1 }}>
                        Entregar en Cuba: <Chip color='primary' label={`${item.producto?.recividoUSD || '0'} USD`} sx={{ mr: 1 }} />
                      </Typography>
                      {item.comentario && (
                        <Typography mt={1}>🗒️ Nota: {item.comentario}</Typography>
                      )}
                      {(Meteor.user()?.profile?.role === 'admin') && !item.entregado ? (
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                          <Chip
                            label="Marcar como Entregado"
                            color="success"
                            clickable
                            onClick={() => marcarItemEntregado(venta._id, i)}
                          />
                        </Box>
                      ) : (
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                          <Chip
                            label="Marcar como No Entregado"
                            color="secondary"
                            clickable
                            onClick={() => marcarItemNoEntregado(venta._id, i)}
                          />
                        </Box>
                      )}
                    </Paper>
                  </Box>
                ))}
              </AccordionDetails>
            </Accordion>
          </Box>
        </Paper>
      ))}


      <Box sx={{ mt: 10 }} />

      <Typography variant="h5" gutterBottom>Seguimiento de tus Remesas Entregadas</Typography>
      {ventasEntregadas.length === 0 && (
        <Typography variant="body1">No tienes remesas Entregadas.</Typography>
      )}

      {ventasEntregadas.map((venta, index) => (
        <Paper key={venta._id} elevation={3} sx={{ p: 2, my: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Remesa #{index + 1} - {venta.createdAt?.toLocaleString()}
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Stepper activeStep={obtenerPasoDesdeEstado(venta)} alternativeLabel>
            {estados.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box sx={{ mt: 2 }}>
            <Chip label={`Precio con Comisión: ${venta.cobrado} ${venta.monedaCobrado || 'USD'}`} sx={{ mr: 1, mb: 1 }} />
            <Chip label={`Precio sin Comisión: ${venta.precioOficial || 'N/A'}`} sx={{ mr: 1, mb: 1 }} />
            <Chip label={`Tipo: ${venta.type}`} sx={{ mb: 1 }} />

            {venta.comentario && (
              <Typography mt={2}>📝 Comentario general: {venta.comentario}</Typography>
            )}

            <Divider sx={{ my: 2 }} />
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="carrito-content" id={`carrito-header-${venta._id}`}>
                <Typography variant="subtitle2">📦 Detalle del Carrito</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {venta.carrito?.map((item, i) => (
                  <Box key={i} sx={{ position: 'relative', mb: 2, ml: 2 }}>
                    <Paper
                      elevation={6}
                      sx={{
                        p: 2,
                        ...(item.entregado && {
                          backgroundImage: 'url(/entregado.png)',
                          backgroundSize: 'contain',
                          backgroundPosition: 'right',
                          backgroundRepeat: 'no-repeat',
                          backgroundBlendMode: 'difference',
                        })
                      }}
                    >
                      <Typography sx={{ mr: 1, mb: 1 }}>
                        Nombre: <Chip color='primary' label={item.producto?.nombre || 'N/A'} sx={{ mr: 1 }} />
                      </Typography>
                      <Typography sx={{ mr: 1, mb: 1 }}>
                        Tarjeta CUP: <Chip color='primary' label={item.producto?.tarjetaCUP || 'N/A'} sx={{ mr: 1 }} />
                      </Typography>
                      <Typography sx={{ mr: 1, mb: 1 }}>
                        Entregar en Cuba: <Chip color='primary' label={`${item.producto?.recividoCUP || '0'} CUP`} sx={{ mr: 1 }} />
                      </Typography>
                      <Typography sx={{ mr: 1, mb: 1 }}>
                        Entregar en Cuba: <Chip color='primary' label={`${item.producto?.recividoUSD || '0'} USD`} sx={{ mr: 1 }} />
                      </Typography>
                      {item.comentario && (
                        <Typography mt={1}>🗒️ Nota: {item.comentario}</Typography>
                      )}
                      {(Meteor.user()?.profile?.role === 'admin') && !item.entregado ? (
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                          <Chip
                            label="Marcar como Entregado"
                            color="success"
                            clickable
                            onClick={() => marcarItemEntregado(venta._id, i)}
                          />
                        </Box>
                      ) : (
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                          <Chip
                            label="Marcar como No Entregado"
                            color="secondary"
                            clickable
                            onClick={() => marcarItemNoEntregado(venta._id, i)}
                          />
                        </Box>
                      )}
                    </Paper>
                  </Box>
                ))}
              </AccordionDetails>
            </Accordion>
          </Box>
        </Paper>
      ))}
    </Box>
  );
};

export default VentasStepper;
