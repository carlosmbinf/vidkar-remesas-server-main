import { Meteor } from "meteor/meteor";
import { Accounts } from 'meteor/accounts-base'

import bodyParser from "body-parser";
import { WebApp } from "meteor/webapp";
import router from "router";
import fs from 'fs';

const endpoint = router();

// import youtubeDownload from "./downloader";
const axios = require('axios');
const sharp = require('sharp');
const { createClient } = require('redis');
var http = require("http");
http.post = require("http-post");

// Configuración de Redis
const redisClient = createClient();
redisClient.connect().catch(console.error);
import express from 'express';

const app = express();

import { Telegraf } from "telegraf";

if (Meteor.isServer) {

    console.log("Cargando Rutas...");
    var conteoPost = 0;

    endpoint.get("/capture-order", async (req, res) => {
        console.log("Capturando Orden PayPal...");
        const { token, PayerID } = req.query;
        // console.log(req.query)
        Meteor.call("captureOrder", token, function (error, success) {
          if (error) {
            console.log("error", error);
          }
          if (success) {
            // console.log(success);
            // res.end("ORDEN CAPTURADA");
            res.redirect("/");
          }
        });
      });

      endpoint.get("/cancel-order", async (req, res) => {
        const { token } = req.query;
      
        if (!token) {
          res.status(400).send("Falta el token de orden");
          return;
        }
      
        console.log("Orden cancelada:", token);
      
        Meteor.call("cancelOrder", token, function (error, result) {
          if (error) {
            console.error("Error al cancelar la orden:", error);
            res.status(500).send("Error al cancelar la orden");
          } else {
            // Redirigimos o mostramos un mensaje
            res.redirect("/cancelled"); // Podés cambiarlo a una página personalizada
          }
        });
      });
      
    WebApp.connectHandlers.use(bodyParser.urlencoded({ extended: true }));
    WebApp.connectHandlers.use(endpoint);

}