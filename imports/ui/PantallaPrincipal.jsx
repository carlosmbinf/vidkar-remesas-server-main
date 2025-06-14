import React, { useEffect, useState } from "react";
import clsx from "clsx";
import {
  makeStyles,
  useTheme,
  Theme,
  createStyles,
  withStyles,
} from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";
import { Link } from "react-router-dom";
import Main from "./Main";
import { Button, Grid, Slide } from "@material-ui/core";
import { useNavigate  } from 'react-router-dom';
import { useTracker } from "meteor/react-meteor-data";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import Avatar from "@material-ui/core/Avatar";
import { Meteor } from "meteor/meteor";
import Fade from "react-reveal/Fade";
import { MensajesCollection, OnlineCollection, ProductosCollection, VentasCollection } from "../collections/collections";



import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import FolderIcon from '@material-ui/icons/Folder';
import RestoreIcon from '@material-ui/icons/Restore';
import FavoriteIcon from '@material-ui/icons/Favorite';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import DashboardIcon from '@material-ui/icons/Dashboard';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import GroupIcon from '@material-ui/icons/Group';
import LiveTvIcon from '@material-ui/icons/LiveTv';
import MovieFilterIcon from '@material-ui/icons/MovieFilter';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import SetPassword from "../ui/users/SetPassword";
import { Suspense } from "react";
import ImportExportIcon from '@material-ui/icons/ImportExport';
import MailOutlineRoundedIcon from '@material-ui/icons/MailOutlineRounded';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import Badge from '@material-ui/core/Badge';
import DialogVenta from "./compraVentas/Remesas/DialogVenta";

const drawerWidth = 240;
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


const useStyles = makeStyles((theme) =>
  createStyles({
    link: {
      textDecoration: "none",
      color: "#8b8b8b",
      fontSize: 12,
      // fontWeight: "bold",
    },
    item: {
      margin: ".3em",
      padding: ".7em 2em",
      marginLeft: "0",
      transition: "all ease 0.2s",
      "&:hover": {
        color: theme.palette.secondary.main,
      },
    },
    root: {
      display: "flex",
      width: "100%",
    },
    appBar: {
      backdropFilter: "blur(30px)",
      backgroundColor: "#3f51b561",
      transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
      transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: theme.spacing(2),
      [theme.breakpoints.down("xs")]: {
        display: "none",
      },
    },
    hide: {
      display: "none",
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      backdropFilter: "blur(30px)",
      width: drawerWidth,
      background:
        "#3f51b561",
      borderRight: 0,
      [theme.breakpoints.down("xs")]: {
        display: "none",
      },
    },
    drawerHeader: {
      display: "flex",
      alignItems: "center",
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
      justifyContent: "flex-end",
    },
    content: {
      minHeight: "100vh",
      minWidth: "100%",
      maxWidth: "100vw",
      flexGrow: 1,
      background: "#2a323d",
      // backgroundImage: "radial-gradient(circle, rgba(238,174,174,0.8323704481792717) -8%, rgba(112,96,255,0.958420868347339) 100%)",
      backgroundPosition: "center",
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      // paddingBottom: "7em",
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginLeft: -drawerWidth,
    },
    contentShift: {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    },
    textTittle: {
      // backgroundColor: "#fff",
    },
    footer: {
      width: "100%",
      position: "fixed",
      bottom: 0,
      background: theme.palette.primary.main,
      color: "green",
      "&$Mui-selected": {
        color: "red",
      },
    },
    bottomItem: {
      color: theme.palette.secondary.main,
      "&$selected": {
        color: theme.palette.primary.main,
      },
    },
  })
);

export default function PantallaPrincipal() {
  const classes = useStyles();
  const theme = useTheme();
  const navigate  = useNavigate ();
  const [open, setOpen] = React.useState(false);
  const [error, setError] = useState("");
  const [saldo, setSaldo] = React.useState(0);
  const userActual = useTracker(() => {

    Meteor.subscribe("userID", {_id: Meteor.userId()}, {
    }).ready();
    return Meteor.user();
  });

  useEffect(() => {
    new Promise((resolve, reject) => {
      Meteor.call("getDisponible", (error, result) => {
          if (error) reject(error);
          else resolve(result);
      });
    }).then((data) => {
      
      if(data && data.Balance) {
        console.log("Disponible:", data);
        setSaldo(data.Balance);
        console.log("saldo", saldo);
      }
       
    }).catch((error) => {
      console.error("Error fetching productos:", error);
    });
  },[])

  const listaDeLinks = [
    { title: "dashboard", icon: <DashboardIcon />, url: "dashboard" },
    { title: "Recargas", icon: <DashboardIcon />, url: "countries" },
    { title: "Remesas", icon: <CurrencyExchangeIcon  />, url: "remesas" }
  
    
    // { title: "USUARIOS", icon: <GroupIcon />, url: "users" },
    
    // { title: "Registro de Logs", icon: <DashboardIcon />, url: "logs" },
    // { title: "Precios", icon: <DashboardIcon />, url: "precios" },
    // { title: "Ventas", icon: <DashboardIcon />, url: "ventas" },

    // { title: "Config Files", icon: <ImportExportIcon />, url: "files" },
    // { title: "Execute CMD", icon: <ImportExportIcon />, url: "execute" },
    
    // { title: "Export Data to MongoDB Server", icon: <ImportExportIcon />, url: "exportdata" },
  ];

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleLogOut = (event) => {
    event.preventDefault();
    setError("");

    Meteor.logout((error) => {
      error && error ? setError(error.message) : "";
    });
  };

  

  
  

  return (
    <>
            <SetPassword/>   
      <div
        className={classes.root}
        // style={{ background: "rgb(29 47 62)" }}
      >
        <CssBaseline />
        <Slide
          direction="down"
          in={true}
          mountOnEnter
          unmountOnExit
          style={{ transformOrigin: "0 0 0" }}
          {...(true ? { timeout: 1000 } : {})}
        >
          <AppBar
            position="fixed"
            className={clsx(
              classes.appBar
              //   {
              //   [classes.appBarShift]: open,
              // }
            )}
          >
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                className={clsx(classes.menuButton, open && classes.hide)}
              >
                <MenuIcon />
              </IconButton>
              <Grid container justify="flex-end">
                {userActual && <Slide
                  direction="right"
                  in={true}
                  mountOnEnter
                  unmountOnExit
                  style={{ transformOrigin: "0 0 0" }}
                  {...(true ? { timeout: 2000 } : {})}
                >
                  <Grid item>
                  
                    <Typography
                      variant="h6"
                      className={classes.textTittle}
                      // color="textSecondary"
                      noWrap
                    >
                    <Button>
                        {saldo} USD
                      </Button>
                    
                      <DialogVenta />
                      <IconButton 
                      // disabled={mensajes.length > 0 ? false : true} 
                      type='submit' aria-label="delete" onClick={() => 
                        navigate(`/chat`)
                        // showNotification()
                        }>
                        <Badge badgeContent={0} color="secondary">
                          <MailOutlineRoundedIcon />
                        </Badge>
                        
                      </IconButton>
                      <Button
                        // style={{
                        //   color: "white",
                        // }}
                        onClick={() => {
                          navigate("/users/" + userActual._id);
                        }}
                      >
                        {Meteor.status().connected ? (
                          <StyledBadge
                            overlap="rectangular"
                            anchorOrigin={{
                              vertical: "bottom",
                              horizontal: "right",
                            }}
                            variant="dot"
                          >
                            <Avatar
                              alt={
                                " " + userActual &&
                                (( userActual.profile &&
                              userActual.profile.firstName)
                                ? userActual.profile.firstName
                                : userActual.profile && userActual.profile.name)
                              }
                              src={userActual.picture}
                            />
                          </StyledBadge>
                        ) : (
                          <Avatar
                            alt={
                              userActual &&
                             (( userActual.profile &&
                              userActual.profile.firstName)
                                ? userActual.profile.firstName
                                : userActual.profile && userActual.profile.name)
                            }
                            src={
                              userActual.picture
                            }
                          />
                        )}

                          
                            {userActual &&
                            ((userActual.profile &&
                            userActual.profile.firstName)
                              ? " " +
                                userActual.profile.firstName +
                                " " +
                                userActual.profile.lastName
                              : " " + (userActual.profile && userActual.profile.name) + " ")
                          
                        }
                      </Button>
                      <IconButton
                        color="secondary"
                        onClick={handleLogOut}
                      >
                        <ExitToAppIcon />
                      </IconButton>
                    </Typography>
                  </Grid>
                </Slide>}
              </Grid>
            </Toolbar>
          </AppBar>
        </Slide>
        <Drawer
          className={classes.drawer}
          variant="persistent"
          anchor="left"
          open={open}
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <div className={classes.drawerHeader}>
            <IconButton
             color="secondary"
              onClick={handleDrawerClose}
            >
              {theme.direction === "ltr" ? (
                <ChevronLeftIcon />
              ) : (
                <ChevronRightIcon />
              )}
            </IconButton>
          </div>
          <Divider />
          <List>
            {listaDeLinks.map((text, index) =>
                (Meteor.user() && Meteor.user().profile && Meteor.user().profile.role == "admin") ? (
                <Link key={index} to={"/" + text.url} className={classes.link}>
                  <ListItem button className={classes.item}>
                    <ListItemIcon>
                    {text.icon}
                      {/* {index % 2 === 0 ? <InboxIcon /> : <MailIcon />} */}
                    </ListItemIcon>
                    <Typography
                  variant="inherit"
                  color="textSecondary"
                  style={{
                    textTransform: "uppercase",
                    // color: "rgba(0, 0, 0, 0.54)",
                  }}
                >
                {text.title}
                </Typography>
                  </ListItem>
                </Link>
              ) : text.url !== "create-series" && text.url !== "vpn" && text.url !== "execute" && text.url !== "files" && text.url !== "dashboard" && text.url !== "chat" && text.url !== "ventas" && text.url !== "precios" && text.url !== "users" && text.url !== "logs" && text.url !== "connections" && text.url !== "exportdata" && text.url !== "register-data" && text.url !== "servers" ? (
                <Link key={index} to={"/" + text.url} className={classes.link}>
                  <ListItem button className={classes.item}>
                    <ListItemIcon color="primary">
                      {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                    </ListItemIcon>
                    <Typography
                  variant="inherit"
                  color="textSecondary"
                  style={{
                    textTransform: "uppercase",
                    // color: "rgba(0, 0, 0, 0.54)",
                  }}
                >
                  {text.title}
                </Typography>
                  </ListItem>
                </Link>
              ) : (
                ""
              )
            )}
          </List>
          <Divider />
          {/* <List>
            {["All mail", "Trash", "Spam"].map((text, index) => (
              <ListItem button key={index}>
                <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List> */}
        </Drawer>
        <main
          className={clsx(
            classes.content
            // {
            // [classes.contentShift]: open,
            // }
          )}
        >
          {/* <div className={classes.drawerHeader}/> */}
          <Main />
          
        </main>
        
      </div>
    </>
  );
}
