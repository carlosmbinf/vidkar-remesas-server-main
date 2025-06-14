import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
    Button,
    Typography,
    Paper,
    Grid,
} from "@material-ui/core";
import Fade from 'react-reveal/Fade';
import { useTracker } from "meteor/react-meteor-data";
import { ProvidersCollection } from "/imports/collections/collections";
import { Link, useParams } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    card: {
        position: "relative",
        padding: "20px",
        width: 350,
        height: 200,
        borderRadius: 20,
        overflow: "hidden",
        background: "linear-gradient(0deg, rgba(36,83,162,0.9), rgba(245,0,87,0.2))",
        color: "white",
    },
    logoFondo: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        opacity: 0.25,
        width: "80%",
        height: "auto",
        pointerEvents: "none",
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
    content: {
        position: "relative",
        zIndex: 1,
        textAlign: "center",
    },
    nameText: {
        fontSize: "1.4rem",
        fontWeight: 600,
    },
    infoText: {
        fontSize: "1rem",
        fontWeight: 500,
    },
    captionText: {
        fontSize: "0.95rem",
        fontWeight: 400,
    },
}));

export default function Proveedores() {
    const classes = useStyles();
    let { countries } = useParams();

  let providers = null;


  useEffect(() => {
    
      providers = Meteor.subscribe("providers", {CountryIso:countries});
    


    return () => {
      providers && providers.stop();
    }
  }, []);



    const proveedores = useTracker(() => {
        return ProvidersCollection.find({CountryIso:countries}).fetch() || [];
    });

    const items = proveedores.map((prov) => (
        <Link to={`/countries/${countries}/proveedores/${prov.ProviderCode}/productos`} className={classes.link} key={prov._id}>
            <Button className={classes.boton}>
                <Paper elevation={5} className={classes.card}>
                    {/* Marca de agua */}
                    <img src={prov.LogoUrl} alt="Logo" className={classes.logoFondo} />

                    {/* Contenido */}
                    <Grid container direction="column" alignItems="center" className={classes.content} spacing={1}>
                        <Grid item>
                            <Typography className={classes.nameText} noWrap>{prov.Name}</Typography>
                        </Grid>
                        <Grid item>
                            <Typography className={classes.infoText}>Código: {prov.ProviderCode}</Typography>
                            <Typography className={classes.captionText}>País: {prov.CountryIso}</Typography>
                        </Grid>
                    </Grid>
                </Paper>
            </Button>
        </Link>
    ));

    return (
        <Fade left>
            <div style={{ width: "100%" }}>
                {items}
            </div>
        </Fade>
    );
}
