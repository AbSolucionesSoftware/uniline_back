let Vimeo = require('vimeo').Vimeo;
let client = new Vimeo(process.env.CLIENT_ID_VIMEO, "{client_secret}", "{access_token}");

client.request({
  method: 'GET',
  path: '/tutorial'
}, function (error, body, status_code, headers) {
  if (error) {
    console.log(error);
  }

  console.log(body);
})