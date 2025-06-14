// imports/ui/pages/CancelledPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Button, Card, CardContent, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

export const CancelledPage = () => {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", padding: "1rem" }}>
      <Card elevation={0} sx={{ backgroundColor: "transparent", width: "100%", maxWidth: 400, textAlign: "center" }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Orden cancelada
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            No se completó tu pago. Podés volver al carrito o seguir navegando.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<MenuIcon />}
            component={Link}
            to="/"
          >
            Menú Principal
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
