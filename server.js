var Botkit = require('botkit')
var request = require('request')

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

controller.hears(['hello', 'hi'], 'message_received', function (bot, message) {
  bot.reply(message, 'Hello!')
  bot.reply(message, 'I want to show you something')
  bot.reply(message, {
    attachment: {
      type: 'template',
      payload: {
        template_type: 'button',
        text: 'Which do you prefer',
        buttons: [
          {
            type: 'postback',
            title: 'Cats',
            payload: 'show_cat'
          },
          {
            type: 'postback',
            title: 'Dogs',
            payload: 'show_dog'
          },
          {
            type: 'postback',
            title: 'Lista Perros',
            payload: 'lista_perros'
          }
        ]
      }
    }
  })
})

controller.on('facebook_postback', function (bot, message) {
  switch (message.payload) {
    case 'show_cat':
      bot.reply(message, {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'generic',
            elements: [{
              title: 'First card',
              subtitle: 'Element #1 of an hscroll',
              image_url: 'http://messengerdemo.parseapp.com/img/rift.png',
              buttons: [{
                type: 'web_url',
                url: 'https://www.messenger.com/',
                title: 'Web url'
              }, {
                type: 'postback',
                title: 'Postback',
                payload: 'Payload for first element in a generic bubble',
              }],
            },{
              title: 'Second card',
              subtitle: 'Element #2 of an hscroll',
              image_url: 'http://messengerdemo.parseapp.com/img/gearvr.png',
              buttons: [{
                type: 'postback',
                title: 'Postback',
                payload: 'Payload for second element in a generic bubble',
              }],
            }]
          }
        }
      })
      break
    case 'show_dog':
      bot.reply(message, {
        attachment: {
          type: 'image',
          payload: {
            url: 'https://media.giphy.com/media/3o7ZeL5FH6Ap9jR9Kg/giphy.gif'
          }
        }
      })
      break
    case 'lista_perros':
    request('http://cuidomimascota.com/botmsn', function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var jsonData = JSON.parse(body);
        for (var i = 0; i < jsonData.mascotas.length; i++) {
          var counter = jsonData.mascotas[i];
          bot.reply(message, {
            attachment: {
              type: 'template',
              payload: {
                template_type: 'generic',
                elements: [{
                          title: counter.mta_name,
                          subtitle: 'Cuido Mi Mascota',
                          image_url: 'http://www.cuidomimascota.com/pictures/'+counter.path,
                          buttons: [{
                            type: 'web_url',
                            url: 'http://www.cuidomimascota.com/perfil/'+counter.id,
                            title: counter.mta_name
                          }],
                }],
              }
            }
          })
        }
      }
    })
    
  }
})
