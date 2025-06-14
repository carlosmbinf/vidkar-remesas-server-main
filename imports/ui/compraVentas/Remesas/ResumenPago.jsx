import React, { useEffect } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { CarritoCollection } from '/imports/collections/collections';
import { Box, Typography, Card, CardContent, Divider, Chip, Grid } from '@mui/material';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import NotesIcon from '@mui/icons-material/Notes';

const ResumenPago = () => {
    const userId = Meteor.userId();

    const { pedidosRemesa } = useTracker(() => {
        const pedidos = CarritoCollection.find({ idUser: userId, type: 'REMESA' }).fetch();
        return { pedidosRemesa: pedidos };
    });
    
    const calcularTotal = () => {
        return pedidosRemesa.reduce((total, pedido) => {
            const { cobrarUSD } = pedido.producto || {};
            if (pedido.metodoPago === 'PAYPAL' && cobrarUSD) {
                return total + (Number(cobrarUSD) + Number(cobrarUSD) * 0.054 + 0.30);
            }
            return total + (Number(cobrarUSD) || 0);
        }, 0).toFixed(2);
    };

    if (pedidosRemesa.length === 0) {
        return <Typography>No hay pedidos para procesar.</Typography>;
    }

    return (
        <Box sx={{ mt: 2 }}>
            <Card
  elevation={6}
  sx={{
    mb: 2,
    borderRadius: 3,
    p: 2,
    position: 'relative',
    backgroundImage: "url('/Gemini_Generated_Image_rtg44brtg44brtg4.png')",
    backgroundBlendMode: 'multiply',
    backgroundSize: 'cover',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    minHeight: 300
  }}
>
  {/* Título dentro del Card */}
  <Box display="flex" alignItems="center" gap={1} mb={1}>
    <Typography variant="h6" fontWeight="bold">
      Resumen de Pago
    </Typography>
  </Box>

  <Divider sx={{ mb: 2 }} />

  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
    {pedidosRemesa.map((pedido, index) => {
      const { producto = {}, metodoPago, comentario } = pedido;
      const { nombre, cobrarUSD } = producto;
      const totalItem = metodoPago === 'PAYPAL' && cobrarUSD
        ? Number(Number(cobrarUSD) + Number(cobrarUSD) * 0.054 + 0.30).toFixed(2)
        : Number(Number(cobrarUSD) || 0).toFixed(2);

      return (
        <Box key={index} mb={2}>
          <Typography variant="subtitle1" fontWeight="bold">
            {nombre}:
          </Typography>
          <Typography variant="body2">
            {`$${totalItem} USD (${metodoPago})`}
          </Typography>
          {comentario && (
            <Box display="flex" alignItems="center" gap={1} mt={1}>
              <NotesIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {comentario}
              </Typography>
            </Box>
          )}
          <Divider sx={{ mt: 2 }} />
        </Box>
      );
    })}

    <Box mt={2} alignSelf="flex-end" display="flex" alignItems="center" gap={1}>
      <MonetizationOnIcon color="success" />
      <Typography variant="h6">
        Total a pagar: <Chip color="primary" size="medium" label={`$${calcularTotal()} USD`} />
      </Typography>
    </Box>
  </CardContent>
</Card>

        </Box>
    );
};

export default ResumenPago;
