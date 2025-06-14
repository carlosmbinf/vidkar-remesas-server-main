import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
    Button,
    Typography,
    Paper,
    Grid,
    Avatar,
} from "@material-ui/core";
import Fade from "react-reveal/Fade";
import { useTracker } from "meteor/react-meteor-data";
import { CountriesCollection } from "/imports/collections/collections";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    card: {
        padding: "15px",
        width: 300,
        borderRadius: 20,
        background: "linear-gradient(0deg, rgba(36,83,162,1) 15%, rgba(245,0,87,0) 100%)",
        color: "white",
    },
    boton: {
        margin: 15,
        borderRadius: 20,
        padding: 0,
    },
    link: {
        textDecoration: "none",
        color: "#8b8b8b",
        fontSize: 16,
        fontWeight: "bold",
    },
    avatar: {
        width: theme.spacing(7),
        height: theme.spacing(7),
        backgroundColor: theme.palette.secondary.main,
    },
    center: {
        textAlign: "center",
    },
}));

export default function Countries() {
    const classes = useStyles();
    let countriesSubscribe = null;

    useEffect(() => {
            if (Meteor.settings.public.regiones && Meteor.settings.public.regiones.length === 0) {
              console.warn("No hay regiones definidas en Meteor.settings.public.regiones");
              countriesSubscribe = Meteor.subscribe("countries", {},{fields:{ CountryName: 1,_id: 1, CountryIso: 1 }});
            }else{
                countriesSubscribe = Meteor.subscribe("countries", {"CountryIso": { $in: Meteor.settings.public.regiones }},{fields:{ CountryName: 1,_id: 1, CountryIso: 1 }});
            }

            return ()=> {
                if (countriesSubscribe) {
                    countriesSubscribe.stop();
                }
            }
    },[])

    const countries = useTracker(() => {
        if (Meteor.settings.public.regiones && Meteor.settings.public.regiones.length === 0) {
            console.warn("No hay regiones definidas en Meteor.settings.public.regiones");
            
            return CountriesCollection.find({}, {fields:{ CountryName: 1,_id: 1, CountryIso: 1 }, sort: { CountryName: 1 } }).fetch();
          }else{
              countriesSubscribe = Meteor.subscribe("countries", {"CountryIso": { $in: Meteor.settings.public.regiones }},{fields:{ CountryName: 1,_id: 1, CountryIso: 1 }});
              return CountriesCollection.find({"CountryIso": { $in: Meteor.settings.public.regiones }}, {fields:{ CountryName: 1,_id: 1, CountryIso: 1 }, sort: { CountryName: 1 } }).fetch();
          }
    });

    return (
        <Fade left>
            <div style={{ width: "100%" }}>
                {countries.map((country) => (
                    <Link
                        to={`/countries/${country.CountryIso}/proveedores`}
                        className={classes.link}
                        key={country._id}
                    >
                        <Button className={classes.boton}>
                            <Paper elevation={5} className={classes.card}>
                                <Grid
                                    container
                                    spacing={1}
                                    direction="column"
                                    alignItems="center"
                                >
                                    <Grid item>
                                        <Avatar className={classes.avatar}>
                                            {country.CountryIso}
                                        </Avatar>
                                    </Grid>
                                    <Grid item className={classes.center}>
                                        <Typography style={{ fontSize: "1rem" }} noWrap>
                                            {country.CountryName}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Button>
                    </Link>
                ))}
            </div>
        </Fade>
    );
}
