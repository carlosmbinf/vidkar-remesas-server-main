import React, { useEffect } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { CarritoCollection } from '/imports/collections/collections';
import { Meteor } from 'meteor/meteor';
import {
    Box,
    Typography,
    Card,
    CardContent,
    IconButton,
    Divider,
    Chip,
    Tooltip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import PersonIcon from '@mui/icons-material/Person';
import NotesIcon from '@mui/icons-material/Notes';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CreditCardIcon from '@mui/icons-material/CreditCard';


import { Grid } from '@material-ui/core';

const ListaPedidosRemesa = () => {
    const userId = Meteor.userId();



    const { pedidosRemesa } = useTracker(() => {
        const pedidos = CarritoCollection.find({ idUser: userId, type: 'REMESA' }).fetch();
        return { pedidosRemesa: pedidos };
    });

    const eliminarPedido = (idPedido) => {
        Meteor.call('eliminarElementoCarrito', idPedido, (error) => {
            if (error) {
                console.error('Error al eliminar pedido:', error);
            }
        });
    };

    if (pedidosRemesa.length === 0) {
        return <Typography>No hay pedidos tipo REMESA.</Typography>;
    }

    return (
        <Box sx={{ mt: 2 }}>

            <Grid
                item
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
                xs={12}
                style={{ paddingBottom: 20 }}
            >
                <Chip color="primary" label={`Tienes ${pedidosRemesa.length} compras en el Carrito`} style={{ width: '100%' }} />
            </Grid>
            <Typography variant="h6" gutterBottom>Remesas</Typography>
            {pedidosRemesa.map((pedido) => {
                const { producto = {}, comentario, metodoPago } = pedido;
                const {
                    nombre,
                    cobrarUSD,
                    recividoCUP,
                    recividoUSD,
                    tarjetaCUP
                } = producto;

                return (
                    <Card elevation={6} sx={{ mb: 2, borderRadius: 3, p: 2, position: 'relative' }} style={{backgroundImage: "url('/Gemini_Generated_Image_rtg44brtg44brtg4.png')", backgroundBlendMode: 'multiply', backgroundSize: 'cover'}}>
                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                            <PersonIcon color="primary" />
                            <Typography variant="h6" fontWeight="bold">
                                {nombre}
                            </Typography>
                        </Box>
                        <IconButton
                            size="small"
                            onClick={() => eliminarPedido(pedido._id)}
                            sx={{ position: 'absolute', top: 10, right: 10 }}
                        >
                            <Tooltip title="Eliminar pedido">
                                <CloseIcon />
                            </Tooltip>
                        </IconButton>
                        <Divider sx={{ mt: 0 }} />
                        
                        <CardContent>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <MonetizationOnIcon color="success" />
                                        <Typography variant="body2">
                                        Pagar: <Chip color="primary" size="small" label={`${cobrarUSD ? Number(Number(cobrarUSD) + (Number(cobrarUSD)*0.054) + 0.30).toFixed(2): 0} USD`} /> {(cobrarUSD && metodoPago == "PAYPAL") && ` -> ${cobrarUSD}USD + (5,40 % de ${cobrarUSD}USD) + 0,30USD`}
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={12}>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <AccountBalanceWalletIcon color="secondary" />
                                        <Typography variant="body2">
                                            Método de pago: <Chip color="primary" size="small" label={metodoPago || "Desconocido"} />
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={12}>
                                    <Divider sx={{ mb: 2 }} />
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <LocalAtmIcon color="info" />
                                        <Typography variant="body2">
                                            Recibe en Cuba:{' '}
                                            <Chip color="primary" size="small" label={[
                                                recividoCUP > 0 ? `${recividoCUP} CUP` : null,
                                                recividoUSD > 0 ? `${recividoUSD} USD` : null
                                            ]
                                                .filter(Boolean)
                                                .join(' y ')} />
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={12}>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <CreditCardIcon color="info" />
                                        <Typography variant="body2">
                                            Tarjeta a Transferir:{' '}
                                            <Chip color="primary" size="small" label={tarjetaCUP || "NO se ha informado" } />
                                        </Typography>
                                    </Box>
                                </Grid>
                                
                            </Grid>

                            {comentario && (
                                <>
                                    <Divider sx={{ my: 2 }} />
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <NotesIcon color="action" />
                                        <Typography variant="body2" color="text.secondary">
                                            {comentario}
                                        </Typography>
                                    </Box>
                                </>
                            )}
                        </CardContent>
                    </Card>
                );
            })}
        </Box>
    );
};

export default ListaPedidosRemesa;
