function mensaje(respuesta){
  request(respuesta, function (error, response, body) {
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
                          title: '¡Quiero conocerla/o!'
                        }],
              }],
            }
          }
        })
      }
    }
  })
}
