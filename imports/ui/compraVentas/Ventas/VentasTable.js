import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
// import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import {
  Paper,
  Box,
  Grid,
  Icon,
  Divider,
  Zoom,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@material-ui/core";
import { Meteor } from "meteor/meteor";
import { Tracker } from "meteor/tracker";
import { useTracker } from "meteor/react-meteor-data";
import Badge from "@material-ui/core/Badge";
import Avatar from "@material-ui/core/Avatar";
import { Link, useParams } from "react-router-dom";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";

import { Dropdown } from "primereact/dropdown";
//icons
import EditIcon from '@material-ui/icons/Edit';
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import AddCircleRoundedIcon from "@material-ui/icons/AddCircleRounded";
import PermContactCalendarRoundedIcon from "@material-ui/icons/PermContactCalendarRounded";
import MailIcon from "@material-ui/icons/Mail";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import CheckCircleRoundedIcon from "@material-ui/icons/CheckCircleRounded";
import ListAltIcon from "@material-ui/icons/ListAlt";
import DeleteIcon from "@material-ui/icons/Delete";
import CheckIcon from '@material-ui/icons/Check';
import BlockIcon from '@material-ui/icons/Block';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';

import "./VentasTable.css";
import "primereact/resources/themes/bootstrap4-dark-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";

import { useNavigate } from "react-router-dom";
import dateFormat from "dateformat";
import { VentasCollection } from "/imports/collections/collections";

const StyledBadge = withStyles((theme) => ({
  badge: {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "$ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}))(Badge);

const SmallAvatar = withStyles((theme) => ({
  root: {
    width: 22,
    height: 22,
    border: `2px solid ${theme.palette.background.paper}`,
  },
}))(Avatar);
const useStyles = makeStyles((theme) => ({
  [theme.breakpoints.down("sm")]: {},
  [theme.breakpoints.down("md")]: {},
  [theme.breakpoints.up("md")]: {
    columnSmoll: {
    }
  },
  clasificado: {
    background: theme.palette.secondary.main,
    padding: 10,
    borderRadius: 25,
  },
  noclasificado: {
    background: theme.palette.primary.main,
    padding: 10,
    borderRadius: 25,
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-start",
  },
  margin: {
    margin: theme.spacing(2),
  },
  avatar: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
}));

export default function VentasTable(option) {
  const classes = useStyles();
  const dt = React.useRef(null);

  const isAdminOficial = useTracker(() => {
    return Meteor.settings.public.administradores.includes(Meteor.user() && Meteor.user().username)
  })
  const user = (id) => {
    Meteor.subscribe("user", id, {
      fields: {
        username: 1
      }
    });
    return Meteor.users.findOne(id)
  }
  const ventas = useTracker(() => {

    let a = [];

    Meteor.subscribe("ventas", isAdminOficial ? {} : { adminId: Meteor.userId() }).ready() &&

      VentasCollection.find(isAdminOficial ? {} : { adminId: Meteor.userId() }, {
        sort: { createdAt: -1 }
      }).map(
        (data) =>
          data &&
          a.push({
            id: data._id,
            userId: user(data.userId) ? user(data.userId).username : "N/A",
            createdAt: data.createdAt && data.createdAt.toLocaleString(),
            isCobrado: data.isCobrado ? "TRUE" : "FALSE",
            comentario: data.comentario && data.comentario,
            type: data.type,
            metodoPago: data.metodoPago,
            cobradoConComision: data.cobrado + " " + (data.monedaCobrado || "USD"),
            cobradoSinComision: data.precioOficial + " " + (data.monedaPrecioOficial || "USD")
          })
      );

    return a;
  });

  const paginatorLeft = (
    <Button type="button" icon="pi pi-refresh" className="p-button-text" />
  );
  const paginatorRight = (
    <Button type="button" icon="pi pi-cloud" className="p-button-text" />
  );
  const idBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title">ID</span>
        {rowData.id}
      </React.Fragment>
    );
  };

  const typeBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title">Tipo</span>
        {rowData.type}
      </React.Fragment>
    );
  };

  const metodoPagoBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title">Método de Pago</span>
        {rowData.metodoPago}
      </React.Fragment>
    );
  };

  const cobradoConComisionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title">Cobrado C/ Comisión</span>
        {rowData.cobradoConComision}
      </React.Fragment>
    );
  };

  const cobradoSinComisionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title">Cobrado S/ Comisión</span>
        {rowData.cobradoSinComision}
      </React.Fragment>
    );
  };

  const isCobradoBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title">¿Cobrado?</span>
        <Chip
          label={rowData.isCobrado}
          color={rowData.isCobrado === "TRUE" ? "primary" : "secondary"}
        />
      </React.Fragment>
    );
  };



  const eliminarVenta = (id) => {
    VentasCollection.remove(id);
  };
  const eliminarBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title"></span>
        <Tooltip
          title={`Eliminar Compra`}
        >
          <IconButton
            // disabled
            aria-label="delete"
            color="primary"
            onClick={() => {
              eliminarVenta(rowData.id);
            }}
          >
            <DeleteIcon fontSize="large" />
          </IconButton>
        </Tooltip>
      </React.Fragment>
    );
  };

  const cobradoBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title">Cobrado: </span>
        <Tooltip
          title={
            rowData.isCobrado ? "Cobrado" : "Sin Cobrar"
          }
        >
          <IconButton
            // disabled
            aria-label="delete"
            color={rowData.isCobrado ? "primary" : "secondary"}
            onClick={() => {
              try {
                VentasCollection.update(rowData.id, { $set: { isCobrado: rowData.isCobrado ? false : true } })
              } catch (error) {
                console.log(error)
              }

            }}
          >
            {rowData.cobrado
              ? <RadioButtonCheckedIcon fontSize="large" />
              : <RadioButtonUncheckedIcon fontSize="large" />}
          </IconButton>
        </Tooltip>
      </React.Fragment>
    );
  };


  return (
    <>
      <div className={classes.drawerHeader}></div>

      <Zoom in={true}>
        <div style={{ width: "100%", padding: 10 }}>
          <div className="datatable-responsive-demo">
            <div className="card">
              <DataTable
                ref={dt}
                className="p-shadow-5 p-datatable-responsive-demo"
                value={ventas}
                paginator
                paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
                rows={5}
                rowsPerPageOptions={[5, 10, 20, 50, 100]}
                paginatorLeft={paginatorLeft}
                paginatorRight={paginatorRight}
              >
                <Column
                  field="id"
                  header="ID"
                  body={idBodyTemplate}
                />
                <Column
                  field="type"
                  header="Tipo"
                  body={typeBodyTemplate}
                  filter
                  filterPlaceholder="Tipo"
                  filterMatchMode="contains"
                />
                <Column
                  field="metodoPago"
                  header="Método de Pago"
                  body={metodoPagoBodyTemplate}
                  filter
                  filterPlaceholder="Método"
                  filterMatchMode="contains"
                />
                <Column
                  field="cobradoConComision"
                  header="Cobrado C/ Comisión"
                  body={cobradoConComisionBodyTemplate}
                />
                <Column
                  field="cobradoSinComision"
                  header="Cobrado S/ Comisión"
                  body={cobradoSinComisionBodyTemplate}
                />
                <Column
                  field="isCobrado"
                  header="¿Cobrado?"
                  body={isCobradoBodyTemplate}
                  filter
                  filterPlaceholder="Cobrado"
                  filterMatchMode="equals"
                />
              </DataTable>
            </div>
          </div>
        </div>
      </Zoom>
    </>
  );
}
