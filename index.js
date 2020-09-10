
//dependencias
const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;

//crear el servidor
const server = http.createServer((req, res) => {
  //obtenermos la url
  // const url=req.url;
  const urlParse = url.parse(req.url,true);
  console.log('urlParse = ',urlParse);
  //obtenemos la ruta
  const ruta = urlParse.pathname;
  //limpiar ruta
  const rutaLimpia = ruta.replace(/^\/+|\/+$/g,'');
  // obtener method
  const method = req.method.toLowerCase();
  // url query
  const query = urlParse.query;
  // headers
  const headers = req.headers;
  // payload
  const decoder = new StringDecoder('utf-8');
  let buffer = '';
  req.on('data', data => {
    console.log('data = ',data);
    buffer += decoder.write(data);
  });

  req.on('end',()=>{
    buffer += decoder.end();
    console.log('buffer = ',buffer);

    const data = {
      ruta: rutaLimpia,
      query,
      method,
      headers,
      payload:buffer
    };

    let handler;
    if (rutaLimpia && enrutador[rutaLimpia]){
      handler = enrutador[rutaLimpia];
    } else {
      handler = enrutador.noEncontrado;
    }

    handler(data, (statusCode = 200,mensaje)=> {
      const respuesta = JSON.stringify(mensaje);
      res.setHeader('Content-Type','application/json')
      res.writeHead(statusCode);
      res.end(respuesta);
    })
    // res.end();
  });

});

const enrutador ={
  ejemplo:(data,callback) => {
    callback(200, { mensaje: 'esto es un ejemplo'});
  },
  noEncontrado: (data,callback) => {
    callback(404, { mensaje:'recurso no encontrado'});
  }
};

server.on('clientError', (err, socket) => {
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});
server.listen(8000,()=>{
  console.log('El servidor esta escuchando el puerto 8000')
});
