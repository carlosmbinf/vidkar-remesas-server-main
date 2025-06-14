import React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Bear from "../animations/Bear";
import { Grid, Typography, Link, ThemeProvider } from "@material-ui/core";
import Fade from 'react-reveal/Fade';
import { theme } from "../../themes/theme";
import {
  BrowserRouter as Router,
  Route,
  useParams,
} from "react-router-dom";

// icons
import HomeIcon from '@material-ui/icons/Home';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import LoginForm from "../componens/login/LoginForm";
import HeroBot from "../animations/HeroBot";
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      // height: "100vh",
      overflow: "hidden",
      backgroundImage: 'radial-gradient(circle, rgba(238,174,174,0.8323704481792717) 0%, rgba(112,96,255,0.958420868347339) 100%)',
      backgroundPosition: "center",
      backgroundSize: "cover",
    },
    path: {
      position: "fixed",
      height: "100vh",
      width: "60vw",
      opacity: 0,
      background: theme.palette.primary.main,
      clipPath: `polygon(0% 0%, 50% 0, 80% 80%, 55% 100%, 0% 100%)`,
      animation: "descend 1s ease",
      animationFillMode: "forwards",
    },
    pathSecondary: {
      height: "100vh",
      background: theme.palette.primary.main,
      opacity: 0,
      clipPath: `polygon(50% 5%, 60% 5%, 90% 81%, 65% 100%, 38% 100%)`,
      animation: "translate-left 1s ease",
      animationFillMode: "forwards",
    },
    info: {
      position: "absolute",
      zIndex: 10,
      color: "white",
      maxWidth: "40vw",
      transitionDelay: `500ms !important`,
      top: "50%",
      transform: "translateY(-50%)",
    },
    img: {
      height: "18em",
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(3),
    },
    title: {
      fontSize: 28,
      marginBottom: theme.spacing(20),
      textAlign: "center",
      maxWidth: 300,
    },
    link: {
      color: "inherit",
      fontFamily: `'Blinker', sans-serif`,
      marginRight: theme.spacing(5),
      marginLeft: theme.spacing(5),
    },
    form: {
      transitionDelay: `600ms !important`,
      borderRadius: "13%",
      // background: "#0ebaf775",
      backgroundImage: "radial-gradient(circle, rgba(2,0,36,0) 0%, rgba(112,96,255,0.7727901158707865) 67%)",
      opacity: 1,
      padding: "25px",
      paddingBottom: 10
      // backdropFilter: "blur(5px)",
    },
    background: {
      // position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      minHeight: "100vh",
      // zIndex:-1,
      backgroundImage: 'url("/img/marcoTV.png")',
      backgroundPosition: "center",
      backgroundSize: "125vh",
      backgroundRepeat: "no-repeat",
      '@media ( max-height: 600px)': {
        backgroundImage: 'none',
      },
      [theme.breakpoints.down("sm")]: {
        backgroundImage: 'none',
      },
      [theme.breakpoints.up("md")]: {
        // backgroundColor: theme.palette.primary.main,
      },
      [theme.breakpoints.up("lg")]: {
        // backgroundColor: "green",
      },

    },
    marco: {
      zIndex: 1000
    },
    vidKarTitle: {
      position: "absolute", top: "1em",
      '@media ( max-height: 500px)': {
      },
      [theme.breakpoints.down('sm')]: {
        position: "relative",
        top: "0.5em",
        paddingBottom: "0.5em",
      },
      [theme.breakpoints.up('sm')]: {
      },
      [theme.breakpoints.up('md')]: {
      },
    },

    vidKarSubTitle: {
      position: "absolute", top: "4em",
      '@media ( max-height: 500px)': {
      },
      [theme.breakpoints.down('sm')]: {
        display: "none",
      },
      [theme.breakpoints.up('sm')]: {
      },
      [theme.breakpoints.up('md')]: {
      },
      zIndex: 1000
    },
    heroBot: {
      position: "fixed",
      bottom: -56,
      left: 0,
      height: "50vh",
      width: "50vh"
    }
  })
);

const LoginPage = () => {
  const classes = useStyles();
  const [checked, setChecked] = React.useState(true);
  const [type, setType] = React.useState(true);

  const handleChange = () => {
    setChecked((prev) => !prev);
  };



  return (
    <ThemeProvider theme={theme}>
      
      <Grid
        container
        direction="row"
        alignItems="center"
        className={classes.root}
        justifyContent="center"
      >
        {/* <Slide direction="up" in={checked} mountOnEnter>

            </Slide> */}
        <Grid item className={classes.heroBot}>
          <HeroBot />
        </Grid>
        <Grid
        container
        direction="row"
        alignItems="center"
        className={classes.background}
        justifyContent="center">

        <Grid item xs={12} className={classes.vidKarTitle} >
          <Fade top>
            <Grid container direction="row" justifyContent="center" alignItems="center">
              <Typography
                variant="body1"
                component="h1"
                style={{ fontSize: "36px", textAlign: "center", paddingBottom: 2 }}
                color="textPrimary"
              >
                <strong>🅥🅘🅓🅚🅐🅡</strong>
              </Typography>
            </Grid>
          </Fade>

        </Grid>
        <Grid item xs={12} className={classes.vidKarSubTitle} >
          <Fade bottom>
            <Grid container direction="row" justifyContent="center" alignItems="center">
              <Typography
                variant="body1"
                component="h1"
                style={{
                  // fontSize: "18px",
                  textAlign: "center",
                  color:"black"
                }}
              >
                Por una vida mas saludable!!!
                {/* <br />
                Quedate en:
                <br />
                <ChevronRightIcon />
                <HomeIcon />
                <ChevronLeftIcon /> */}
              </Typography>
            </Grid>
          </Fade>
        </Grid>
        <Grid className={classes.marco}>
          <Fade bottom

          >
            <Grid container
              direction="row"
              alignItems="center"
              justify="center" >

              <LoginForm />

              {/* <button onClick={handleLoginFacebook}>loguin to facebook</button> */}
            </Grid>
          </Fade>
        </Grid>


      </Grid>
        <Grid item xs={7}>
          <Fade in>
            <Grid
              container
              className={classes.info}
              direction="column"
              alignItems="center"
            >

              <Grid item>
                {/* <img src="/bg_home.png" className={classes.img} /> */}
              </Grid>
              {/* <Grid item>
                <Typography
                  component="p"
                  variant="body1"
                  className={classes.title}
                >
                  Sistema de Env&iacute;o de Certificados Vacacionales
                </Typography>
              </Grid>
              <Grid item>
                <Grid container>
                  <Grid item>
                    <Link href="#" className={classes.link}>
                      Contact
                    </Link>
                  </Grid>
                  <Grid item>
                    <Link href="#" className={classes.link}>
                      Support
                    </Link>
                  </Grid>
                </Grid>
              </Grid> */}
            </Grid>
          </Fade>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default LoginPage;
