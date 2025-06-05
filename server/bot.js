import { Telegraf } from "telegraf";
import { Meteor } from "meteor/meteor";
import axios from "axios";

console.log(
  `Cargando Bot Telegram vidkar_bot +${Meteor.settings.public.tokenBotTelegram}`
);
const bot = new Telegraf(Meteor.settings.public.tokenBotTelegram);



//iconos
const cuidadoEmoji = "⚠️"; // Código Unicode del emoji de "cuidado"

bot.start(async (ctx) => {
  try {
    // Explicit usage
    await ctx.reply(
      `Welcome! ${ctx.message.from.first_name} ${ctx.message.from.last_name}`
    );

    
  } catch (error) {
    console.log(error);
  }
});

// Comando para iniciar la conversación
bot.command("opciones", async (ctx) => {
  try {
    
    // Establecer el estado de la conversación para esperar la siguiente respuesta
    // cambiarEstado(ctx.message.chat.id,'esperando_opcion');
  } catch (error) {
    console.log(error);
  }
});

// Manejar la respuesta del usuario después de seleccionar una opción
bot.on("text", async (ctx) => {
  try {
   
  } catch (error) {
    console.log(error);
  }
});

//cuando selecciona una opcion del teclado in linea
bot.on("callback_query", async (ctx) => {
  try {
    // Explicit usage
    let estado = ctx.callbackQuery.data;
    
    // muestra un mensaje en telegram
    // await ctx.answerCbQuery('PRUEBA',{text: 'Hello World!'})
  } catch (error) {
    console.log(error);
  }
});

// bot.on('inline_query', async (ctx) => {
//     const result = ["HOLA"]
//     console.log(`message{`)
//     console.log(ctx.inlineQuery)
//     console.log(`}`)
//     console.log(`--------------------------------------`)
//     // Explicit usage
//     // await ctx.telegram.answerInlineQuery(ctx.inlineQuery.id, result)

//     // Using context shortcut
//     await ctx.answerInlineQuery(result)
// })

bot.launch();

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
