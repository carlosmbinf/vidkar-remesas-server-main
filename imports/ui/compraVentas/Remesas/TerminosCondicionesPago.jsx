import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import GavelIcon from '@mui/icons-material/Gavel';

const TerminosCondicionesPago = () => {
  return (
    <Card elevation={4} sx={{ borderRadius: 3, mb: 3, p: 2 }}>
      <CardContent>
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <GavelIcon color="warning" />
          <Typography variant="h6" fontWeight="bold">
            Términos y Condiciones de Pago – VidKar
          </Typography>
        </Box>
        <Typography variant="body2" gutterBottom>
          Al seleccionar <strong>PayPal</strong> como método de pago, el usuario acepta que este servicio aplica una <strong>comisión adicional</strong>, la cual <strong>deberá ser asumida íntegramente</strong> por el usuario al momento de realizar la transacción.
        </Typography>
        <Typography variant="body2" gutterBottom>
          <strong>VidKar no ofrece reembolsos</strong>, por lo que al confirmar el pago, se entiende que el usuario <strong>acepta que toda la información proporcionada es correcta y veraz</strong>.
        </Typography>
        <Typography variant="body2">
          La entrega del efectivo en Cuba se realizará <strong>mediante transferencia en un plazo no mayor a un (1) día hábil</strong>, garantizando un proceso ágil y seguro.
        </Typography>
      </CardContent>
    </Card>
  );
};

export default TerminosCondicionesPago;
