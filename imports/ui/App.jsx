import React from 'react';

import useMediaQuery from '@material-ui/core/useMediaQuery';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { createTheme, ThemeProvider as ThemeProvider2 } from '@mui/material/styles';
import { useTracker } from "meteor/react-meteor-data";


import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Rotate from 'react-reveal/Rotate';


import {
  BrowserRouter,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Routes,
} from "react-router-dom";

import PersistentDrawerLeft from './App'
import LoginPage from './login';
import PantallaPrincipal from './PantallaPrincipal';


const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
  },
}));


export default function App() {
  const classes = useStyles();

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const newTheme = (theme) => createTheme({
    ...theme,
    components: {
      MuiTextField: {
        styleOverrides: {
          root: {
            color: '#bbdefb',
            borderRadius: '17px',
            borderWidth: '1px',
            borderColor: '#2196f3',
            border: '1px solid',
            backgroundColor: '#3f51b5',
          }
        }
      }
    }
  })


  const theme = React.useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: 'dark',
          // type: prefersDarkMode ? 'dark' : 'light',
        },

      }),
    [prefersDarkMode],
  );
  
  const userActual = useTracker(() => {
    return Meteor.userId();
  });

  return (
    <ThemeProvider2 theme={newTheme(theme)}>
      <ThemeProvider theme={theme}>
      <BrowserRouter future={{ v7_startTransition: true }}>
        {  userActual ? <PantallaPrincipal/> : <LoginPage />}
    </BrowserRouter>
      </ThemeProvider>
    </ThemeProvider2>

          
  );
}

