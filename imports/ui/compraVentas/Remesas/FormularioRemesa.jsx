import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import {
  Box,
  Button,
  Paper,
  Typography,
  Collapse,
  IconButton
} from '@mui/material';
import { Add as AddIcon, ExpandLess, ExpandMore } from '@mui/icons-material';
import { TextField } from '@material-ui/core';

const FormularioRemesa = () => {
  const [form, setForm] = useState({
    nombre: '',
    cobrarUSD: '',
    recividoCUP: '',
    recividoUSD: '',
    tarjetaCUP: '',
    comentario: ''
  });

  const [open, setOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newValue =
      name === 'tarjetaCUP' ? formatearTarjeta(value) : value;

    setForm((prev) => ({ ...prev, [name]: newValue }));
  };

  const formatearTarjeta = (value) => {
    const soloNumeros = value.replace(/\D/g, '').slice(0, 16);
    return soloNumeros.replace(/(.{4})/g, '$1 ').trim();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = Meteor.userId();
    if (!userId) {
      alert('Debe estar logueado para realizar esta acción.');
      return;
    }

    const nuevoCarrito = {
      idUser: userId,
      producto: {
        cobrarUSD: form.cobrarUSD,
        nombre: form.nombre,
        recividoCUP: Number(form.cobrarUSD) * 370,
        recividoUSD: 0,
        tarjetaCUP: form.tarjetaCUP
      },
      comentario: form.comentario,
      type: 'REMESA',
      metodoPago: 'PAYPAL'
    };

    try {
      await Meteor.callAsync("insertarRemesaAlCarrito", nuevoCarrito);
      alert('✅ Remesa añadida al carrito');
      setForm({
        nombre: '',
        cobrarUSD: '',
        recividoCUP: '',
        recividoUSD: '',
        tarjetaCUP: '',
        comentario: ''
      });
      setOpen(false);
    } catch (err) {
      console.error('❌ Error al insertar remesa:', err);
      alert('Error al insertar remesa');
    }
  };

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', mt: 4 }}>
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mb: 2 }}>
<Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
        <Typography variant="h6">
          {open ? 'Formulario de Remesa' : 'Agregar nueva remesa'}
        </Typography>
        <IconButton onClick={() => setOpen(!open)} color="secondary" >
          {open ? <ExpandLess /> : <AddIcon />}
        </IconButton>
      </Box>

    </Paper>
      
      <Collapse in={open}>
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
          <form onSubmit={handleSubmit}>
            <TextField
              color="secondary"
              variant="outlined"
              label="Nombre del destinatario"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              color="secondary"
              variant="outlined"
              label="Monto a enviar en USD"
              name="cobrarUSD"
              type="number"
              value={form.cobrarUSD}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              color="secondary"
              variant="outlined"
              label="Tarjeta CUP"
              name="tarjetaCUP"
              value={form.tarjetaCUP}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              color="secondary"
              variant="outlined"
              label="Comentario"
              name="comentario"
              value={form.comentario}
              onChange={handleChange}
              fullWidth
              margin="normal"
              multiline
              rows={2}
            />
            <Box mt={2}>
              <Button variant="contained" color="primary" type="submit" fullWidth>
                Agregar al carrito
              </Button>
            </Box>
          </form>
        </Paper>
      </Collapse>
    </Box>
  );
};

export default FormularioRemesa;
