import http from 'http';
import fs from 'fs';
import path from 'path';
const port = process.env.PORT ? parseInt(process.env.PORT) : 3001;
const baseDir = "C:\\Users\\mauri\\Documents\\Default Project\\Skin-Health";
http.createServer((req,res)=>{
  let reqPath = req.url.split('?')[0];
  if(reqPath === '/') reqPath = '/open-design-preview.html';
  const fullPath = path.join(baseDir, reqPath.replace(/^\//, ''));
  const ext = path.extname(fullPath).toLowerCase();
  const mime = {'.html':'text/html','.png':'image/png','.svg':'image/svg+xml','.jpg':'image/jpeg','.jpeg':'image/jpeg','.css':'text/css','.js':'application/javascript'}[ext] || 'application/octet-stream';
  fs.readFile(fullPath,(err,data)=>{
    if(err){ res.writeHead(404); return res.end('not found '+reqPath);}
    res.writeHead(200,{'Content-Type':mime});
    res.end(data);
  });
}).listen(port, '127.0.0.1', ()=> console.log('serving http://localhost:'+port+'/open-design-preview.html'));