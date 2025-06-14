import React, { useEffect } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import {
    Card,
    CardContent,
    Button,
    Typography,
    Paper,
    Grid,
    Avatar,
    Divider,
} from "@material-ui/core";
import Fade from 'react-reveal/Fade';
import { useTracker } from "meteor/react-meteor-data";
import { ProductosCollection, ProductosDescriptionsCollection } from "/imports/collections/collections";
import { Link, useParams } from "react-router-dom";
import Carousel from "../componens/carousel/Carousel";

const useStyles = makeStyles((theme) => ({
    primary: {
        padding: "15px",
        width: 350,
        borderRadius: 20,
        background:
            "linear-gradient(0deg, rgba(36,83,162,1) 15%, rgba(245,0,87,0) 100%)",
        color: "white",
    },
    boton: {
        margin: 15,
        borderRadius: 20,
        padding: 0,
    },
    link: {
        borderRadius: 20,
        textDecoration: "none",
        color: "#8b8b8b",
        fontSize: 16,
        fontWeight: "bold",
    },
    large: {
        width: theme.spacing(7),
        height: theme.spacing(7),
        backgroundColor: theme.palette.secondary.main,
    },
    center: {
        textAlign: "center",
    },
    tag: {
        background: "#ffffff33",
        padding: "2px 8px",
        borderRadius: "10px",
        fontSize: "0.75rem",
        display: "inline-block",
        margin: "2px",
    },
}));


export default function ProductCard() {
    const classes = useStyles();
    const [loadingDescripcion, setLoadingDescripcion] = React.useState(true);
    let { proveedor } = useParams();

    
    
   
   
     useEffect(() => {
        let productosSubscripcion = null;
        let productosDescriptions = null;

        productosSubscripcion = Meteor.subscribe("productos", {"ProviderCode":proveedor});
        let produ = productosSubscripcion && ProductosCollection.find({"ProviderCode":proveedor}).fetch();
        if(produ && produ.length > 0) {
            console.log("productos", produ);
            productosDescriptions =  Meteor.subscribe("productosDescriptions", {
               LocalizationKey: {
                 $in: produ.map( prod => prod.LocalizationKey ),
                } 
              });
            setLoadingDescripcion(!productosDescriptions.ready());
          }



       return () => {
        productosSubscripcion && productosSubscripcion.stop();         
        productosDescriptions && productosDescriptions.stop();
       }
     }, []);

     const insertVenta = (producto) => {
        const venta = {
            adminId : Meteor.userId(),
            numeroMovilARecargar : "55267327",
            cobrado: (Number(producto.Maximum.SendValue) +( Number(producto.Maximum.SendValue)*0.054) + 0.30).toFixed(2), //dinero que se cobro
            monedaCobrado: "USD",
            precioOficial: producto.Maximum.SendValue, //precio oficial de la recarga
            monedaPrecioOficial: "USD",
            comentario: "Recarga de prueba",
            type:"RECARGA",
            producto: producto,
            metodoPago: "EFECTIVO"
        }

        Meteor.call("venta.insert", venta, (error, result) => {
            if (error) {
                console.error("Error al insertar la venta:", error);
            } else {
                console.log("Venta insertada con éxito:", result);
            }
        });
    };

    const productosDescriptions = useTracker(() => {
        let descriptions = [];
        let productos = ProductosCollection.find({ "ProviderCode": proveedor }).fetch();
        if (productos.length > 0) {
            descriptions = ProductosDescriptionsCollection.find({
                LocalizationKey: { $in: productos.map(prod => prod.LocalizationKey) }
            }).fetch();
        }
        console.log("descriptions", descriptions);
        return descriptions;
    });

    const productos = useTracker( () => {
        let prod = []

        let productos =  ProductosCollection.find({"ProviderCode":proveedor}).fetch();
        productos.forEach(product => {
            prod.push({...product,descripcion: ProductosDescriptionsCollection.findOne({ LocalizationKey: product.LocalizationKey })?.DescriptionMarkdown  || "Sin descripción disponible"});
        })

        
        return prod;
    });

    //   console.log("productos", productos);

    const items = productos.map((prod) => (
        // <Link to={"/producto/" + prod._id} className={classes.link} key={prod._id}>
            <Button className={classes.boton} onClick={() => insertVenta(prod)} key={prod._id}>
                <Paper elevation={5} className={classes.primary}>
                    <Grid container spacing={1} direction="column" alignItems="center">
                        <Grid item>
                            <Avatar className={classes.large}>
                                {prod.RegionCode}
                            </Avatar>
                        </Grid>
                        <Grid item className={classes.center}>
                            <Typography style={{fontSize:'1rem'}} noWrap>
                                {prod.DefaultDisplayText}
                            </Typography>
                            <Typography variant="body2">
                                {prod.SkuCode}
                            </Typography>
                        </Grid>
                        <Grid item className={classes.center}>
                            <Typography variant="body2">
                                <strong>Recibes:</strong> {prod.Maximum.ReceiveValue} {prod.Maximum.ReceiveCurrencyIso}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Precio Original:</strong> {prod.Maximum.SendValue} {prod.Maximum.SendCurrencyIso}
                            </Typography>
                            <Typography variant="body2">
                                <strong>COMISION:</strong> {prod.CommissionRate} %
                            </Typography>
                            <Typography variant="body2">
                                <strong>Pagas:</strong> {(Number(prod.Maximum.SendValue) * (1 - prod.CommissionRate) +2) < prod.Maximum.SendValue  ? Number(prod.Maximum.SendValue).toFixed(2)    : (Number(prod.Maximum.SendValue) * (1 - prod.CommissionRate) +2).toFixed(2)} {prod.Maximum.SendCurrencyIso}
                            </Typography>
                            
                        </Grid>
                        <Grid item>
                            <Divider style={{ margin: "5px 0" }} />
                            <Typography variant="caption" display="block" className={classes.center}>
                                {prod.Benefits && prod.Benefits.map((b, i) => (
                                    <span key={i} className={classes.tag}>{b}</span>
                                ))}
                            </Typography>
                            <Typography variant="caption" className={classes.center}>
                                Vigencia: {prod.ValidityPeriodIso ? prod.ValidityPeriodIso.replace("P", "").replace("D", " días") : "Sin vigencia"}
                            </Typography>
                        </Grid>

                        <Grid item>
                            <Divider style={{ margin: "5px 0" }} />
                            <Typography variant="caption" className={classes.center}>
                                {productosDescriptions.find(element => element.LocalizationKey = prod.LocalizationKey)?.DescriptionMarkdown}
                            </Typography>
                        </Grid>

                    </Grid>
                </Paper>
            </Button>
        // </Link>
    ));

    return (
        <Fade left>
            <div style={{ width: "100%" }} key={proveedor}>

                {items.map((item, i) => {
                    return item;
                })}
                {/* <Carousel items={items} /> */}
            </div>
        </Fade>
    );
}
