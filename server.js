var Botkit = require('botkit')
var request = require('request')
var require = require('./modulos/mensaje')

var accessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN
var verifyToken = process.env.FACEBOOK_VERIFY_TOKEN
var port = process.env.PORT

if (!accessToken) throw new Error('FACEBOOK_PAGE_ACCESS_TOKEN is required but missing')
if (!verifyToken) throw new Error('FACEBOOK_VERIFY_TOKEN is required but missing')
if (!port) throw new Error('PORT is required but missing')

var controller = Botkit.facebookbot({
  access_token: accessToken,
  verify_token: verifyToken
})

var bot = controller.spawn()

controller.setupWebserver(port, function (err, webserver) {
  if (err) return console.log(err)
  controller.createWebhookEndpoints(webserver, bot, function () {
    console.log('Ready Player 1')
  })
})

controller.hears(['Hola', 'Buenos días', 'Buen día', 'Buenas tardes', 'Buena tarde', 'Buenas noches', 'Buena noche'], 'message_received', function (bot, message) {

  bot.reply(message, 'Desde este chat podrás conocer muchos peluditos que están en busca de un hogar amoroso y responsable.')
  bot.reply(message, '¡Hola!')
  bot.reply(message, {
    attachment: {
      type: 'template',
      payload: {
        template_type: 'button',
        text: '¿Qué buscas? (De un toque sobre la palabra)',
        buttons: [
          {
            type: 'postback',
            title: 'Gatos',
            payload: 'show_cats'
          },
          {
            type: 'postback',
            title: 'Perros',
            payload: 'show_dogs'
          },
          {
            type: 'postback',
            title: '¡Ambos!',
            payload: 'lista_todos'
          }
        ]
      }
    }
  })
})

controller.on('facebook_postback', function (bot, message) {
  switch (message.payload) {
    case 'show_cats':
      mensaje('http://cuidomimascota.com/botgato')
      break
    case 'show_dogs':
      mensaje('http://cuidomimascota.com/botperro')
      break
    case 'lista_todos':
      mensaje('http://cuidomimascota.com/botmsn')
      break
  }
})
