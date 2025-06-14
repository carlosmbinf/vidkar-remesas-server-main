import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Stepper, Step, StepLabel,
  IconButton, Button, Typography, Box, Chip, useTheme
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CloseIcon from '@mui/icons-material/Close';
import Badge from '@mui/material/Badge';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { CarritoCollection, PaypalCollection } from '/imports/collections/collections';
import ListaPedidosRemesa from './PedidosCard';
import TerminosCondicionesPago from './TerminosCondicionesPago';
import useMediaQuery from '@mui/material/useMediaQuery';
import ResumenPago from './ResumenPago';

const steps = ['Confirmar Pedidos', 'Términos y Condiciones', 'Pago'];

const getButtonText = (activeStep) => {
  switch (activeStep) {
    case 0:
      return 'Confirmar Pedidos';
    case 1:
      return 'Aceptar Términos y Condiciones';
    case 2:
      return 'Finalizar Pago';
    default:
      return 'Siguiente';
  }
};

const DialogVenta = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [pagoConfirmado, setPagoConfirmado] = useState(false);
  const [precioOrden, setPrecioOrden] = useState(100); // Precio de ejemplo
  const ordenCreada = useRef(false);

  const userId = Meteor.userId();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const { readyCompraPaypal, compraPaypal } = useTracker(() => {
    const readyCompraPaypal = Meteor.subscribe('paypal', {
      userId,
      status: { $nin: ['COMPLETED', 'CANCELLED'] }
    });

    const compraPaypal = PaypalCollection.findOne({
      userId,
      status: { $nin: ['COMPLETED', 'CANCELLED'] }
    });

    return { readyCompraPaypal, compraPaypal };
  });


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

  const crearOrdenPaypal = () => {
    Meteor.call(
      "creandoOrden",
      userId,
      calcularTotal(),
      "Compras Online a travez de RiderKar",
      function (error, success) {
        if (error) {
          console.log("error", error);
        }
        if (success) {
          console.log("success", success);
        }
      }
    );

  };



  const handleNext = () => {
    if (activeStep === steps.length - 1 && compraPaypal?.link) {
      window.location.href = compraPaypal.link;
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (activeStep === 2) {
      Meteor.call("cancelarOrdenesPaypalIncompletas", userId, (error) => {
        if (error) {
          console.error("Error cancelando órdenes PayPal:", error);
        } else {
          console.log("✅ Órdenes PayPal incompletas canceladas");
          ordenCreada.current = false; // permitir crear una nueva orden al volver
        }
      });
    }
    setActiveStep((prev) => prev - 1);
  };
  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  useEffect(() => {
    const total = pedidosRemesa.reduce((sum, item) => sum + item.producto.cobrarUSD, 0);
    setPrecioOrden(total);
  }, [pedidosRemesa]);


  useEffect(() => {
    if (
      activeStep === 2 &&
      readyCompraPaypal &&
      !compraPaypal &&
      !ordenCreada.current
    ) {
      crearOrdenPaypal();
      ordenCreada.current = true;
    }
  }, [activeStep, readyCompraPaypal, compraPaypal]);

  useEffect(() => {
    const sub = Meteor.subscribe('carrito', { idUser: Meteor.userId(), type: 'REMESA' });
    return () => {
      sub && sub.ready() && sub.stop()
      readyCompraPaypal && readyCompraPaypal.ready() && readyCompraPaypal.stop()
    };
  }, []);

  useEffect(() => {
    if (compraPaypal?.status === 'COMPLETED' && !pagoConfirmado) {
      setPagoConfirmado(true);
      console.log('✅ Pago confirmado. Ejecutar lógica de guardado aquí.');
      // confirmarPago(); <-- aquí iría tu función para finalizar la orden
    }
  }, [compraPaypal?.status]);

  const StepContent = () => {
    switch (activeStep) {
      case 0:
        return <ListaPedidosRemesa />;
      case 1:
        return <TerminosCondicionesPago />;
      case 2:
        return (
          <Box>
            {!readyCompraPaypal ? (
              <Chip label="Cargando orden de PayPal..." color="warning" />
            ) : <ResumenPago />}
            {/* {compraPaypal?.status && (
              <Chip
                label={`Estado del pago: ${compraPaypal.status}`}
                color={compraPaypal.status === 'COMPLETED' ? 'success' : 'warning'}
                sx={{ mt: 2 }}
              />
            )} */}
          </Box>
        );
      default:
        return <Typography>Finalizado</Typography>;
    }
  };

  return (
    <>
      <IconButton onClick={handleOpen}>
        <Badge badgeContent={pedidosRemesa ? pedidosRemesa.length : 0} color="error">
          <ShoppingCartIcon />
        </Badge>
      </IconButton>

      <Dialog open={isOpen} onClose={handleClose} fullWidth={true} fullScreen={fullScreen}>
        <DialogTitle>
          Carrito de Remesas
          <IconButton onClick={handleClose} sx={{ position: 'absolute', top: 8, right: 8 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <Box sx={{ mt: 2 }}>
            <StepContent />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button disabled={activeStep === 0} onClick={handleBack}>Atrás</Button>
          <Button
            onClick={handleNext}
            variant="contained"
            disabled={(activeStep === steps.length - 1 && !compraPaypal?.link) || (!pedidosRemesa || pedidosRemesa.length === 0) }
          >
            {getButtonText(activeStep)}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DialogVenta;
