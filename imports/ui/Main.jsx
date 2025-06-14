import React, { useEffect } from "react";
import { Meteor } from "meteor/meteor";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import { useTracker } from "meteor/react-meteor-data";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";
import "bootstrap"
import {
  BrowserRouter as Router,
  Route,
  Link,
  useParams,
  Routes,
} from "react-router-dom";
import CreateUsers from "./users/CreateUsers";
import { Zoom } from "react-reveal";
import { Grid } from "@material-ui/core";
import Footer from "./footer/Footer";
import ProductCard from "./productos/Productos";
import Countries from "./countries/Countries";
import Proveedores from "./proveedores/Proveedores";
import { CancelledPage } from "./compraVentas/Remesas/CancelledPage";
import FormularioRemesa from "./compraVentas/Remesas/FormularioRemesa";
import VentasStepper from "./compraVentas/Remesas/VentasStepper";
import VentasTable from "./compraVentas/Ventas/VentasTable";

const useStyles = makeStyles((theme) => ({
  // necessary for content to be below app bar
  root: {
    display: "flex",
    flexWrap: "nowrap",
    "& > *": {
      margin: theme.spacing(5),
      // width: 330,
      // height: 323,
    },
  },
  toolbar: theme.mixins.toolbar,
  contents: {
    overflowX: "auto",
    flexGrow: 1,
    padding: 5,
    marginLeft: 0,
    height: "100%",
  },
  filterInput: {
    margin: theme.spacing(2, 0),
    width: "100%",
  }

}));

export default function Main() {
  const classes = useStyles();
  const useractual = useTracker(() => {
    return Meteor.user();
  });


  return (
    <>
      <div className={classes.toolbar} />

      {/* A <Switch> looks through its children <Route>s and
        renders the first one that matches the current URL. */}
      <Routes>
        <Route path="/create-users"
          element={
            <>
              <div style={{ paddingBottom: "7em" }}>
                {useractual &&
                  useractual.profile &&
                  useractual.profile.role == "admin" ? (
                  <CreateUsers />
                ) : (
                  <Zoom in={true}>
                    <Grid
                      container
                      direction="row"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <h1>SIN ACCESO</h1>
                    </Grid>
                  </Zoom>
                )}
              </div>

              <Footer />
            </>
          }>

        </Route>
        
        <Route path="/countries"
          element={
            <>
              <div style={{ paddingBottom: "7em" }}>
                {useractual &&
                  useractual.profile &&
                  useractual.profile.role == "admin" ? (
                  <Countries />
                ) : (
                  <Zoom in={true}>
                    <Grid
                      container
                      direction="row"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <h1>SIN ACCESO</h1>
                    </Grid>
                  </Zoom>
                )}
              </div>

              <Footer />
            </>
          }>

        </Route>

        <Route path="/countries/:countries/proveedores"
          element={
            <>
              <div style={{ paddingBottom: "7em" }}>
                {useractual &&
                  useractual.profile &&
                  useractual.profile.role == "admin" ? (
                  <Proveedores />
                ) : (
                  <Zoom in={true}>
                    <Grid
                      container
                      direction="row"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <h1>SIN ACCESO</h1>
                    </Grid>
                  </Zoom>
                )}
              </div>

              <Footer />
            </>
          }>

        </Route>
        <Route path="/countries/:countries/proveedores/:proveedor/productos"
          element={
            <>
              <div style={{ paddingBottom: "7em" }}>
                {useractual &&
                  useractual.profile &&
                  useractual.profile.role == "admin" ? (
                  <ProductCard />
                ) : (
                  <Zoom in={true}>
                    <Grid
                      container
                      direction="row"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <h1>SIN ACCESO</h1>
                    </Grid>
                  </Zoom>
                )}
              </div>

              <Footer />
            </>
          }>

        </Route>
        <Route path="/cancelled"
          element={
            <>
              <div style={{ paddingBottom: "7em" }}>
                <CancelledPage />
              </div>

              <Footer />
            </>
          }>

        </Route>
        <Route path="/remesas"
          element={
            <>
              <div style={{ paddingBottom: "7em" }}>
                <FormularioRemesa />
                <VentasStepper />
              </div>

              <Footer />
            </>
          }>
        </Route>
        <Route path="/ventas"
          element={
            <>
              <div style={{ paddingBottom: "7em" }}>
                <VentasTable />
              </div>

              <Footer />
            </>
          }>

        </Route>
        
      </Routes>


    </>
  );
}
